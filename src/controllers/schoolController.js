const { validationResult } = require('express-validator');
const School = require('../models/schoolModel');
const { haversineDistance } = require('../utils/distance');

/**
 * POST /addSchool
 * Validates and inserts a new school into the database.
 */
const addSchool = async (req, res, next) => {
  try {
    // Check validation results from express-validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }

    const { name, address, latitude, longitude } = req.body;

    // Trim string inputs
    const school = await School.create({
      name: name.trim(),
      address: address.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: school,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addSchool };
