import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import api from '../api/axios';

export interface FoodAnalysis {
  item: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export const VisionService = {
  async captureAndAnalyze(): Promise<FoodAnalysis[]> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (!image.base64String) {
        throw new Error('Failed to capture image data');
      }

      console.log('Image captured, analyzing via backend...');
      
      const response = await api.post<FoodAnalysis[]>('/ai/analyze-food', {
        image_base64: image.base64String,
      });
      
      return response.data;
    } catch (error) {
      console.error('Vision analysis error:', error);
      throw error;
    }
  }
};
