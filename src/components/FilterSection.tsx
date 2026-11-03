import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import { APP_CONFIG } from '../config/appConfig';
import { CustomPicker } from './CustomPicker';

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (val: boolean) => void;
  onClearFilters: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedStatus,
  onStatusChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  onClearFilters,
}) => {
  const genreOptions = ['All', ...APP_CONFIG.genres];
  const statusOptions = ['All', ...APP_CONFIG.statuses];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Search & Filters</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title or director..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      {/* Dropdown Filters */}
      <View style={styles.dropdownRow}>
        <View style={styles.dropdownCol}>
          <CustomPicker
            label="Genre"
            selectedValue={selectedGenre}
            onValueChange={onGenreChange}
            items={genreOptions}
            placeholder="All Genres"
          />
        </View>
        <View style={styles.dropdownCol}>
          <CustomPicker
            label="Status"
            selectedValue={selectedStatus}
            onValueChange={onStatusChange}
            items={statusOptions}
            placeholder="All Statuses"
          />
        </View>
      </View>

      {/* Favorite Toggle & Clear Button */}
      <View style={styles.bottomRow}>
        <View style={styles.switchContainer}>
          <Switch
            value={favoritesOnly}
            onValueChange={onFavoritesOnlyChange}
            trackColor={{ false: '#D1D5DB', true: '#818CF8' }}
            thumbColor={favoritesOnly ? '#4F46E5' : '#F3F4F6'}
          />
          <Text style={styles.switchLabel}>Favorites only</Text>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={onClearFilters}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dropdownCol: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
});
