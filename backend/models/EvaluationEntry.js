const mongoose = require('mongoose');

// Define the evaluation entry schema
const evaluationSchema = new mongoose.Schema({
  yearType: {
    type: String,
    required: true,           // 'FY' or 'TY'
    enum: ['FY', 'TY']        // restrict to these values
  },
  academicYear: {
    type: String,
    required: true            // e.g., "2023-2024"
  },
  division: {
    type: String,
    required: true            // e.g., "A", "B", "C"
  },
  group: {
    type: String,
    required: true            // e.g., Group number or name
  },
  guide: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    default: ''               // default blank comment
  },
  evaluations: {
    type: [String],           // store R1, R2, R3, etc.
    default: []               // default to empty array
  },
  filename: {
    type: String,             // ✅ stores uploaded Excel file name
    required: true            // we mark this required to track file origin
  },
  createdAt: {
    type: Date,
    default: Date.now         // optional: track upload timestamp
  }
});

// Create and export the model
const EvaluationEntry = mongoose.model('EvaluationEntry', evaluationSchema);

module.exports = EvaluationEntry;
