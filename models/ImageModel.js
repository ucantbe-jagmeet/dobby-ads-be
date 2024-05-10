const mongoose = require('mongoose')

module.exports = mongoose.model('images', {
    fileName: String,
    filePath: String,
    userId: String,
})