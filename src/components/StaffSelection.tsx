import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Users,
  AlertCircle,
  ChevronRight,
  Clock,
  Coffee,
  CheckCircle,
  Settings,
  Moon,
  Sun,
  Server,
  X,
} from 'lucide-react-native';
import type { Staff, StaffStatus, Theme } from '../App';

interface StaffSelectionProps {
  onStaffSelect: (staff: Staff) => void;
  staffStatuses: Record<string, StaffStatus>;
  theme: Theme;
  onThemeToggle: () => void;
  apiServer: string;
  onApiServerChange: (server: string) => void;
}

const mockStaff: Staff[] = [
  { id: '1', name: 'Sarah Johnson', pin: '1234', securityNumber: 'SEC-001' },
  { id: '2', name: 'Michael Chen', pin: '5678', securityNumber: 'SEC-002' },
  { id: '3', name: 'Emily Rodriguez', pin: '9012', securityNumber: 'SEC-003' },
  { id: '4', name: 'David Thompson', pin: '3456', securityNumber: 'SEC-004' },
  { id: '5', name: 'Lisa Wang', pin: '7890', securityNumber: 'SEC-005' },
  { id: '6', name: 'James Wilson', pin: '2468', securityNumber: 'SEC-006' },
  { id: '7', name: 'Maria Garcia', pin: '1357', securityNumber: 'SEC-007' },
  { id: '8', name: 'Robert Kim', pin: '9753', securityNumber: 'SEC-008' },
];

const getStatusConfig = (status: StaffStatus, theme: Theme) => {
  const isDark = theme === 'dark';
  
  switch (status) {
    case 'available':
      return {
        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textColor: isDark ? '#f3f4f6' : '#111827',
        statusBg: isDark ? '#064e3b' : '#dcfce7',
        statusText: isDark ? '#34d399' : '#15803d',
        statusIcon: CheckCircle,
        statusLabel: 'Available'
      };
    case 'on-shift':
      return {
        backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
        borderColor: isDark ? '#3b82f6' : '#93c5fd',
        textColor: isDark ? '#93c5fd' : '#1e3a8a',
        statusBg: isDark ? '#1e3a8a' : '#dbeafe',
        statusText: isDark ? '#60a5fa' : '#1d4ed8',
        statusIcon: Clock,
        statusLabel: 'On Shift'
      };
    case 'on-break':
      return {
        backgroundColor: isDark ? '#92400e' : '#fef3c7',
        borderColor: isDark ? '#f59e0b' : '#fbbf24',
        textColor: isDark ? '#fbbf24' : '#92400e',
        statusBg: isDark ? '#92400e' : '#fef3c7',
        statusText: isDark ? '#fbbf24' : '#b45309',
        statusIcon: Coffee,
        statusLabel: 'On Break'
      };
    case 'shift-ended':
      return {
        backgroundColor: isDark ? '#064e3b' : '#dcfce7',
        borderColor: isDark ? '#10b981' : '#34d399',
        textColor: isDark ? '#34d399' : '#064e3b',
        statusBg: isDark ? '#064e3b' : '#dcfce7',
        statusText: isDark ? '#34d399' : '#059669',
        statusIcon: CheckCircle,
        statusLabel: 'Shift Ended'
      };
    default:
      return {
        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textColor: isDark ? '#f3f4f6' : '#111827',
        statusBg: isDark ? '#374151' : '#f3f4f6',
        statusText: isDark ? '#9ca3af' : '#374151',
        statusIcon: CheckCircle,
        statusLabel: 'Available'
      };
  }
};

