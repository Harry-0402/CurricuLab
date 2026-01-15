const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 4000;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Use UUID to prevent path traversal and collisions
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File Validation
const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'text/plain',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'image/png',
    'image/jpeg',
    'image/jpg'
];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, PPTX, TXT, CSV, and Excel allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.body;
    if (!userId) {
        // Clean up if validation fails
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        console.log(`[Node] File received: ${req.file.filename} from User: ${userId}`);

        // Call Python Service to process content
        const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/process`, {
            fileId: req.file.filename,
            filePath: req.file.path,
            userId: userId,
            originalName: req.file.originalname
        });

        res.json({
            status: 'success',
            fileId: req.file.filename,
            message: 'File processed and indexed successfully',
            stats: pythonResponse.data
        });

    } catch (error) {
        console.error('[Node] Error processing file:', error.message);
        // Clean up on error
        if (fs.existsSync(req.file.path)) {
            // fs.unlinkSync(req.file.path); // Optional: keep for debug or delete
        }
        res.status(500).json({
            error: 'Failed to process file',
            details: error.response?.data || error.message
        });
    }
});

app.post('/chat', async (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ error: 'userId and message are required' });
    }

    try {
        console.log(`[Node] Chat query from ${userId}: ${message}`);

        // Proxy to Python RAG query
        const pythonResponse = await axios.post(`${PYTHON_SERVICE_URL}/query`, {
            userId,
            query: message
        });

        res.json(pythonResponse.data);

    } catch (error) {
        console.error('[Node] Chat error:', error.message);
        res.status(500).json({
            error: 'Failed to get answer',
            details: error.response?.data || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`[Node] Upload Server running on http://localhost:${PORT}`);
});
