import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface Goal {
  id: number;
  goal_type: string;
  target_value: number;
  unit: string;
  period: string;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const queryClient = useQueryClient();

  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get<Goal[]>('/ai/goals');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const addGoal = useMutation({
    mutationFn: async (newGoal: { goal_type: string, target_value: number, unit: string, period: string }) => {
      const response = await api.post<Goal>('/ai/upsert-goal', newGoal);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  return {
    goals,
    isLoading,
    error,
    addGoal,
  };
};
