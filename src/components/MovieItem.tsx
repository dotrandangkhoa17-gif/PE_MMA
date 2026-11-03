import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { APP_CONFIG } from '../config/appConfig';
import { Movie } from '../types';

interface MovieItemProps {
  movie: Movie;
  onPress: () => void;
  onToggleFavorite: (id: string, currentVal: boolean) => void;
}

export const MovieItem: React.FC<MovieItemProps> = ({ movie, onPress, onToggleFavorite }) => {
  return (
    <TouchableOpacity
      testID={APP_CONFIG.testIDs.itemCard}
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {movie.title}
          </Text>
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => onToggleFavorite(movie.id, movie.favorite)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.starIcon, movie.favorite && styles.starActive]}>
              {movie.favorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.director} numberOfLines={1}>
          Directed by {movie.director}
        </Text>

        <View style={styles.tagRow}>
          <View style={[styles.badge, styles.genreBadge]}>
            <Text style={styles.genreText}>{movie.genre}</Text>
          </View>
          <View style={[styles.badge, styles.statusBadge]}>
            <Text style={styles.statusText}>{movie.status}</Text>
          </View>
          {movie.rating !== null && movie.rating !== undefined && (
            <View style={[styles.badge, styles.ratingBadge]}>
              <Text style={styles.ratingText}>⭐ {movie.rating}/5</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  starButton: {
    padding: 4,
  },
  starIcon: {
    fontSize: 22,
    color: '#9CA3AF',
  },
  starActive: {
    color: '#F59E0B',
  },
  director: {
    fontSize: 14,
    color: '#4B5563',
    marginVertical: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  genreBadge: {
    backgroundColor: '#EEF2FF',
  },
  genreText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
  },
  ratingText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
  },
});

