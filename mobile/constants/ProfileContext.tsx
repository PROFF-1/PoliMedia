import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  ageGroup: string;
  occupation: string;
  location: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  isLoading: boolean;
}

const ProfileContext = React.createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
  clearProfile: () => {},
  isLoading: true,
});

const STORAGE_KEY = 'polimedia_profile';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfileState(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Failed to load profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const setProfile = async (newProfile: UserProfile) => {
    setProfileState(newProfile);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.log('Failed to save profile:', e);
    }
  };

  const clearProfile = async () => {
    setProfileState(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.log('Failed to clear profile:', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, clearProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return React.useContext(ProfileContext);
}

export default ProfileContext;
