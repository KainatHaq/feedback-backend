const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authenticateAdmin = require('../middleware/authMiddleware');

// 📩 POST /feedback — Student submits feedback
router.post('/', async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ msg: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ msg: "Error submitting feedback", error: err.message });
  }
});

// 📥 GET /feedback?page=1&limit=5 — Admin gets paginated feedbacks
router.get('/', authenticateAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const total = await Feedback.countDocuments();
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      feedbacks,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching feedbacks", error: err.message });
  }
});

// 🗑 DELETE /feedback/:id — Admin deletes a feedback
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ msg: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting feedback", error: err.message });
  }
});

module.exports = router;
