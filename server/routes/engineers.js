const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/engineers — List all engineers
router.get('/', protect, async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = { role: 'engineer' };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const engineers = await User.find(query)
      .select('-password')
      .sort({ ratings: -1 });

    res.json({ success: true, engineers });
  } catch (error) {
    console.error('Get engineers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch engineers' });
  }
});

// GET /api/engineers/:id — Get single engineer profile
router.get('/:id', protect, async (req, res) => {
  try {
    const engineer = await User.findById(req.params.id).select('-password');
    
    if (!engineer || engineer.role !== 'engineer') {
      return res.status(404).json({ success: false, message: 'Engineer not found' });
    }

    res.json({ success: true, engineer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch engineer' });
  }
});

// PUT /api/engineers/:id — Update engineer profile
router.put('/:id', protect, async (req, res) => {
  try {
    // Only the engineer themselves can update their profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const allowedFields = ['bio', 'skills', 'experience', 'specialization', 'profilePicture', 'portfolio'];
    const updates = {};
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const engineer = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, engineer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;
