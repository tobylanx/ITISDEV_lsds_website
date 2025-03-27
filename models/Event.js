const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
    eventPicture: { type: String, required: true },
});

module.exports = mongoose.model('Event', EventSchema);
