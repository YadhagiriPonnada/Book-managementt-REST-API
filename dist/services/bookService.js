"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateBooks = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const uuid_1 = require("uuid");
const Book_1 = __importDefault(require("../models/Book"));
const validators_1 = require("../utils/validators");
const getAllBooks = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Book_1.default.find();
});
exports.getAllBooks = getAllBooks;
const getBookById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isValidUUID)(id)) {
        throw new Error('Invalid book ID format');
    }
    return yield Book_1.default.findOne({ id });
});
exports.getBookById = getBookById;
const createBook = (bookData) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, publishedYear } = bookData;
    if (!(0, validators_1.isValidBookData)(title, author, publishedYear)) {
        throw new Error('Invalid book data');
    }
    const id = bookData.id || (0, uuid_1.v4)();
    if (bookData.id && !(0, validators_1.isValidUUID)(bookData.id)) {
        throw new Error('Invalid book ID format');
    }
    // Check if book with ID already exists
    const existingBook = yield Book_1.default.findOne({ id });
    if (existingBook) {
        throw new Error(`Book with ID ${id} already exists`);
    }
    const newBook = new Book_1.default({
        id,
        title,
        author,
        publishedYear
    });
    return yield newBook.save();
});
exports.createBook = createBook;
const updateBook = (id, bookData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isValidUUID)(id)) {
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
    const updatedBook = yield Book_1.default.findOneAndUpdate({ id }, { $set: bookData }, { new: true, runValidators: true });
    return updatedBook;
});
exports.updateBook = updateBook;
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, validators_1.isValidUUID)(id)) {
        throw new Error('Invalid book ID format');
    }
    const result = yield Book_1.default.deleteOne({ id });
    return result.deletedCount === 1;
});
exports.deleteBook = deleteBook;
const bulkCreateBooks = (books) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBooks = [];
    for (const bookData of books) {
        try {
            const book = yield (0, exports.createBook)(bookData);
            createdBooks.push(book);
        }
        catch (error) {
            // Log error but continue with other books
            console.error(`Failed to create book: ${error.message}`);
        }
    }
    return createdBooks;
});
exports.bulkCreateBooks = bulkCreateBooks;
