import { Request, Response } from 'express';
import fs from 'fs';
import * as bookService from '../services/bookService';
import { parseCSV } from '../utils/csvParser';

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await bookService.getBookById(req.params.id);
    
    if (!book) {
      res.status(404).json({
        success: false,
        error: 'Book not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message
    });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, title, author, publishedYear } = req.body;
    
    const newBook = await bookService.createBook({
      id,
      title,
      author,
      publishedYear: Number(publishedYear)
    });
    
    res.status(201).json({
      success: true,
      data: newBook
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message
    });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, publishedYear } = req.body;
    const id = req.params.id;
    
    // Process publishedYear if it exists
    const processedData: any = { title, author };
    if (publishedYear !== undefined) {
      processedData.publishedYear = Number(publishedYear);
    }
    
    const updatedBook = await bookService.updateBook(id, processedData);
    
    if (!updatedBook) {
      res.status(404).json({
        success: false,
        error: 'Book not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: updatedBook
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message
    });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const isDeleted = await bookService.deleteBook(req.params.id);
    
    if (!isDeleted) {
      res.status(404).json({
        success: false,
        error: 'Book not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message
    });
  }
};

export const importBooksFromCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'Please upload a CSV file'
      });
      return;
    }
    
    // Read the file content
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    
    // Parse and validate CSV
    const parseResult = parseCSV(fileContent);
    
    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    // If no valid books found and there are errors
    if (parseResult.validBooks.length === 0 && parseResult.errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'CSV validation failed',
        errors: parseResult.errors
      });
      return;
    }
    
    // Import valid books
    const createdBooks = await bookService.bulkCreateBooks(parseResult.validBooks);
    
    res.status(201).json({
      success: true,
      message: `Successfully imported ${createdBooks.length} books`,
      successCount: createdBooks.length,
      failureCount: parseResult.validBooks.length - createdBooks.length,
      validationErrors: parseResult.errors.length > 0 ? parseResult.errors : undefined
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
}; 