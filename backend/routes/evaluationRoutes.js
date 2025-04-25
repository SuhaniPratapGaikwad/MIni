const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const EvaluationEntry = require('../models/EvaluationEntry');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/excels/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)  // Using timestamp to avoid duplicate filenames
});

const upload = multer({ storage });

// ====== ✅ 1. Upload File and Save to DB ======
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

// ====== ✅ 2. Get Uploaded Files List ======
router.get('/files/:yearType/:academicYear/:division', async (req, res) => {
  try {
    const { yearType, academicYear, division } = req.params;
    const files = await EvaluationEntry.find({ yearType, academicYear, division });

    if (!files.length) {
      return res.status(404).json({ message: 'No files found' });
    }

    const fileNames = [...new Set(files.map(file => file.filename))]; // Unique filenames
    res.status(200).json(fileNames);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// ====== ✅ 3. Get File Content by Filename ======
router.get('/file/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/excels', filename);

  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    res.json({ data });
  } catch (err) {
    console.error('Read error:', err);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// ====== ✅ 4. Save Edited File Content ======
router.post('/file/update/:filename', async (req, res) => {
  const { filename } = req.params;
  const newData = req.body.data;
  const filePath = path.join(__dirname, '../uploads/excels', filename);

  try {
    const worksheet = xlsx.utils.json_to_sheet(newData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    xlsx.writeFile(workbook, filePath);

    res.json({ message: 'File updated successfully' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

// ====== ✅ 5. Delete File by Filename ======
router.delete('/file/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads/excels', filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      await EvaluationEntry.deleteMany({ filename }); // Also delete from DB
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

module.exports = router;
