import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const useAIChat = () => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const response = await api.get<Message[]>('/ai/chat/history');
      return response.data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post<{ reply: string }>('/ai/chat', { message: content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      await api.post('/ai/chat/clear');
    },
    onSuccess: () => {
      queryClient.setQueryData(['chat-history'], []);
    },
  });

  return {
    messages,
    sendMessage,
    clearHistory,
    isLoading: sendMessage.isPending || isHistoryLoading,
  };
};
