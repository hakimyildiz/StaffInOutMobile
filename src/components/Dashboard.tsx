import React, { useState } from 'react';
import { Clock, Play, Pause, Square, LogOut, Calendar, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { Staff, TimeEntry, Theme } from '../App';

interface DashboardProps {
  staff: Staff;
  timeEntries: TimeEntry;
  setTimeEntries: React.Dispatch<React.SetStateAction<TimeEntry>>;
  onLogout: () => void;
  theme: Theme;
  timelogID: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  staff, 
  timeEntries, 
  setTimeEntries, 
  onLogout, 
  theme, 
  timelogID 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const { logout, breakStart, breakEnd } = useApi();

  const isDark = theme === 'dark';

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const handleTimeAction = async (action: keyof TimeEntry) => {
    if (!timelogID && (action === 'breakStart' || action === 'breakEnd')) {
      console.error('No timelogID available for break actions');
      return;
    }

    setActionLoading(action);
    const currentTime = getCurrentTime();

    try {
      let success = false;

      switch (action) {
        case 'breakStart':
          if (timelogID) {
            const result = await breakStart(staff.id, staff.pin, timelogID);
            success = !!result;
          }
          break;
        case 'breakEnd':
          if (timelogID) {
            const result = await breakEnd(staff.id, staff.pin, timelogID);
            success = !!result;
          }
          break;
        case 'shiftEnd':
          const result = await logout(staff.id, staff.pin);
          success = !!result;
          break;
        default:
          // For local-only actions or fallback
          success = true;
      }

      if (success) {
        setTimeEntries(prev => ({
          ...prev,
          [action]: currentTime
        }));
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
      // Still update local state for offline functionality
      setTimeEntries(prev => ({
        ...prev,
        [action]: currentTime
      }));
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(staff.id, staff.pin);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      onLogout();
    }
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

  return (
    <div className="min-h-screen p-4 safe-area-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-colors ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className={`p-2 sm:p-3 rounded-full ${
                isDark ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <Clock className={`h-6 w-6 sm:h-8 sm:w-8 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <h1 className={`text-lg sm:text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Time Management Dashboard
                </h1>
                <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome back, {staff.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Connection Status */}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                isOnline 
                  ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700')
                  : (isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700')
              }`}>
                {isOnline ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors touch-manipulation ${
                  isDark 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20 active:bg-red-800/30' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50 active:bg-red-100'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Actions Panel */}
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-colors ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Time Actions
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => handleTimeAction('breakStart')}
                disabled={!timeEntries.shiftStart || !!timeEntries.breakStart || !!timeEntries.shiftEnd || actionLoading === 'breakStart'}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 active:bg-yellow-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation no-select"
              >
                <Pause className="h-5 w-5" />
                <span className="font-medium">
                  {actionLoading === 'breakStart' ? 'Starting Break...' : 'Break Start'}
                </span>
              </button>

              <button
                onClick={() => handleTimeAction('breakEnd')}
                disabled={!timeEntries.breakStart || !!timeEntries.breakEnd || actionLoading === 'breakEnd'}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation no-select"
              >
                <Play className="h-5 w-5" />
                <span className="font-medium">
                  {actionLoading === 'breakEnd' ? 'Ending Break...' : 'Break End'}
                </span>
              </button>

              <button
                onClick={() => handleTimeAction('shiftEnd')}
                disabled={!timeEntries.shiftStart || !!timeEntries.shiftEnd || actionLoading === 'shiftEnd'}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation no-select"
              >
                <Square className="h-5 w-5" />
                <span className="font-medium">
                  {actionLoading === 'shiftEnd' ? 'Ending Shift...' : 'Shift End'}
                </span>
              </button>
            </div>
          </div>

          {/* Time Log Panel */}
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-colors ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Calendar className={`h-5 w-5 sm:h-6 sm:w-6 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h2 className={`text-lg sm:text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Today's Time Log
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className={`rounded-lg p-3 sm:p-4 ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-xs sm:text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Current Date
                </p>
                <p className={`text-sm sm:text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {getCurrentDate()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className={`rounded-lg p-3 sm:p-4 ${
                  isDark ? 'bg-green-900/30' : 'bg-green-50'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    Shift Start
                  </p>
                  <p className={`text-sm sm:text-lg font-mono ${
                    isDark ? 'text-green-300' : 'text-green-800'
                  }`}>
                    {timeEntries.shiftStart || '--:--:--'}
                  </p>
                </div>

                <div className={`rounded-lg p-3 sm:p-4 ${
                  isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    Break Start
                  </p>
                  <p className={`text-sm sm:text-lg font-mono ${
                    isDark ? 'text-yellow-300' : 'text-yellow-800'
                  }`}>
                    {timeEntries.breakStart || '--:--:--'}
                  </p>
                </div>

                <div className={`rounded-lg p-3 sm:p-4 ${
                  isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Break End
                  </p>
                  <p className={`text-sm sm:text-lg font-mono ${
                    isDark ? 'text-blue-300' : 'text-blue-800'
                  }`}>
                    {timeEntries.breakEnd || '--:--:--'}
                  </p>
                </div>

                <div className={`rounded-lg p-3 sm:p-4 ${
                  isDark ? 'bg-red-900/30' : 'bg-red-50'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    isDark ? 'text-red-400' : 'text-red-600'
                  }`}>
                    Shift End
                  </p>
                  <p className={`text-sm sm:text-lg font-mono ${
                    isDark ? 'text-red-300' : 'text-red-800'
                  }`}>
                    {timeEntries.shiftEnd || '--:--:--'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Important Notes */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Current Status */}
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-colors ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <h3 className={`text-base sm:text-lg font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Current Status
            </h3>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              status === 'pre-shift' ? (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800') :
              status === 'on-shift' ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800') :
              status === 'on-break' ? (isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800') :
              status === 'back-from-break' ? (isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800') :
              status === 'shift-ended' ? (isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800') : 
              (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
            }`}>
              {status === 'pre-shift' && 'Ready to Start Shift'}
              {status === 'on-shift' && 'Currently Working'}
              {status === 'on-break' && 'On Break'}
              {status === 'back-from-break' && 'Back from Break'}
              {status === 'shift-ended' && 'Shift Completed'}
            </div>
            
            {timelogID && (
              <div className="mt-3">
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Session ID: {timelogID}
                </p>
              </div>
            )}
          </div>

          {/* Important Notes */}
          <div className={`border rounded-2xl p-4 sm:p-6 transition-colors ${
            isDark 
              ? 'bg-amber-900/20 border-amber-800' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 mt-0.5 flex-shrink-0 ${
                isDark ? 'text-amber-400' : 'text-amber-600'
              }`} />
              <div>
                <h3 className={`font-bold mb-2 text-sm sm:text-base ${
                  isDark ? 'text-amber-300' : 'text-amber-800'
                }`}>
                  Important
                </h3>
                <ul className={`text-xs sm:text-sm space-y-1 ${
                  isDark ? 'text-amber-200' : 'text-amber-700'
                }`}>
                  <li>• All actions are automatically timestamped</li>
                  <li>• Attendance records are monitored for compliance</li>
                  <li>• Follow company attendance policy guidelines</li>
                  <li>• Contact supervisor for any system issues</li>
                  {!isOnline && <li>• Working offline - data will sync when online</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;