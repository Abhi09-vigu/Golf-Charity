const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: String, required: true }, // Stripe price ID
  status: { type: String, enum: ['Active', 'Canceled', 'PastDue'], default: 'Active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
