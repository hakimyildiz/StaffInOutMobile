import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TimeLog } from '@/types/api';
import { Clock, LogIn, LogOut, Calendar } from 'lucide-react-native';

interface RecentTimeLogsProps {
  logs: TimeLog[];
}

export default function RecentTimeLogs({ logs }: RecentTimeLogsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateDuration = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return 'In Progress';
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Clock size={48} color="#94a3b8" />
        <Text style={styles.emptyText}>No recent time logs</Text>
        <Text style={styles.emptySubtext}>Your attendance history will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {logs.map((log, index) => (
        <View key={index} style={styles.logItem}>
          <View style={styles.logHeader}>
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#64748b" />
              <Text style={styles.dateText}>{formatDate(log.checkIn)}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.durationText}>
                {calculateDuration(log.checkIn, log.checkOut)}
              </Text>
            </View>
          </View>
          
          <View style={styles.timeContainer}>
            <View style={styles.timeEntry}>
              <View style={styles.timeIcon}>
                <LogIn size={14} color="#10b981" />
              </View>
              <View style={styles.timeDetails}>
                <Text style={styles.timeLabel}>Check In</Text>
                <Text style={styles.timeValue}>{formatTime(log.checkIn)}</Text>
              </View>
            </View>
            
            <View style={styles.timeDivider} />
            
            <View style={styles.timeEntry}>
              <View style={[styles.timeIcon, !log.checkOut && styles.inProgressIcon]}>
                <LogOut size={14} color={log.checkOut ? '#ef4444' : '#94a3b8'} />
              </View>
              <View style={styles.timeDetails}>
                <Text style={styles.timeLabel}>Check Out</Text>
                <Text style={[styles.timeValue, !log.checkOut && styles.inProgressText]}>
                  {log.checkOut ? formatTime(log.checkOut) : 'In Progress'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  logItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  durationContainer: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeEntry: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inProgressIcon: {
    backgroundColor: '#f1f5f9',
  },
  timeDetails: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  inProgressText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  timeDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 12,
  },
});