import { SocialLogin } from '@capgo/capacitor-social-login';

export const SocialAuthService = {
  async init() {
    await SocialLogin.initialize({
      google: {
        webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with user's ID
      },
      apple: {
        clientId: 'com.aurasync.app',
        redirectUrl: 'https://aurasync-ai.firebaseapp.com/__/auth/handler',
      }
    });
  },

  async loginWithGoogle() {
    try {
      const result = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile'],
        },
      });
      console.log('Google login result:', result);
      return result;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  async loginWithApple() {
    try {
      const result = await SocialLogin.login({
        provider: 'apple',
        options: {
          scopes: ['email', 'name'],
        },
      });
      console.log('Apple login result:', result);
      return result;
    } catch (error) {
      console.error('Apple login error:', error);
      throw error;
    }
  }
};
