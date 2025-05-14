import { validate as uuidValidate } from 'uuid';

export const isValidUUID = (id: string): boolean => {
  return uuidValidate(id);
};

export const isValidBookData = (
  title: string, 
  author: string, 
  publishedYear: number
): boolean => {
  const currentYear = new Date().getFullYear();
  
  if (!title || typeof title !== 'string') return false;
  if (!author || typeof author !== 'string') return false;
  if (!publishedYear || 
      typeof publishedYear !== 'number' || 
      publishedYear < 1000 || 
      publishedYear > currentYear) {
    return false;
  }
  
  return true;
};

export const parsePublishedYear = (yearStr: string): number | null => {
  const year = parseInt(yearStr);
  return isNaN(year) ? null : year;
}; 