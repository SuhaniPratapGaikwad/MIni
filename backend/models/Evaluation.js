const mongoose = require('mongoose');

const evaluationEntrySchema = new mongoose.Schema({
  yearType: String,
  academicYear: String,
  division: String,
  group: String,
  guide: String,
  studentName: String,
  comment: String,
  evaluations: [String], // This stores R1, R2... etc
});

module.exports = mongoose.model('EvaluationEntry', evaluationEntrySchema);
