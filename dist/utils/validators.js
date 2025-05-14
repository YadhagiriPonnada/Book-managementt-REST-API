"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePublishedYear = exports.isValidBookData = exports.isValidUUID = void 0;
const uuid_1 = require("uuid");
const isValidUUID = (id) => {
    return (0, uuid_1.validate)(id);
};
exports.isValidUUID = isValidUUID;
const isValidBookData = (title, author, publishedYear) => {
    const currentYear = new Date().getFullYear();
    if (!title || typeof title !== 'string')
        return false;
    if (!author || typeof author !== 'string')
        return false;
    if (!publishedYear ||
        typeof publishedYear !== 'number' ||
        publishedYear < 1000 ||
        publishedYear > currentYear) {
        return false;
    }
    return true;
};
exports.isValidBookData = isValidBookData;
const parsePublishedYear = (yearStr) => {
    const year = parseInt(yearStr);
    return isNaN(year) ? null : year;
};
exports.parsePublishedYear = parsePublishedYear;
