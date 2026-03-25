const express = require('express');
const router = express.Router();
const Winner = require('../models/Winner');
const { authMiddleware } = require('../middleware/auth');

// Get logged-in user's winnings
router.get('/my-winnings', authMiddleware, async (req, res) => {
  try {
    const winnings = await Winner.find({ userId: req.user.id }).populate('drawId', 'date numbers');
    res.json(winnings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload proof (mocked as URL input for simplicity)
router.post('/:id/upload-proof', authMiddleware, async (req, res) => {
  try {
    const { proofUrl } = req.body;
    const winner = await Winner.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { proofUrl, verificationStatus: 'Pending' },
      { new: true }
    );
    if (!winner) return res.status(404).json({ message: 'Record not found' });
    res.json(winner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
