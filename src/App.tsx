import React, { useState, useEffect } from 'react';
import StaffSelection from './components/StaffSelection';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';

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
  const [apiServer, setApiServer] = useState<string>('https://api.company.com');
  
  // Mock staff statuses - in a real app, this would come from a backend
  const [staffStatuses] = useState<Record<string, StaffStatus>>({
    '1': 'available',
    '2': 'on-shift',
    '3': 'on-break',
    '4': 'available',
    '5': 'shift-ended',
    '6': 'on-shift',
    '7': 'available',
    '8': 'on-break',
  });

  // Load theme and API server from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedApiServer = localStorage.getItem('apiServer');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedApiServer) {
      setApiServer(savedApiServer);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save API server to localStorage
  useEffect(() => {
    localStorage.setItem('apiServer', apiServer);
  }, [apiServer]);

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff);
    setCurrentStep('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentStep('dashboard');
  };

  const handleBackToSelection = () => {
    setSelectedStaff(null);
    setCurrentStep('selection');
  };

  const handleLogout = () => {
    setSelectedStaff(null);
    setTimeEntries({});
    setCurrentStep('selection');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
          onApiServerChange={setApiServer}
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
        />
      )}
    </div>
  );
}

export default App;