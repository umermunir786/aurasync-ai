import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface Activity {
  id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  notes?: string;
}

export const useActivities = () => {
  const queryClient = useQueryClient();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await api.get<Activity[]>('/activities');
      return response.data;
    },
  });

  const addActivity = useMutation({
    mutationFn: async (newActivity: Omit<Activity, 'id' | 'timestamp'>) => {
      const response = await api.post<Activity>('/activities', newActivity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  return {
    activities,
    isLoading,
    error,
    addActivity,
    deleteActivity,
  };
};
