import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

      console.log('Image captured, analyzing...');
      
      // MOCK AI ANALYSIS
      // In a real production app, you would send image.base64String to a backend
      // that uses Gemini Pro Vision or GPT-4o to analyze the food.
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              item: "Grilled Chicken Salad",
              calories: 350,
              protein: 35,
              carbs: 12,
              fat: 18,
              confidence: 0.94
            },
            {
              item: "Balsamic Vinaigrette",
              calories: 45,
              protein: 0,
              carbs: 3,
              fat: 4,
              confidence: 0.88
            }
          ]);
        }, 1500);
      });
    } catch (error) {
      console.error('Vision analysis error:', error);
      throw error;
    }
  }
};
