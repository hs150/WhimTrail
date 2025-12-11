const express = require('express');
const { getAllDestinations } = require('../models/supabase/Destination');

const router = express.Router();

// Search destinations (simple fallback: fetch a subset and filter in JS)
router.get('/destinations/search', async (req, res) => {
  try {
    const { q, city, category, minBudget, maxBudget } = req.query;

    // Fetch a reasonable subset from Supabase
    const candidates = await getAllDestinations(500, 'popularity');

    const filtered = candidates.filter((d) => {
      const name = (d.name || '').toLowerCase();
      const desc = (d.description || '').toLowerCase();
      const tags = Array.isArray(d.tags) ? d.tags.join(' ').toLowerCase() : '';
      const locCity = d.location && d.location.city ? String(d.location.city).toLowerCase() : '';

      if (q) {
        const ql = q.toLowerCase();
        if (!(name.includes(ql) || desc.includes(ql) || tags.includes(ql))) return false;
      }

      if (city && !locCity.includes(String(city).toLowerCase())) return false;
      if (category && d.category !== category) return false;

      if (minBudget || maxBudget) {
        const eb = d.estimated_budget || {};
        const min = parseFloat(eb.min || 0);
        const max = parseFloat(eb.max || 0);
        if (minBudget && min < parseFloat(minBudget)) return false;
        if (maxBudget && max > parseFloat(maxBudget)) return false;
      }

      return true;
    });

    res.status(200).json(filtered.slice(0, 50));
  } catch (error) {
    res.status(500).json({ message: 'Error searching', error: error.message });
  }
});

// Auto-suggest
router.get('/suggest', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) return res.status(200).json([]);

    const candidates = await getAllDestinations(200, 'popularity');
    const ql = q.toLowerCase();

    const suggestions = candidates
      .filter(
        (d) =>
          (d.name && d.name.toLowerCase().includes(ql)) ||
          (d.location && d.location.city && String(d.location.city).toLowerCase().includes(ql))
      )
      .slice(0, 10)
      .map((d) => ({ name: d.name, city: d.location ? d.location.city : '' }));

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions', error: error.message });
  }
});

module.exports = router;
