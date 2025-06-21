import React, { useState, useEffect } from 'react';
import StaffSelection from './components/StaffSelection';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';
import { apiService } from './services/api';
import type { ApiStaff, TimeLog } from './types/api';

export type StaffStatus = 'available' | 'on-shift' | 'on-break' | 'shift-ended';

export type Theme = 'light' | 'dark';

function App() {
  const [currentStep, setCurrentStep] = useState<'selection' | 'auth' | 'dashboard'>('selection');
  const [selectedStaff, setSelectedStaff] = useState<ApiStaff | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeLog[]>([]);
  const [theme, setTheme] = useState<Theme>('light');
  const [apiServer, setApiServer] = useState<string>(apiService.getBaseUrl());
  //const [currentTimeLogID, setCurrentTimeLogID] = useState<Number>(0);
  
  // Staff data from API
  const [staffList, setStaffList] = useState<ApiStaff[]>([]);
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

  const handleStaffSelect = (staff: ApiStaff) => {
    setSelectedStaff(staff);
    setCurrentStep('auth');
  };

  const handleAuthSuccess = (TimeLogs?: TimeLog[]) => { 
    console.log('TimeLogs:', TimeLogs);
      setTimeEntries(TimeLogs||[]);
      setCurrentStep('dashboard');
  };

  const handleBackToSelection = () => {
    setSelectedStaff(null);
    setCurrentStep('selection');
  };

  const handleLogout = () => {
    setSelectedStaff(null);
    setTimeEntries([]);
    //setCurrentTimeLogID(null);
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
         // timelogID={currentTimeLogID}
        />
      )}
    </div>
  );
}

export default App;