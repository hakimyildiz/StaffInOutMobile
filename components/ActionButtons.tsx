import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LogIn, LogOut } from 'lucide-react-native';

interface ActionButtonsProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  loadingAction: 'checkin' | 'checkout' | null;
}

export default function ActionButtons({ 
  onCheckIn, 
  onCheckOut, 
  isDisabled, 
  isLoading, 
  loadingAction 
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.checkInButton, isDisabled && styles.disabledButton]}
        onPress={onCheckIn}
        disabled={isDisabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading && loadingAction === 'checkin' ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <>
            <LogIn size={24} color="#ffffff" />
            <Text style={styles.buttonText}>Check In</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.checkOutButton, isDisabled && styles.disabledButton]}
        onPress={onCheckOut}
        disabled={isDisabled || isLoading}
        activeOpacity={0.8}
      >
        {isLoading && loadingAction === 'checkout' ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <>
            <LogOut size={24} color="#ffffff" />
            <Text style={styles.buttonText}>Check Out</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    minHeight: 56,
  },
  checkInButton: {
    backgroundColor: '#10b981',
  },
  checkOutButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});