const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPaymentsByUser,
  getPaymentById,
  updatePaymentStatus
} = require('../models/supabase/Payment');
const { getBookingById, updateBooking } = require('../models/supabase/Booking');
const { verifyToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Create a new payment
router.post(
  '/',
  verifyToken,
  [
    body('bookingId').notEmpty().withMessage('Booking ID required'),
    body('amount').isDecimal({ force_decimal: true }).withMessage('Valid amount required'),
    body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'wallet']).withMessage('Invalid payment method'),
    body('transactionId').notEmpty().withMessage('Transaction ID required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { bookingId, amount, currency, paymentMethod, transactionId, paymentGateway, metadata } = req.body;

      // Verify booking exists and belongs to user
      const booking = await getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      if (booking.user_id !== req.userId) {
        return res.status(403).json({ message: 'Unauthorized to process payment for this booking' });
      }

      const payment = await createPayment({
        booking_id: bookingId,
        user_id: req.userId,
        amount,
        currency: currency || 'USD',
        payment_method: paymentMethod,
        transaction_id: transactionId,
        payment_gateway: paymentGateway || 'stripe',
        status: 'completed',
        metadata: metadata || {}
      });

      // Update booking status to confirmed
      await updateBooking(bookingId, { status: 'confirmed' });

      res.status(201).json({
        message: 'Payment processed successfully',
        payment
      });
    } catch (error) {
      console.error('Payment creation error:', error);
      next(error);
    }
  }
);

// Get payment history for a user
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const payments = await getPaymentsByUser(req.userId);
    res.status(200).json({
      message: 'Payments retrieved successfully',
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Fetch payments error:', error);
    next(error);
  }
});

// Get payment details by ID
router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const payment = await getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    if (payment.user_id !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to access this payment' });
    }
    res.status(200).json({ message: 'Payment retrieved successfully', payment });
  } catch (error) {
    console.error('Fetch payment error:', error);
    next(error);
  }
});

// Refund payment
router.post(
  '/:id/refund',
  verifyToken,
  [
    body('refundAmount').isDecimal({ force_decimal: true }).withMessage('Valid refund amount required'),
    body('reason').notEmpty().withMessage('Refund reason required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const payment = await getPaymentById(req.params.id);
      if (!payment) return res.status(404).json({ message: 'Payment not found' });
      if (payment.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized to refund this payment' });
      if (payment.status === 'refunded') return res.status(400).json({ message: 'Payment already refunded' });

      const { refundAmount, reason } = req.body;
      if (parseFloat(refundAmount) > parseFloat(payment.amount)) {
        return res.status(400).json({ message: 'Refund amount cannot exceed payment amount' });
      }

      const updated = await updatePaymentStatus(req.params.id, {
        status: 'refunded',
        refund_amount: refundAmount,
        refund_reason: reason,
        refunded_at: new Date()
      });

      res.status(200).json({ message: 'Payment refunded successfully', payment: updated });
    } catch (error) {
      console.error('Refund error:', error);
      next(error);
    }
  }
);

// Get payment status
router.get('/:id/status', verifyToken, async (req, res, next) => {
  try {
    const payment = await getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    res.status(200).json({
      message: 'Payment status retrieved',
      status: payment.status,
      transactionId: payment.transaction_id
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    next(error);
  }
});

module.exports = router;
