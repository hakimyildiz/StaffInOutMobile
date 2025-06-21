import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'staff time management',
  webDir: 'dist',
  server: {
    androidScheme: "http", // Important for telling Capacitor to use HTTP
    cleartext: true//, // Essential for allowing HTTP traffic
    //allowNavigation: ['10.0.2.2']
  },
  android: {
    allowMixedContent: true // Explicitly allow mixed content
  }
};

export default config;
