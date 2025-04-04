const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    dateTime: { type: Date, required: true },
    uploader: { type: String, required: true },
    body: { type: String, required: true },
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
