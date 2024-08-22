const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const path = require('path');

// --------------------------DATABASE CONNECTION------------------------
connectToMongo();
// ---------------------------------------------------------------------

// -------------------------EXPRESS SERVER------------------------------
const app = express();
const port = 5000;
app.use(cors());

// -------------NECESSARY TO USE req.body (Middleware)------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/example', express.static(path.join(__dirname, '../example')));
// --------------------------------------------

//---------------AVAILABLE ROUTES--------------
app.use('/api/v1/auth', require('./routes/auth.js'));
app.use('/api/v1/product', require('./routes/products.js'));

// -------------------------------------------------

// --------------IMAGE UPLOAD----------------------
const multer = require('multer');
const fs = require('fs');

// Define the path to the 'images' directory inside 'public/example/' of the frontend project
const uploadDirectory = path.join(__dirname, '/example/images');

// Ensure that the 'images' directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Save files to the defined directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Handle POST request to upload files
app.post('/api/v1/upload', upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'subImage1', maxCount: 1 },
    { name: 'subImage2', maxCount: 1 },
    { name: 'subImage3', maxCount: 1 }
]), (req, res) => {
    const uploadedFiles = req.files;
    const filePaths = {};

    Object.keys(uploadedFiles).forEach(key => {
        filePaths[`${key}Path`] = `/example/images/${uploadedFiles[key][0].filename}`;
    });

    if (Object.keys(filePaths).length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    console.log('Files uploaded:', uploadedFiles);
    res.status(200).json({ message: 'Files uploaded successfully!', filePaths });
});

// Serve the uploaded files
app.use('/example/images', express.static(uploadDirectory));

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
});
