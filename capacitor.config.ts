import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'staff time management',
  webDir: 'dist',
  server: {
    androidScheme: 'https'/*,
    allowNavigation: [
      '10.0.2.2'
    ]*/
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;