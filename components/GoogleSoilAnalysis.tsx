import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle, Activity, BarChart2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore } from '../store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const GOOGLE_ML_API_KEY = Constants.expoConfig?.extra?.GOOGLE_ML_API_KEY || 'YOUR_GOOGLE_ML_API_KEY';
const ML_API_URL = `https://us-central1-aiplatform.googleapis.com/v1/projects/your-project-id/locations/us-central1/endpoints/your-endpoint-id:predict?key=${GOOGLE_ML_API_KEY}`;

// Types for the soil analysis
interface SoilAnalysisResult {
  soilType?: string;
  phLevel?: number;
  moistureContent?: number;
  organicMatter?: number;
  nutrientLevels?: {
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    calcium?: number;
    magnesium?: number;
    sulfur?: number;
  };
  recommendations?: string[];
  suitableCrops?: string[];
}

interface Props {
  onAnalysisComplete?: (result: SoilAnalysisResult) => void;
}

export default function GoogleSoilAnalysis({ onAnalysisComplete }: Props) {
  const { isDark } = useThemeStore();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Take a photo with the camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Camera permission is required to take photos');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          analyzeImage(result.assets[0].base64);
        } else {
          setError('Image data not available in base64 format');
        }
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      setError('Failed to take photo');
    }
  };

  // Pick an image from library
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Media library permission is required to select images');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          analyzeImage(result.assets[0].base64);
        } else {
          setError('Image data not available in base64 format');
        }
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to select image');
    }
  };

  // Analyze image using Google ML API
  const analyzeImage = async (base64Image: string) => {
    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);
      
      // In development mode without API key, use mock data
      if (__DEV__ && GOOGLE_ML_API_KEY === 'YOUR_GOOGLE_ML_API_KEY') {
        console.log('Using mock soil analysis in development mode');
        await mockAnalysis();
        return;
      }

      console.log('Sending request to Google ML Soil Analysis API...');
      const requestBody = {
        image: {
          content: base64Image,
        },
        features: [
          { type: 'SOIL_ANALYSIS' },
          { type: 'OBJECT_DETECTION', maxResults: 5 },
        ],
      };

      const response = await fetch(ML_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GOOGLE_ML_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Soil API error response:', errorData);
        throw new Error(`Soil Analysis API error: ${response.status}. ${errorData}`);
      }

      const data = await response.json();
      
      if (!data || !data.soilAnalysis) {
        throw new Error('No soil analysis results returned from ML API');
      }
      
      console.log('Successfully received Soil Analysis API response');
      processAnalysisResults(data);
      
    } catch (err: any) {
      console.error('Error analyzing soil sample:', err);
      setError(err.message || 'Failed to analyze soil. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process the response from Google ML API
  const processAnalysisResults = (data: any) => {
    // In a real implementation, this would process the actual ML model response
    // For this example, we'll create a placeholder implementation
    
    // Extract soil type from classifications
    const soilType = extractSoilType(data);
    
    // Extract pH level and other properties
    const phLevel = extractPhLevel(data);
    const moistureContent = extractMoistureContent(data);
    const organicMatter = extractOrganicMatter(data);
    
    // Extract nutrient levels
    const nutrientLevels = extractNutrientLevels(data);
    
    // Generate recommendations based on soil analysis
    const recommendations = generateRecommendations(soilType, phLevel, nutrientLevels);
    
    // Generate suitable crops based on soil analysis
    const suitableCrops = generateSuitableCrops(soilType, phLevel, nutrientLevels);
    
    const result: SoilAnalysisResult = {
      soilType,
      phLevel,
      moistureContent,
      organicMatter,
      nutrientLevels,
      recommendations,
      suitableCrops,
    };
    
    setAnalysisResult(result);
    
    // Call the callback if provided
    if (onAnalysisComplete) {
      onAnalysisComplete(result);
    }
  };
  
  // Mock analysis for development without API key
  const mockAnalysis = async () => {
    // Simulate API delay
    const delayTime = 1000 + Math.random() * 2000;
    console.log(`Simulating API delay (${delayTime.toFixed(0)}ms)...`);
    await new Promise(resolve => setTimeout(resolve, delayTime));
    
    // Create more realistic mock data
    const soilTypes = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky'];
    const soilType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    
    const mockpH = (6 + Math.random() * 2).toFixed(1);
    const mockResult: SoilAnalysisResult = {
      soilType: soilType,
      phLevel: parseFloat(mockpH),
      moistureContent: Math.random() * 100,
      organicMatter: Math.random() * 10,
      nutrientLevels: {
        nitrogen: Math.random() * 100,
        phosphorus: Math.random() * 100,
        potassium: Math.random() * 100,
        calcium: Math.random() * 100,
        magnesium: Math.random() * 100,
        sulfur: Math.random() * 100,
      },
      recommendations: [],
      suitableCrops: [],
    };
    
    // Generate recommendations based on soil type and pH
    if (soilType === 'Clay') {
      mockResult.recommendations?.push('Add organic matter to improve drainage');
      mockResult.recommendations?.push('Consider raised beds for better results');
    } else if (soilType === 'Sandy') {
      mockResult.recommendations?.push('Add compost to improve water retention');
      mockResult.recommendations?.push('Use mulch to prevent rapid evaporation');
    } else if (soilType === 'Loamy') {
      mockResult.recommendations?.push('Ideal soil type for most crops');
      mockResult.recommendations?.push('Maintain organic matter with regular compost additions');
    }
    
    if (mockResult.phLevel && mockResult.phLevel < 6.0) {
      mockResult.recommendations?.push('Soil is acidic. Consider adding lime to raise pH');
      mockResult.recommendations?.push('Good for acid-loving plants like blueberries, potatoes');
    } else if (mockResult.phLevel && mockResult.phLevel > 7.5) {
      mockResult.recommendations?.push('Soil is alkaline. Consider adding sulfur to lower pH');
      mockResult.recommendations?.push('Good for some vegetables like asparagus, cabbage');
    } else {
      mockResult.recommendations?.push('Soil pH is in the ideal range for most crops');
    }
    
    // Nutrient specific recommendations
    if (mockResult.nutrientLevels?.nitrogen && mockResult.nutrientLevels.nitrogen < 40) {
      mockResult.recommendations?.push('Low nitrogen. Add nitrogen-rich fertilizers or legume cover crops');
    }
    if (mockResult.nutrientLevels?.phosphorus && mockResult.nutrientLevels.phosphorus < 30) {
      mockResult.recommendations?.push('Low phosphorus. Consider bone meal or rock phosphate amendments');
    }
    if (mockResult.nutrientLevels?.potassium && mockResult.nutrientLevels.potassium < 35) {
      mockResult.recommendations?.push('Low potassium. Add wood ash or seaweed to soil');
    }
    
    // Add suitable crops based on soil type
    if (mockResult.phLevel) {
      mockResult.suitableCrops = getSuitableCropsForSoil(soilType, mockResult.phLevel);
    }
    
    console.log('Mock soil analysis complete');
    setAnalysisResult(mockResult);
    
    // Call the callback if provided
    if (onAnalysisComplete) {
      onAnalysisComplete(mockResult);
    }
  };

  // Helper to determine suitable crops based on soil type and pH
  const getSuitableCropsForSoil = (soilType: string, pH: number): string[] => {
    const crops: string[] = [];
    
    // Add crops based on soil type
    if (soilType === 'Clay') {
      crops.push('Broccoli', 'Brussels Sprouts', 'Beans', 'Cabbage');
    } else if (soilType === 'Sandy') {
      crops.push('Carrots', 'Radishes', 'Potatoes', 'Lettuce');
    } else if (soilType === 'Loamy') {
      crops.push('Corn', 'Wheat', 'Tomatoes', 'Most vegetables');
    } else if (soilType === 'Silty') {
      crops.push('Fruit trees', 'Ornamental plants', 'Vegetables');
    } else if (soilType === 'Peaty') {
      crops.push('Blueberries', 'Legumes', 'Root vegetables');
    } else if (soilType === 'Chalky') {
      crops.push('Spinach', 'Cabbage', 'Sweet Corn');
    }
    
    // Add crops based on pH
    if (pH < 6.0) {
      crops.push('Potatoes', 'Blueberries', 'Strawberries');
    } else if (pH > 7.5) {
      crops.push('Asparagus', 'Cabbage', 'Cauliflower');
    } else {
      crops.push('Tomatoes', 'Peppers', 'Cucumbers', 'Most common vegetables');
    }
    
    // Return unique crops only
    return [...new Set(crops)];
  };

  // Helper functions to extract data from the ML response
  // These would be implemented based on the actual ML model output format
  const extractSoilType = (data: any): string => {
    return 'Clay Loam'; // Placeholder
  };
  
  const extractPhLevel = (data: any): number => {
    return 6.8; // Placeholder
  };
  
  const extractMoistureContent = (data: any): number => {
    return 35; // Placeholder
  };
  
  const extractOrganicMatter = (data: any): number => {
    return 3.2; // Placeholder
  };
  
  const extractNutrientLevels = (data: any): { nitrogen?: number; phosphorus?: number; potassium?: number } => {
    return {
      nitrogen: 40,
      phosphorus: 15,
      potassium: 25,
    }; // Placeholder
  };
  
  // Generate recommendations based on soil analysis
  const generateRecommendations = (
    soilType?: string,
    phLevel?: number,
    nutrientLevels?: { nitrogen?: number; phosphorus?: number; potassium?: number }
  ): string[] => {
    const recommendations: string[] = [];
    
    // General recommendations
    recommendations.push('Regularly test your soil for accurate analysis');
    
    // pH specific recommendations
    if (phLevel) {
      if (phLevel < 5.5) {
        recommendations.push('Soil is acidic. Consider adding lime to raise pH');
      } else if (phLevel > 7.5) {
        recommendations.push('Soil is alkaline. Consider adding sulfur to lower pH');
      } else {
        recommendations.push('Soil pH is within optimal range for most crops');
      }
    }
    
    // Nutrient specific recommendations
    if (nutrientLevels) {
      if (nutrientLevels.nitrogen && nutrientLevels.nitrogen < 30) {
        recommendations.push('Low nitrogen levels. Consider nitrogen-rich fertilizers or legume cover crops');
      }
      
      if (nutrientLevels.phosphorus && nutrientLevels.phosphorus < 10) {
        recommendations.push('Low phosphorus levels. Consider bone meal or rock phosphate amendments');
      }
      
      if (nutrientLevels.potassium && nutrientLevels.potassium < 20) {
        recommendations.push('Low potassium levels. Consider potash or wood ash amendments');
      }
    }
    
    // Soil type specific recommendations
    if (soilType) {
      if (soilType.toLowerCase().includes('clay')) {
        recommendations.push('Clay soil detected. Add organic matter to improve drainage and workability');
      } else if (soilType.toLowerCase().includes('sand')) {
        recommendations.push('Sandy soil detected. Add organic matter to improve water retention and nutrient holding capacity');
      } else if (soilType.toLowerCase().includes('silt')) {
        recommendations.push('Silty soil detected. Avoid tilling when wet to prevent compaction');
      }
    }
    
    return recommendations;
  };
  
  // Generate suitable crops based on soil analysis
  const generateSuitableCrops = (
    soilType?: string,
    phLevel?: number,
    nutrientLevels?: { nitrogen?: number; phosphorus?: number; potassium?: number }
  ): string[] => {
    const crops: string[] = [];
    
    // General crop suggestions based on soil type
    if (soilType) {
      if (soilType.toLowerCase().includes('clay')) {
        crops.push('Rice', 'Wheat', 'Corn');
      } else if (soilType.toLowerCase().includes('loam')) {
        crops.push('Vegetables', 'Fruits', 'Beans', 'Squash');
      } else if (soilType.toLowerCase().includes('sand')) {
        crops.push('Root vegetables', 'Potatoes', 'Carrots', 'Radishes');
      }
    }
    
    // pH specific crop suggestions
    if (phLevel) {
      if (phLevel < 6.0) {
        crops.push('Potatoes', 'Strawberries', 'Blueberries');
      } else if (phLevel >= 6.0 && phLevel <= 7.0) {
        crops.push('Tomatoes', 'Peppers', 'Cucumbers', 'Lettuce');
      } else {
        crops.push('Asparagus', 'Beets', 'Cabbage');
      }
    }
    
    // Remove duplicates
    return [...new Set(crops)];
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <LinearGradient
        colors={isDark ? ['rgba(26, 36, 33, 0.9)', 'rgba(15, 49, 35, 0.9)'] : ['rgba(233, 245, 225, 0.9)', 'rgba(248, 255, 239, 0.9)']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Soil Analysis</Text>
        <Text style={styles.headerSubtitle}>Powered by Google ML</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            
            <TouchableOpacity 
              style={[styles.retakeButton, { backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0' }]}
              onPress={() => setImage(null)}
            >
              <RefreshCw size={16} color={isDark ? '#FFFFFF' : '#333333'} />
              <Text style={[styles.buttonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Retake
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.uploadContainer, { backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0' }]}>
            <BarChart2 size={40} color={isDark ? '#38B000' : '#38B000'} style={styles.uploadIcon} />
            <Text style={[styles.uploadText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Take or select a photo of soil for analysis
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#38B000' }]}
                onPress={takePhoto}
              >
                <Camera size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#2196F3' }]}
                onPress={pickImage}
              >
                <Upload size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#38B000" />
            <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Analyzing soil with Google ML...
            </Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={24} color="#FF5252" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {analysisResult && (
          <ScrollView style={styles.resultsContainer}>
            <View style={[styles.resultCard, { backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0' }]}>
              <Text style={[styles.resultTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Soil Analysis Results
              </Text>
              
              {analysisResult.soilType && (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Soil Type:
                  </Text>
                  <Text style={[styles.resultValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {analysisResult.soilType}
                  </Text>
                </View>
              )}
              
              {analysisResult.phLevel && (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    pH Level:
                  </Text>
                  <Text style={[styles.resultValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {analysisResult.phLevel.toFixed(1)}
                  </Text>
                </View>
              )}
              
              {analysisResult.moistureContent && (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Moisture Content:
                  </Text>
                  <Text style={[styles.resultValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {analysisResult.moistureContent}%
                  </Text>
                </View>
              )}
              
              {analysisResult.organicMatter && (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Organic Matter:
                  </Text>
                  <Text style={[styles.resultValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {analysisResult.organicMatter.toFixed(1)}%
                  </Text>
                </View>
              )}
              
              {analysisResult.nutrientLevels && (
                <View style={styles.nutrientsContainer}>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    Nutrient Levels (ppm)
                  </Text>
                  
                  <View style={styles.nutrientBars}>
                    {analysisResult.nutrientLevels.nitrogen && (
                      <View style={styles.nutrientBar}>
                        <Text style={[styles.nutrientLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                          Nitrogen (N)
                        </Text>
                        <View style={styles.barContainer}>
                          <View 
                            style={[
                              styles.barFill, 
                              { 
                                width: `${Math.min(analysisResult.nutrientLevels.nitrogen / 100 * 100, 100)}%`,
                                backgroundColor: analysisResult.nutrientLevels.nitrogen < 30 ? '#FF5252' : 
                                              analysisResult.nutrientLevels.nitrogen < 60 ? '#FFC107' : '#4CAF50'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.nutrientValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                          {analysisResult.nutrientLevels.nitrogen}
                        </Text>
                      </View>
                    )}
                    
                    {analysisResult.nutrientLevels.phosphorus && (
                      <View style={styles.nutrientBar}>
                        <Text style={[styles.nutrientLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                          Phosphorus (P)
                        </Text>
                        <View style={styles.barContainer}>
                          <View 
                            style={[
                              styles.barFill, 
                              { 
                                width: `${Math.min(analysisResult.nutrientLevels.phosphorus / 50 * 100, 100)}%`,
                                backgroundColor: analysisResult.nutrientLevels.phosphorus < 10 ? '#FF5252' : 
                                              analysisResult.nutrientLevels.phosphorus < 25 ? '#FFC107' : '#4CAF50'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.nutrientValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                          {analysisResult.nutrientLevels.phosphorus}
                        </Text>
                      </View>
                    )}
                    
                    {analysisResult.nutrientLevels.potassium && (
                      <View style={styles.nutrientBar}>
                        <Text style={[styles.nutrientLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                          Potassium (K)
                        </Text>
                        <View style={styles.barContainer}>
                          <View 
                            style={[
                              styles.barFill, 
                              { 
                                width: `${Math.min(analysisResult.nutrientLevels.potassium / 50 * 100, 100)}%`,
                                backgroundColor: analysisResult.nutrientLevels.potassium < 20 ? '#FF5252' : 
                                              analysisResult.nutrientLevels.potassium < 40 ? '#FFC107' : '#4CAF50'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[styles.nutrientValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                          {analysisResult.nutrientLevels.potassium}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
              
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    Recommendations
                  </Text>
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <CheckCircle size={14} color="#38B000" style={styles.recommendationIcon} />
                      <Text style={[styles.recommendationText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        {recommendation}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {analysisResult.suitableCrops && analysisResult.suitableCrops.length > 0 && (
                <View style={styles.cropsContainer}>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    Suitable Crops
                  </Text>
                  <View style={styles.cropTags}>
                    {analysisResult.suitableCrops.map((crop, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.cropTag, 
                          { backgroundColor: isDark ? 'rgba(56, 176, 0, 0.2)' : 'rgba(56, 176, 0, 0.1)' }
                        ]}
                      >
                        <Text style={[styles.cropTagText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                          {crop}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    padding: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  uploadContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    marginBottom: 15,
  },
  uploadText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  errorText: {
    color: '#FF5252',
    marginLeft: 10,
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: 15,
  },
  resultCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  nutrientsContainer: {
    marginTop: 10,
  },
  nutrientBars: {
    marginTop: 5,
  },
  nutrientBar: {
    marginBottom: 12,
  },
  nutrientLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    flex: 1,
    marginRight: 10,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    right: 0,
  },
  recommendationsContainer: {
    marginTop: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 5,
  },
  recommendationIcon: {
    marginRight: 8,
  },
  recommendationText: {
    fontSize: 14,
    flex: 1,
  },
  cropsContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  cropTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  cropTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  cropTagText: {
    fontSize: 14,
  },
}); 