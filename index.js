// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// require("dotenv").config(); // Load environment variables
// console.log("✅ MONGO_URI:", process.env.MONGO_URI); // Debug check

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/feedback", require("./routes/feedbackRoutes"));
// app.use("/admin", require("./routes/adminRoutes"));

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI) // ✅ Removed deprecated options
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Example API route
app.post('/api/feedback', async (req, res) => {
  try {
    const Feedback = mongoose.model('Feedback', new mongoose.Schema({
      name: String,
      email: String,
      comment: String,
    }));

    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// === Serve React frontend ===

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /dist (React build)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all to serve React's index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
