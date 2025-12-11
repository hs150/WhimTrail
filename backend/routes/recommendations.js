const express = require('express');
const { getUserById } = require('../models/supabase/User');
const {
  getTrendingDestinations,
  getTopRatedDestinations,
  getDestinationsBySeason,
  getSimilarDestinations
} = require('../models/supabase/Destination');

const router = express.Router();

// Get AI recommendations based on user preferences
router.get('/personalized/:userId', async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For now, return mock recommendations based on preferences
    res.status(200).json({
      message: 'Recommendations based on user preferences',
      recommendations: [] // Replace with actual logic later
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
});

// Get trending/popular destinations
router.get('/trending/all', async (req, res) => {
  try {
    const destinations = await getTrendingDestinations(10);
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending', error: error.message });
  }
});

// Get recommendations by rating
router.get('/top-rated/all', async (req, res) => {
  try {
    const destinations = await getTopRatedDestinations(10);
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top rated', error: error.message });
  }
});

// Get recommendations by season
router.get('/seasonal/:season', async (req, res) => {
  try {
    const seasonMap = {
      spring: { start: 'March', end: 'May' },
      summer: { start: 'June', end: 'August' },
      fall: { start: 'September', end: 'November' },
      winter: { start: 'December', end: 'February' }
    };

    const season = req.params.season.toLowerCase();
    if (!seasonMap[season]) {
      return res.status(400).json({ message: 'Invalid season' });
    }

    const destinations = await getDestinationsBySeason(season);
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seasonal recommendations', error: error.message });
  }
});

// Get content-based recommendations (similar to viewed destinations)
router.get('/similar/:destinationId', async (req, res) => {
  try {
    const destinations = await getSimilarDestinations(req.params.destinationId);
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching similar destinations', error: error.message });
  }
});

module.exports = router;
