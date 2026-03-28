import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfile } from './ProfileContext';
import { API_BASE_URL } from './API';
import type { PersonalizedPolicy } from './policies';
import { getPersonalizedPolicies } from './policies';

interface PoliciesContextType {
  policies: PersonalizedPolicy[];
  loading: boolean;
  error: string | null;
  refreshPolicies: () => Promise<void>;
}

const PoliciesContext = createContext<PoliciesContextType>({
  policies: [],
  loading: true,
  error: null,
  refreshPolicies: async () => {},
});

export function PoliciesProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const [policies, setPolicies] = useState<PersonalizedPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = async () => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/policies?occupation=${profile.occupation}&location=${profile.location}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPolicies(data);
    } catch (err) {
      console.warn("API Error, falling back to local data:", err);
      // Fallback
      setPolicies(getPersonalizedPolicies(profile.occupation, profile.location));
      setError('Could not connect to server, showing local data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [profile?.occupation, profile?.location]);

  return (
    <PoliciesContext.Provider value={{ policies, loading, error, refreshPolicies: fetchPolicies }}>
      {children}
    </PoliciesContext.Provider>
  );
}

export const usePolicies = () => useContext(PoliciesContext);
