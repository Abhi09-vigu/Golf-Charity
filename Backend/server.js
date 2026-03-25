const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/golf-charity')
  .then(async () => {
    console.log('MongoDB connected');
    // Seed Admin
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
        await User.create({
          name: 'Super Admin',
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'Admin'
        });
        console.log('Admin user seeded from .env');
      }
    }
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/charity', require('./routes/charity'));
app.use('/api/score', require('./routes/score'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/winner', require('./routes/winner'));

// Basic route
app.get('/', (req, res) => {
  res.send('Golf Charity API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
