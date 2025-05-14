import { isValidUUID, parsePublishedYear } from './validators';
import { v4 as uuidv4 } from 'uuid';

interface BookData {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
}

interface ValidationError {
  row: number;
  errors: string[];
}

interface ParseResult {
  validBooks: BookData[];
  errors: ValidationError[];
}

export const parseCSV = (fileContent: string): ParseResult => {
  const lines = fileContent.split(/\r?\n/);
  const result: ParseResult = { validBooks: [], errors: [] };
  
  // Skip empty lines
  const nonEmptyLines = lines.filter(line => line.trim() !== '');
  
  // Check if file is empty
  if (nonEmptyLines.length === 0) {
    return result;
  }
  
  // Process header row (skip it)
  const headerRow = nonEmptyLines[0];
  const expectedColumns = 4; // id, title, author, publishedYear
  
  // Process data rows
  for (let i = 1; i < nonEmptyLines.length; i++) {
    const row = nonEmptyLines[i];
    const rowNumber = i + 1; // 1-based for user-friendly error messages
    const values = parseCSVRow(row);
    
    // Validate number of columns
    if (values.length !== expectedColumns) {
      result.errors.push({
        row: rowNumber,
        errors: [`Expected ${expectedColumns} columns but found ${values.length}`]
      });
      continue;
    }
    
    // Extract values
    const [id, title, author, publishedYearStr] = values;
    const rowErrors: string[] = [];
    
    // Validate UUID
    if (!isValidUUID(id)) {
      rowErrors.push('Invalid UUID format');
    }
    
    // Validate title
    if (!title || title.trim() === '') {
      rowErrors.push('Title cannot be empty');
    }
    
    // Validate author
    if (!author || author.trim() === '') {
      rowErrors.push('Author cannot be empty');
    }
    
    // Validate published year
    const publishedYear = parsePublishedYear(publishedYearStr);
    const currentYear = new Date().getFullYear();
    
    if (publishedYear === null) {
      rowErrors.push('Published year must be a valid number');
    } else if (publishedYear < 1000 || publishedYear > currentYear) {
      rowErrors.push(`Published year must be between 1000 and ${currentYear}`);
    }
    
    // Add validation errors if any
    if (rowErrors.length > 0) {
      result.errors.push({
        row: rowNumber,
        errors: rowErrors
      });
      continue;
    }
    
    // Add valid book data
    result.validBooks.push({
      id,
      title,
      author,
      publishedYear: publishedYear as number
    });
  }
  
  return result;
};

// Helper function to parse a CSV row, handling quotes and commas properly
const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let inQuotes = false;
  let currentValue = '';
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      // Handle quotes - toggle inQuotes flag
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // End of field if comma is outside quotes
      result.push(currentValue.trim());
      currentValue = '';
    } else {
      // Add character to current field
      currentValue += char;
    }
  }
  
  // Add the last field
  result.push(currentValue.trim());
  
  return result;
}; 