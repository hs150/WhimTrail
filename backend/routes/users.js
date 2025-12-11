const express = require('express');
const {
  getUserById,
  updateUser
} = require('../models/supabase/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude password before sending
    const { password, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, bio, avatar, phone, address, city, country, zipCode } = req.body;

    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await updateUser(req.userId, {
      first_name: firstName,
      last_name: lastName,
      bio,
      avatar,
      phone,
      address,
      city,
      country,
      zip_code: zipCode
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Update preferences
router.put('/preferences', verifyToken, async (req, res) => {
  try {
    const { theme, currency, language, notifications } = req.body;

    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updated = await updateUser(req.userId, {
      preferences: { theme, currency, language, notifications }
    });

    res.status(200).json({ message: 'Preferences updated', preferences: updated.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
});

// Save destination (placeholder)
router.post('/save-destination', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      message: 'Destination saved (stored in user preferences)',
      savedDestinations: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving destination', error: error.message });
  }
});

// Remove saved destination (placeholder)
router.post('/unsave-destination', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      message: 'Destination removed from saved',
      savedDestinations: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing destination', error: error.message });
  }
});

// Get view history (placeholder)
router.get('/history', verifyToken, async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

// Add to view history (placeholder)
router.post('/add-history', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      message: 'Added to history',
      viewHistory: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to history', error: error.message });
  }
});

module.exports = router;
