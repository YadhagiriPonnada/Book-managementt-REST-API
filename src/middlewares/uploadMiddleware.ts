import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filter function to allow only CSV files
const csvFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return cb(new Error('Only CSV files are allowed'));
  }
  cb(null, true);
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB max file size
  fileFilter: csvFilter
});

// Upload middleware for CSV
export const uploadCSV = (req: Request, res: Response, next: NextFunction) => {
  const csvUpload = upload.single('file');
  
  csvUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
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
    } else if (err) {
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