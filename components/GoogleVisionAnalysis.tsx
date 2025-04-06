import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Camera, Upload, RefreshCw, CheckCircle, AlertCircle, Leaf } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore } from '../store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const GOOGLE_VISION_API_KEY = Constants.expoConfig?.extra?.GOOGLE_VISION_API_KEY || 'YOUR_GOOGLE_VISION_API_KEY';
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

// Types for Google Vision API
interface GoogleVisionResponse {
  responses: [{
    labelAnnotations?: {
      description: string;
      score: number;
      topicality: number;
    }[];
    cropHintsAnnotation?: {
      cropHints: {
        boundingPoly: {
          vertices: { x: number; y: number }[];
        };
        confidence: number;
        importanceFraction: number;
      }[];
    };
    imagePropertiesAnnotation?: {
      dominantColors: {
        colors: {
          color: { red: number; green: number; blue: number };
          score: number;
          pixelFraction: number;
        }[];
      };
    };
  }];
}

interface AnalysisResult {
  plantType?: string;
  healthStatus?: 'healthy' | 'unhealthy' | 'unknown';
  confidence?: number;
  possibleIssues?: string[];
  recommendations?: string[];
  dominantColors?: { name: string; value: string; score: number }[];
}

interface Props {
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export default function GoogleVisionAnalysis({ onAnalysisComplete }: Props) {
  const { isDark } = useThemeStore();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
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

  // Analyze image using Google Vision API
  const analyzeImage = async (base64Image: string | undefined) => {
    if (!base64Image) {
      setError('No image data available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);
      
      // In development mode without API key, use mock data
      if (__DEV__ && GOOGLE_VISION_API_KEY === 'YOUR_GOOGLE_VISION_API_KEY') {
        console.log('Using mock analysis in development mode');
        await mockAnalysis();
        return;
      }

      console.log('Sending request to Google Vision API...');
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'CROP_HINTS', maxResults: 5 },
              { type: 'IMAGE_PROPERTIES', maxResults: 5 },
            ],
          },
        ],
      };

      const response = await fetch(VISION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Vision API error response:', errorData);
        throw new Error(`Vision API error: ${response.status}. ${errorData}`);
      }

      const data = await response.json() as GoogleVisionResponse;
      
      if (!data.responses || data.responses.length === 0) {
        throw new Error('No analysis results returned from Vision API');
      }
      
      console.log('Successfully received Vision API response');
      processAnalysisResults(data);
      
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process the response from Google Vision API
  const processAnalysisResults = (data: GoogleVisionResponse) => {
    const labels = data.responses[0]?.labelAnnotations || [];
    
    // Find plant-related labels
    const plantLabels = labels.filter(label => 
      ['plant', 'crop', 'leaf', 'flower', 'tree', 'fruit', 'vegetable'].some(term => 
        label.description.toLowerCase().includes(term)
      )
    );
    
    // Find possible disease/pest labels
    const issueLabels = labels.filter(label => 
      ['disease', 'pest', 'fungus', 'blight', 'rot', 'wilted', 'damaged'].some(term => 
        label.description.toLowerCase().includes(term)
      )
    );
    
    // Determine plant type and health status
    const plantType = plantLabels.length > 0 ? plantLabels[0].description : undefined;
    
    // Determine if plant is healthy or has issues
    const healthStatus = issueLabels.length > 0 ? 'unhealthy' : 'healthy';
    
    // Extract confidence score
    const confidence = plantLabels.length > 0 ? plantLabels[0].score : undefined;
    
    // Extract dominant colors
    const colors = data.responses[0]?.imagePropertiesAnnotation?.dominantColors?.colors || [];
    const dominantColors = colors.map(color => {
      const { red, green, blue } = color.color;
      const hexColor = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
      return {
        name: getColorName(red, green, blue),
        value: hexColor,
        score: color.score,
      };
    });
    
    // Generate recommendations based on analysis
    const recommendations = generateRecommendations(plantType, healthStatus, issueLabels);
    
    const result: AnalysisResult = {
      plantType,
      healthStatus,
      confidence,
      possibleIssues: issueLabels.map(label => label.description),
      recommendations,
      dominantColors,
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
    const healthyChance = Math.random();
    const confidence = 0.7 + (Math.random() * 0.25);
    
    const possiblePlantTypes = [
      'Rice Plant', 
      'Wheat Plant', 
      'Tomato Plant', 
      'Corn Plant', 
      'Cotton Plant',
      'Potato Plant'
    ];
    
    const selectedPlantType = possiblePlantTypes[Math.floor(Math.random() * possiblePlantTypes.length)];
    
    const possibleIssues = [
      ['Leaf spot', 'Possible fungal infection'],
      ['Aphid infestation', 'Leaf damage'],
      ['Powdery mildew', 'Nutrient deficiency'],
      ['Bacterial wilt', 'Root rot symptoms'],
      ['Early blight', 'Leaf yellowing']
    ];
    
    const selectedIssueIndex = Math.floor(Math.random() * possibleIssues.length);
    const selectedIssueSet = possibleIssues[selectedIssueIndex];
    
    const mockResult: AnalysisResult = {
      plantType: selectedPlantType,
      healthStatus: healthyChance > 0.3 ? 'healthy' : 'unhealthy',
      confidence: confidence,
      possibleIssues: healthyChance > 0.3 ? [] : selectedIssueSet,
      recommendations: [
        'Ensure proper irrigation',
        'Monitor for pest activity',
        'Check soil nutrient levels',
        'Maintain proper spacing between plants',
      ],
      dominantColors: [
        { name: 'Green', value: '#4CAF50', score: 0.8 },
        { name: 'Brown', value: '#795548', score: 0.15 },
        { name: 'Yellow', value: '#FFEB3B', score: 0.05 },
      ],
    };
    
    // Add plant-specific recommendations
    if (selectedPlantType.toLowerCase().includes('rice')) {
      mockResult.recommendations?.push('Maintain proper water levels for rice cultivation');
    } else if (selectedPlantType.toLowerCase().includes('tomato')) {
      mockResult.recommendations?.push('Ensure proper staking and pruning for tomato plants');
    } else if (selectedPlantType.toLowerCase().includes('corn')) {
      mockResult.recommendations?.push('Check for proper spacing between corn plants');
    }
    
    // Add issue-specific recommendations if unhealthy
    if (mockResult.healthStatus === 'unhealthy') {
      mockResult.recommendations?.push('Consider consulting a local agricultural expert');
      
      if (selectedIssueSet.some(issue => issue.toLowerCase().includes('fungal') || issue.toLowerCase().includes('blight'))) {
        mockResult.recommendations?.push('Apply appropriate fungicide treatment');
      } else if (selectedIssueSet.some(issue => issue.toLowerCase().includes('pest') || issue.toLowerCase().includes('aphid'))) {
        mockResult.recommendations?.push('Consider organic or chemical pest control methods');
      }
    }
    
    console.log('Mock analysis complete');
    setAnalysisResult(mockResult);
    
    // Call the callback if provided
    if (onAnalysisComplete) {
      onAnalysisComplete(mockResult);
    }
  };
  
  // Simple color name detection
  const getColorName = (r: number, g: number, b: number): string => {
    if (g > r && g > b) return 'Green';
    if (r > g && r > b) return 'Red';
    if (b > r && b > g) return 'Blue';
    if (r > 200 && g > 200 && b < 100) return 'Yellow';
    if (r > 200 && g < 100 && b < 100) return 'Red';
    if (r < 100 && g < 100 && b < 100) return 'Black';
    if (r > 200 && g > 200 && b > 200) return 'White';
    if (r > 150 && g > 75 && b < 80) return 'Brown';
    return 'Unknown';
  };
  
  // Generate recommendations based on analysis
  const generateRecommendations = (
    plantType?: string, 
    healthStatus?: 'healthy' | 'unhealthy' | 'unknown',
    issueLabels: { description: string; score: number }[] = []
  ): string[] => {
    const recommendations: string[] = [];
    
    // General recommendations
    recommendations.push('Ensure proper irrigation');
    recommendations.push('Monitor for pest activity');
    
    // Add health-specific recommendations
    if (healthStatus === 'unhealthy') {
      recommendations.push('Consider consulting a local agricultural expert');
      
      // Add issue-specific recommendations
      issueLabels.forEach(issue => {
        const description = issue.description.toLowerCase();
        
        if (description.includes('fungus') || description.includes('blight') || description.includes('rot')) {
          recommendations.push('Apply appropriate fungicide treatment');
        } else if (description.includes('pest') || description.includes('insect')) {
          recommendations.push('Consider organic or chemical pest control methods');
        } else if (description.includes('wilted') || description.includes('dry')) {
          recommendations.push('Check irrigation system and soil moisture');
        } else if (description.includes('yellow') || description.includes('discolor')) {
          recommendations.push('Check soil nutrient levels and consider appropriate fertilizer');
        }
      });
    }
    
    // Add plant-specific recommendations
    if (plantType) {
      if (plantType.toLowerCase().includes('rice')) {
        recommendations.push('Maintain proper water levels for rice cultivation');
      } else if (plantType.toLowerCase().includes('tomato')) {
        recommendations.push('Ensure proper staking and pruning for tomato plants');
      } else if (plantType.toLowerCase().includes('corn') || plantType.toLowerCase().includes('maize')) {
        recommendations.push('Check for proper spacing between corn plants');
      }
    }
    
    return recommendations;
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <LinearGradient
        colors={isDark ? ['rgba(26, 36, 33, 0.9)', 'rgba(15, 49, 35, 0.9)'] : ['rgba(233, 245, 225, 0.9)', 'rgba(248, 255, 239, 0.9)']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Crop Analysis</Text>
        <Text style={styles.headerSubtitle}>Powered by Google Vision AI</Text>
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
            <Leaf size={40} color={isDark ? '#38B000' : '#38B000'} style={styles.uploadIcon} />
            <Text style={[styles.uploadText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Take or select a photo of your crop for analysis
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
              Analyzing image with Google Vision AI...
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
                Analysis Results
              </Text>
              
              {analysisResult.plantType && (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Plant Type:
                  </Text>
                  <Text style={[styles.resultValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {analysisResult.plantType}
                  </Text>
                </View>
              )}
              
              {analysisResult.healthStatus && (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Health Status:
                  </Text>
                  <View style={styles.healthStatus}>
                    {analysisResult.healthStatus === 'healthy' ? (
                      <CheckCircle size={16} color="#4CAF50" style={styles.statusIcon} />
                    ) : (
                      <AlertCircle size={16} color="#FF5252" style={styles.statusIcon} />
                    )}
                    <Text 
                      style={[
                        styles.resultValue, 
                        { 
                          color: analysisResult.healthStatus === 'healthy' 
                            ? '#4CAF50' 
                            : '#FF5252' 
                        }
                      ]}
                    >
                      {analysisResult.healthStatus.charAt(0).toUpperCase() + analysisResult.healthStatus.slice(1)}
                    </Text>
                  </View>
                </View>
              )}
              
              {analysisResult.confidence && (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Confidence:
                  </Text>
                  <Text style={[styles.resultValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {Math.round(analysisResult.confidence * 100)}%
                  </Text>
                </View>
              )}
              
              {analysisResult.possibleIssues && analysisResult.possibleIssues.length > 0 && (
                <View style={styles.issuesContainer}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Possible Issues:
                  </Text>
                  {analysisResult.possibleIssues.map((issue, index) => (
                    <View key={index} style={styles.issueItem}>
                      <AlertCircle size={14} color="#FF5252" style={styles.issueIcon} />
                      <Text style={[styles.issueText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        {issue}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {analysisResult.recommendations && (
                <View style={styles.recommendationsContainer}>
                  <Text style={[styles.resultLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                    Recommendations:
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
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 5,
  },
  issuesContainer: {
    marginVertical: 10,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 10,
  },
  issueIcon: {
    marginRight: 8,
  },
  issueText: {
    fontSize: 14,
  },
  recommendationsContainer: {
    marginTop: 15,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 10,
  },
  recommendationIcon: {
    marginRight: 8,
  },
  recommendationText: {
    fontSize: 14,
  },
}); 