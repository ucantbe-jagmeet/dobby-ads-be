const fs = require('fs');
const path = require('path');
const ImageModel = require('../models/ImageModel');

const getImages = async (req, res) => {
    const userId = req.user.id;

    try {
        const images = await ImageModel.find({ userId });
        if (!images.length) {
            return res.status(404).json({ message: 'No images found.' });
        }
        res.status(200).json(images);
    } catch (err) {
        console.error('Error retrieving images:', err);
        res.status(500).send('Failed to retrieve images');
    }
}

const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newImage = new ImageModel({
        userId: req.user.id,
        fileName: req.file.originalname,
        filePath: `/uploads/${req.user.id}/${req.file.filename}`
    });

    try {
        await newImage.save();
        res.status(200).json({ message: 'File uploaded successfully', fileDetails: newImage });
    } catch (err) {
        console.error('Error saving the image:', err);
        res.status(500).send('Error saving the image');
    }
}

const searchImages = async (req, res) => {
    const userId = req.user.id;
    const searchQuery = req.query.name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();

    console.log('searchQuery', searchQuery)
    try {
        const images = await ImageModel.find({
            userId: userId,
            fileName: { $regex: searchQuery, $options: 'i' }
        });
        if (!images.length) {
            return res.status(404).json({ message: 'No matching images found.' });
        }
        res.status(200).json(images);
    } catch (err) {
        console.error('Error searching for images:', err);
        res.status(500).send('Failed to retrieve images');
    }
}

module.exports = {
    getImages,
    uploadImage,
    searchImages
};
