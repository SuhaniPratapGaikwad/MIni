const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const guideRoutes = require('./routes/guideRoutes');
const noticesRoutes = require('./routes/notices');
const errorHandler = require('./middleware/errorHandler');
const evaluationRoutes = require('./routes/evaluationRoutes');
const evaluation = require("./routes/evaluation");




dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/evaluate', evaluation);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Routes
app.use('/api/guide', guideRoutes);
app.use('/api/notices', noticesRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
