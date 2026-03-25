const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  numbers: [{ type: Number }], // The winning numbers
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  results: { type: mongoose.Schema.Types.Mixed } // e.g., JSON storing winners details
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);
