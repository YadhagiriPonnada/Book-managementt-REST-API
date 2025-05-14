import express, { Router, Request, Response, NextFunction } from 'express';
import * as bookController from '../controllers/bookController';
import { uploadCSV } from '../middlewares/uploadMiddleware';

const router: Router = express.Router();

// Get all books
router.get('/', bookController.getAllBooks);

// Get single book by ID
router.get('/:id', bookController.getBookById);

// Create a new book
router.post('/', bookController.createBook);

// Update a book
router.put('/:id', bookController.updateBook);

// Delete a book
router.delete('/:id', bookController.deleteBook);

// Bulk import books from CSV
router.post('/import', uploadCSV, bookController.importBooksFromCSV);

export default router; 