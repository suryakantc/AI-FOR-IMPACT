const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  rawText: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    default: 'Hindi-English'
  },
  issueType: {
    type: String,
    enum: ['Electrical', 'Plumbing', 'Internet', 'Mess', 'Hostel', 'Academic', 'Library', 'Administrative', 'Other'],
    default: 'Other'
  },
  department: {
    type: String,
    default: 'General Maintenance'
  },
  location: {
    type: String,
    default: 'Campus'
  },
  duration: {
    type: String,
    default: 'Not specified'
  },
  urgency: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  summary: {
    type: String,
    default: ''
  },
  formalComplaint: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN PROGRESS', 'RESOLVED'],
    default: 'OPEN'
  }
}, {
  timestamps: true
});

complaintSchema.index({ status: 1 });
complaintSchema.index({ urgency: -1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
