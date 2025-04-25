const express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const EvaluationEntry = require('../models/EvaluationEntry');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/excels/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)  // Using timestamp to avoid duplicate filenames
});

const upload = multer({ storage });

// Handle file upload
router.post('/upload/:yearType/:academicYear/:division', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/excels/', req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Save the uploaded file's data into the database
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
        filename: req.file.filename  // Save the filename in the database entry
      });
      await entry.save();
    }

    res.status(200).json({ message: 'File uploaded and saved to MongoDB successfully!' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error saving to MongoDB' });
  }
});

// Handle fetching uploaded files
router.get('/files/:yearType/:academicYear/:division', async (req, res) => {
  try {
    const { yearType, academicYear, division } = req.params;
    const files = await EvaluationEntry.find({ yearType, academicYear, division });

    if (!files.length) {
      return res.status(404).json({ message: 'No files found' });
    }

    // Return only the filenames from the database
    const fileNames = files.map(file => file.filename);

    res.status(200).json(fileNames);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

module.exports = router;
