import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Staff } from '@/types/api';

interface StaffGridProps {
  staff: Staff[];
  selectedId: number | null;
  onSelect: (ID: number) => void;
  isLoading: boolean;
}

export default function StaffGrid({ staff, selectedId, onSelect, isLoading }: StaffGridProps) {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;
  const columnsCount = isLandscape ? 6 : 3;
  
  const itemWidth = (width - 48 - (columnsCount - 1) * 12) / columnsCount;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading staff...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Staff Member</Text>
      <View style={styles.grid}>
        {staff.map((member) => (
          <TouchableOpacity
            key={member.ID}
            style={[
              styles.staffItem,
              { width: itemWidth },
              selectedId === member.ID && styles.selectedItem,
            ]}
            onPress={() => onSelect(member.ID)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.staffName,
                selectedId === member.ID && styles.selectedText,
              ]}
              numberOfLines={2}
            >
              {member.FirstName} {member.LastName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  staffItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedItem: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  staffName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  selectedText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
});