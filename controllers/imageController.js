const fs = require('fs');

const getImages = (req, res) => {
    const userId = req.user.id;
    const dir = path.join(__dirname, 'uploads', String(userId));

    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).send('Failed to retrieve files');
        }
        const fileDetails = files.map(file => ({
            name: file,
            url: `/uploads/${userId}/${file}`
        }));
        res.status(200).json(fileDetails);
    });
}

const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({ message: 'File uploaded successfully', filePath: `../uploads/${req.user.id}/${req.file.filename}`, fileName: req.body.name });
}

const searchImages = (req, res) => {
    const userId = req.user.id;
    const searchQuery = req.query.name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    const dir = path.join(__dirname, '..', 'uploads', String(userId));

    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).send('Failed to retrieve files');
        }
        const filteredFiles = files.filter(file => file.toLowerCase().startsWith(searchQuery)).map(file => ({
            name: file,
            url: `/uploads/${userId}/${file}`
        }));
        res.status(200).json(filteredFiles);
    });
}

module.exports = {
    getImages,
    uploadImage,
    searchImages
};
