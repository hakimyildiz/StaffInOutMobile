import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface FeedbackMessageProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onDismiss: () => void;
}

export default function FeedbackMessage({ message, type, visible, onDismiss }: FeedbackMessageProps) {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(-50);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss();
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        type === 'success' ? styles.successContainer : styles.errorContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {type === 'success' ? (
        <CheckCircle size={24} color="#ffffff" />
      ) : (
        <XCircle size={24} color="#ffffff" />
      )}
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  successContainer: {
    backgroundColor: '#10b981',
  },
  errorContainer: {
    backgroundColor: '#ef4444',
  },
  message: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});