const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { authMiddleware } = require('../middleware/auth');

// Add new score
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { score } = req.body;
    if (score < 1 || score > 45) return res.status(400).json({ message: 'Score must be between 1 and 45' });

    let userScore = await Score.findOne({ userId: req.user.id });
    
    if (!userScore) {
      userScore = new Score({ userId: req.user.id, scores: [{ value: score }] });
    } else {
      userScore.scores.push({ value: score });
      // Keep only last 5 scores, sorted latest first naturally by push, so we'll just slice the last 5
      if (userScore.scores.length > 5) {
        // Remove the oldest score (first element) or keep the newest 5
        userScore.scores = userScore.scores.slice(-5);
      }
    }

    await userScore.save();
    // Return sorted by latest first (reverse of the array)
    res.json(userScore.scores.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user scores
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userScore = await Score.findOne({ userId: req.user.id });
    if (!userScore) return res.json([]);
    // Clone and reverse to show latest first
    const sortedScores = [...userScore.scores].reverse();
    res.json(sortedScores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
