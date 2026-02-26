import api from '../api/axios';

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const AuthService = {
  async login(formData: FormData): Promise<LoginResponse> {
    const response = await api.post('/auth/login/access-token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async signup(userData: any): Promise<User> {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ msg: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async verifyOTP(email: string, otp: string): Promise<{ msg: string }> {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  async resetPassword(data: any): Promise<{ msg: string }> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(userData: any): Promise<User> {
    const response = await api.patch('/users/me', userData);
    return response.data;
  },
};
