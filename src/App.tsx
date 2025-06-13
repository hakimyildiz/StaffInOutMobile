import React, { useState, useEffect } from 'react';
import StaffSelection from './components/StaffSelection';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';
import { apiService } from './services/api';
import type { ApiStaff, TimelogEntry } from './types/api';

export interface Staff {
  id: string;
  name: string;
  pin: string;
  securityNumber: string;
}

export interface TimeEntry {
  shiftStart?: string;
  breakStart?: string;
  breakEnd?: string;
  shiftEnd?: string;
}

export type StaffStatus = 'available' | 'on-shift' | 'on-break' | 'shift-ended';

export type Theme = 'light' | 'dark';

function App() {
  const [currentStep, setCurrentStep] = useState<'selection' | 'auth' | 'dashboard'>('selection');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry>({});
  const [theme, setTheme] = useState<Theme>('light');
  const [apiServer, setApiServer] = useState<string>('http://localhost:5000/api');
  const [currentTimelogID, setCurrentTimelogID] = useState<string | null>(null);
  
  // Staff data from API
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [staffStatuses, setStaffStatuses] = useState<Record<string, StaffStatus>>({});

  // Load theme and API server from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedApiServer = localStorage.getItem('apiBaseUrl');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedApiServer) {
      setApiServer(savedApiServer);
    } else {
      // Set default API server
      apiService.setBaseUrl(apiServer);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save API server to localStorage and update service
  useEffect(() => {
    apiService.setBaseUrl(apiServer);
  }, [apiServer]);

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    setCurrentStep('auth');
  };

  const handleAuthSuccess = (timelogEntry?: TimelogEntry) => {
    if (timelogEntry?.timelogID) {
      setCurrentTimelogID(timelogEntry.timelogID);
      
      // Update time entries based on API response
      const newTimeEntries: TimeEntry = {};
      if (timelogEntry.loginTime) {
        newTimeEntries.shiftStart = new Date(timelogEntry.loginTime).toLocaleTimeString();
      }
      if (timelogEntry.breakStartTime) {
        newTimeEntries.breakStart = new Date(timelogEntry.breakStartTime).toLocaleTimeString();
      }
      if (timelogEntry.breakEndTime) {
        newTimeEntries.breakEnd = new Date(timelogEntry.breakEndTime).toLocaleTimeString();
      }
      if (timelogEntry.logoutTime) {
        newTimeEntries.shiftEnd = new Date(timelogEntry.logoutTime).toLocaleTimeString();
      }
      
      setTimeEntries(newTimeEntries);
    }
    
    setCurrentStep('dashboard');
  };

  const handleBackToSelection = () => {
    setSelectedStaff(null);
    setCurrentStep('selection');
  };

  const handleLogout = () => {
    setSelectedStaff(null);
    setTimeEntries({});
    setCurrentTimelogID(null);
    setCurrentStep('selection');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleApiServerChange = (server: string) => {
    setApiServer(server);
    apiService.setBaseUrl(server);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {currentStep === 'selection' && (
        <StaffSelection 
          onStaffSelect={handleStaffSelect} 
          staffStatuses={staffStatuses}
          theme={theme}
          onThemeToggle={toggleTheme}
          apiServer={apiServer}
          onApiServerChange={handleApiServerChange}
          staffList={staffList}
          setStaffList={setStaffList}
          setStaffStatuses={setStaffStatuses}
        />
      )}
      
      {currentStep === 'auth' && selectedStaff && (
        <Authentication 
          staff={selectedStaff}
          onAuthSuccess={handleAuthSuccess}
          onBack={handleBackToSelection}
          theme={theme}
        />
      )}
      
      {currentStep === 'dashboard' && selectedStaff && (
        <Dashboard 
          staff={selectedStaff}
          timeEntries={timeEntries}
          setTimeEntries={setTimeEntries}
          onLogout={handleLogout}
          theme={theme}
          timelogID={currentTimelogID}
        />
      )}
    </div>
  );
}

export default App;