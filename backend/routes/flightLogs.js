const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const flightLogController = require('../controllers/flightController'); // Adjust the path based on your project structure

const router = express.Router();

router.post('/', [auth, [
    check('tailNumber', 'Tail number is required').not().isEmpty(),
    check('flightID', 'Flight ID is required').not().isEmpty(),
    check('takeoff', 'Takeoff time is required').not().isEmpty(),
    check('landing', 'Landing time is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric(),
]], flightLogController.createFlightLog);

router.get('/', auth, flightLogController.getFlightLog);

router.put('/:id', [auth, [
    check('tailNumber', 'Tail number is required').not().isEmpty(),
    check('flightID', 'Flight ID is required').not().isEmpty(),
    check('takeoff', 'Takeoff time is required').not().isEmpty(),
    check('landing', 'Landing time is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric(),
]], flightLogController.updateFlightLog);

router.delete('/:id', auth, flightLogController.deleteFlightLog);

module.exports = router;
