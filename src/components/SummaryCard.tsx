import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_CONFIG } from '../config/appConfig';
import { StatusBreakdownItem } from '../types';

interface SummaryCardProps {
  movieCount: number;
  favoriteCount: number;
  statusBreakdown?: StatusBreakdownItem[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  movieCount,
  favoriteCount,
  statusBreakdown = [],
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Summary</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Movies</Text>
          <Text testID={APP_CONFIG.testIDs.itemCount} style={styles.statNumber}>
            {movieCount}
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Favorites</Text>
          <Text testID={APP_CONFIG.testIDs.favoriteCount} style={styles.statNumber}>
            {favoriteCount}
          </Text>
        </View>
      </View>

      {statusBreakdown.length > 0 && (
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Status Breakdown:</Text>
          {statusBreakdown.map((item) => (
            <View key={item.status} style={styles.breakdownRow}>
              <Text style={styles.statusName}>{item.status}</Text>
              <Text style={styles.statusCount}>{item.count}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 110,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  breakdownSection: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statusName: {
    fontSize: 14,
    color: '#374151',
  },
  statusCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
