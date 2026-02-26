import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface Activity {
  id: number;
  activity_type: string;
  duration_minutes: number;
  intensity: string;
  calories_burned: number;
  created_at: string;
}

export const useActivities = () => {
  const queryClient = useQueryClient();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await api.get<Activity[]>('/ai/recent-activities');
      return response.data;
    },
  });

  const addActivity = useMutation({
    mutationFn: async (newActivity: { activity_type: string, duration_minutes: number, intensity: string, calories_burned: number }) => {
      const response = await api.post<Activity>('/ai/log-activity', newActivity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: number) => {
      // Backend delete not implemented yet, but keeping the mutation for future
      console.warn('Delete activity not implemented on backend');
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
