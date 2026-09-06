import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { fetchMissions } from '../api/missions';
import { Mission } from '../types/Mission';

interface MissionsContextValue {
  missions: Mission[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  toggleMission: (id: string) => void;
  refresh: () => void;
}

const MissionsContext = createContext<MissionsContextValue | undefined>(undefined);

export function MissionsProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadMissions(isRefresh: boolean) {
    if (isRefresh) setRefreshing(true);
    fetchMissions()
      .then((data) => {
        setMissions(data);
        setError(null);
      })
      .catch(() => setError('No se pudieron cargar las misiones'))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }

  useEffect(() => {
    loadMissions(false);
  }, []);

  const refresh = useCallback(() => {
    loadMissions(true);
  }, []);

  function toggleMission(id: string) {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  }

  return (
    <MissionsContext.Provider value={{ missions, loading, refreshing, error, toggleMission, refresh }}>
      {children}
    </MissionsContext.Provider>
  );
}

export function useMissions() {
  const context = useContext(MissionsContext);
  if (!context) {
    throw new Error('useMissions debe usarse dentro de un MissionsProvider');
  }
  return context;
}