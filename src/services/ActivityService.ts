import api from '../api/axios';

export interface ActivityLog {
  activity_type: string;
  duration_minutes: number;
  intensity: string;
  calories_burned: number;
}

export interface ActivityLogResponse extends ActivityLog {
  id: number;
  user_id: number;
  created_at: string;
}

export interface UserGoal {
  goal_type: string;
  target_value: number;
  unit: string;
  period: string;
}

export interface UserGoalResponse extends UserGoal {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export const ActivityService = {
  async logActivity(data: ActivityLog): Promise<ActivityLogResponse> {
    const response = await api.post<ActivityLogResponse>('/ai/log-activity', data);
    return response.data;
  },

  async getRecentActivities(): Promise<ActivityLogResponse[]> {
    const response = await api.get<ActivityLogResponse[]>('/ai/recent-activities');
    return response.data;
  },

  async upsertGoal(data: UserGoal): Promise<UserGoalResponse> {
    const response = await api.post<UserGoalResponse>('/ai/upsert-goal', data);
    return response.data;
  },

  async getGoals(): Promise<UserGoalResponse[]> {
    const response = await api.get<UserGoalResponse[]>('/ai/goals');
    return response.data;
  },

  async getRecommendations(): Promise<string[]> {
    const response = await api.get<{ recommendations: string[] }>('/ai/recommendations');
    return response.data.recommendations;
  }
};
