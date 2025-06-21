import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Play, Pause, Square, LogOut, Calendar, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { Theme } from '../App';
import type { ApiStaff, TimeBreak, TimeLog } from './../types/api';

interface DashboardProps {
  staff: ApiStaff;
  timeEntries: TimeLog[];
  setTimeEntries: React.Dispatch<React.SetStateAction<TimeLog[]>>;
  onLogout: () => void;
  theme: Theme;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  staff, 
  timeEntries, 
  setTimeEntries, 
  onLogout, 
  theme 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { CheckIn, CheckOut, BreakStart, BreakEnd, clearApiLogin } = useApi();

  const isDark = theme === 'dark';

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get latest time entry and break
  const { lastEntry, lastBreak } = useMemo(() => {
    const getLatest = (arr: any[] | undefined, timeField: any) => 
      arr?.length ? arr.reduce((latest, current) => 
        current[timeField]===null ? current : latest, null
      ) : null;

    const lastEntry: TimeLog | null = getLatest(timeEntries, 'CheckOutTime');
    const lastBreak: TimeBreak | null = getLatest(lastEntry?.TimeBreaks, 'BreakEndTime');
    
    
    return { lastEntry, lastBreak };
  }, [timeEntries]);

  //console.log('timeEntries:', timeEntries);
  //console.log('lastEntry:', lastEntry);
  //console.log('lastBreak:', lastBreak);
  // Button disabled states
  const buttonStates = useMemo(() => ({
    shiftStart: !!lastEntry,
    breakStart: !(lastEntry?.CheckInTime) || !!(lastBreak),
    breakEnd: !lastBreak?.BreakStartTime || !!lastBreak?.BreakEndTime,
    shiftEnd: !(lastEntry?.CheckInTime)
  }), [lastEntry, lastBreak]);

