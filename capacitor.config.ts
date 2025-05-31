import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jackdesk',
  appName: 'jackdesk-android',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '556673880157-840ns0acfd66aq42kjjaphg9l6dbqe5h.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
