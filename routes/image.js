const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser.js');
const uploadMiddleware = require('../middleware/upload.js');
const Image = require('../models/Image.js');
const { body, validationResult } = require('express-validator');
const User = require('../models/Users');

// Route to upload an image (POST /api/upload)
router.post('/upload', [
    fetchuser,
    uploadMiddleware,
    body('category', 'Category is required').notEmpty(),
    body('comment', 'Comment is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, category, comment } = req.body;
        const images = req.files;
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!images || images.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        const imageDocs = images.map(image => ({
            name: name, // Use the same name for all images if needed
            username: user.name,
            data: image.buffer,
            contentType: image.mimetype,
            fileType: image.mimetype,
            category: category,
            comment: comment
        }));

        const newImage = new Image({
            user: userId,
            name: name, // Set the name of the image collection
            username: user.name, // Assuming username is stored in the User model
            category: category,
            comment: comment,
            images: imageDocs
        });

        const savedImage = await newImage.save();
        res.json(savedImage);
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to delete an image (DELETE /api/delete/:id)
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        // Find the image by ID
        const image = await Image.findById(req.params.id);

        // Check if image exists
        if (!image) {
            return res.status(404).json({ errors: [{ msg: 'Image not found' }] });
        }

        // Check if the user owns the image
        if (image.user.toString() !== req.user.id) {
            return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
        }

        // Delete the image
        await Image.findByIdAndDelete(req.params.id);

        res.json({ message: 'Image deleted successfully', image: image });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to get all files (GET /api/files)
router.get('/files', fetchuser,async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch the authenticated user's details
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }

        // Fetch all files from the database
        const image = await Image.find();
        

        res.json(image);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
