const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    filename: String,  // GridFS filename
    fileId: mongoose.Schema.Types.ObjectId // for streaming later
});


module.exports = mongoose.model('File', fileSchema);
