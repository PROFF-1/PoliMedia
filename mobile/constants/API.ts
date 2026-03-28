import { Platform } from 'react-native';
import Constants from 'expo-constants';

// API configuration for PoliMedia
const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  
  if (__DEV__) {
    // Dynamically get the IP address of the Expo Dev Server (e.g. 192.168.x.x)
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:3001`;
    }
  }
  
  return Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
};

export const API_BASE_URL = getApiUrl();
