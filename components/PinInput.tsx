import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Backpack as Backspace } from 'lucide-react-native';

interface PinInputProps {
  pin: string;
  onPinChange: (pin: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

const { width } = Dimensions.get('window');

export default function PinInput({
  pin,
  onPinChange,
  maxLength = 4,
  disabled = false,
}: PinInputProps) {
  const addDigit = (digit: string) => {
    if (pin.length < maxLength) {
      onPinChange(pin + digit);
    }
  };

  const removeDigit = () => {
    onPinChange(pin.slice(0, -1));
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < maxLength; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            i < pin.length && styles.pinDotFilled,
          ]}
        />
      );
    }
    return dots;
  };

  const renderKeypadButton = (digit: string) => {
    const isBackspace = digit === 'backspace';
    const buttonSize = Math.min((width - 80) / 3 - 16, 80);
    
    return (
      <TouchableOpacity
        key={digit}
        style={[
          styles.keypadButton,
          { width: buttonSize, height: buttonSize },
          disabled && styles.keypadButtonDisabled,
        ]}
        onPress={() => {
          if (isBackspace) {
            removeDigit();
          } else {
            addDigit(digit);
          }
        }}
        disabled={disabled}
      >
        {isBackspace ? (
          <Backspace size={24} color={disabled ? '#9CA3AF' : '#374151'} />
        ) : (
          <Text style={[styles.keypadButtonText, disabled && styles.keypadButtonTextDisabled]}>
            {digit}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter PIN Code</Text>
      <View style={styles.pinDisplay}>
        {renderPinDots()}
      </View>
      <View style={styles.keypad}>
        <View style={styles.keypadRow}>
          {renderKeypadButton('1')}
          {renderKeypadButton('2')}
          {renderKeypadButton('3')}
        </View>
        <View style={styles.keypadRow}>
          {renderKeypadButton('4')}
          {renderKeypadButton('5')}
          {renderKeypadButton('6')}
        </View>
        <View style={styles.keypadRow}>
          {renderKeypadButton('7')}
          {renderKeypadButton('8')}
          {renderKeypadButton('9')}
        </View>
        <View style={styles.keypadRow}>
          <View style={[styles.keypadButton, styles.invisibleButton]} />
          {renderKeypadButton('0')}
          {renderKeypadButton('backspace')}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  pinDotFilled: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  keypad: {
    alignItems: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  keypadButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  keypadButtonDisabled: {
    opacity: 0.6,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  keypadButtonTextDisabled: {
    color: '#9CA3AF',
  },
  invisibleButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
});