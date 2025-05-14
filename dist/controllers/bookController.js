"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.importBooksFromCSV = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const fs_1 = __importDefault(require("fs"));
const bookService = __importStar(require("../services/bookService"));
const csvParser_1 = require("../utils/csvParser");
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield bookService.getAllBooks();
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield bookService.getBookById(req.params.id);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
exports.getBookById = getBookById;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, author, publishedYear } = req.body;
        const newBook = yield bookService.createBook({
            id,
            title,
            author,
            publishedYear: Number(publishedYear)
        });
        res.status(201).json({
            success: true,
            data: newBook
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
exports.createBook = createBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, publishedYear } = req.body;
        const id = req.params.id;
        // Process publishedYear if it exists
        const processedData = { title, author };
        if (publishedYear !== undefined) {
            processedData.publishedYear = Number(publishedYear);
        }
        const updatedBook = yield bookService.updateBook(id, processedData);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDeleted = yield bookService.deleteBook(req.params.id);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
exports.deleteBook = deleteBook;
const importBooksFromCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                error: 'Please upload a CSV file'
            });
            return;
        }
        // Read the file content
        const fileContent = fs_1.default.readFileSync(req.file.path, 'utf8');
        // Parse and validate CSV
        const parseResult = (0, csvParser_1.parseCSV)(fileContent);
        // Delete the temporary file
        fs_1.default.unlinkSync(req.file.path);
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
        const createdBooks = yield bookService.bulkCreateBooks(parseResult.validBooks);
        res.status(201).json({
            success: true,
            message: `Successfully imported ${createdBooks.length} books`,
            successCount: createdBooks.length,
            failureCount: parseResult.validBooks.length - createdBooks.length,
            validationErrors: parseResult.errors.length > 0 ? parseResult.errors : undefined
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
exports.importBooksFromCSV = importBooksFromCSV;
