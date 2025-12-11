const express = require('express');
const {
  createReview,
  getReviewsByDestination,
  getReviewById,
  updateReview,
  deleteReview,
  getAllReviewsByDestination
} = require('../models/supabase/Review');
const { updateDestination, getDestinationById } = require('../models/supabase/Destination');
const { getUserById } = require('../models/supabase/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Add review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { destinationId, rating, title, comment } = req.body;

    if (!destinationId || rating == null || !title || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const review = await createReview({
      destination_id: destinationId,
      user_id: req.userId,
      rating: parseInt(rating, 10),
      title,
      body: comment
    });

    // Update destination average rating
    const allReviews = await getAllReviewsByDestination(destinationId);
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length
      : 0;

    await updateDestination(destinationId, { rating: avgRating });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
});

// Get reviews for destination
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await getReviewsByDestination(req.params.destinationId);

    const total = reviews.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = reviews.slice(offset, offset + Number(limit));

    // Attach user info for each review
    const enriched = await Promise.all(
      paginated.map(async (r) => {
        const user = await getUserById(r.user_id);
        return {
          ...r,
          user: user
            ? { firstName: user.first_name, lastName: user.last_name, avatar: user.avatar }
            : null
        };
      })
    );

    res.status(200).json({
      reviews: enriched,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Update review
router.put('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const review = await getReviewById(req.params.reviewId);

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    const updated = await updateReview(req.params.reviewId, {
      rating: rating != null ? parseInt(rating, 10) : review.rating,
      title: title ?? review.title,
      body: comment ?? review.body
    });

    // Update destination rating
    const allReviews = await getAllReviewsByDestination(review.destination_id);
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length
      : 0;

    await updateDestination(review.destination_id, { rating: avgRating });

    res.status(200).json({ message: 'Review updated successfully', review: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
});

// Delete review
router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    const review = await getReviewById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    const destinationId = review.destination_id;
    await deleteReview(req.params.reviewId);

    // Update destination rating
    const allReviews = await getAllReviewsByDestination(destinationId);
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length
      : 0;

    await updateDestination(destinationId, { rating: avgRating });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

module.exports = router;
