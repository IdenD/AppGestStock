const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (admin) {
      console.log('Admin already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const newAdmin = new User({ email: 'admin@example.com', password: hashedPassword, role: 'admin' });
    await newAdmin.save();
    console.log('Admin created');
    process.exit();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit();
  });
