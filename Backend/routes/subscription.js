const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { authMiddleware } = require('../middleware/auth');

// Mock create checkout session
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body; // 'Monthly' or 'Yearly'
    // Simulate successful payment instantly for demo
    await User.findByIdAndUpdate(req.user.id, { 
      subscriptionStatus: 'Active', 
      subscriptionPlan: plan 
    });

    const sub = new Subscription({
      userId: req.user.id,
      planId: plan,
      status: 'Active',
      endDate: plan === 'Yearly' ? new Date(Date.now() + 365*24*60*60*1000) : new Date(Date.now() + 30*24*60*60*1000)
    });
    await sub.save();

    res.json({ message: 'Subscription successful', url: 'http://localhost:5173/dashboard' }); // mock redirect url
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current subscription status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ status: user.subscriptionStatus, plan: user.subscriptionPlan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
