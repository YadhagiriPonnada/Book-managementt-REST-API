import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes';
import { errorHandler, notFound } from './middlewares/errorMiddleware';

// Load env vars
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the Book Management API',
    endpoints: {
      books: {
        getAllBooks: 'GET /books',
        getBookById: 'GET /books/:id',
        createBook: 'POST /books',
        updateBook: 'PUT /books/:id',
        deleteBook: 'DELETE /books/:id',
        importBooks: 'POST /books/import'
      }
    }
  });
});

// Mount routes
app.use('/books', bookRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app; 