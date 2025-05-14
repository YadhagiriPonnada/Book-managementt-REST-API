# Book Management REST API

A RESTful API to manage a collection of books with basic CRUD operations and support for CSV bulk import with validation.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose
- Jest for testing

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally on default port 27017)

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd book-api
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory with:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookdb
```

4. Start MongoDB locally

Make sure MongoDB is running on your local machine with the default port (27017).

5. Start the application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Books

| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | /books         | Get all books         |
| GET    | /books/:id     | Get a specific book   |
| POST   | /books         | Add a new book        |
| PUT    | /books/:id     | Update a book         |
| DELETE | /books/:id     | Delete a book         |
| POST   | /books/import  | Import books from CSV |

### Book Object Structure

```json
{
  "id": "uuid-string",
  "title": "Book Title",
  "author": "Book Author",
  "publishedYear": 2023
}
```

## CSV Import

The API supports bulk importing of books via CSV files. The CSV should include a header row and have the following columns:

```
id,title,author,publishedYear
```

Example:
```
id,title,author,publishedYear
123e4567-e89b-12d3-a456-426614174000,The Hobbit,J.R.R. Tolkien,1937
123e4567-e89b-12d3-a456-426614174001,To Kill a Mockingbird,Harper Lee,1960
```

- `id` should be a valid UUID
- `title` and `author` should be non-empty strings
- `publishedYear` should be a number between 1000 and the current year

## Running Tests

```bash
npm run dev
```

## Postman Upload Instructions:
- Method: POST
- URL: http://localhost:5000/books/import
- Body: form-data
 - Key: file (type: File)
 - Value: (Upload your .csv file)
Running Tests
$ npm test




## Author
Developed by 
## Ponnada Yadhagiri
8074849052
ponnadayadhagiri111@gmail.com
yadhagiri9577@gmail.com

