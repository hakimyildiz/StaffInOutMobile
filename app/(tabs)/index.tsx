import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Staff } from '@/types/api';
import { apiService } from '@/services/api';
import StaffPicker from '@/components/StaffPicker';
import PinInput from '@/components/PinInput';
import ActionButtons from '@/components/ActionButtons';
import StatusMessage from '@/components/StatusMessage';

const { width, height } = Dimensions.get('window');

export default function TimeClockScreen() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false,
  });

  const fetchStaff = async () => {
    try {
      const staffData = await apiService.getStaff();
      setStaff(staffData);
    } catch (error) {
      showStatusMessage('Failed to load staff list', 'error');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStaff();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const showStatusMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setStatusMessage({ message, type, visible: true });
  };

  const hideStatusMessage = () => {
    setStatusMessage(prev => ({ ...prev, visible: false }));
  };

  const resetForm = () => {
    setSelectedStaff(null);
    setPin('');
  };

  const handleClockIn = async () => {
    if (!selectedStaff || !pin) {
      showStatusMessage('Please select staff and enter PIN', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.clockIn({
        UserID: selectedStaff.ID,
        pin,
        datetime: new Date().toISOString(),
      });

      if (result) {
        showStatusMessage(`${selectedStaff.Name} clocked in successfully`, 'success');
        resetForm();
      } else {
        showStatusMessage('Clock in failed. Please check your PIN.', 'error');
      }
    } catch (error) {
      showStatusMessage('Clock in failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!selectedStaff || !pin) {
      showStatusMessage('Please select staff and enter PIN', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.clockOut({
        UserID: selectedStaff.ID,
        pin,
        datetime: new Date().toISOString(),
      });

      if (result) {
        showStatusMessage(`${selectedStaff.Name} clocked out successfully`, 'success');
        resetForm();
      } else {
        showStatusMessage('Clock out failed. Please check your PIN.', 'error');
      }
    } catch (error) {
      showStatusMessage('Clock out failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = selectedStaff && pin.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusMessage
        message={statusMessage.message}
        type={statusMessage.type}
        visible={statusMessage.visible}
        onHide={hideStatusMessage}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Staff Time Clock</Text>
          <Text style={styles.subtitle}>Select your name and enter your PIN</Text>
        </View>

        <View style={styles.form}>
          <StaffPicker
            staff={staff}
            selectedStaff={selectedStaff}
            onSelect={setSelectedStaff}
            disabled={loading}
          />

          <PinInput
            pin={pin}
            onPinChange={setPin}
            disabled={loading}
          />
        </View>
      </ScrollView>

      <View style={styles.actionContainer}>
        <ActionButtons
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
          disabled={!isFormValid}
          loading={loading}
        />
      </View>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  form: {
    flex: 1,
    justifyContent: 'center',
    minHeight: height * 0.5,
  },
  actionContainer: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});