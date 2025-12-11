const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingsByUser,
  getBookingById,
  updateBooking,
  deleteBooking
} = require('../models/supabase/Booking');
const { verifyToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Create a new booking
router.post(
  '/',
  verifyToken,
  [
    body('destinationId').notEmpty().withMessage('Destination ID is required'),
    body('destinationName').notEmpty().withMessage('Destination name is required'),
    body('checkInDate').isISO8601().withMessage('Valid check-in date required'),
    body('checkOutDate').isISO8601().withMessage('Valid check-out date required'),
    body('numberOfTravelers').isInt({ min: 1 }).withMessage('Number of travelers must be at least 1'),
    body('numberOfRooms').isInt({ min: 1 }).withMessage('Number of rooms must be at least 1'),
    body('accommodationType').isIn(['hotel', 'resort', 'hostel', 'apartment', 'homestay', 'villa']).withMessage('Invalid accommodation type'),
    body('totalPrice').isDecimal({ force_decimal: true }).withMessage('Valid price required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        destinationId,
        destinationName,
        checkInDate,
        checkOutDate,
        numberOfTravelers,
        numberOfRooms,
        accommodationType,
        totalPrice,
        currency,
        specialRequests,
        userEmail,
        userPhone
      } = req.body;

      // Generate confirmation code
      const confirmationCode = `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const booking = await createBooking({
        user_id: req.userId,
        destination_id: destinationId,
        destination_name: destinationName,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        number_of_travelers: numberOfTravelers,
        number_of_rooms: numberOfRooms,
        accommodation_type: accommodationType,
        total_price: totalPrice,
        currency: currency || 'USD',
        special_requests: specialRequests || null,
        confirmation_code: confirmationCode,
        user_email: userEmail || req.userEmail,
        user_phone: userPhone || null,
        status: 'pending',
      });

      res.status(201).json({
        message: 'Booking created successfully',
        booking,
      });
    } catch (error) {
      console.error('Booking creation error:', error);
      next(error);
    }
  }
);

// Get all bookings for a user
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const bookings = await getBookingsByUser(req.userId);
    res.status(200).json({
      message: 'Bookings retrieved successfully',
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    next(error);
  }
});

// Get a single booking by ID
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user_id !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to access this booking' });
    }

    res.status(200).json({
      message: 'Booking retrieved successfully',
      booking,
    });
  } catch (error) {
    console.error('Fetch booking error:', error);
    next(error);
  }
});

// Update booking status
router.put(
  '/:id/status',
  verifyToken,
  [body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Invalid status')],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const booking = await getBookingById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized to update this booking' });

      const updated = await updateBooking(req.params.id, { status: req.body.status });
      res.status(200).json({ message: 'Booking status updated successfully', booking: updated });
    } catch (error) {
      console.error('Update booking error:', error);
      next(error);
    }
  }
);

// Cancel booking
router.post('/:id/cancel', verifyToken, async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized to cancel this booking' });

    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is already cancelled' });
    if (booking.status === 'completed') return res.status(400).json({ message: 'Cannot cancel completed booking' });

    const updated = await updateBooking(req.params.id, { status: 'cancelled', notes: req.body.reason || 'User cancelled' });
    res.status(200).json({ message: 'Booking cancelled successfully', booking: updated });
  } catch (error) {
    console.error('Cancel booking error:', error);
    next(error);
  }
});

// Delete booking (only pending bookings)
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized to delete this booking' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Can only delete pending bookings' });

    await deleteBooking(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    next(error);
  }
});

module.exports = router;
