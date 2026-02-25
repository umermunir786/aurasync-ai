import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface Goal {
  id: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  unit: string;
  aiPlan?: string;
}

export const useGoals = () => {
  const queryClient = useQueryClient();

  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get<Goal[]>('/goals');
      return response.data;
    },
  });

  const addGoal = useMutation({
    mutationFn: async (newGoal: Omit<Goal, 'id' | 'currentValue' | 'aiPlan'>) => {
      const response = await api.post<Goal>('/goals', newGoal);
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
