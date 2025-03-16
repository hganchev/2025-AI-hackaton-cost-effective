/**
 * Utility functions for form validation
 */

/**
 * Validates an email address
 * @param email Email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param password Password to validate
 * @returns True if password meets requirements (min 6 chars), false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates password with stronger requirements
 * @param password Password to validate
 * @returns True if password meets all requirements, false otherwise
 */
export const isStrongPassword = (password: string): boolean => {
  // Check length - minimum 8 characters
  if (password.length < 8) return false;
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Check for digit
  if (!/\d/.test(password)) return false;
  
  return true;
};

/**
 * Gets password validation error message if any
 * @param password Password to validate
 * @returns Error message or empty string if valid
 */
export const getPasswordErrorMessage = (password: string): string => {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit";
  }
  return "";
};

/**
 * Checks if passwords match
 * @param password Main password
 * @param confirmPassword Confirmation password
 * @returns True if passwords match, false otherwise
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validates that a required field is not empty
 * @param value Field value
 * @returns True if field has value, false otherwise
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates form fields and returns error messages
 * @param fields Object containing field values
 * @returns Object with error messages for each field
 */
export const validateForm = (fields: Record<string, string>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Name validation
  if (fields.name !== undefined && !isNotEmpty(fields.name)) {
    errors.name = "Name is required";
  }
  
  // Email validation
  if (!isNotEmpty(fields.email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(fields.email)) {
    errors.email = "Invalid email format";
  }
  
  // Password validation
  if (!isNotEmpty(fields.password)) {
    errors.password = "Password is required";
  } else if (!isValidPassword(fields.password)) {
    errors.password = "Password must be at least 6 characters";
  }
  
  // Confirm password validation
  if (fields.confirmPassword !== undefined) {
    if (!isNotEmpty(fields.confirmPassword)) {
      errors.confirmPassword = "Please confirm your password";
    } else if (!doPasswordsMatch(fields.password, fields.confirmPassword)) {
      errors.confirmPassword = "Passwords do not match";
    }
  }
  
  return errors;
}; 