"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSV = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Set storage engine
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
// Filter function to allow only CSV files
const csvFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(csv)$/)) {
        return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
};
// Initialize upload
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB max file size
    fileFilter: csvFilter
});
// Upload middleware for CSV
const uploadCSV = (req, res, next) => {
    const csvUpload = upload.single('file');
    csvUpload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            // A Multer error occurred when uploading.
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: 'File size cannot exceed 5MB'
                });
            }
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        else if (err) {
            // A non-Multer error occurred
            return res.status(400).json({
                success: false,
                error: err.message
            });
        }
        // Check if a file was actually uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Please upload a CSV file'
            });
        }
        next();
    });
};
exports.uploadCSV = uploadCSV;
