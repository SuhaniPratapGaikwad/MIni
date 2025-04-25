const express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const EvaluationEntry = require('../models/EvaluationEntry');
const router = express.Router();

// Set up file storage and naming configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/excels/')); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename using timestamp
  }
});
const upload = multer({ storage: storage });

// Step 2: Update Upload Route - Handle Excel file upload and store data
router.post('/upload/:yearType/:academicYear/:division', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/excels/', req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Save file details to the database for each row in the Excel file
    for (const row of data) {
      const entry = new EvaluationEntry({
        yearType: req.params.yearType,
        academicYear: req.params.academicYear,
        division: req.params.division,
        group: row.Group,
        guide: row.Guide,
        studentName: row['Student Name'],
        comment: row.Comment || '',
        evaluations: Object.keys(row)
          .filter(key => /^R\d+$/.test(key))
          .map(key => row[key]?.toString() || ''),
        filename: req.file.filename // Save the filename in the document
      });
      await entry.save();
    }

    // Return filenames after saving the file details
    const files = await EvaluationEntry.find({
      yearType: req.params.yearType,
      academicYear: req.params.academicYear,
      division: req.params.division
    });

    const fileNames = files.map(file => file.filename);  // Get all filenames for the division
    res.status(200).json({
      message: 'File uploaded successfully!',
      fileNames: fileNames  // Send back the list of filenames
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error saving to MongoDB' });
  }
});

// Step 3: Add Fetch Files Route - Fetch list of all uploaded files for a specific academic year and division
router.get('/files/:yearType/:academicYear/:division', async (req, res) => {
  const { yearType, academicYear, division } = req.params;
  try {
    // Fetch filenames for the given academic year, yearType, and division
    const files = await EvaluationEntry.find({ yearType, academicYear, division });
    const fileNames = files.map(file => file.filename);  // Extract filenames from the database

    res.json({ fileNames: fileNames }); // Send filenames back to the client
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Step 4: Add Delete Route - Delete specific uploaded file by filename
router.delete('/file/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  try {
    // Find the record using the fileId and delete the associated file entry
    const file = await EvaluationEntry.findOne({ filename: fileId });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the record from the database
    await file.deleteOne();

    // Also delete the actual file from the server
    const filePath = path.join(__dirname, '../uploads/excels/', fileId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the physical file from server storage
    }

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

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
