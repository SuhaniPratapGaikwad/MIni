const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Notice = require('../models/Notice');

const router = express.Router();

// Ensure upload folder exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'notices');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { year } = req.body;
    const fileUrl = `/uploads/notices/${req.file.filename}`;
    const notice = new Notice({ year, fileUrl });
    await notice.save();
    res.status(200).json({ message: 'Notice uploaded successfully', fileUrl, year });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading notice', error: err });
  }
});

// Get all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notices', error: err });
  }
});

// Delete notice by ID
router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notice', error: err });
  }
});

module.exports = router;
