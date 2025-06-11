import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Staff, TimeLogRequest, TimeLog } from '@/types/api';
import { apiService } from '@/services/api';
import StaffGrid from '@/components/StaffGrid';
import PinKeypad from '@/components/PinKeypad';
import ActionButtons from '@/components/ActionButtons';
import FeedbackMessage from '@/components/FeedbackMessage';
import StepIndicator from '@/components/StepIndicator';
import RecentTimeLogs from '@/components/RecentTimeLogs';

export default function AttendanceScreen() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<'checkin' | 'checkout' | null>(null);
  const [recentLogs, setRecentLogs] = useState<TimeLog[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
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
    loadRecentTimeLogs();
  }, []);

  useEffect(() => {
    if (selectedStaffId && currentStep === 1) {
      setCurrentStep(2);
    } else if (!selectedStaffId && currentStep > 1) {
      setCurrentStep(1);
      setPinCode('');
    }
  }, [selectedStaffId]);

  useEffect(() => {
    if (pinCode.length === 4 && currentStep === 2) {
      setCurrentStep(3);
    } else if (pinCode.length < 4 && currentStep === 3) {
      setCurrentStep(2);
    }
  }, [pinCode]);

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

  const loadRecentTimeLogs = async () => {
    try {
      const logs = await apiService.getRecentTimeLogs();
      setRecentLogs(logs);
    } catch (error) {
      // Silently fail for recent logs as it's not critical
      console.warn('Failed to load recent time logs:', error);
    }
  };

  const handleNumberPress = (number: string) => {
    if (pinCode.length < 4) {
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

  const isFormValid = selectedStaffId !== null && pinCode.length === 4;

  const handleCheckIn = async () => {
    if (!isFormValid || !selectedStaffId) return;

    try {
      setIsLoading(true);
      setLoadingAction('checkin');
      
      const request: TimeLogRequest = {
        UserID: selectedStaffId,
        PinCode: pinCode
      };

      const response = await apiService.checkIn(request);
      
      if (response.success) {
        showFeedback('Check-in successful! Have a great day at work.', 'success');
        resetForm();
        loadRecentTimeLogs(); // Refresh recent logs
      } else {
        showFeedback(response.message || 'Check-in failed. Please verify your PIN and try again.', 'error');
      }
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : 'Network error. Please check your connection and try again.',
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
        PinCode: pinCode
      };

      const response = await apiService.checkOut(request);
      
      if (response.success) {
        showFeedback('Check-out successful! Thank you for your hard work today.', 'success');
        resetForm();
        loadRecentTimeLogs(); // Refresh recent logs
      } else {
        showFeedback(response.message || 'Check-out failed. Please verify your PIN and try again.', 'error');
      }
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : 'Network error. Please check your connection and try again.',
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
    setCurrentStep(1);
  };

  const selectedStaff = staff.find(s => s.ID === selectedStaffId);
  const selectedStaffName = selectedStaff ? `${selectedStaff.FirstName} ${selectedStaff.LastName}` : '';

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
          <Text style={styles.title}>Staff Attendance System</Text>
          <Text style={styles.subtitle}>
            Follow the steps below to record your attendance
          </Text>
        </View>

        <StepIndicator currentStep={currentStep} />

        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepTitle}>Step 1: Staff Selection</Text>
            <Text style={styles.stepDescription}>
              Choose your name from the list below. If your name is not listed, please contact your supervisor.
            </Text>
          </View>

          <StaffGrid
            staff={staff}
            selectedId={selectedStaffId}
            onSelect={setSelectedStaffId}
            isLoading={isStaffLoading}
          />

          {selectedStaffName && (
            <View style={styles.selectedStaffContainer}>
              <Text style={styles.selectedStaffLabel}>Selected Staff Member:</Text>
              <Text style={styles.selectedStaffText}>{selectedStaffName}</Text>
            </View>
          )}
        </View>

        {selectedStaffId && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Step 2: Authentication</Text>
              <Text style={styles.stepDescription}>
                Enter your 4-digit PIN code. PIN must be numeric and exactly 4 digits.
              </Text>
            </View>

            <PinKeypad
              pinCode={pinCode}
              onNumberPress={handleNumberPress}
              onBackspace={handleBackspace}
              onClear={handleClear}
              maxLength={4}
            />
          </View>
        )}

        {isFormValid && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Step 3: Time Management</Text>
              <Text style={styles.stepDescription}>
                Select an action to record your attendance. All actions are time-stamped for accuracy.
              </Text>
            </View>

            <ActionButtons
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              isDisabled={!isFormValid}
              isLoading={isLoading}
              loadingAction={loadingAction}
            />
          </View>
        )}

        {recentLogs.length > 0 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Recent Time Logs</Text>
              <Text style={styles.stepDescription}>
                Your last 5 attendance entries
              </Text>
            </View>

            <RecentTimeLogs logs={recentLogs} />
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Please ensure you're following company attendance policy.
          </Text>
          <Text style={styles.footerSubtext}>
            All actions are recorded and monitored for accuracy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  stepContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepHeader: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  selectedStaffContainer: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  selectedStaffLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 4,
  },
  selectedStaffText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  footer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});