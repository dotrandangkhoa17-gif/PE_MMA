import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMovies } from '../context/MovieContext';
import { APP_CONFIG } from '../config/appConfig';
import { validateMovieForm } from '../utils/validation';
import { CustomPicker } from '../components/CustomPicker';
import { RootStackParamList, FormErrors } from '../types';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { movies, updateMovie, deleteMovie, toggleFavorite } = useMovies();

  const movie = movies.find((m) => m.id === movieId);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editError, setEditError] = useState<string>('');

  // Editable Form fields
  const [title, setTitle] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (movie) {
      setTitle(movie.title || '');
      setDirector(movie.director || '');
      setGenre(movie.genre || '');
      setStatus(movie.status || '');
      setRating(movie.rating !== null && movie.rating !== undefined ? String(movie.rating) : '');
      setNotes(movie.notes || '');
    }
  }, [movie]);

  if (!movie) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Movie not found or has been deleted.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Back to List</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Switch to Edit Mode
  const startEditing = () => {
    setTitle(movie.title || '');
    setDirector(movie.director || '');
    setGenre(movie.genre || '');
    setStatus(movie.status || '');
    setRating(movie.rating !== null && movie.rating !== undefined ? String(movie.rating) : '');
    setNotes(movie.notes || '');
    setFormErrors({});
    setEditError('');
    setIsEditing(true);
  };

  // Cancel Edit Mode
  const cancelEditing = () => {
    setIsEditing(false);
    setFormErrors({});
    setEditError('');
  };

  // Save changes
  const handleSave = async () => {
    setEditError('');
    const currentData = { title, director, genre, status, rating, notes };
    const { isValid, errors } = validateMovieForm(currentData);
    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      await updateMovie(movie.id, {
        title,
        director,
        genre,
        status,
        rating,
        notes,
        favorite: movie.favorite,
      });
      setIsEditing(false);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update movie');
    } finally {
      setLoading(false);
    }
  };

  // Delete Movie with Confirmation
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to delete "${movie.title}"?`);
      if (confirmed) {
        setLoading(true);
        deleteMovie(movie.id)
          .then(() => navigation.goBack())
          .catch((err: any) => {
            alert(err.message || 'Could not delete movie');
            setLoading(false);
          });
      }
      return;
    }

    Alert.alert(
      'Delete Movie',
      `Are you sure you want to delete "${movie.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteMovie(movie.id);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Could not delete movie');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* EDIT MODE */}
        {isEditing ? (
          <View style={styles.editCard}>
            <Text style={styles.cardHeading}>Edit Movie Details</Text>

            {editError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>{editError}</Text>
              </View>
            ) : null}

            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, formErrors.title ? styles.inputError : null]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
              />
              {formErrors.title ? (
                <Text style={styles.errorText}>{formErrors.title}</Text>
              ) : null}
            </View>

            {/* Director */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Director *</Text>
              <TextInput
                style={[styles.input, formErrors.director ? styles.inputError : null]}
                value={director}
                onChangeText={setDirector}
                placeholder="Enter director"
              />
              {formErrors.director ? (
                <Text style={styles.errorText}>{formErrors.director}</Text>
              ) : null}
            </View>

            {/* Genre */}
            <CustomPicker
              label="Genre *"
              selectedValue={genre}
              onValueChange={setGenre}
              items={APP_CONFIG.genres}
              placeholder={APP_CONFIG.placeholders.genre}
              errorMessage={formErrors.genre}
            />

            {/* Status */}
            <CustomPicker
              label="Status *"
              selectedValue={status}
              onValueChange={setStatus}
              items={APP_CONFIG.statuses}
              placeholder={APP_CONFIG.placeholders.status}
              errorMessage={formErrors.status}
            />

            {/* Rating */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating (0 - 5, optional)</Text>
              <TextInput
                style={[styles.input, formErrors.rating ? styles.inputError : null]}
                value={rating}
                onChangeText={setRating}
                placeholder="e.g. 4"
                keyboardType="numeric"
              />
              {formErrors.rating ? (
                <Text style={styles.errorText}>{formErrors.rating}</Text>
              ) : null}
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput, formErrors.notes ? styles.inputError : null]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter notes"
                multiline
                numberOfLines={3}
              />
              {formErrors.notes ? (
                <Text style={styles.errorText}>{formErrors.notes}</Text>
              ) : null}
            </View>

            {/* Save & Cancel Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.saveBtn]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={cancelEditing}
                disabled={loading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* VIEW MODE */
          <View style={styles.viewCard}>
            <View style={styles.topRow}>
              <Text style={styles.detailTitle}>{movie.title}</Text>
              <TouchableOpacity
                onPress={() => toggleFavorite(movie.id, movie.favorite)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[styles.starIcon, movie.favorite && styles.starActive]}>
                  {movie.favorite ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.detailDirector}>Directed by {movie.director}</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Genre:</Text>
              <Text style={styles.infoValue}>{movie.genre}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{movie.status}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rating:</Text>
              <Text style={styles.infoValue}>
                {movie.rating !== null && movie.rating !== undefined ? `${movie.rating} / 5` : 'Not rated'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Favorite:</Text>
              <Text style={styles.infoValue}>{movie.favorite ? 'Yes' : 'No'}</Text>
            </View>

            <View style={styles.notesBox}>
              <Text style={styles.infoLabel}>Notes:</Text>
              <Text style={styles.notesText}>
                {movie.notes ? movie.notes : 'No notes provided.'}
              </Text>
            </View>

            {/* Actions: Edit & Delete */}
            <View style={styles.actionSection}>
              <TouchableOpacity style={styles.editBtn} onPress={startEditing}>
                <Text style={styles.editBtnText}>Edit Movie</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Delete Movie</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  viewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  starIcon: {
    fontSize: 28,
    color: '#9CA3AF',
  },
  starActive: {
    color: '#F59E0B',
  },
  detailDirector: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  notesBox: {
    marginTop: 14,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    marginTop: 6,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionSection: {
    marginTop: 24,
    gap: 12,
  },
  editBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  deleteBtnText: {
    color: '#B91C1C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  editCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorBoxText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 13,
  },
  inputGroup: {
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  notesInput: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#10B981',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
  },
  cancelBtnText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});
