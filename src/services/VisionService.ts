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
  async captureImage(): Promise<{ base64: string, imageUrl: string }> {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    if (!image.base64String) {
      throw new Error('Failed to capture image data');
    }

    return {
      base64: image.base64String,
      imageUrl: `data:image/jpeg;base64,${image.base64String}`
    };
  },

  async analyzeImage(base64: string): Promise<FoodAnalysis[]> {
    console.log('Analyzing image via backend...');
    const response = await api.post<FoodAnalysis[]>('/ai/analyze-food', {
      image_base64: base64,
    });
    return response.data;
  },

  // Keep for backward compatibility if needed, but we'll update our components
  async captureAndAnalyze(): Promise<{ analysis: FoodAnalysis[], imageUrl: string }> {
    const { base64, imageUrl } = await this.captureImage();
    const analysis = await this.analyzeImage(base64);
    return { analysis, imageUrl };
  }
};
