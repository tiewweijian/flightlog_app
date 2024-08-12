const mongoose = require('mongoose');

const FlightLogSchema = new mongoose.Schema({
    tailNumber: { type: String, required: true },
    flightID: { type: String, required: true },
    takeoff: { type: Date, required: true },
    landing: { type: Date, required: true },
    duration: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('FlightLog', FlightLogSchema);
