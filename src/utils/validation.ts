import { APP_CONFIG } from '../config/appConfig';
import { MovieFormData, FormErrors } from '../types';

/**
 * Validate Email
 */
export const validateEmail = (email?: string): string | undefined => {
  if (!email || email.trim() === '') {
    return APP_CONFIG.messages.emailRequired;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return APP_CONFIG.messages.emailInvalid;
  }
  return undefined;
};

/**
 * Validate Password
 */
export const validatePassword = (password?: string, isRegister = false): string | undefined => {
  if (!password || password === '') {
    return APP_CONFIG.messages.passwordRequired;
  }
  if (isRegister && password.length < 6) {
    return APP_CONFIG.messages.passwordMinLength;
  }
  return undefined;
};

/**
 * Validate Confirm Password
 */
export const validateConfirmPassword = (confirmPassword?: string, password?: string): string | undefined => {
  if (!confirmPassword || confirmPassword === '') {
    return APP_CONFIG.messages.confirmPasswordRequired;
  }
  if (confirmPassword !== password) {
    return APP_CONFIG.messages.passwordMismatch;
  }
  return undefined;
};

/**
 * Validate Movie Form
 */
export const validateMovieForm = (data: Partial<MovieFormData>): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  // Title validation
  const title = data.title ? data.title.trim() : '';
  if (!title) {
    errors.title = APP_CONFIG.messages.titleRequired;
  } else if (title.length > APP_CONFIG.limits.titleMax) {
    errors.title = APP_CONFIG.messages.titleMaxLength;
  }

  // Director validation
  const director = data.director ? data.director.trim() : '';
  if (!director) {
    errors.director = APP_CONFIG.messages.directorRequired;
  } else if (director.length > APP_CONFIG.limits.directorMax) {
    errors.director = APP_CONFIG.messages.directorMaxLength;
  }

  // Genre validation
  if (!data.genre || data.genre === '' || data.genre === APP_CONFIG.placeholders.genre) {
    errors.genre = APP_CONFIG.messages.genreRequired;
  }

  // Status validation
  if (!data.status || data.status === '' || data.status === APP_CONFIG.placeholders.status) {
    errors.status = APP_CONFIG.messages.statusRequired;
  }

  // Rating validation (optional, but if filled must be integer 0 to 5)
  if (data.rating !== undefined && data.rating !== null && String(data.rating).trim() !== '') {
    const rawVal = String(data.rating).trim();
    const isInteger = /^-?\d+$/.test(rawVal);
    const num = parseInt(rawVal, 10);
    if (!isInteger || num < APP_CONFIG.limits.ratingMin || num > APP_CONFIG.limits.ratingMax) {
      errors.rating = APP_CONFIG.messages.ratingInvalid;
    }
  }

  // Notes validation (optional, max 300 chars)
  if (data.notes && data.notes.length > APP_CONFIG.limits.notesMax) {
    errors.notes = APP_CONFIG.messages.notesMaxLength;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
