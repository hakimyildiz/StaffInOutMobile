import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors, lightTheme, darkTheme } from './styles/globalStyles';
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

  // Load theme and API server from AsyncStorage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme') as Theme;
        const savedApiServer = await AsyncStorage.getItem('apiServer');
        
        if (savedTheme) {
          setTheme(savedTheme);
        }
        if (savedApiServer) {
          setApiServer(savedApiServer);
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  // Save theme to AsyncStorage
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };

    saveTheme();
  }, [theme]);

  // Save API server to AsyncStorage
  useEffect(() => {
    const saveApiServer = async () => {
      try {
        await AsyncStorage.setItem('apiServer', apiServer);
      } catch (error) {
        console.error('Error saving API server:', error);
      }
    };

    saveApiServer();
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

  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[globalStyles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.background}
      />
      
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
    </View>
  );
}

export default App;