import React, { useState } from 'react';
import { Lock, Shield, ArrowLeft, Delete } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { Staff, Theme } from '../App';
import type { TimelogEntry } from '../types/api';

interface AuthenticationProps {
  staff: Staff;
  onAuthSuccess: (timelogEntry?: TimelogEntry) => void;
  onBack: () => void;
  theme: Theme;
}

const Authentication: React.FC<AuthenticationProps> = ({ staff, onAuthSuccess, onBack, theme }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { authenticateStaff, checkIn } = useApi();

  const isDark = theme === 'dark';

  const handleKeypadPress = (value: string) => {
    if (value === 'clear') {
      setPin('');
      setError('');
    } else if (value === 'backspace') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 8) { // Maximum 8 digits
      setPin(prev => prev + value);
    }
  };

  const handleSubmit = async () => {
    if (pin.length < 1 || pin.length > 8) return;
    
    setError('');
    setIsLoading(true);

    try {
      // First authenticate the staff member
      const authResult = await authenticateStaff(staff.UserID, pin);
      
      if (authResult) {
        // If authentication successful, perform login to get timelog entry
        const loginResult = await checkIn(staff.UserID, pin);
        
        if (loginResult) {
          onAuthSuccess(loginResult);
        } else {
          // If login fails but auth succeeded, still proceed
          onAuthSuccess();
        }
      } else {
        setError('Invalid PIN. Please try again.');
        setPin('');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setPin('');
    }
    
    setIsLoading(false);
  };

  const keypadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace']
  ];

  return (
    <div className="max-h-screen flex items-center justify-center p-4 safe-area-padding">
      <div className={`rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md transition-colors ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <button
          onClick={onBack}
          className={`flex items-center mb-6 transition-colors touch-manipulation ${
            isDark 
              ? 'text-gray-400 hover:text-white active:text-blue-400' 
              : 'text-gray-600 hover:text-gray-900 active:text-blue-600'
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm sm:text-base">Back to Staff Selection</span>
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-3 rounded-full ${
              isDark ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              <Lock className={`h-6 w-6 sm:h-8 sm:w-8 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Authentication
          </h1>
          <p className={`mb-4 text-sm sm:text-base ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            
          </p>
        </div>

        <div className={`border rounded-xl p-4 mb-6 ${
          isDark 
            ? 'bg-blue-900/20 border-blue-800' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Shield className={`h-5 w-5 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>              
              <p className={`font-mono text-base sm:text-lg ${
                isDark ? 'text-blue-200' : 'text-blue-700'
              }`}>
                Welcome, {staff.Name}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Enter Your PIN (1-8 digits)
            </label>
            <div className={`border rounded-lg p-4 text-center ${
              isDark 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex justify-center space-x-1 mb-2 flex-wrap">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full border-2 transition-all ${
                      index < pin.length 
                        ? 'bg-blue-600 border-blue-600' 
                        : isDark 
                          ? 'bg-gray-800 border-gray-500' 
                          : 'bg-white border-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className={`text-lg sm:text-xl font-mono min-h-[1.5rem] ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {pin.replace(/./g, '•')}
              </div>
              <div className={`text-xs mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {pin.length}/8 digits
              </div>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {keypadButtons.flat().map((button, index) => {
              if (button === 'clear') {
                return (
                  <button
                    key={index}
                    onClick={() => handleKeypadPress(button)}
                    className={`col-span-1 font-semibold py-4 px-4 rounded-lg transition-colors text-sm touch-manipulation no-select ${
                      isDark 
                        ? 'bg-red-900/50 hover:bg-red-800/60 active:bg-red-700/70 text-red-400' 
                        : 'bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700'
                    }`}
                  >
                    Clear
                  </button>
                );
              }
              
              if (button === 'backspace') {
                return (
                  <button
                    key={index}
                    aria-label="Backspace"
                    onClick={() => handleKeypadPress(button)}
                    className={`col-span-1 font-semibold py-4 px-4 rounded-lg transition-colors flex items-center justify-center touch-manipulation no-select ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <Delete className="h-5 w-5" />
                  </button>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => handleKeypadPress(button)}
                  disabled={pin.length >= 8}
                  className={`font-semibold py-4 px-4 rounded-lg transition-colors text-xl disabled:cursor-not-allowed touch-manipulation no-select ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500 disabled:bg-gray-800 disabled:text-gray-600 text-gray-200' 
                      : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400 text-gray-900'
                  }`}
                >
                  {button}
                </button>
              );
            })}
          </div>

          {error && (
            <div className={`border rounded-lg p-3 ${
              isDark 
                ? 'bg-red-900/20 border-red-800' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                isDark ? 'text-red-400' : 'text-red-700'
              }`}>
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || pin.length < 1}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium touch-manipulation"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Verify that the security number displayed above matches your assigned number
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;