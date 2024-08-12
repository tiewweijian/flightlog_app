const { check, validationResult } = require('express-validator');
const FlightLog = require('../models/FlightLog'); // Adjust the path based on your project structure


exports.createFlightLog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { tailNumber, flightID, takeoff, landing, duration } = req.body;

    try {
        const newLog = new FlightLog({
            tailNumber,
            flightID,
            takeoff,
            landing,
            duration,
            user: req.user.id
        });

        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.updateFlightLog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { tailNumber, flightID, takeoff, landing, duration } = req.body;

    try {
        let log = await FlightLog.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ msg: 'Log not found' });
        }

        // Update the log with new data
        log = await FlightLog.findByIdAndUpdate(
            req.params.id,
            { tailNumber, flightID, takeoff, landing, duration },
            { new: true }
        );

        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getFlightLog = async (req, res) => {
    try {
        const logs = await FlightLog.find();
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.deleteFlightLog = async (req, res) => {
    try {
        let log = await FlightLog.findById(req.params.id);

        if (!log) {
            return res.status(404).json({ msg: 'Log not found' });
        }

        await FlightLog.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Log removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}