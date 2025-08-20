import { useEffect, useState } from 'react';
import { QuarterlyDeviation, Vessel } from '@/types';

interface UseVesselDataReturn {
  deviations: QuarterlyDeviation[];
  vessels: Vessel[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useVesselData = (): UseVesselDataReturn => {
  const [deviations, setDeviations] = useState<QuarterlyDeviation[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch vessels and deviations data
      const [vesselsResponse, deviationsResponse] = await Promise.all([
        fetch('http://localhost:3001/api/vessels'),
        fetch('http://localhost:3001/api/vessels/deviations'),
      ]);

      if (!vesselsResponse.ok || !deviationsResponse.ok) {
        throw new Error('Failed to fetch data from backend');
      }

      const vesselsData = await vesselsResponse.json();
      const deviationsData = await deviationsResponse.json();

      setVessels(vesselsData);
      setDeviations(deviationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    deviations,
    vessels,
    loading,
    error,
    refetch: fetchData,
  };
};
