import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { APP_CONFIG } from '../config/appConfig';
import { validateMovieForm } from '../utils/validation';
import { sortMovies, filterMovies, calculateSummary } from '../utils/helpers';
import { CustomPicker } from '../components/CustomPicker';
import { SummaryCard } from '../components/SummaryCard';
import { FilterSection } from '../components/FilterSection';
import { MovieItem } from '../components/MovieItem';
import { RootStackParamList, FormErrors, Movie } from '../types';

type ListScreenProps = NativeStackScreenProps<RootStackParamList, 'List'>;

export const ListScreen: React.FC<ListScreenProps> = ({ navigation }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const { movies, loading: moviesLoading, addMovie, toggleFavorite } = useMovies();
  const isFocused = useIsFocused();

  // Redirect if not authenticated (prevent flash of protected content)
  useEffect(() => {
    if (isFocused && !authLoading && !user) {
      navigation.replace('Home');
    }
  }, [user, authLoading, isFocused, navigation]);

  // Form state
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [director, setDirector] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [hasSubmittedForm, setHasSubmittedForm] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Real-time form field validations
  const handleFieldChange = (
    field: string,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(value);
    setFormSuccess('');
    setFormError('');
    if (hasSubmittedForm) {
      const currentData = {
        title,
        director,
        genre,
        status,
        rating,
        notes,
        [field]: value,
      };
      const { errors } = validateMovieForm(currentData);
      setFormErrors((prev) => ({ ...prev, [field]: errors[field] }));
    }
  };

  // Submit Add Movie
  const handleAddMovie = async () => {
    setHasSubmittedForm(true);
    setFormSuccess('');
    setFormError('');

    const currentData = { title, director, genre, status, rating, notes };
    const { isValid, errors } = validateMovieForm(currentData);
    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addMovie({
        title,
        director,
        genre,
        status,
        rating,
        notes,
        favorite: false,
      });

      // Clear form on success
      setTitle('');
      setDirector('');
      setGenre('');
      setStatus('');
      setRating('');
      setNotes('');
      setFormErrors({});
      setHasSubmittedForm(false);
      setFormSuccess(APP_CONFIG.messages.itemAddedSuccess);
    } catch (err: any) {
      setFormError(err.message || 'Failed to add movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedStatus('All');
    setFavoritesOnly(false);
  };

  // Compute sorted & filtered movies
  const visibleMovies: Movie[] = useMemo(() => {
    const filtered = filterMovies(movies, {
      genre: selectedGenre,
      status: selectedStatus,
      favoritesOnly,
      searchQuery,
    });
    return sortMovies(filtered);
  }, [movies, selectedGenre, selectedStatus, favoritesOnly, searchQuery]);

  // Compute summary stats
  const summary = useMemo(() => {
    return calculateSummary(visibleMovies);
  }, [visibleMovies]);

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView testID={APP_CONFIG.testIDs.listScreen} style={styles.container}>
      {/* Header with user email & Logout */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.appName}>{APP_CONFIG.appName}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={visibleMovies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* ADD MOVIE FORM (Collapsible) */}
            <View testID={APP_CONFIG.testIDs.itemForm} style={styles.formContainer}>
              <TouchableOpacity
                style={styles.toggleHeader}
                onPress={() => setIsFormVisible(!isFormVisible)}
                activeOpacity={0.7}
              >
                <View style={styles.toggleTitleContainer}>
                  <Text style={styles.formTitle}>Add New Movie</Text>
                  <Text style={styles.toggleSubtitle}>
                    {isFormVisible ? 'Click to collapse form' : 'Click to expand form'}
                  </Text>
                </View>
                <View style={[styles.toggleBadge, isFormVisible && styles.toggleBadgeActive]}>
                  <Text style={[styles.toggleBadgeText, isFormVisible && styles.toggleBadgeTextActive]}>
                    {isFormVisible ? '✕ Close' : '+ Add Movie'}
                  </Text>
                </View>
              </TouchableOpacity>

              {isFormVisible && (
                <View style={styles.formBody}>
                  {/* Form Success Message */}
                  {formSuccess ? (
                    <View style={styles.successBox}>
                      <Text testID={APP_CONFIG.testIDs.itemSuccess} style={styles.successText}>
                        {formSuccess}
                      </Text>
                    </View>
                  ) : null}

                  {/* Form Error Message (e.g. duplicate) */}
                  {formError ? (
                    <View style={styles.errorBox}>
                      <Text testID={APP_CONFIG.testIDs.itemError} style={styles.errorBoxText}>
                        {formError}
                      </Text>
                    </View>
                  ) : null}

                  {/* Title Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                      style={[styles.input, formErrors.title ? styles.inputError : null]}
                      placeholder="Enter movie title"
                      placeholderTextColor="#9CA3AF"
                      value={title}
                      onChangeText={(val) => handleFieldChange('title', val, setTitle)}
                    />
                    {formErrors.title ? (
                      <Text style={styles.fieldError}>{formErrors.title}</Text>
                    ) : null}
                  </View>

                  {/* Director Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Director *</Text>
                    <TextInput
                      style={[styles.input, formErrors.director ? styles.inputError : null]}
                      placeholder="Enter director name"
                      placeholderTextColor="#9CA3AF"
                      value={director}
                      onChangeText={(val) => handleFieldChange('director', val, setDirector)}
                    />
                    {formErrors.director ? (
                      <Text style={styles.fieldError}>{formErrors.director}</Text>
                    ) : null}
                  </View>

                  {/* Genre Picker */}
                  <CustomPicker
                    label="Genre *"
                    selectedValue={genre}
                    onValueChange={(val) => handleFieldChange('genre', val, setGenre)}
                    items={APP_CONFIG.genres}
                    placeholder={APP_CONFIG.placeholders.genre}
                    errorMessage={formErrors.genre}
                  />

                  {/* Status Picker */}
                  <CustomPicker
                    label="Status *"
                    selectedValue={status}
                    onValueChange={(val) => handleFieldChange('status', val, setStatus)}
                    items={APP_CONFIG.statuses}
                    placeholder={APP_CONFIG.placeholders.status}
                    errorMessage={formErrors.status}
                  />

                  {/* Rating Input (Optional) */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Rating (0 - 5, optional)</Text>
                    <TextInput
                      style={[styles.input, formErrors.rating ? styles.inputError : null]}
                      placeholder="e.g. 5"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      value={rating}
                      onChangeText={(val) => handleFieldChange('rating', val, setRating)}
                    />
                    {formErrors.rating ? (
                      <Text style={styles.fieldError}>{formErrors.rating}</Text>
                    ) : null}
                  </View>

                  {/* Notes Input (Optional) */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes (optional)</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.notesInput,
                        formErrors.notes ? styles.inputError : null,
                      ]}
                      placeholder="Short notes about the movie..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                      value={notes}
                      onChangeText={(val) => handleFieldChange('notes', val, setNotes)}
                    />
                    {formErrors.notes ? (
                      <Text style={styles.fieldError}>{formErrors.notes}</Text>
                    ) : null}
                  </View>

                  {/* Add Button */}
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleAddMovie}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitBtnText}>Add Movie</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* FILTERS & SEARCH */}
            <FilterSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              favoritesOnly={favoritesOnly}
              onFavoritesOnlyChange={setFavoritesOnly}
              onClearFilters={handleClearFilters}
            />

            {/* SUMMARY STATS */}
            <SummaryCard
              movieCount={summary.movieCount}
              favoriteCount={summary.favoriteCount}
              statusBreakdown={summary.statusBreakdown}
            />

            <Text style={styles.sectionHeading}>Movies List</Text>
          </View>
        }
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            onPress={() => navigation.navigate('Detail', { movieId: item.id })}
            onToggleFavorite={toggleFavorite}
          />
        )}
        ListEmptyComponent={
          !moviesLoading ? (
            <View style={styles.emptyContainer}>
              <Text testID={APP_CONFIG.testIDs.itemsEmpty} style={styles.emptyText}>
                {APP_CONFIG.messages.emptyList}
              </Text>
            </View>
          ) : (
            <ActivityIndicator style={{ marginTop: 20 }} color="#4F46E5" />
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    overflow: 'hidden',
  },
  toggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  toggleTitleContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  toggleBadge: {
    backgroundColor: '#4F46E5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  toggleBadgeActive: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  toggleBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  toggleBadgeTextActive: {
    color: '#4B5563',
  },
  formBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#34D399',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    color: '#065F46',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  errorBoxText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: 'bold',
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
  fieldError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 14,
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});
