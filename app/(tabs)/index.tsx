import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Staff, TimeLogRequest } from '@/types/api';
import { apiService } from '@/services/api';
import StaffGrid from '@/components/StaffGrid';
import PinKeypad from '@/components/PinKeypad';
import ActionButtons from '@/components/ActionButtons';
import FeedbackMessage from '@/components/FeedbackMessage';

export default function AttendanceScreen() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [PinCode, setPinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<'checkin' | 'checkout' | null>(null);
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setIsStaffLoading(true);
      const staffData = await apiService.getStaffList();
      setStaff(staffData);
    } catch (error) {
      showFeedback('Failed to load staff list. Please try again.', 'error');
    } finally {
      setIsStaffLoading(false);
    }
  };

  const handleNumberPress = (number: string) => {
    if (PinCode.length < 9) {
      setPinCode(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setPinCode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPinCode('');
  };

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ visible: true, message, type });
  };

  const hideFeedback = () => {
    setFeedback(prev => ({ ...prev, visible: false }));
  };

  const isFormValid = selectedStaffId !== null && PinCode.length >= 1 && PinCode.length <= 9;

  const handleCheckIn = async () => {
    if (!isFormValid || !selectedStaffId) return;

    try {
      setIsLoading(true);
      setLoadingAction('checkin');
      
      const request: TimeLogRequest = {
        UserID: selectedStaffId,
        PinCode: PinCode
      };

      const response = await apiService.checkIn(request);
      
      if (response.success) {
        showFeedback('Check-in successful!', 'success');
        resetForm();
      } else {
        showFeedback(response.message || 'Check-in failed. Please try again.', 'error');
      }
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : 'Network error. Please check your connection.',
        'error'
      );
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleCheckOut = async () => {
    if (!isFormValid || !selectedStaffId) return;

    try {
      setIsLoading(true);
      setLoadingAction('checkout');
      
      const request: TimeLogRequest = {
        UserID: selectedStaffId,
        PinCode: PinCode
      };

      const response = await apiService.checkOut(request);
      
      if (response.success) {
        showFeedback('Check-out successful!', 'success');
        resetForm();
      } else {
        showFeedback(response.message || 'Check-out failed. Please try again.', 'error');
      }
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : 'Network error. Please check your connection.',
        'error'
      );
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const resetForm = () => {
    setSelectedStaffId(null);
    setPinCode('');
  };

  const selectedStaffName = staff.find(s => s.ID === selectedStaffId)?.FirstName + ' ' + staff.find(s => s.ID === selectedStaffId)?.LastName;

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackMessage
        message={feedback.message}
        type={feedback.type}
        visible={feedback.visible}
        onDismiss={hideFeedback}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Staff Attendance</Text>
          <Text style={styles.subtitle}>Select staff member, enter PIN, and choose action</Text>
        </View>

        <StaffGrid
          staff={staff}
          selectedId={selectedStaffId}
          onSelect={setSelectedStaffId}
          isLoading={isStaffLoading}
        />

        {selectedStaffName && (
          <View style={styles.selectedStaffContainer}>
            <Text style={styles.selectedStaffText}>
              Selected: {selectedStaffName}
            </Text>
          </View>
        )}

        <PinKeypad
          PinCode={PinCode}
          onNumberPress={handleNumberPress}
          onBackspace={handleBackspace}
          onClear={handleClear}
        />

        <ActionButtons
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isDisabled={!isFormValid}
          isLoading={isLoading}
          loadingAction={loadingAction}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  selectedStaffContainer: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  selectedStaffText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
    textAlign: 'center',
  },
});