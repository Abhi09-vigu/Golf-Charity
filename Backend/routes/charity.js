const express = require('express');
const router = express.Router();
const Charity = require('../models/Charity');

// Get all charities
router.get('/', async (req, res) => {
  try {
    const charities = await Charity.find();
    res.json(charities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
