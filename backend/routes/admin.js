const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../models/supabase/User');
const {
  createDestination,
  updateDestination,
  deleteDestination,
  getAllDestinations
} = require('../models/supabase/Destination');
const {
  getAllReviews,
  deleteReview,
  getReviewsByDestination
} = require('../models/supabase/Review');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    const destinations = await getAllDestinations();
    const reviews = await getAllReviews();
    // You can add getAllBlogs() if needed

    res.status(200).json({
      totalUsers: users.length,
      totalDestinations: destinations.length,
      totalReviews: reviews.length,
      totalBlogs: 0 // Replace with actual blog count if available
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Manage users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    const sanitized = users.map(({ password, ...rest }) => rest);
    res.status(200).json(sanitized);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user status
router.put('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const { is_admin } = req.body;
    const user = await getUserById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updated = await updateUser(req.params.userId, { is_admin });
    res.status(200).json({ message: 'User updated', user: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    await deleteUser(req.params.userId);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Manage destinations
router.post('/destinations', verifyAdmin, async (req, res) => {
  try {
    const destination = await createDestination(req.body);
    res.status(201).json({ message: 'Destination created', destination });
  } catch (error) {
    res.status(500).json({ message: 'Error creating destination', error: error.message });
  }
});

router.put('/destinations/:destId', verifyAdmin, async (req, res) => {
  try {
    const updated = await updateDestination(req.params.destId, req.body);
    res.status(200).json({ message: 'Destination updated', destination: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating destination', error: error.message });
  }
});

router.delete('/destinations/:destId', verifyAdmin, async (req, res) => {
  try {
    await deleteDestination(req.params.destId);
    res.status(200).json({ message: 'Destination deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting destination', error: error.message });
  }
});

// Moderate reviews
router.get('/reviews', verifyAdmin, async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

router.delete('/reviews/:reviewId', verifyAdmin, async (req, res) => {
  try {
    const review = await deleteReview(req.params.reviewId);
    const destinationId = review.destination_id;

    const allReviews = await getReviewsByDestination(destinationId);
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    await updateDestination(destinationId, { rating: avgRating });

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

module.exports = router;
