const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/projects — Create a new project (client only)
router.post('/', protect, authorize('client'), async (req, res) => {
  try {
    const { title, description, disciplines, budget, startDate, deadline } = req.body;

    if (!title || !description || !disciplines || !budget || !startDate || !deadline) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const project = await Project.create({
      title,
      description,
      client: req.user._id,
      disciplines: Array.isArray(disciplines) ? disciplines : [disciplines],
      budget: Number(budget),
      startDate: new Date(startDate),
      deadline: new Date(deadline),
      status: 'open'
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

// GET /api/projects — List projects
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'client') {
      // Clients see their own projects
      projects = await Project.find({ client: req.user._id })
        .populate('assignedEngineers', 'name specialization profilePicture')
        .sort({ createdAt: -1 });
    } else {
      // Engineers see available & assigned projects
      const { filter } = req.query;
      if (filter === 'assigned') {
        projects = await Project.find({ assignedEngineers: req.user._id })
          .populate('client', 'name email')
          .sort({ createdAt: -1 });
      } else {
        projects = await Project.find({ status: 'open' })
          .populate('client', 'name email')
          .sort({ createdAt: -1 });
      }
    }

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id — Get single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email')
      .populate('assignedEngineers', 'name specialization experience ratings profilePicture bio');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// PUT /api/projects/:id — Update project
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only the client owner can update
    if (req.user.role === 'client' && project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedEngineers', 'name specialization profilePicture');

    res.json({ success: true, project: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

// POST /api/projects/:id/match — Match engineers to a project
router.post('/:id/match', protect, authorize('client'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Find engineers matching the project's disciplines
    const disciplinePatterns = project.disciplines.map(d => new RegExp(d, 'i'));
    
    let engineers = await User.find({
      role: 'engineer',
      specialization: { $regex: disciplinePatterns.map(p => p.source).join('|'), $options: 'i' }
    }).sort({ ratings: -1 }).limit(10);

    // If not enough matches, return all engineers sorted by rating
    if (engineers.length < 3) {
      engineers = await User.find({ role: 'engineer' })
        .sort({ ratings: -1 })
        .limit(10);
    }

    // Update project status
    project.status = 'matching';
    await project.save();

    res.json({ success: true, engineers });
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ success: false, message: 'Failed to match engineers' });
  }
});

// POST /api/projects/:id/assign — Assign engineers to a project
router.post('/:id/assign', protect, authorize('client'), async (req, res) => {
  try {
    const { engineerIds } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.assignedEngineers = engineerIds;
    project.status = 'in-progress';
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('assignedEngineers', 'name specialization profilePicture');

    res.json({ success: true, project: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to assign engineers' });
  }
});

module.exports = router;
