import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface WeightLog {
  id: number;
  weight: number;
  recorded_at: string;
}

export const useWeight = () => {
  const queryClient = useQueryClient();

  const { data: weightHistory = [], isLoading, error } = useQuery({
    queryKey: ['weight-history'],
    queryFn: async () => {
      const response = await api.get<WeightLog[]>('/users/weight/history');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logWeight = useMutation({
    mutationFn: async (weight: number) => {
      const response = await api.post<WeightLog>('/users/weight', { weight });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-history'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] }); // To update user.weight
    },
  });

  return {
    weightHistory,
    isLoading,
    error,
    logWeight,
  };
};
