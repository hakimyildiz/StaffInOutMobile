import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Lock, Shield, ArrowLeft, Trash2 } from 'lucide-react-native';
import { globalStyles, colors, lightTheme, darkTheme, spacing } from '../styles/globalStyles';
import type { Staff, Theme } from '../App';

interface AuthenticationProps {
  staff: Staff;
  onAuthSuccess: () => void;
  onBack: () => void;
  theme: Theme;
}

const Authentication: React.FC<AuthenticationProps> = ({ staff, onAuthSuccess, onBack, theme }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme === 'dark';
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const handleKeypadPress = (value: string) => {
    if (value === 'clear') {
      setPin('');
      setError('');
    } else if (value === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 8) { // Maximum 8 digits
      setPin(prev => prev + value);
    }
  };

  const handleSubmit = async () => {
    if (pin.length < 1 || pin.length > 8) return;
    
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (pin === staff.pin) {
      onAuthSuccess();
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
    
    setIsLoading(false);
  };

  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace']
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: currentTheme.background,
    },
    card: {
      backgroundColor: currentTheme.surface,
      borderRadius: 16,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? colors.gray[700] : 'transparent',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    backButtonText: {
      color: isDark ? colors.gray[400] : colors.gray[600],
      marginLeft: spacing.sm,
    },
    iconContainer: {
      backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : colors.gray[100],
      padding: spacing.md,
      borderRadius: 50,
      alignSelf: 'center',
      marginBottom: spacing.md,
    },
    title: {
      color: currentTheme.text,
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: spacing.sm,
    },
    welcomeText: {
      color: currentTheme.textSecondary,
      marginBottom: spacing.md,
    },
    securityCard: {
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : colors.primary[50],
      borderWidth: 1,
      borderColor: isDark ? colors.primary[800] : colors.primary[200],
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    securityInfo: {
      marginLeft: spacing.md,
    },
    securityTitle: {
      color: isDark ? colors.primary[300] : colors.primary[800],
      fontWeight: '600',
    },
    securityNumber: {
      color: isDark ? colors.primary[200] : colors.primary[700],
      fontFamily: 'monospace',
      fontSize: 18,
    },
    label: {
      color: currentTheme.textSecondary,
      fontSize: 14,
      fontWeight: '500',
      marginBottom: spacing.sm,
    },
    pinContainer: {
      backgroundColor: isDark ? colors.gray[700] : colors.gray[50],
      borderWidth: 1,
      borderColor: isDark ? colors.gray[600] : colors.gray[300],
      borderRadius: 8,
      padding: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    pinDots: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    pinDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      marginHorizontal: 2,
      marginVertical: 2,
    },
    pinDotFilled: {
      backgroundColor: colors.primary[600],
      borderColor: colors.primary[600],
    },
    pinDotEmpty: {
      backgroundColor: isDark ? colors.gray[800] : colors.white,
      borderColor: isDark ? colors.gray[500] : colors.gray[300],
    },
    pinDisplay: {
      color: currentTheme.textSecondary,
      fontSize: 20,
      fontFamily: 'monospace',
      minHeight: 24,
    },
    pinCounter: {
      color: currentTheme.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    keypadContainer: {
      marginBottom: spacing.lg,
    },
    keypadRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    keypadButton: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keypadButtonNumber: {
      backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
    },
    keypadButtonClear: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : colors.gray[100],
    },
    keypadButtonText: {
      fontSize: 20,
      fontWeight: '600',
      color: currentTheme.text,
    },
    keypadButtonTextClear: {
      color: isDark ? colors.red[400] : colors.red[700],
      fontSize: 14,
    },
    errorContainer: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : colors.red[50],
      borderWidth: 1,
      borderColor: isDark ? colors.red[800] : colors.red[200],
      borderRadius: 8,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    errorText: {
      color: isDark ? colors.red[400] : colors.red[700],
      fontSize: 14,
    },
    loginButton: {
      backgroundColor: colors.primary[600],
      paddingVertical: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    loginButtonDisabled: {
      backgroundColor: colors.gray[300],
    },
    loginButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '500',
    },
    footerText: {
      color: currentTheme.textSecondary,
      fontSize: 12,
      textAlign: 'center',
    },
  });

  const renderKeypadButton = (button: string, index: number) => {
    if (button === 'clear') {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleKeypadPress(button)}
          style={[styles.keypadButton, styles.keypadButtonClear]}
        >
          <Text style={[styles.keypadButtonText, styles.keypadButtonTextClear]}>
            Clear
          </Text>
        </TouchableOpacity>
      );
    }
    
    if (button === 'backspace') {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleKeypadPress(button)}
          style={[styles.keypadButton, styles.keypadButtonNumber]}
        >
          <Trash2 size={20} color={currentTheme.text} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleKeypadPress(button)}
        disabled={pin.length >= 8}
        style={[
          styles.keypadButton, 
          styles.keypadButtonNumber,
          pin.length >= 8 && { opacity: 0.5 }
        ]}
      >
        <Text style={styles.keypadButtonText}>{button}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={[globalStyles.container, styles.container]}
      contentContainerStyle={[globalStyles.centerContainer, globalStyles.p4]}
    >
      <View style={[styles.card, globalStyles.shadowLg, globalStyles.p4, { maxWidth: 400, width: '100%' }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
        >
          <ArrowLeft size={16} color={isDark ? colors.gray[400] : colors.gray[600]} />
          <Text style={styles.backButtonText}>Back to Staff Selection</Text>
        </TouchableOpacity>

        <View style={[globalStyles.center, { marginBottom: spacing.lg }]}>
          <View style={styles.iconContainer}>
            <Lock size={32} color={isDark ? colors.green[400] : colors.green[600]} />
          </View>
          <Text style={[styles.title, globalStyles.textCenter]}>
            Authentication
          </Text>
          <Text style={[styles.welcomeText, globalStyles.textCenter]}>
            Welcome, {staff.name}
          </Text>
        </View>

        <View style={styles.securityCard}>
          <Shield size={20} color={isDark ? colors.primary[400] : colors.primary[600]} />
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>Security Number</Text>
            <Text style={styles.securityNumber}>{staff.securityNumber}</Text>
          </View>
        </View>

        <View style={{ marginBottom: spacing.lg }}>
          <Text style={styles.label}>Enter Your PIN (1-8 digits)</Text>
          <View style={styles.pinContainer}>
            <View style={styles.pinDots}>
              {[...Array(8)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    index < pin.length ? styles.pinDotFilled : styles.pinDotEmpty
                  ]}
                />
              ))}
            </View>
            <Text style={styles.pinDisplay}>
              {pin.replace(/./g, '•')}
            </Text>
            <Text style={styles.pinCounter}>
              {pin.length}/8 digits
            </Text>
          </View>
        </View>

        <View style={styles.keypadContainer}>
          {keypadButtons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((button, buttonIndex) => 
                renderKeypadButton(button, rowIndex * 3 + buttonIndex)
              )}
            </View>
          ))}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading || pin.length < 1}
          style={[
            styles.loginButton,
            (isLoading || pin.length < 1) && styles.loginButtonDisabled
          ]}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Authenticating...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Verify that the security number displayed above matches your assigned number
        </Text>
      </View>
    </ScrollView>
  );
};

export default Authentication;