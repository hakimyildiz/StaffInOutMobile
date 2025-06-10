import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Backpack as Backspace } from 'lucide-react-native';

interface PinKeypadProps {
  PinCode: string;
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export default function PinKeypad({ PinCode, onNumberPress, onBackspace, onClear }: PinKeypadProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter PIN</Text>
      
      <View style={styles.pinDisplay}>
        <Text style={styles.pinText}>
          {PinCode.replace(/./g, '●')}
        </Text>
        {PinCode.length === 0 && (
          <Text style={styles.placeholder}>Enter 1-9 digits</Text>
        )}
      </View>

      <View style={styles.keypad}>
        {numbers.map((number) => (
          <TouchableOpacity
            key={number}
            style={styles.numberButton}
            onPress={() => onNumberPress(number)}
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
          activeOpacity={0.7}
        >
          <Text style={styles.numberText}>0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onBackspace}
          activeOpacity={0.7}
          disabled={PinCode.length === 0}
        >
          <Backspace size={24} color={PinCode.length === 0 ? '#9ca3af' : '#374151'} />
        </TouchableOpacity>
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
  pinDisplay: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  pinText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    letterSpacing: 8,
    minHeight: 28,
  },
  placeholder: {
    fontSize: 14,
    color: '#9ca3af',
    position: 'absolute',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  numberButton: {
    width: '30%',
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
  numberText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionButton: {
    width: '30%',
    height: 60,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});