import { GenreType, StatusType } from '../types';

export interface AppConfigSchema {
  appName: string;
  homeTitle: string;
  collectionName: string;
  featureCards: { id: string; title: string; desc: string }[];
  genres: GenreType[];
  statuses: StatusType[];
  statusBreakdownPriority: StatusType[];
  placeholders: {
    genre: string;
    status: string;
  };
  testIDs: {
    homeTitle: string;
    formSuccess: string;
    errorAuth: string;
    listScreen: string;
    itemForm: string;
    itemSuccess: string;
    itemError: string;
    itemCard: string;
    itemsEmpty: string;
    itemCount: string;
    favoriteCount: string;
  };
  messages: {
    registrationSuccess: string;
    itemAddedSuccess: string;
    emptyList: string;
    duplicateItem: string;
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMinLength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
    titleRequired: string;
    titleMaxLength: string;
    directorRequired: string;
    directorMaxLength: string;
    genreRequired: string;
    statusRequired: string;
    ratingInvalid: string;
    notesMaxLength: string;
  };
  limits: {
    titleMax: number;
    directorMax: number;
    notesMax: number;
    ratingMin: number;
    ratingMax: number;
  };
}

export const APP_CONFIG: AppConfigSchema = {
  appName: 'CineList',
  homeTitle: 'CineList',
  collectionName: 'movies',

  featureCards: [
    { id: '1', title: 'Track what you watch', desc: 'Keep your personal movie watchlist organized in one place' },
    { id: '2', title: 'Sort by status', desc: 'Easily track what movies you plan to watch, are watching, or have watched' },
    { id: '3', title: 'Rate your favorites', desc: 'Star your favorite movies and give ratings from 0 to 5' },
  ],

  genres: ['Action', 'Comedy', 'Drama', 'Horror'],
  statuses: ['Plan to Watch', 'Watching', 'Watched'],
  statusBreakdownPriority: ['Plan to Watch', 'Watching', 'Watched'],

  placeholders: {
    genre: 'Choose genre',
    status: 'Choose status',
  },

  testIDs: {
    homeTitle: 'home-title',
    formSuccess: 'form-success',
    errorAuth: 'error-auth',
    listScreen: 'list-screen',
    itemForm: 'movie-form',
    itemSuccess: 'movie-success',
    itemError: 'error-movie',
    itemCard: 'movie-item',
    itemsEmpty: 'movies-empty',
    itemCount: 'movie-count',
    favoriteCount: 'favorite-count',
  },

  messages: {
    registrationSuccess: 'Registration successful',
    itemAddedSuccess: 'Movie added',
    emptyList: 'No movies found',
    duplicateItem: 'A movie with this title and director already exists',

    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    confirmPasswordRequired: 'Confirm password is required',
    passwordMismatch: 'Passwords do not match',

    titleRequired: 'Title is required',
    titleMaxLength: 'Title must be at most 100 characters',
    directorRequired: 'Director is required',
    directorMaxLength: 'Director must be at most 60 characters',
    genreRequired: 'Please choose a genre',
    statusRequired: 'Please choose a status',
    ratingInvalid: 'Rating must be a whole number from 0 to 5',
    notesMaxLength: 'Notes must be at most 300 characters',
  },

  limits: {
    titleMax: 100,
    directorMax: 60,
    notesMax: 300,
    ratingMin: 0,
    ratingMax: 5,
  },
};