  const handleTimeAction = async (action: string) => {
    setActionLoading(action);

    try {
      let result: TimeLog[] = [];
      
      switch (action) {
        case 'shiftStart':
          result = await CheckIn();
          break;
        case 'breakStart':
          if (lastEntry?.ID) {
            result = await BreakStart(lastEntry.ID);
          }
          break;
        case 'breakEnd':
          if (lastEntry?.ID && lastBreak?.ID) {
            result = await BreakEnd(lastEntry.ID, lastBreak.ID);
          }
          break;
        case 'shiftEnd':
          if (lastEntry?.ID) {
            result = await CheckOut(lastEntry?.ID);
          }
          break;
      }

      if (result) {
        setTimeEntries(result);
        ///console.log('timeEntries:',result );
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await clearApiLogin();
      setTimeEntries([]);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      onLogout();
    }
  };

  const ShiftStatus = () => {
    const { statusText, statusStyle } = useMemo(() => {
      if (!lastEntry) {
        return {
          statusText: 'Ready to Start Shift',
          statusStyle: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
        };
      }
      if (lastEntry.CheckOutTime) {
        return {
          statusText: 'Shift Ended',
          statusStyle: isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'
        };
      }
      if (lastBreak?.BreakStartTime && !lastBreak.BreakEndTime) {
        return {
          statusText: 'On Break',
          statusStyle: isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
        };
      }
      if (lastBreak?.BreakEndTime) {
        return {
          statusText: 'Back from Break',
          statusStyle: isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800'
        };
      }
      return {
        statusText: 'Shift In Progress',
        statusStyle: isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
      };
    }, [lastEntry, lastBreak, isDark]);

    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle}`}>
        {statusText}
      </div>
    );
  };

  const formatTime = (dateString?: string | null) => {
    if (!dateString) return '--:--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const minutesToTimeFormat = (minutes: number):string => {
    if (isNaN(minutes)) return '00:00:00';
    const totalSeconds:number = Math.floor(minutes * 60);
    const hours:number = Math.floor(totalSeconds / 3600);
    const mins:number = Math.floor((totalSeconds % 3600) / 60);
    const secs:number = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  

    const calculateTimeHours = ():any => {
      let totalWorkMinutes: number = 0;
      let totalBreakMinutes: number = 0;
      
      // Process each entry in the data array
      timeEntries.forEach((entry: TimeLog) => {
        // Add total hours (which appears to be in minutes based on the values)
        totalWorkMinutes += entry.TotalHours as number;
        
        // Add all break hours for this entry
          if (entry.TimeBreaks && entry.TimeBreaks.length > 0) {
            entry.TimeBreaks.forEach((breakEntry: TimeBreak) => {
              totalBreakMinutes += breakEntry.BreakHours as number;
            });
          }
        });
      
      return {
        totalTime: minutesToTimeFormat(totalWorkMinutes),
        totalBreakTime: minutesToTimeFormat(totalBreakMinutes)
      };
    }
  const calculationResult: any = calculateTimeHours();

  return (
    <div className="min-h-screen p-4 safe-area-padding">
      <div className="max-w-4xl mx-auto  
        min-w-[800px] max-[800px]:min-w-screen 
        min-h-[1200px] max-[800px]:min-h-screen ">
        {/* Header */}
        <div className={`rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 transition-colors 
        ${
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
                  Welcome back, {staff.FirstName} {staff.LastName}
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
                onClick={() => handleTimeAction('shiftStart')}
                disabled={buttonStates.shiftStart}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-red-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation no-select"
              >
                <Play className="h-5 w-5" />
                <span className="font-medium">
                  {actionLoading === 'shiftStart' ? 'Starting Shift...' : 'Shift Start'}
                </span>
              </button>
              <button
                onClick={() => handleTimeAction('breakStart')}
                disabled={buttonStates.breakStart}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 active:bg-yellow-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation no-select"
              >
                <Pause className="h-5 w-5" />
                <span className="font-medium">
                  {actionLoading === 'breakStart' ? 'Starting Break...' : 'Break Start'}
                </span>
              </button>

              <button
                onClick={() => handleTimeAction('breakEnd')}
                disabled={buttonStates.breakEnd}
                className="w-full flex items-center justify-center space-x-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation no-select"
              >
                <Play className="h-5 w-5" />
                <span className="font-medium">
                  {actionLoading === 'breakEnd' ? 'Ending Break...' : 'Break End'}
                </span>
              </button>

              <button
                onClick={() => handleTimeAction('shiftEnd')}
                disabled={buttonStates.shiftEnd}
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
                  {formatDate()}
                </p>
              </div>
              {timeEntries.length>0 && timeEntries.map((entry, index) => (
               <div key={index} className="grid grid-cols-1 gap-3 sm:gap-4">               
                  {/* Shift Start/End */}                
                  <div className={`rounded-lg p-3 sm:p-4 ${
                    isDark ? 'bg-green-900/30' : 'bg-green-50'
                  }`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-xs sm:text-sm font-medium ${
                          isDark ? 'text-green-400' : 'text-green-600'
                        }`}>
                          Shift Start
                        </p>
                        <p className={`text-sm sm:text-lg font-mono ${
                          isDark ? 'text-green-300' : 'text-green-800'
                        }`}>
                          {formatTime(entry.CheckInTime) || '--:--:--'}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs sm:text-sm font-medium ${
                          isDark ? 'text-red-400' : 'text-red-600'
                        }`}>
                          Shift End
                        </p>
                        <p className={`text-sm sm:text-lg font-mono ${
                          isDark ? 'text-red-300' : 'text-red-800'
                        }`}>
                          {formatTime(entry.CheckOutTime) || '--:--:--'}
                        </p>
                      </div>
                    </div>

                  {/* Break Times */}
                  {entry.TimeBreaks && entry.TimeBreaks.map((entrySub, indexSub) => (
                    <div key={indexSub} className={`rounded-lg p-3 sm:p-4 ${
                      isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'
                    }`}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={`text-xs sm:text-sm font-medium ${
                            isDark ? 'text-yellow-400' : 'text-yellow-600'
                          }`}>
                            Break Start
                          </p>
                          <p className={`text-sm sm:text-lg font-mono ${
                            isDark ? 'text-yellow-300' : 'text-yellow-800'
                          }`}>
                            {formatTime(entrySub.BreakStartTime) || '--:--:--'}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs sm:text-sm font-medium ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            Break End
                          </p>
                          <p className={`text-sm sm:text-lg font-mono ${
                            isDark ? 'text-blue-300' : 'text-blue-800'
                          }`}>
                            {formatTime(entrySub.BreakEndTime) || '--:--:--'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>                           
              ))}
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
            <ShiftStatus />

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className={`space-y-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-semibold">Total Working Hours:</span>
                  <span className={`text-base sm:text-lg font-mono font-bold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {calculationResult.totalTime}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-semibold">Total Break Time:</span>
                  <span className={`text-base sm:text-lg font-mono font-bold ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                    {calculationResult.totalBreakTime}
                  </span>
                </div>
              </div>
            </div>
            
            
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