// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Vietnamese format)
export const isValidPhone = (phone) => {
  const phoneRegex =
    /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
  return phoneRegex.test(phone);
};

// Password validation (minimum 6 characters, at least one letter and one number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

// Required field validation
export const isRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Minimum length validation
export const hasMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

// Maximum length validation
export const hasMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength;
};

// Number validation
export const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Future date validation
export const isFutureDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d > now;
};

// Past date validation
export const isPastDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d < now;
};
