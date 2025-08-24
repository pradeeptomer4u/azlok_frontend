/**
 * Utility functions for formatting dates, currency, and other values
 */

/**
 * Format a date to a readable string
 * @param date - Date to format
 * @param format - Optional format (defaults to 'PP' - locale's date format)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (defaults to USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format a number with commas
 * @param num - Number to format
 * @returns Formatted number string with commas
 */
export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '-';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
