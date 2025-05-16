/**
 * Utility functions for working with dates in the application
 */

/**
 * Formats a date to MySQL-compatible datetime string
 * @param date Date object or ISO string
 * @returns MySQL datetime string (YYYY-MM-DD HH:MM:SS) or null if input is null/undefined
 */
export function formatDateForMySQL(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Format as YYYY-MM-DD HH:MM:SS for MySQL
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
  } catch (error) {
    console.error('Error formatting date for MySQL:', error);
    throw new Error('Invalid date format');
  }
}

/**
 * Formats a date for display in the UI
 * @param date Date object, ISO string or MySQL datetime string
 * @returns Formatted date string for display or empty string if input is null/undefined
 */
export function formatDateForDisplay(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    // Format for display using browser's locale
    return dateObj.toLocaleString();
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return 'Invalid date';
  }
}
