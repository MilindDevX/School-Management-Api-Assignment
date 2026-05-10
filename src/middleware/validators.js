const { body, query } = require('express-validator');

/**
 * Validation rules for POST /addSchool
 */
const validateAddSchool = [
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .notEmpty()
    .withMessage('Name cannot be blank')
    .isLength({ max: 255 })
    .withMessage('Name must be 255 characters or fewer'),

  body('address')
    .exists({ checkFalsy: true })
    .withMessage('Address is required')
    .isString()
    .withMessage('Address must be a string')
    .trim()
    .notEmpty()
    .withMessage('Address cannot be blank')
    .isLength({ max: 500 })
    .withMessage('Address must be 500 characters or fewer'),

  body('latitude')
    .exists({ checkNull: true })
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),

  body('longitude')
    .exists({ checkNull: true })
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
];

/**
 * Validation rules for GET /listSchools
 */
const validateListSchools = [
  query('latitude')
    .exists({ checkNull: true })
    .withMessage('Latitude query parameter is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),

  query('longitude')
    .exists({ checkNull: true })
    .withMessage('Longitude query parameter is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
];

module.exports = { validateAddSchool, validateListSchools };
