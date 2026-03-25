const express = require('express');
const router = express.Router();
const Draw = require('../models/Draw');
const User = require('../models/User');
const Charity = require('../models/Charity');
const Score = require('../models/Score');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// List all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Run a manual draw
router.post('/draw', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { totalPool = 10000 } = req.body; // Mocked total prize pool
    // Generate 5 random winning numbers 1-45
    const numbers = [];
    while(numbers.length < 5) {
      const r = Math.floor(Math.random() * 45) + 1;
      if(numbers.indexOf(r) === -1) numbers.push(r);
    }
    
    // Check all user scores
    const allScores = await Score.find({});
    const winners5 = [];
    const winners4 = [];
    const winners3 = [];

    allScores.forEach(userScore => {
      const latestScores = userScore.scores.slice(-5).map(s => s.value);
      if(latestScores.length > 0) { // Should consider all even if not 5 played, but 5 matches possible only if 5 played
         let matchCount = 0;
         latestScores.forEach(s => {
           if(numbers.includes(s)) matchCount++;
         });
         
         if(matchCount === 5) winners5.push(userScore.userId);
         else if(matchCount === 4) winners4.push(userScore.userId);
         else if(matchCount === 3) winners3.push(userScore.userId);
      }
    });
    
    const draw = new Draw({ numbers, status: 'Completed', results: { 
      matches5: winners5.length, 
      matches4: winners4.length, 
      matches3: winners3.length 
    } });
    await draw.save();

    // Calculate prizes
    const prize5 = winners5.length > 0 ? (totalPool * 0.40) / winners5.length : 0;
    const prize4 = winners4.length > 0 ? (totalPool * 0.35) / winners4.length : 0;
    const prize3 = winners3.length > 0 ? (totalPool * 0.25) / winners3.length : 0;

    const Winner = require('../models/Winner');
    
    const createWinners = async (userIds, matchCount, prize) => {
      for(let uid of userIds) {
         await Winner.create({ drawId: draw._id, userId: uid, matches: matchCount, prizeAmount: prize });
      }
    };

    await createWinners(winners5, 5, prize5);
    await createWinners(winners4, 4, prize4);
    await createWinners(winners3, 3, prize3);

    res.json(draw);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all winners
router.get('/winners', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const Winner = require('../models/Winner');
    const winners = await Winner.find().populate('userId', 'name email').populate('drawId', 'date numbers');
    res.json(winners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update winner status
router.put('/winners/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { verificationStatus, paymentStatus } = req.body;
    const Winner = require('../models/Winner');
    const winner = await Winner.findByIdAndUpdate(
      req.params.id, 
      { verificationStatus, paymentStatus }, 
      { new: true }
    );
    res.json(winner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add a charity
router.post('/charity', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const charity = new Charity(req.body);
    await charity.save();
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
