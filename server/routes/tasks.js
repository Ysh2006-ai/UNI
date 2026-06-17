const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/tasks — Get tasks (optionally filtered by project)
router.get('/', protect, async (req, res) => {
  try {
    const { project } = req.query;
    let query = {};

    if (project) {
      query.project = project;
    } else if (req.user.role === 'engineer') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    // Group by status for Kanban board
    const grouped = {
      todo: tasks.filter(t => t.status === 'todo'),
      inProgress: tasks.filter(t => t.status === 'inProgress'),
      completed: tasks.filter(t => t.status === 'completed')
    };

    res.json({ success: true, tasks: grouped });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks — Create a task
router.post('/', protect, async (req, res) => {
  try {
    const { title, project, assignedTo, dueDate, description } = req.body;

    if (!title || !project) {
      return res.status(400).json({ success: false, message: 'Title and project are required' });
    }

    const task = await Task.create({
      title,
      project,
      assignedTo: assignedTo || req.user._id,
      dueDate: dueDate ? new Date(dueDate) : null,
      description: description || '',
      status: 'todo'
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name')
      .populate('project', 'title');

    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id — Update a task (move between columns, edit details)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { status, title, dueDate, description, assignedTo } = req.body;
    
    if (status) task.status = status;
    if (title) task.title = title;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (description !== undefined) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name')
      .populate('project', 'title');

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
});

module.exports = router;
