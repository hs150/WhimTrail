const express = require('express');
const {
  getAllDestinations,
  getDestinationById,
  getDestinationsByCategory,
  getTrendingDestinations,
  updateDestination
} = require('../models/supabase/Destination');
const { getReviewsByDestination } = require('../models/supabase/Review');

const router = express.Router();

// Get all destinations with filters
router.get('/', async (req, res) => {
  try {
    const { category, city, rating, page = 1, limit = 10 } = req.query;

    const destinations = await getAllDestinations();
    let filtered = destinations;

    if (category) {
      filtered = filtered.filter(d => d.category === category);
    }
    if (rating) {
      filtered = filtered.filter(d => parseFloat(d.rating) >= parseFloat(rating));
    }
    if (city) {
      const cityl = String(city).toLowerCase();
      filtered = filtered.filter(
        d =>
          d.location &&
          d.location.city &&
          String(d.location.city).toLowerCase().includes(cityl)
      );
    }

    const total = filtered.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(offset, offset + Number(limit));

    res.status(200).json({
      destinations: paginated,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
});

// Get destination by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // increment popularity
    await updateDestination(id, { popularity: { increment: 1 } });

    const destination = await getDestinationById(id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    const reviews = await getReviewsByDestination(id);
    destination.reviews = reviews;

    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destination', error: error.message });
  }
});

// Get destinations by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const destinations = await getDestinationsByCategory(req.params.category);

    const total = destinations.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = destinations.slice(offset, offset + Number(limit));

    res.status(200).json(paginated);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
});

// Get trending destinations
router.get('/trending/all', async (req, res) => {
  try {
    const destinations = await getTrendingDestinations(10);
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending destinations', error: error.message });
  }
});

module.exports = router;
