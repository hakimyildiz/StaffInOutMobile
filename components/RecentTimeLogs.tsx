import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TimeLog } from '@/types/api';

interface RecentTimeLogsProps {
  logs: TimeLog[];
}

export default function RecentTimeLogs({ logs }: RecentTimeLogsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'checkin':
      case 'check-in':
        return '#10b981';
      case 'checkout':
      case 'check-out':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getActionText = (action: string) => {
    switch (action.toLowerCase()) {
      case 'checkin':
      case 'check-in':
        return 'Check In';
      case 'checkout':
      case 'check-out':
        return 'Check Out';
      default:
        return action;
    }
  };

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent time logs found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {logs.map((log, index) => (
        <View key={index} style={styles.logItem}>
          <View style={styles.logHeader}>
            <View style={[
              styles.actionBadge,
              { backgroundColor: getActionColor(log.Action) }
            ]}>
              <Text style={styles.actionText}>
                {getActionText(log.Action)}
              </Text>
            </View>
            <Text style={styles.dateText}>
              {formatDate(log.Timestamp)}
            </Text>
          </View>
          
          <View style={styles.logDetails}>
            <Text style={styles.timeText}>
              {formatTime(log.Timestamp)}
            </Text>
            {log.UserName && (
              <Text style={styles.userText}>
                {log.UserName}
              </Text>
            )}
          </View>
          
          {log.Notes && (
            <Text style={styles.notesText}>
              {log.Notes}
            </Text>
          )}
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
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontStyle: 'italic',
  },
  logItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e2e8f0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  logDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  userText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    fontStyle: 'italic',
  },
});