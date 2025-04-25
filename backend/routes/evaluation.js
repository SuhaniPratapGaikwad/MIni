const express = require('express');
const EvaluationEntry = require('../models/EvaluationEntry');
const router = express.Router();

// Get all rows for a specific fileId (academicYear+division+yearType as key)
router.get('/file/:fileId', async (req, res) => {
  const [yearType, academicYear, division] = req.params.fileId.split('-');
  try {
    const rows = await EvaluationEntry.find({ yearType, academicYear, division });
    res.json({ filename: `${yearType}-${academicYear}-${division}`, rows: rows.map(doc => {
      const row = {
        group: doc.group,
        guide: doc.guide,
        studentName: doc.studentName,
        comment: doc.comment || '',
        R1: doc.evaluations[0] || '',
        R2: doc.evaluations[1] || '',
        R3: doc.evaluations[2] || '',
        R4: doc.evaluations[3],
        R5: doc.evaluations[4],
        R6: doc.evaluations[5]
      };
      return row;
    })});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});

// Update specific row by index
router.put('/file/:fileId/row/:index', async (req, res) => {
  const [yearType, academicYear, division] = req.params.fileId.split('-');
  const index = parseInt(req.params.index);
  try {
    const docs = await EvaluationEntry.find({ yearType, academicYear, division });
    const doc = docs[index];
    if (!doc) return res.status(404).json({ error: 'Row not found' });

    doc.comment = req.body.comment;
    doc.evaluations = [
      req.body.R1,
      req.body.R2,
      req.body.R3,
      req.body.R4,
      req.body.R5,
      req.body.R6
    ].filter(v => v !== undefined);

    await doc.save();
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update row' });
  }
});

// Delete specific row by index
router.delete('/file/:fileId/row/:index', async (req, res) => {
  const [yearType, academicYear, division] = req.params.fileId.split('-');
  const index = parseInt(req.params.index);
  try {
    const docs = await EvaluationEntry.find({ yearType, academicYear, division });
    const doc = docs[index];
    if (!doc) return res.status(404).json({ error: 'Row not found' });

    await doc.deleteOne();
    res.json({ message: 'Row deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete row' });
  }
});

module.exports = router;
