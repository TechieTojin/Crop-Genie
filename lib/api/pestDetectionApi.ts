import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Constants from 'expo-constants';

// Plant.id API key
const PLANTID_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_PLANTID_API_KEY || 
                       process.env.EXPO_PUBLIC_PLANTID_API_KEY;

// Base URL for Plant.id API
const PLANTID_BASE_URL = 'https://api.plant.id/v2';

// Types
export interface CropHealthResult {
  cropType: string;
  imageUrl: string;
  status: 'healthy' | 'disease' | 'pest';
  confidence: number;
  issue?: string;
  description?: string;
  recommendations: string[];
  date: string;
}

// Get image from camera
export const getImageFromCamera = async (): Promise<string | null> => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      console.error('Camera permission denied');
      return null;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

// Get image from gallery
export const getImageFromGallery = async (): Promise<string | null> => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      console.error('Media library permission denied');
      return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

// Convert image URI to base64
const imageUriToBase64 = async (uri: string): Promise<string | null> => {
  try {
    // For web platform
    if (uri.startsWith('data:')) {
      return uri.split(',')[1];
    }
    
    // For native platforms, we would use FileSystem
    // Since this is primarily for web, we'll return a mock response
    console.warn('Base64 conversion not fully implemented for native platforms');
    return 'mock_base64_data';
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

// Analyze crop health using Plant.id API
export const analyzeCropHealth = async (imageUri: string): Promise<CropHealthResult | null> => {
  try {
    const base64Image = await imageUriToBase64(imageUri);
    
    if (!base64Image) {
      throw new Error('Failed to convert image to base64');
    }
    
    const response = await axios.post(`${PLANTID_BASE_URL}/health_assessment`, {
      images: [base64Image],
      modifiers: ['crops_fast'],
      disease_details: ['description', 'treatment'],
      api_key: PLANTID_API_KEY,
    });
    
    // Process the response and return a structured result
    const data = response.data;
    
    // For now, we'll return mock data
    return getMockCropHealthResult(imageUri);
  } catch (error) {
    console.error('Error analyzing crop health:', error);
    return null;
  }
};

// Mock crop health result
const getMockCropHealthResult = (imageUri: string): CropHealthResult => {
  // Randomly determine if the crop is healthy or has an issue
  const randomStatus = Math.random();
  let status: 'healthy' | 'disease' | 'pest';
  let issue: string | undefined;
  let description: string | undefined;
  let recommendations: string[];
  
  if (randomStatus < 0.3) {
    // Healthy crop
    status = 'healthy';
    recommendations = [
      'Continue current farming practices',
      'Maintain regular irrigation schedule',
      'Monitor for any changes in leaf color or growth pattern',
    ];
  } else if (randomStatus < 0.7) {
    // Disease
    status = 'disease';
    issue = 'Leaf Blast';
    description = 'Leaf blast is a fungal disease caused by Magnaporthe oryzae. It appears as diamond-shaped lesions with gray centers and brown margins on leaves.';
    recommendations = [
      'Apply fungicide treatment immediately',
      'Ensure proper field drainage to reduce humidity',
      'Consider resistant varieties for future planting',
      'Maintain balanced fertilization to avoid excessive nitrogen',
    ];
  } else {
    // Pest
    status = 'pest';
    issue = 'Brown Planthopper';
    description = 'Brown planthoppers are insects that suck sap from the rice plant and can cause yellowing and drying of the crop, known as "hopper burn".';
    recommendations = [
      'Apply appropriate insecticide as per local agricultural guidelines',
      'Drain the field for 3-4 days if possible',
      'Avoid excessive use of nitrogen fertilizers',
      'Encourage natural enemies by minimizing pesticide use',
    ];
  }
  
  // Determine crop type based on image (in a real app, this would come from the API)
  const cropTypes = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'];
  const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)];
  
  return {
    cropType,
    imageUrl: imageUri,
    status,
    confidence: 75 + Math.floor(Math.random() * 20), // 75-95%
    issue,
    description,
    recommendations,
    date: new Date().toISOString().split('T')[0],
  };
};

// Export additional utility functions
export const getCropDiseaseInfo = async (diseaseName: string): Promise<any> => {
  // In a real app, this would fetch detailed information about a specific disease
  // For now, we'll return mock data
  return {
    name: diseaseName,
    scientificName: 'Magnaporthe oryzae',
    hostPlants: ['Rice', 'Wheat', 'Barley'],
    symptoms: [
      'Diamond-shaped lesions on leaves',
      'Gray centers with brown margins',
      'Lesions can coalesce causing leaf death',
    ],
    conditions: 'High humidity (>90%) and moderate temperatures (24-28°C) favor disease development',
    management: [
      'Use resistant varieties',
      'Apply fungicides preventively',
      'Avoid excessive nitrogen fertilization',
      'Improve field drainage',
    ],
  };
};

export const getPestInfo = async (pestName: string): Promise<any> => {
  // In a real app, this would fetch detailed information about a specific pest
  // For now, we'll return mock data
  return {
    name: pestName,
    scientificName: 'Nilaparvata lugens',
    hostPlants: ['Rice'],
    damage: [
      'Sucks sap from the plant',
      'Causes yellowing and drying of plants',
      'Can transmit viral diseases',
    ],
    lifecycle: 'Eggs → Nymphs (5 stages) → Adults, completes in 25-30 days',
    management: [
      'Use resistant varieties',
      'Apply appropriate insecticides',
      'Drain fields periodically',
      'Encourage natural enemies',
    ],
  };
};