const { getImages, uploadImage, searchImages } = require('../controllers/imageController');
const multer = require('multer');
const express = require("express");
const router = express.Router();
const crypto = require('crypto');  // Import crypto to generate random hex strings
const path = require('path');  // Import crypto to generate random hex strings
const fs = require('fs');  // Import crypto to generate random hex strings

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('image'), uploadImage);
router.get('/images', getImages);
router.get('/search', searchImages);


module.exports = router;