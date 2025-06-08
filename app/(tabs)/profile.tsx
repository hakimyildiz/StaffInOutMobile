import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Clock, Users, Shield, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Staff Portal</Text>
          <Text style={styles.subtitle}>Time tracking information and guidelines</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Clock size={24} color="#2563EB" />
            <Text style={styles.cardTitle}>How to Use</Text>
            <Text style={styles.cardText}>
              1. Select your name from the staff list{'\n'}
              2. Enter your personal PIN code{'\n'}
              3. Choose Clock In or Clock Out{'\n'}
              4. Your time will be recorded automatically
            </Text>
          </View>

          <View style={styles.card}>
            <Shield size={24} color="#059669" />
            <Text style={styles.cardTitle}>Security</Text>
            <Text style={styles.cardText}>
              Your PIN code is confidential and should not be shared with others. 
              If you forget your PIN, please contact your supervisor.
            </Text>
          </View>

          <View style={styles.card}>
            <Users size={24} color="#DC2626" />
            <Text style={styles.cardTitle}>Important Notes</Text>
            <Text style={styles.cardText}>
              • Always clock in when you arrive{'\n'}
              • Clock out when you leave for the day{'\n'}
              • Contact management for break policies{'\n'}
              • Report any issues immediately
            </Text>
          </View>

          <View style={styles.card}>
            <Info size={24} color="#7C3AED" />
            <Text style={styles.cardTitle}>Support</Text>
            <Text style={styles.cardText}>
              If you experience any issues with the time clock system, 
              please contact your supervisor or IT support for assistance.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#6B7280',
    textAlign: 'center',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});