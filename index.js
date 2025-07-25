const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config(); // Load environment variables
console.log("✅ MONGO_URI:", process.env.MONGO_URI); // Debug check

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/feedback", require("./routes/feedbackRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI) // ✅ Removed deprecated options
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

