import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Delete } from 'lucide-react-native';

interface PinKeypadProps {
  pinCode: string;
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  maxLength?: number;
}

export default function PinKeypad({ 
  pinCode, 
  onNumberPress, 
  onBackspace, 
  onClear, 
  maxLength = 9 
}: PinKeypadProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <View style={styles.container}>
      <View style={styles.pinDisplay}>
        <View style={styles.pinDots}>
          {Array.from({ length: maxLength }, (_, index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                index < pinCode.length && styles.filledDot,
              ]}
            />
          ))}
        </View>
        {pinCode.length === 0 && (
          <Text style={styles.placeholder}>Enter your {maxLength}-digit PIN</Text>
        )}
        {pinCode.length > 0 && (
          <Text style={styles.pinLength}>
            {pinCode.length} of {maxLength} digits entered
          </Text>
        )}
      </View>

      <View style={styles.keypad}>
        {numbers.map((number) => (
          <TouchableOpacity
            key={number}
            style={styles.numberButton}
            onPress={() => onNumberPress(number)}
            disabled={pinCode.length >= maxLength}
            activeOpacity={0.7}
          >
            <Text style={styles.numberText}>{number}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => onNumberPress('0')}
          disabled={pinCode.length >= maxLength}
          activeOpacity={0.7}
        >
          <Text style={styles.numberText}>0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, pinCode.length === 0 && styles.disabledButton]}
          onPress={onBackspace}
          activeOpacity={0.7}
          disabled={pinCode.length === 0}
        >
          <Delete size={20} color={pinCode.length === 0 ? '#cbd5e1' : '#475569'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pinDisplay: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pinDots: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  filledDot: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  placeholder: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  pinLength: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    maxWidth: 240,
  },
  numberButton: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  numberText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionButton: {
    width: 64,
    height: 64,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});