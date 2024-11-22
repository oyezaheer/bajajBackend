const express = require("express");
const bodyParser = require("body-parser");
const { fromBuffer } = require("file-type");
const multer = require('multer');
const cors = require('cors');
const path = require('path');
 // Optional: For dynamic MIME type detection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});


// Helper function to check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};
const processFile = async (file) => {
    try {
        if (!file || !file.buffer) {
            return { 
                valid: false,
                error: "No file provided" 
            };
        }

        // Get file type using file-type package
        const fileInfo = await fileType.fromBuffer(file.buffer);
        
        // Get file extension from original name if file-type fails
        const originalExtension = path.extname(file.originalname).toLowerCase();
        
        // Handle text-based files that file-type might not detect
        const textBasedExtensions = new Set(['.txt', '.js', '.html', '.css', '.json']);
        const isTextBased = textBasedExtensions.has(originalExtension);

        let mimeType;
        if (fileInfo) {
            mimeType = fileInfo.mime;
        } else if (isTextBased) {
            // Map common text-based extensions to MIME types
            const mimeTypes = {
                '.txt': 'text/plain',
                '.js': 'application/javascript',
                '.html': 'text/html',
                '.css': 'text/css',
                '.json': 'application/json'
            };
            mimeType = mimeTypes[originalExtension] || 'text/plain';
        } else {
            return { valid: false, error: "Unknown file type" };
        }

        return {
            valid: true,
            mimeType: mimeType,
            sizeKb: Math.ceil(file.buffer.length / 1024).toString(),
            originalName: file.originalname
        };
    } catch (error) {
        console.error('File processing error:', error);
        return { 
            valid: false,
            error: "File processing failed" 
        };
    }
};

// Middleware to validate headers
const validateHeaders = (req, res, next) => {
  req.user_id = req.headers["user_id"] || "unknown_user";
  req.email = req.headers["email"] || "unknown_email";
  req.roll_number = req.headers["roll_number"] || "unknown_roll_number";
  req.filename = req.headers["filename"] || "unknown_file";
  next();
};

// API Endpoint
app
  .route("/bfhl")
  .get((req, res) => {
    res.status(200).json({ operation_code: 1 });
  })
  .post(validateHeaders, async (req, res) => {
    const { data = [], file_b64 = null } = req.body;
    const file = req.body;

    const numbers = [];
    const alphabets = [];
    let highest_lowercase = "";
    let prime_found = false;

    // Process input data
    for (const item of data) {
      if (!isNaN(item)) {
        numbers.push(item);
        if (isPrime(Number(item))) {
          prime_found = true;
        }
      } else if (item.length === 1 && isNaN(item)) {
        alphabets.push(item);
        if (item >= "a" && item <= "z" && (!highest_lowercase || item > highest_lowercase)) {
          highest_lowercase = item;
        }
      }
    }

    // Process base64 file
    let file_valid = false;
    let file_mime_type = null;
    let file_size_kb = null;

    if (file_b64) {
      try {
        const buffer = Buffer.from(file_b64, "base64");
        file_size_kb = (buffer.length / 1024).toFixed(2); // Calculate file size in KB
        file_valid = true;

        // Optional: Dynamically determine MIME type
        const fileType = await fromBuffer(buffer);
        file_mime_type = fileType?.mime || "unknown";
      } catch (error) {
        file_valid = false;
      }
    }

    // Response object
    const response = {
      is_success: true,
      user_id: req.user_id,
      email: req.email,
      roll_number: req.roll_number,
      filename: req.filename,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highest_lowercase ? [highest_lowercase] : [],
      is_prime_found: prime_found,
      file_valid,
      file_mime_type,
      file_size_kb,
    };

    res.json(response);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