const StaffSelection: React.FC<StaffSelectionProps> = ({
  onStaffSelect,
  staffStatuses,
  theme,
  onThemeToggle,
  apiServer,
  onApiServerChange,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiServer, setTempApiServer] = useState(apiServer);

  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  const handleSaveSettings = () => {
    onApiServerChange(tempApiServer);
    setShowSettings(false);
  };

  const handleCancelSettings = () => {
    setTempApiServer(apiServer);
    setShowSettings(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#111827' : '#ffffff'}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainCard}>
          {/* Header with Settings */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Users size={32} color={isDark ? '#60a5fa' : '#2563eb'} />
              </View>
              <Text style={styles.title}>Staff Selection</Text>
              <Text style={styles.subtitle}>
                Please select your name from the list below to continue
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              style={styles.settingsButton}
            >
              <Settings size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          {/* Staff List */}
          <View style={styles.staffList}>
            {mockStaff.map((staff) => {
              const status = staffStatuses[staff.id] || 'available';
              const config = getStatusConfig(status, theme);
              const StatusIcon = config.statusIcon;

              return (
                <TouchableOpacity
                  key={staff.id}
                  onPress={() => onStaffSelect(staff)}
                  style={[
                    styles.staffButton,
                    {
                      backgroundColor: config.backgroundColor,
                      borderColor: config.borderColor,
                    },
                  ]}
                >
                  <View style={styles.staffInfo}>
                    <Text style={[styles.staffName, { color: config.textColor }]}>
                      {staff.name}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: config.statusBg }]}>
                      <StatusIcon size={12} color={config.statusText} />
                      <Text style={[styles.statusText, { color: config.statusText }]}>
                        {config.statusLabel}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight
                    size={20}
                    color={isDark ? '#6b7280' : '#9ca3af'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Alert Box */}
          <View style={styles.alertBox}>
            <View style={styles.alertContent}>
              <AlertCircle
                size={20}
                color={isDark ? '#fbbf24' : '#d97706'}
                style={styles.alertIcon}
              />
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>Name Not Listed?</Text>
                <Text style={styles.alertDescription}>
                  If your name is not listed above, please contact your supervisor immediately for assistance with system access.
                </Text>
              </View>
            </View>
          </View>

          {/* Status Legend */}
          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Status Legend:</Text>
            <View style={styles.legendGrid}>
              {[
                { status: 'available', icon: CheckCircle, label: 'Available' },
                { status: 'on-shift', icon: Clock, label: 'On Shift' },
                { status: 'on-break', icon: Coffee, label: 'On Break' },
                { status: 'shift-ended', icon: CheckCircle, label: 'Shift Ended' },
              ].map(({ status, icon: Icon, label }) => {
                const config = getStatusConfig(status as StaffStatus, theme);
                return (
                  <View key={status} style={styles.legendItem}>
                    <View style={[styles.legendBadge, { backgroundColor: config.statusBg }]}>
                      <Icon size={12} color={config.statusText} />
                      <Text style={[styles.legendText, { color: config.statusText }]}>
                        {label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelSettings}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity
                onPress={handleCancelSettings}
                style={styles.closeButton}
              >
                <X size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {/* Theme Toggle */}
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Theme</Text>
                <TouchableOpacity
                  onPress={onThemeToggle}
                  style={styles.themeToggle}
                >
                  <View style={styles.themeInfo}>
                    {isDark ? (
                      <Moon size={20} color="#60a5fa" />
                    ) : (
                      <Sun size={20} color="#d97706" />
                    )}
                    <Text style={styles.themeText}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={onThemeToggle}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={isDark ? '#ffffff' : '#f3f4f6'}
                  />
                </TouchableOpacity>
              </View>

              {/* API Server */}
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>API Server</Text>
                <View style={styles.inputContainer}>
                  <Server
                    size={20}
                    color={isDark ? '#9ca3af' : '#6b7280'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={tempApiServer}
                    onChangeText={setTempApiServer}
                    style={styles.textInput}
                    placeholder="https://api.company.com"
                    placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                    keyboardType="url"
                  />
                </View>
                <Text style={styles.inputHelp}>
                  Enter the API server URL for time management data
                </Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCancelSettings}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveSettings}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#f3f4f6',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 16,
    },
    mainCard: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 16,
      padding: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? '#374151' : 'transparent',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 32,
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    iconContainer: {
      backgroundColor: isDark ? '#1e3a8a' : '#dbeafe',
      padding: 12,
      borderRadius: 50,
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      color: isDark ? '#d1d5db' : '#6b7280',
      textAlign: 'center',
      fontSize: 16,
    },
    settingsButton: {
      padding: 8,
      borderRadius: 8,
    },
    staffList: {
      marginBottom: 32,
    },
    staffButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
    },
    staffInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    staffName: {
      fontSize: 16,
      fontWeight: '500',
      marginRight: 16,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
    },
    alertBox: {
      backgroundColor: isDark ? '#451a03' : '#fef3c7',
      borderColor: isDark ? '#92400e' : '#f59e0b',
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    alertContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    alertIcon: {
      marginTop: 2,
      marginRight: 12,
    },
    alertText: {
      flex: 1,
    },
    alertTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fbbf24' : '#92400e',
      marginBottom: 4,
    },
    alertDescription: {
      fontSize: 14,
      color: isDark ? '#fde68a' : '#a16207',
      lineHeight: 20,
    },
    legendContainer: {
      backgroundColor: isDark ? '#374151' : '#f9fafb',
      borderRadius: 12,
      padding: 16,
    },
    legendTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#e5e7eb' : '#1f2937',
      marginBottom: 12,
    },
    legendGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    legendItem: {
      width: '48%',
      marginBottom: 12,
    },
    legendBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    legendText: {
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modalContent: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 12,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? '#374151' : 'transparent',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#111827',
    },
    closeButton: {
      padding: 4,
      borderRadius: 8,
    },
    modalBody: {
      marginBottom: 32,
    },
    settingItem: {
      marginBottom: 24,
    },
    settingLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#e5e7eb' : '#374151',
      marginBottom: 12,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? '#374151' : '#f9fafb',
      borderColor: isDark ? '#4b5563' : '#d1d5db',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
    },
    themeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeText: {
      color: isDark ? '#e5e7eb' : '#374151',
      marginLeft: 12,
      fontSize: 16,
    },
    inputContainer: {
      position: 'relative',
    },
    inputIcon: {
      position: 'absolute',
      left: 12,
      top: 14,
      zIndex: 1,
    },
    textInput: {
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderColor: isDark ? '#4b5563' : '#d1d5db',
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 44,
      paddingRight: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#111827',
    },
    inputHelp: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginTop: 4,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderColor: isDark ? '#4b5563' : '#d1d5db',
      borderWidth: 1,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: isDark ? '#d1d5db' : '#374151',
      fontSize: 16,
      fontWeight: '500',
    },
    saveButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
    },
  });

export default StaffSelection;