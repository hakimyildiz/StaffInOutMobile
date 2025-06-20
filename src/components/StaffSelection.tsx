import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, ChevronRight, Clock, Coffee, CheckCircle, Settings, Moon, Sun, Server, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { StaffStatus, Theme } from '../App';
import type { ApiStaff } from '../types/api';

interface StaffSelectionProps {
  onStaffSelect: (staff: ApiStaff) => void;
  staffStatuses: Record<string, StaffStatus>;
  theme: Theme;
  onThemeToggle: () => void;
  apiServer: string;
  onApiServerChange: (server: string) => void;
  staffList: ApiStaff[];
  setStaffList: React.Dispatch<React.SetStateAction<ApiStaff[]>>;
  setStaffStatuses: React.Dispatch<React.SetStateAction<Record<string, StaffStatus>>>;
}

const getStatusConfig = (status: StaffStatus, theme: Theme) => {
  const isDark = theme === 'dark';
  
  switch (status) {
    case 'available':
      return {
        bgColor: isDark 
          ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-blue-600 active:bg-gray-600' 
          : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-200 active:bg-blue-100',
        textColor: isDark 
          ? 'text-gray-100 group-hover:text-blue-400' 
          : 'text-gray-900 group-hover:text-blue-700',
        statusBg: isDark ? 'bg-green-900/50' : 'bg-green-100',
        statusText: isDark ? 'text-green-400' : 'text-green-700',
        statusIcon: CheckCircle,
        statusLabel: 'Available'
      };
    case 'on-shift':
      return {
        bgColor: isDark 
          ? 'bg-blue-900/30 hover:bg-blue-800/40 border-blue-800 hover:border-blue-600 active:bg-blue-700/50' 
          : 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 active:bg-blue-200',
        textColor: isDark ? 'text-blue-300' : 'text-blue-900',
        statusBg: isDark ? 'bg-blue-900/50' : 'bg-blue-100',
        statusText: isDark ? 'text-blue-400' : 'text-blue-700',
        statusIcon: Clock,
        statusLabel: 'On Shift'
      };
    case 'on-break':
      return {
        bgColor: isDark 
          ? 'bg-yellow-900/30 hover:bg-yellow-800/40 border-yellow-800 hover:border-yellow-600 active:bg-yellow-700/50' 
          : 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 hover:border-yellow-300 active:bg-yellow-200',
        textColor: isDark ? 'text-yellow-300' : 'text-yellow-900',
        statusBg: isDark ? 'bg-yellow-900/50' : 'bg-yellow-100',
        statusText: isDark ? 'text-yellow-400' : 'text-yellow-700',
        statusIcon: Coffee,
        statusLabel: 'On Break'
      };
    case 'shift-ended':
      return {
        bgColor: isDark 
          ? 'bg-green-900/30 hover:bg-green-800/40 border-green-800 hover:border-green-600 active:bg-green-700/50' 
          : 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300 active:bg-green-200',
        textColor: isDark ? 'text-green-300' : 'text-green-900',
        statusBg: isDark ? 'bg-green-900/50' : 'bg-green-100',
        statusText: isDark ? 'text-green-400' : 'text-green-700',
        statusIcon: CheckCircle,
        statusLabel: 'Shift Ended'
      };
    default:
      return {
        bgColor: isDark 
          ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-blue-600 active:bg-gray-600' 
          : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-200 active:bg-blue-100',
        textColor: isDark 
          ? 'text-gray-100 group-hover:text-blue-400' 
          : 'text-gray-900 group-hover:text-blue-700',
        statusBg: isDark ? 'bg-gray-700' : 'bg-gray-100',
        statusText: isDark ? 'text-gray-400' : 'text-gray-700',
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
  staffList,
  setStaffList,
  setStaffStatuses
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiServer, setTempApiServer] = useState(apiServer);
  const [isOnline, setIsOnline] = useState(true);
  
  const { loading, error, getStaffList } = useApi();

  const isDark = theme === 'dark';

  // Load staff list on component mount
  useEffect(() => {
    loadStaffList();
  }, []);

  // Check online status
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

  const loadStaffList = async () => {
    const apiStaffList = await getStaffList();
    
    if (apiStaffList) {
      // Convert API staff to internal format
      //console.log('API Staff List:', apiStaffList);
      const convertedStaff: ApiStaff[] = apiStaffList;
      
      setStaffList(convertedStaff);
      
      // Set initial statuses based on API data
      const statuses: Record<string, StaffStatus> = {};
      apiStaffList.forEach((apiStaff: ApiStaff) => {
        statuses[apiStaff.UserID.toString()] = (apiStaff.WorkStatus as StaffStatus) || 'available';
      });
      setStaffStatuses(statuses);
    }
  };

  const handleRefresh = () => {
    loadStaffList();
  };

  const handleSaveSettings = () => {
    onApiServerChange(tempApiServer);
    setShowSettings(false);
    // Reload staff list with new API server
    setTimeout(() => {
      loadStaffList();
    }, 100);
  };

  const handleCancelSettings = () => {
    setTempApiServer(apiServer);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 safe-area-padding">
      <div className={`rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl transition-colors 
       min-w-[800px] max-[800px]:min-w-screen 
       min-h-[1200px] max-[800px]:min-h-screen  ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        {/* Header with Settings and Connection Status */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                <Users className={`h-6 w-6 sm:h-8 sm:w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Staff Selection
            </h1>
            <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Please select your name from the list below to continue
            </p>
          </div>
          
          {/* Connection Status and Controls */}
          <div className="flex items-center space-x-2">
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
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              aria-label="Refresh Staff List"
              disabled={loading}
              className={`p-2 rounded-lg transition-colors touch-manipulation ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700 active:bg-gray-600 disabled:opacity-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50'
              }`}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              aria-label="Open Settings"
              className={`p-2 rounded-lg transition-colors touch-manipulation ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700 active:bg-gray-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`border rounded-xl p-4 mb-6 ${
            isDark 
              ? 'bg-red-900/20 border-red-800' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`} />
              <div>
                <h3 className={`font-semibold mb-1 text-sm ${
                  isDark ? 'text-red-300' : 'text-red-800'
                }`}>
                  Connection Error
                </h3>
                <p className={`text-xs ${
                  isDark ? 'text-red-200' : 'text-red-700'
                }`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <RefreshCw className={`h-8 w-8 animate-spin mx-auto mb-4 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading staff list...
            </p>
          </div>
        )}

        {/* Staff List */}
        {!loading && staffList.length > 0 && (
          <div className="space-y-3 mb-6 sm:mb-8">
            {staffList.map((staff) => {
              const status = staffStatuses[staff.UserID.toString()] || 'available';
              const config = getStatusConfig(status, theme);
              const StatusIcon = config.statusIcon;

              return (
                <button
                  key={staff.UserID.toString()}
                  onClick={() => onStaffSelect(staff)}
                  className={`w-full flex items-center justify-between p-4 ${config.bgColor} rounded-xl transition-all duration-200 border group touch-manipulation no-select`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className={`font-medium text-sm sm:text-base ${config.textColor}`}>
                      {staff.FirstName} {staff.LastName}
                    </span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${config.statusBg}`}>
                      <StatusIcon className={`h-3 w-3 ${config.statusText}`} />
                      <span className={`text-xs font-medium ${config.statusText}`}>
                        {config.statusLabel}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-colors ${
                    isDark 
                      ? 'text-gray-500 group-hover:text-blue-400' 
                      : 'text-gray-400 group-hover:text-blue-600'
                  }`} />
                </button>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && staffList.length === 0 && !error && (
          <div className="text-center py-8">
            <Users className={`h-12 w-12 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No staff members found. Check your API connection.
            </p>
          </div>
        )}

        <div className={`border rounded-xl p-4 mb-4 sm:mb-6 ${
          isDark 
            ? 'bg-amber-900/20 border-amber-800' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
              isDark ? 'text-amber-400' : 'text-amber-600'
            }`} />
            <div>
              <h3 className={`font-semibold mb-1 text-sm sm:text-base ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
                Name Not Listed?
              </h3>
              <p className={`text-xs sm:text-sm ${
                isDark ? 'text-amber-200' : 'text-amber-700'
              }`}>
                If your name is not listed above, please contact your supervisor immediately for assistance with system access.
              </p>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <h4 className={`font-semibold mb-3 text-sm ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`}>
            Status Legend:
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
            {[
              { WorkStatus: 'available', icon: CheckCircle, label: 'Available' },
              { WorkStatus: 'on-shift', icon: Clock, label: 'On Shift' },
              { WorkStatus: 'on-break', icon: Coffee, label: 'On Break' },
              { WorkStatus: 'shift-ended', icon: CheckCircle, label: 'Shift Ended' }
            ].map(({ WorkStatus, icon: Icon, label }) => {
              const config = getStatusConfig(WorkStatus as StaffStatus, theme);
              return (
                <div key={WorkStatus} className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${config.statusBg}`}>
                    <Icon className={`h-3 w-3 ${config.statusText}`} />
                    <span className={`font-medium ${config.statusText}`}>
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h2>
              <button
                onClick={handleCancelSettings}
                aria-label="Close settings"
                className={`p-2 rounded-lg transition-colors touch-manipulation ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700 active:bg-gray-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Theme
                </label>
                <button
                  onClick={onThemeToggle}
                  className={`flex items-center justify-between w-full p-3 rounded-lg border transition-colors touch-manipulation ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 active:bg-gray-500' 
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isDark ? (
                      <Moon className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Sun className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    isDark ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </button>
              </div>

              {/* API Server */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  API Server
                </label>
                <div className="relative">
                  <Server className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="url"
                    value={tempApiServer}
                    onChange={(e) => setTempApiServer(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors text-base ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500/20`}
                    placeholder={localStorage.getItem('apiBaseUrl') || 'https://'}
                  />
                </div>
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Enter the API server URL for time management data
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                onClick={handleCancelSettings}
                className={`flex-1 py-3 px-4 rounded-lg border transition-colors touch-manipulation ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 active:bg-gray-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSelection;