import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, X } from 'lucide-react-native';

type AnalysisResultProps = {
  result: {
    cropType: string;
    imageUrl: string;
    status: 'healthy' | 'disease' | 'pest';
    confidence: number;
    issue?: string;
    description?: string;
    recommendations: string[];
    date: string;
  };
  onClose: () => void;
};

export default function CropAnalysisResult({ result, onClose }: AnalysisResultProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getStatusColor = () => {
    switch(result.status) {
      case 'healthy': return '#4CAF50';
      case 'disease': return '#F44336';
      case 'pest': return '#FF9800';
      default: return '#4CAF50';
    }
  };
  
  const getStatusIcon = () => {
    switch(result.status) {
      case 'healthy': 
        return <CheckCircle size={24} color="#4CAF50" />;
      case 'disease':
      case 'pest': 
        return <AlertTriangle size={24} color={result.status === 'disease' ? '#F44336' : '#FF9800'} />;
      default: 
        return <Info size={24} color="#2196F3" />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)' }]}>
      <View style={[styles.content, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>Analysis Result</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={{ uri: result.imageUrl }} style={styles.image} />
          
          <View style={styles.resultHeader}>
            <View style={styles.statusContainer}>
              {getStatusIcon()}
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {result.status === 'healthy' ? 'Healthy' : result.status === 'disease' ? 'Disease Detected' : 'Pest Detected'}
              </Text>
            </View>
            <Text style={[styles.confidence, { color: isDark ? '#BBBBBB' : '#666666' }]}>
              Confidence: {result.confidence}%
            </Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={[styles.cropType, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Crop: {result.cropType}
            </Text>
            
            {result.issue && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>Issue</Text>
                <Text style={[styles.issueText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{result.issue}</Text>
              </View>
            )}
            
            {result.description && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>Description</Text>
                <Text style={[styles.description, { color: isDark ? '#BBBBBB' : '#666666' }]}>{result.description}</Text>
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>Recommendations</Text>
              {result.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={[styles.recommendationNumber, { color: isDark ? '#7CFC00' : '#006400' }]}>{index + 1}.</Text>
                  <Text style={[styles.recommendationText, { color: isDark ? '#BBBBBB' : '#666666' }]}>{recommendation}</Text>
                </View>
              ))}
            </View>
            
            <Text style={[styles.date, { color: isDark ? '#999999' : '#999999' }]}>
              Analysis date: {result.date}
            </Text>
          </View>
        </ScrollView>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: isDark ? '#7CFC00' : '#006400' }]}
          onPress={onClose}
        >
          <Text style={styles.actionButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  confidence: {
    fontSize: 14,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  cropType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  issueText: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  recommendationNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
    width: 20,
  },
  recommendationText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    marginTop: 15,
    textAlign: 'right',
  },
  actionButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});