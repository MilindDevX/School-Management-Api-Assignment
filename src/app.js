const express = require('express');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', schoolRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'School Management API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
