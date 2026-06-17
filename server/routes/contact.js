const express = require('express');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

// POST /api/contact — Submit a contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const contactMessage = await ContactMessage.create({ name, email, message });

    res.status(201).json({ 
      success: true, 
      message: 'Thank you! Your message has been received. We\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit message' });
  }
});

module.exports = router;
