const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matches: { type: Number, required: true }, // e.g., 3, 4, or 5 matches
  prizeAmount: { type: Number, required: true },
  proofUrl: { type: String }, // User uploads proof image
  verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Winner', winnerSchema);
