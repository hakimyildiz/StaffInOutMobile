import React, { useState } from 'react';
import StaffSelection from './components/StaffSelection'; // Adjust path as needed

// Define your types
export interface Staff {
  id: string;
  name: string;
  pin: string;
  securityNumber: string;
}

export type StaffStatus = 'available' | 'on-shift' | 'on-break' | 'shift-ended';
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [apiServer, setApiServer] = useState('https://api.company.com');
  const [staffStatuses] = useState<Record<string, StaffStatus>>({
    '1': 'available',
    '2': 'on-shift',
    '3': 'on-break',
    '4': 'shift-ended',
    '5': 'available',
    '6': 'on-shift',
    '7': 'available',
    '8': 'on-break',
  });

  const handleStaffSelect = (staff: Staff) => {
    console.log('Selected staff:', staff);
    // Handle staff selection logic here
  };

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleApiServerChange = (server: string) => {
    setApiServer(server);
  };

  return (
    <StaffSelection
      onStaffSelect={handleStaffSelect}
      staffStatuses={staffStatuses}
      theme={theme}
      onThemeToggle={handleThemeToggle}
      apiServer={apiServer}
      onApiServerChange={handleApiServerChange}
    />
  );
};

export default App;