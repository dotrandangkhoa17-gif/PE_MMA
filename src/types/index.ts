import { User as FirebaseUser } from 'firebase/auth';

export type GenreType = 'Action' | 'Comedy' | 'Drama' | 'Horror';
export type StatusType = 'Plan to Watch' | 'Watching' | 'Watched';

export interface Movie {
  id: string;
  userId: string;
  title: string;
  director: string;
  genre: GenreType | string;
  status: StatusType | string;
  rating?: number | null;
  favorite: boolean;
  notes?: string;
  createdAt?: any;
}

export interface MovieFormData {
  title: string;
  director: string;
  genre: string;
  status: string;
  rating?: string | number | null;
  notes?: string;
  favorite?: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface StatusBreakdownItem {
  status: string;
  count: number;
}

export interface SummaryData {
  movieCount: number;
  favoriteCount: number;
  statusBreakdown: StatusBreakdownItem[];
}

export interface FilterParams {
  genre?: string;
  status?: string;
  favoritesOnly?: boolean;
  searchQuery?: string;
}

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

export interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  addMovie: (data: MovieFormData) => Promise<string>;
  updateMovie: (id: string, data: MovieFormData) => Promise<void>;
  toggleFavorite: (id: string, currentVal: boolean) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  List: undefined;
  Detail: { movieId: string };
};
