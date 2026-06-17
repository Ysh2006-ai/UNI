const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages — Get messages for a project
router.get('/', protect, async (req, res) => {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }

    const messages = await Message.find({ project })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 }); // oldest first

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// POST /api/messages — Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { project, content } = req.body;

    if (!project || !content) {
      return res.status(400).json({ success: false, message: 'Project and content are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      project,
      content
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture');

    res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

module.exports = router;
