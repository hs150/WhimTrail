const express = require('express');
const {
  createItinerary,
  getItinerariesByUser,
  getItineraryById,
  updateItinerary,
  deleteItinerary
} = require('../models/supabase/Itinerary');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create itinerary
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, days } = req.body;

    const itinerary = await createItinerary({
      title,
      user_id: req.userId,
      days,
      duration_days: days ? days.length : null,
      is_public: false
    });

    res.status(201).json({ message: 'Itinerary created successfully', itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Error creating itinerary', error: error.message });
  }
});

// Get user's itineraries
router.get('/user/my-itineraries', verifyToken, async (req, res) => {
  try {
    const itineraries = await getItinerariesByUser(req.userId);
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
  }
});

// Get itinerary by ID
router.get('/:id', async (req, res) => {
  try {
    const itinerary = await getItineraryById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching itinerary', error: error.message });
  }
});

// Update itinerary
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, days } = req.body;
    const itinerary = await getItineraryById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    const updated = await updateItinerary(req.params.id, {
      title: title ?? itinerary.title,
      days: days ?? itinerary.days,
      duration_days: days ? days.length : itinerary.duration_days
    });

    res.status(200).json({ message: 'Itinerary updated successfully', itinerary: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating itinerary', error: error.message });
  }
});

// Delete itinerary
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const itinerary = await getItineraryById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    await deleteItinerary(req.params.id);
    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting itinerary', error: error.message });
  }
});

// Share itinerary
router.post('/:id/share', verifyToken, async (req, res) => {
  try {
    const itinerary = await getItineraryById(req.params.id);
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    if (itinerary.user_id !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    const updated = await updateItinerary(req.params.id, { is_public: true });
    res.status(200).json({ message: 'Itinerary shared successfully', itinerary: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing itinerary', error: error.message });
  }
});

module.exports = router;
