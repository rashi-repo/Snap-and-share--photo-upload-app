const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('uploads')); // Serve static files from the uploads folder

// Set up storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Route to handle uploads
app.post('/upload', upload.array('photos', 10), (req, res) => {
    res.json({ files: req.files.map(file => file.filename) });
});

// Route to get all uploaded images
app.get('/photos', (req, res) => {
    const fs = require('fs');
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        res.json(files);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

