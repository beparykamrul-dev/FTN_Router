
import { useState, useEffect } from 'react';
import { ServiceStatus } from '../types.js';

export const useServiceHealth = () => {
  const [services, setServices] = useState<ServiceStatus[]>([]);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/v1/services/registry');
        const data = await response.json();
        setServices(data.services.map((s: any) => ({
          id: s.id,
          name: s.name,
          status: s.status,
          latencyMs: s.latencyMs,
          healthScore: s.healthScore
        })));
      } catch (error) {
        console.error('Failed to fetch service health:', error);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // 10s ping
    return () => clearInterval(interval);
  }, []);

  return services;
};
