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

/**
 * GET /listSchools
 * Fetches all schools and returns them sorted by proximity
 * to the user's latitude/longitude query parameters.
 */
const listSchools = async (req, res, next) => {
  try {
    // Validate query params
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

    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    // Fetch all schools from DB
    const schools = await School.findAll();

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found',
        userLocation: { latitude: userLat, longitude: userLon },
        total: 0,
        data: [],
      });
    }

    // Attach distance and sort ascending
    const schoolsWithDistance = schools
      .map((school) => ({
        ...school,
        distance_km: haversineDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: 'Schools retrieved and sorted by proximity',
      userLocation: { latitude: userLat, longitude: userLon },
      total: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addSchool, listSchools };
