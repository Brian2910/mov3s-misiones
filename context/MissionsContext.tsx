import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchMissions } from '../api/missions';
import { Mission } from '../types/Mission';

interface MissionsContextValue {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  toggleMission: (id: string) => void;
}

const MissionsContext = createContext<MissionsContextValue | undefined>(undefined);

export function MissionsProvider({ children }: { children: ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions()
      .then((data) => setMissions(data))
      .catch(() => setError('No se pudieron cargar las misiones'))
      .finally(() => setLoading(false));
  }, []);

  function toggleMission(id: string) {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  }

  return (
    <MissionsContext.Provider value={{ missions, loading, error, toggleMission }}>
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