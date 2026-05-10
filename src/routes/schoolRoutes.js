const { Router } = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');
const { validateAddSchool, validateListSchools } = require('../middleware/validators');

const router = Router();

/**
 * @route  POST /addSchool
 * @desc   Add a new school
 * @access Public
 * @body   { name, address, latitude, longitude }
 */
router.post('/addSchool', validateAddSchool, addSchool);

/**
 * @route  GET /listSchools
 * @desc   Get all schools sorted by proximity to user's location
 * @access Public
 * @query  latitude, longitude
 */
router.get('/listSchools', validateListSchools, listSchools);

module.exports = router;
