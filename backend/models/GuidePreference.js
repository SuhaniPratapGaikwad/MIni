const mongoose = require('mongoose');

const guidePreferenceSchema = new mongoose.Schema({
  guideName: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  subDomain: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('GuidePreference', guidePreferenceSchema);
