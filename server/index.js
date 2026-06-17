const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Route imports
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const engineerRoutes = require('./routes/engineers');
const taskRoutes = require('./routes/tasks');
const messageRoutes = require('./routes/messages');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'UNI Server is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/engineers', engineerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 UNI Server running on http://localhost:' + PORT);
      console.log('📡 API available at http://localhost:' + PORT + '/api');
      console.log('');
    });
  }
};

startServer();

module.exports = app;
