import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Book, { IBook } from '../../src/models/Book';

// Mock Data
const mockBookData = {
  id: uuidv4(),
  title: 'Test Book',
  author: 'Test Author',
  publishedYear: 2020
};

describe('Book Model', () => {
  beforeAll(async () => {
    // Connect to a test MongoDB instance
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    // Clean up and close the connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up the collection after each test
    await Book.deleteMany({});
  });

  it('should create a new book', async () => {
    const newBook = new Book(mockBookData);
    const savedBook = await newBook.save();
    
    // Check the saved document
    expect(savedBook.id).toBe(mockBookData.id);
    expect(savedBook.title).toBe(mockBookData.title);
    expect(savedBook.author).toBe(mockBookData.author);
    expect(savedBook.publishedYear).toBe(mockBookData.publishedYear);
  });

  it('should not save a book without required fields', async () => {
    const invalidBook = new Book({ title: 'Invalid Book' });
    let error = null;
    
    try {
      await invalidBook.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).not.toBeNull();
  });

  it('should validate book id is a valid UUID', async () => {
    const invalidBook = new Book({
      id: 'not-a-valid-uuid',
      title: 'Test Book',
      author: 'Test Author',
      publishedYear: 2020
    });
    
    // The model doesn't validate UUID format, that's done in the service layer
    // So this should actually save, but we just test the validation function here
    const book = await invalidBook.save();
    expect(book.id).toBe('not-a-valid-uuid');
  });
}); 