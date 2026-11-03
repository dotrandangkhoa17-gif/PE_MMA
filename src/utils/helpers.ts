import { APP_CONFIG } from '../config/appConfig';
import { Movie, FilterParams, SummaryData, StatusBreakdownItem } from '../types';

/**
 * Sắp xếp danh sách phim theo Title A-Z (case-insensitive), nếu trùng thì theo Director
 */
export const sortMovies = (movies: Movie[]): Movie[] => {
  return [...movies].sort((a, b) => {
    const titleA = (a.title || '').trim().toLowerCase();
    const titleB = (b.title || '').trim().toLowerCase();
    const titleCompare = titleA.localeCompare(titleB);
    if (titleCompare !== 0) {
      return titleCompare;
    }
    const directorA = (a.director || '').trim().toLowerCase();
    const directorB = (b.director || '').trim().toLowerCase();
    return directorA.localeCompare(directorB);
  });
};

/**
 * Lọc danh sách phim theo Genre, Status, Favorite Only và Search Query (AND logic)
 */
export const filterMovies = (movies: Movie[], filters: FilterParams): Movie[] => {
  const { genre, status, favoritesOnly, searchQuery } = filters;
  const query = (searchQuery || '').trim().toLowerCase();

  return movies.filter((movie) => {
    // 1. Filter theo Genre
    if (genre && genre !== 'All' && movie.genre !== genre) {
      return false;
    }

    // 2. Filter theo Status
    if (status && status !== 'All' && movie.status !== status) {
      return false;
    }

    // 3. Filter theo Favorite
    if (favoritesOnly && !movie.favorite) {
      return false;
    }

    // 4. Substring match Title hoặc Director (case-insensitive, trimmed)
    if (query) {
      const matchTitle = (movie.title || '').toLowerCase().includes(query);
      const matchDirector = (movie.director || '').toLowerCase().includes(query);
      if (!matchTitle && !matchDirector) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Tính toán số liệu thống kê cho Summary:
 * - movieCount: Tổng số phim đang hiển thị
 * - favoriteCount: Số phim yêu thích đang hiển thị
 * - statusBreakdown: Danh sách các status đang có, sắp xếp giảm dần theo count (hòa giải theo priority: 'Plan to Watch' -> 'Watching' -> 'Watched')
 */
export const calculateSummary = (visibleMovies: Movie[]): SummaryData => {
  const movieCount = visibleMovies.length;
  const favoriteCount = visibleMovies.filter((m) => m.favorite).length;

  const counts: Record<string, number> = {};
  visibleMovies.forEach((movie) => {
    if (movie.status) {
      counts[movie.status] = (counts[movie.status] || 0) + 1;
    }
  });

  const priorityOrder = APP_CONFIG.statusBreakdownPriority || ['Plan to Watch', 'Watching', 'Watched'];

  const statusBreakdown: StatusBreakdownItem[] = Object.keys(counts)
    .map((statusName) => ({
      status: statusName,
      count: counts[statusName],
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      const indexA = priorityOrder.indexOf(a.status as any);
      const indexB = priorityOrder.indexOf(b.status as any);
      const prioA = indexA === -1 ? 999 : indexA;
      const prioB = indexB === -1 ? 999 : indexB;
      return prioA - prioB;
    });

  return {
    movieCount,
    favoriteCount,
    statusBreakdown,
  };
};

/**
 * Kiểm tra xem người dùng đã có phim cùng title + director (case-insensitive, trimmed) hay chưa
 */
export const checkDuplicate = (
  existingMovies: Movie[],
  newTitle: string,
  newDirector: string,
  excludeId: string | null = null
): boolean => {
  const normTitle = (newTitle || '').trim().toLowerCase();
  const normDirector = (newDirector || '').trim().toLowerCase();

  return existingMovies.some((movie) => {
    if (excludeId && movie.id === excludeId) return false;
    const mTitle = (movie.title || '').trim().toLowerCase();
    const mDirector = (movie.director || '').trim().toLowerCase();
    return mTitle === normTitle && mDirector === normDirector;
  });
};
