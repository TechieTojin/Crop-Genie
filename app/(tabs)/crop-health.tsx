import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, History } from 'lucide-react-native';
import { useLanguageStore } from '../../store/languageStore';
import { saveCropHealthScan, getCropHealthScans } from '../../lib/supabase';
import { getImageFromCamera, getImageFromGallery, analyzeCropHealth, CropHealthResult } from '../../lib/api/pestDetectionApi';
import CropAnalysisResult from '../../components/CropAnalysisResult';

export default function CropHealthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { translations: t } = useLanguageStore();
  
  const [scanHistory, setScanHistory] = useState([
    {
      id: '1',
      date: '2023-10-15',
      cropType: 'Rice',
      issue: 'Leaf Blast',
      imageUrl: 'https://images.unsplash.com/photo-1602165586566-0acb1ec67b27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      recommendation: 'Apply fungicide. Ensure proper drainage in the field.'
    },
    {
      id: '2',
      date: '2023-10-10',
      cropType: 'Wheat',
      issue: 'Healthy',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      recommendation: 'Continue current practices. Crop is healthy.'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CropHealthResult | null>(null);

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const imageUri = await getImageFromCamera();
      
      if (!imageUri) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        setLoading(false);
        return;
      }
      
      const result = await analyzeCropHealth(imageUri);
      
      if (result) {
        setAnalysisResult(result);
        
        // In a real app, save the result to the database
        // const saved = await saveCropHealthScan({
        //   farmer_id: 'user123', // This would come from authenticated user
        //   crop_type: result.cropType,
        //   image_url: result.imageUrl,
        //   status: result.status,
        //   issue: result.issue || '',
        //   confidence: result.confidence,
        //   description: result.description || '',
        //   recommendations: result.recommendations,
        // });
        
        // Update scan history
        const newScan = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          cropType: result.cropType,
          issue: result.issue || (result.status === 'healthy' ? 'Healthy' : 'Unknown Issue'),
          imageUrl: result.imageUrl,
          recommendation: result.recommendations[0] || 'No specific recommendations',
        };
        
        setScanHistory([newScan, ...scanHistory]);
      } else {
        Alert.alert('Error', 'Failed to analyze image. Please try again.');
      }
    } catch (error) {
      console.error('Error in take photo flow:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const imageUri = await getImageFromGallery();
      
      if (!imageUri) {
        Alert.alert('Error', 'Failed to select image. Please try again.');
        setLoading(false);
        return;
      }
      
      const result = await analyzeCropHealth(imageUri);
      
      if (result) {
        setAnalysisResult(result);
        
        // Update scan history
        const newScan = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          cropType: result.cropType,
          issue: result.issue || (result.status === 'healthy' ? 'Healthy' : 'Unknown Issue'),
          imageUrl: result.imageUrl,
          recommendation: result.recommendations[0] || 'No specific recommendations',
        };
        
        setScanHistory([newScan, ...scanHistory]);
      } else {
        Alert.alert('Error', 'Failed to analyze image. Please try again.');
      }
    } catch (error) {
      console.error('Error in upload image flow:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryItemPress = (item) => {
    // In a real app, we would fetch the full details from the database
    // For now, we'll create a mock result based on the history item
    const mockResult: CropHealthResult = {
      cropType: item.cropType,
      imageUrl: item.imageUrl,
      status: item.issue === 'Healthy' ? 'healthy' : (item.issue.includes('Pest') ? 'pest' : 'disease'),
      confidence: 85,
      issue: item.issue === 'Healthy' ? undefined : item.issue,
      description: item.issue === 'Healthy' 
        ? undefined 
        : `${item.issue} is a common problem affecting ${item.cropType} crops. It can lead to reduced yield and quality if not addressed promptly.`,
      recommendations: [item.recommendation],
      date: item.date,
    };
    
    setAnalysisResult(mockResult);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
            onPress={handleTakePhoto}
            disabled={loading}
          >
            <Camera size={24} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.actionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.takePhoto}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
            onPress={handleUploadImage}
            disabled={loading}
          >
            <Upload size={24} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.actionText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.uploadImage}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Analyzing image...
            </Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <View style={styles.sectionHeader}>
            <History size={20} color={isDark ? '#7CFC00' : '#006400'} />
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.recentScans}</Text>
          </View>
          
          {scanHistory.map(item => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.historyItem, { borderBottomColor: isDark ? '#444444' : '#EEEEEE' }]}
              onPress={() => handleHistoryItemPress(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.historyImage} />
              <View style={styles.historyContent}>
                <Text style={[styles.cropType, { color: isDark ? '#FFFFFF' : '#000000' }]}>{item.cropType}</Text>
                <Text style={[styles.issueText, { 
                  color: item.issue === 'Healthy' ? '#4CAF50' : '#F44336' 
                }]}>{item.issue}</Text>
                <Text style={[styles.dateText, { color: isDark ? '#BBBBBB' : '#666666' }]}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.infoSection, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
          <Text style={[styles.infoTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>{t.howToUse}</Text>
          <Text style={[styles.infoText, { color: isDark ? '#BBBBBB' : '#666666' }]}>
            {t.scannerInstructions}
          </Text>
        </View>
      </ScrollView>

      {analysisResult && (
        <CropAnalysisResult 
          result={analysisResult} 
          onClose={() => setAnalysisResult(null)} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  section: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  historyImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  historyContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cropType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  issueText: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
  infoSection: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    lineHeight: 22,
  },
});