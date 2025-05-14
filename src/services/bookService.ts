import { v4 as uuidv4 } from 'uuid';
import Book, { IBook } from '../models/Book';
import { isValidBookData, isValidUUID } from '../utils/validators';

interface BookData {
  id?: string;
  title: string;
  author: string;
  publishedYear: number;
}

export const getAllBooks = async (): Promise<IBook[]> => {
  return await Book.find();
};

export const getBookById = async (id: string): Promise<IBook | null> => {
  if (!isValidUUID(id)) {
    throw new Error('Invalid book ID format');
  }
  return await Book.findOne({ id });
};

export const createBook = async (bookData: BookData): Promise<IBook> => {
  const { title, author, publishedYear } = bookData;
  
  if (!isValidBookData(title, author, publishedYear)) {
    throw new Error('Invalid book data');
  }
  
  const id = bookData.id || uuidv4();
  
  if (bookData.id && !isValidUUID(bookData.id)) {
    throw new Error('Invalid book ID format');
  }
  
  // Check if book with ID already exists
  const existingBook = await Book.findOne({ id });
  if (existingBook) {
    throw new Error(`Book with ID ${id} already exists`);
  }
  
  const newBook = new Book({
    id,
    title,
    author,
    publishedYear
  });
  
  return await newBook.save();
};

export const updateBook = async (id: string, bookData: Partial<BookData>): Promise<IBook | null> => {
  if (!isValidUUID(id)) {
    throw new Error('Invalid book ID format');
  }
  
  const { title, author, publishedYear } = bookData;
  
  // Validate partial data if provided
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    throw new Error('Title cannot be empty');
  }
  
  if (author !== undefined && (typeof author !== 'string' || author.trim() === '')) {
    throw new Error('Author cannot be empty');
  }
  
  if (publishedYear !== undefined) {
    const currentYear = new Date().getFullYear();
    if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > currentYear) {
      throw new Error(`Published year must be between 1000 and ${currentYear}`);
    }
  }
  
  const updatedBook = await Book.findOneAndUpdate(
    { id },
    { $set: bookData },
    { new: true, runValidators: true }
  );
  
  return updatedBook;
};

export const deleteBook = async (id: string): Promise<boolean> => {
  if (!isValidUUID(id)) {
    throw new Error('Invalid book ID format');
  }
  
  const result = await Book.deleteOne({ id });
  return result.deletedCount === 1;
};

export const bulkCreateBooks = async (books: BookData[]): Promise<IBook[]> => {
  const createdBooks: IBook[] = [];
  
  for (const bookData of books) {
    try {
      const book = await createBook(bookData);
      createdBooks.push(book);
    } catch (error) {
      // Log error but continue with other books
      console.error(`Failed to create book: ${(error as Error).message}`);
    }
  }
  
  return createdBooks;
}; 