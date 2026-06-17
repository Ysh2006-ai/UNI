const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: 2000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
