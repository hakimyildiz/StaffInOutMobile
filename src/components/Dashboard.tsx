import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Clock, Play, Pause, Square, LogOut, Calendar, AlertTriangle } from 'lucide-react-native';
import { globalStyles, colors, spacing } from '../styles/globalStyles';
import type { Staff, TimeEntry, Theme } from '../App';

interface DashboardProps {
  staff: Staff;
  timeEntries: TimeEntry;
  setTimeEntries: React.Dispatch<React.SetStateAction<TimeEntry>>;
  onLogout: () => void;
  theme: Theme;
}

const Dashboard: React.FC<DashboardProps> = ({ staff, timeEntries, setTimeEntries, onLogout, theme }) => {
  const isDark = theme === 'dark';

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTimeAction = (action: keyof TimeEntry) => {
    const currentTime = getCurrentTime();
    setTimeEntries(prev => ({
      ...prev,
      [action]: currentTime
    }));
  };

  const getActionStatus = () => {
    if (!timeEntries.shiftStart) return 'pre-shift';
    if (timeEntries.shiftStart && !timeEntries.breakStart) return 'on-shift';
    if (timeEntries.breakStart && !timeEntries.breakEnd) return 'on-break';
    if (timeEntries.breakEnd && !timeEntries.shiftEnd) return 'back-from-break';
    if (timeEntries.shiftEnd) return 'shift-ended';
    return 'unknown';
  };

  const status = getActionStatus();

  const getStatusStyle = () => {
    const baseStyle = {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      alignSelf: 'flex-start' as const,
    };

    switch (status) {
      case 'pre-shift':
        return {
          ...baseStyle,
          backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
        };
      case 'on-shift':
        return {
          ...baseStyle,
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
        };
      case 'on-break':
        return {
          ...baseStyle,
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
        };
      case 'back-from-break':
        return {
          ...baseStyle,
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        };
      case 'shift-ended':
        return {
          ...baseStyle,
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
        };
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'pre-shift':
        return isDark ? colors.gray[300] : colors.gray[800];
      case 'on-shift':
        return isDark ? '#10b981' : '#065f46';
      case 'on-break':
        return isDark ? '#f59e0b' : '#92400e';
      case 'back-from-break':
        return isDark ? '#3b82f6' : '#1e40af';
      case 'shift-ended':
        return isDark ? '#ef4444' : '#991b1b';
      default:
        return isDark ? colors.gray[300] : colors.gray[800];
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pre-shift':
        return 'Ready to Start Shift';
      case 'on-shift':
        return 'Currently Working';
      case 'on-break':
        return 'On Break';
      case 'back-from-break':
        return 'Back from Break';
      case 'shift-ended':
        return 'Shift Completed';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <ScrollView 
      style={[
        globalStyles.container,
        { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }
      ]}
      contentContainerStyle={{ padding: spacing.md }}
    >
      {/* Header */}
      <View style={[
        globalStyles.shadowMd,
        globalStyles.roundedXl,
        globalStyles.p4,
        globalStyles.m3,
        {
          backgroundColor: isDark ? colors.gray[800] : colors.white,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? colors.gray[700] : 'transparent',
        }
      ]}>
        <View style={[globalStyles.row, globalStyles.spaceBetween, { alignItems: 'center' }]}>
          <View style={[globalStyles.row, { alignItems: 'center' }]}>
            <View style={[
              globalStyles.p3,
              globalStyles.roundedFull,
              globalStyles.m2,
              {
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
              }
            ]}>
              <Clock 
                size={32} 
                color={isDark ? colors.primary[400] : colors.primary[600]} 
              />
            </View>
            <View>
              <Text style={[
                globalStyles.text2Xl,
                globalStyles.fontBold,
                { color: isDark ? colors.white : colors.gray[900] }
              ]}>
                Time Management Dashboard
              </Text>
              <Text style={[
                globalStyles.textBase,
                { color: isDark ? colors.gray[300] : colors.gray[600] }
              ]}>
                Welcome back, {staff.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onLogout}
            style={[
              globalStyles.row,
              globalStyles.px3,
              globalStyles.py2,
              globalStyles.roundedLg,
              { alignItems: 'center' }
            ]}
          >
            <LogOut 
              size={16} 
              color={isDark ? colors.gray[400] : colors.gray[600]} 
            />
            <Text style={[
              globalStyles.textSm,
              globalStyles.mx1,
              { color: isDark ? colors.gray[400] : colors.gray[600] }
            ]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[globalStyles.row, { flex: 1 }]}>
        {/* Actions Panel */}
        <View style={[
          globalStyles.shadowMd,
          globalStyles.roundedXl,
          globalStyles.p4,
          globalStyles.m3,
          { 
            flex: 1,
            backgroundColor: isDark ? colors.gray[800] : colors.white,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? colors.gray[700] : 'transparent',
          }
        ]}>
          <Text style={[
            globalStyles.textXl,
            globalStyles.fontBold,
            globalStyles.mb3,
            { color: isDark ? colors.white : colors.gray[900] }
          ]}>
            Time Actions
          </Text>
          
          <View style={{ gap: spacing.md }}>
            <TouchableOpacity
              onPress={() => handleTimeAction('shiftStart')}
              disabled={!!timeEntries.shiftStart}
              style={[
                globalStyles.wFull,
                globalStyles.row,
                globalStyles.center,
                globalStyles.p4,
                globalStyles.roundedXl,
                {
                  backgroundColor: timeEntries.shiftStart ? colors.gray[300] : colors.success,
                }
              ]}
            >
              <Play size={20} color={colors.white} />
              <Text style={[
                globalStyles.fontMedium,
                globalStyles.mx2,
                { color: colors.white }
              ]}>
                Shift Start
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTimeAction('breakStart')}
              disabled={!timeEntries.shiftStart || !!timeEntries.breakStart || !!timeEntries.shiftEnd}
              style={[
                globalStyles.wFull,
                globalStyles.row,
                globalStyles.center,
                globalStyles.p4,
                globalStyles.roundedXl,
                {
                  backgroundColor: (!timeEntries.shiftStart || !!timeEntries.breakStart || !!timeEntries.shiftEnd) 
                    ? colors.gray[300] : colors.warning,
                }
              ]}
            >
              <Pause size={20} color={colors.white} />
              <Text style={[
                globalStyles.fontMedium,
                globalStyles.mx2,
                { color: colors.white }
              ]}>
                Break Start
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTimeAction('breakEnd')}
              disabled={!timeEntries.breakStart || !!timeEntries.breakEnd}
              style={[
                globalStyles.wFull,
                globalStyles.row,
                globalStyles.center,
                globalStyles.p4,
                globalStyles.roundedXl,
                {
                  backgroundColor: (!timeEntries.breakStart || !!timeEntries.breakEnd) 
                    ? colors.gray[300] : colors.primary[500],
                }
              ]}
            >
              <Play size={20} color={colors.white} />
              <Text style={[
                globalStyles.fontMedium,
                globalStyles.mx2,
                { color: colors.white }
              ]}>
                Break End
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTimeAction('shiftEnd')}
              disabled={!timeEntries.shiftStart || !!timeEntries.shiftEnd}
              style={[
                globalStyles.wFull,
                globalStyles.row,
                globalStyles.center,
                globalStyles.p4,
                globalStyles.roundedXl,
                {
                  backgroundColor: (!timeEntries.shiftStart || !!timeEntries.shiftEnd) 
                    ? colors.gray[300] : colors.error,
                }
              ]}
            >
              <Square size={20} color={colors.white} />
              <Text style={[
                globalStyles.fontMedium,
                globalStyles.mx2,
                { color: colors.white }
              ]}>
                Shift End
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Log Panel */}
        <View style={[
          globalStyles.shadowMd,
          globalStyles.roundedXl,
          globalStyles.p4,
          globalStyles.m3,
          { 
            flex: 1,
            backgroundColor: isDark ? colors.gray[800] : colors.white,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? colors.gray[700] : 'transparent',
          }
        ]}>
          <View style={[globalStyles.row, globalStyles.mb3, { alignItems: 'center' }]}>
            <Calendar 
              size={24} 
              color={isDark ? colors.primary[400] : colors.primary[600]} 
            />
            <Text style={[
              globalStyles.textXl,
              globalStyles.fontBold,
              globalStyles.mx2,
              { color: isDark ? colors.white : colors.gray[900] }
            ]}>
              Today's Time Log
            </Text>
          </View>
          
          <View style={{ gap: spacing.md }}>
            <View style={[
              globalStyles.roundedLg,
              globalStyles.p4,
              {
                backgroundColor: isDark ? colors.gray[700] : colors.gray[50],
              }
            ]}>
              <Text style={[
                globalStyles.textSm,
                globalStyles.fontMedium,
                { color: isDark ? colors.gray[300] : colors.gray[600] }
              ]}>
                Current Date
              </Text>
              <Text style={[
                globalStyles.textLg,
                globalStyles.fontSemiBold,
                { color: isDark ? colors.white : colors.gray[900] }
              ]}>
                {getCurrentDate()}
              </Text>
            </View>

            <View style={[globalStyles.row, { gap: spacing.md }]}>
              <View style={[
                globalStyles.roundedLg,
                globalStyles.p4,
                { 
                  flex: 1,
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
                }
              ]}>
                <Text style={[
                  globalStyles.textSm,
                  globalStyles.fontMedium,
                  { color: isDark ? '#10b981' : '#065f46' }
                ]}>
                  Shift Start
                </Text>
                <Text style={[
                  globalStyles.textLg,
                  { 
                    fontFamily: 'monospace',
                    color: isDark ? '#34d399' : '#047857'
                  }
                ]}>
                  {timeEntries.shiftStart || '--:--:--'}
                </Text>
              </View>

              <View style={[
                globalStyles.roundedLg,
                globalStyles.p4,
                { 
                  flex: 1,
                  backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)',
                }
              ]}>
                <Text style={[
                  globalStyles.textSm,
                  globalStyles.fontMedium,
                  { color: isDark ? '#f59e0b' : '#92400e' }
                ]}>
                  Break Start
                </Text>
                <Text style={[
                  globalStyles.textLg,
                  { 
                    fontFamily: 'monospace',
                    color: isDark ? '#fbbf24' : '#d97706'
                  }
                ]}>
                  {timeEntries.breakStart || '--:--:--'}
                </Text>
              </View>
            </View>

            <View style={[globalStyles.row, { gap: spacing.md }]}>
              <View style={[
                globalStyles.roundedLg,
                globalStyles.p4,
                { 
                  flex: 1,
                  backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                }
              ]}>
                <Text style={[
                  globalStyles.textSm,
                  globalStyles.fontMedium,
                  { color: isDark ? '#3b82f6' : '#1e40af' }
                ]}>
                  Break End
                </Text>
                <Text style={[
                  globalStyles.textLg,
                  { 
                    fontFamily: 'monospace',
                    color: isDark ? '#60a5fa' : '#1d4ed8'
                  }
                ]}>
                  {timeEntries.breakEnd || '--:--:--'}
                </Text>
              </View>

              <View style={[
                globalStyles.roundedLg,
                globalStyles.p4,
                { 
                  flex: 1,
                  backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                }
              ]}>
                <Text style={[
                  globalStyles.textSm,
                  globalStyles.fontMedium,
                  { color: isDark ? '#ef4444' : '#991b1b' }
                ]}>
                  Shift End
                </Text>
                <Text style={[
                  globalStyles.textLg,
                  { 
                    fontFamily: 'monospace',
                    color: isDark ? '#f87171' : '#dc2626'
                  }
                ]}>
                  {timeEntries.shiftEnd || '--:--:--'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Status and Important Notes */}
      <View style={[globalStyles.row, globalStyles.my3, { gap: spacing.lg }]}>
        {/* Current Status */}
        <View style={[
          globalStyles.shadowMd,
          globalStyles.roundedXl,
          globalStyles.p4,
          { 
            flex: 1,
            backgroundColor: isDark ? colors.gray[800] : colors.white,
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? colors.gray[700] : 'transparent',
          }
        ]}>
          <Text style={[
            globalStyles.textLg,
            globalStyles.fontBold,
            globalStyles.mb3,
            { color: isDark ? colors.white : colors.gray[900] }
          ]}>
            Current Status
          </Text>
          <View style={getStatusStyle()}>
            <Text style={[
              globalStyles.textSm,
              globalStyles.fontMedium,
              { color: getStatusTextColor() }
            ]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        {/* Important Notes */}
        <View style={[
          globalStyles.roundedXl,
          globalStyles.p4,
          {
            flex: 1,
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
            borderWidth: 1,
            borderColor: isDark ? '#92400e' : '#f59e0b',
          }
        ]}>
          <View style={[globalStyles.row, { alignItems: 'flex-start' }]}>
            <AlertTriangle 
              size={24} 
              color={isDark ? '#f59e0b' : '#92400e'} 
              style={{ marginTop: 2, marginRight: spacing.sm }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[
                globalStyles.fontBold,
                globalStyles.mb2,
                { color: isDark ? '#fbbf24' : '#92400e' }
              ]}>
                Important
              </Text>
              <View>
                <Text style={[
                  globalStyles.textSm,
                  { color: isDark ? '#fde68a' : '#78350f' }
                ]}>
                  • All actions are automatically timestamped
                </Text>
                <Text style={[
                  globalStyles.textSm,
                  { color: isDark ? '#fde68a' : '#78350f' }
                ]}>
                  • Attendance records are monitored for compliance
                </Text>
                <Text style={[
                  globalStyles.textSm,
                  { color: isDark ? '#fde68a' : '#78350f' }
                ]}>
                  • Follow company attendance policy guidelines
                </Text>
                <Text style={[
                  globalStyles.textSm,
                  { color: isDark ? '#fde68a' : '#78350f' }
                ]}>
                  • Contact supervisor for any system issues
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;