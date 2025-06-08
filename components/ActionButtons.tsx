import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LogIn, LogOut } from 'lucide-react-native';

interface ActionButtonsProps {
  onClockIn: () => void;
  onClockOut: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const { width } = Dimensions.get('window');

export default function ActionButtons({
  onClockIn,
  onClockOut,
  disabled = false,
  loading = false,
}: ActionButtonsProps) {
  const buttonWidth = Math.min((width - 60) / 2, 180);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.clockInButton,
          { width: buttonWidth },
          disabled && styles.buttonDisabled,
        ]}
        onPress={onClockIn}
        disabled={disabled || loading}
      >
        <LogIn size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Clock In'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.clockOutButton,
          { width: buttonWidth },
          disabled && styles.buttonDisabled,
        ]}
        onPress={onClockOut}
        disabled={disabled || loading}
      >
        <LogOut size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Clock Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  clockInButton: {
    backgroundColor: '#059669',
  },
  clockOutButton: {
    backgroundColor: '#DC2626',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});