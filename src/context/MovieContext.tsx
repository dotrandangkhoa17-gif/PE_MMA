import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { APP_CONFIG } from '../config/appConfig';
import { checkDuplicate } from '../utils/helpers';
import { Movie, MovieFormData, MovieContextType } from '../types';

const MovieContext = createContext<MovieContextType>({} as MovieContextType);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setMovies([]);
      return;
    }

    setLoading(true);
    const moviesRef = collection(db, APP_CONFIG.collectionName);
    const q = query(moviesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedMovies: Movie[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedMovies.push({
            id: docSnap.id,
            userId: data.userId,
            title: data.title,
            director: data.director,
            genre: data.genre,
            status: data.status,
            rating: data.rating,
            favorite: Boolean(data.favorite),
            notes: data.notes,
            createdAt: data.createdAt,
          });
        });
        setMovies(loadedMovies);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Thêm phim mới
  const addMovie = async (movieData: MovieFormData): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const isDup = checkDuplicate(movies, movieData.title, movieData.director);
    if (isDup) {
      throw new Error(APP_CONFIG.messages.duplicateItem);
    }

    const payload = {
      userId: user.uid,
      title: movieData.title.trim(),
      director: movieData.director.trim(),
      genre: movieData.genre,
      status: movieData.status,
      rating: movieData.rating !== undefined && movieData.rating !== null && String(movieData.rating).trim() !== '' 
        ? parseInt(String(movieData.rating).trim(), 10) 
        : null,
      favorite: Boolean(movieData.favorite),
      notes: movieData.notes ? movieData.notes.trim() : '',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, APP_CONFIG.collectionName), payload);
    return docRef.id;
  };

  // Cập nhật thông tin phim
  const updateMovie = async (id: string, updatedData: MovieFormData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const isDup = checkDuplicate(movies, updatedData.title, updatedData.director, id);
    if (isDup) {
      throw new Error(APP_CONFIG.messages.duplicateItem);
    }

    const docRef = doc(db, APP_CONFIG.collectionName, id);
    const payload = {
      title: updatedData.title.trim(),
      director: updatedData.director.trim(),
      genre: updatedData.genre,
      status: updatedData.status,
      rating: updatedData.rating !== undefined && updatedData.rating !== null && String(updatedData.rating).trim() !== '' 
        ? parseInt(String(updatedData.rating).trim(), 10) 
        : null,
      favorite: Boolean(updatedData.favorite),
      notes: updatedData.notes ? updatedData.notes.trim() : '',
    };

    await updateDoc(docRef, payload);
  };

  // Toggle Favorite (bật/tắt sao cập nhật Firestore ngay lập tức)
  const toggleFavorite = async (id: string, currentVal: boolean): Promise<void> => {
    if (!user) return;
    const docRef = doc(db, APP_CONFIG.collectionName, id);
    await updateDoc(docRef, { favorite: !currentVal });
  };

  // Xoá phim khỏi Firestore
  const deleteMovie = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    const docRef = doc(db, APP_CONFIG.collectionName, id);
    await deleteDoc(docRef);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        loading,
        addMovie,
        updateMovie,
        toggleFavorite,
        deleteMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = (): MovieContextType => useContext(MovieContext);

