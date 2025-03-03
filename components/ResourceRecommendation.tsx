import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Droplets, Zap, Calendar, CircleCheck as CheckCircle } from 'lucide-react-native';

type RecommendationType = 'irrigation' | 'fertilizer';

type RecommendationProps = {
  type: RecommendationType;
  data: {
    cropType: string;
    fieldSize: string;
    currentStatus: string;
    recommendation: string;
    schedule: {
      nextDate: string;
      frequency: string;
      amount: string;
    };
    tips: string[];
  };
  onApply: () => void;
  onClose: () => void;
};

export default function ResourceRecommendation({ type, data, onApply, onClose }: RecommendationProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getIcon = () => {
    switch(type) {
      case 'irrigation': 
        return <Droplets size={24} color={isDark ? '#7CFC00' : '#006400'} />;
      case 'fertilizer': 
        return <Zap size={24} color={isDark ? '#7CFC00' : '#006400'} />;
      default: 
        return null;
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'irrigation': return 'Irrigation Recommendation';
      case 'fertilizer': return 'Fertilizer Recommendation';
      default: return 'Recommendation';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)' }]}>
      <View style={[styles.content, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}>
        <View style={styles.header}>
          {getIcon()}
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000000' }]}>{getTitle()}</Text>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          <View style={styles.infoSection}>
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>Crop:</Text>
            <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{data.cropType}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>Field Size:</Text>
            <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{data.fieldSize}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={[styles.infoLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>Current Status:</Text>
            <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{data.currentStatus}</Text>
          </View>
          
          <View style={[styles.recommendationBox, { backgroundColor: isDark ? '#3A3A3A' : '#F0F8FF' }]}>
            <Text style={[styles.recommendationTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>AI Recommendation</Text>
            <Text style={[styles.recommendationText, { color: isDark ? '#FFFFFF' : '#000000' }]}>{data.recommendation}</Text>
          </View>
          
          <View style={styles.scheduleSection}>
            <View style={styles.scheduleHeader}>
              <Calendar size={20} color={isDark ? '#7CFC00' : '#006400'} />
              <Text style={[styles.scheduleTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>Recommended Schedule</Text>
            </View>
            
            <View style={[styles.scheduleBox, { backgroundColor: isDark ? '#3A3A3A' : '#F0F8FF' }]}>
              <View style={styles.scheduleItem}>
                <Text style={[styles.scheduleLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>Next Date:</Text>
                <Text style={[styles.scheduleValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{data.schedule.nextDate}</Text>
              </View>
              
              <View style={styles.scheduleItem}>
                <Text style={[styles.scheduleLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>Frequency:</Text>
                <Text style={[styles.scheduleValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{data.schedule.frequency}</Text>
              </View>
              
              <View style={styles.scheduleItem}>
                <Text style={[styles.scheduleLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>Amount:</Text>
                <Text style={[styles.scheduleValue, { color: isDark ? '#FFFFFF' : '#000000' }]}>{data.schedule.amount}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.tipsSection}>
            <Text style={[styles.tipsTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>Tips & Best Practices</Text>
            {data.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <CheckCircle size={16} color={isDark ? '#7CFC00' : '#006400'} style={styles.tipIcon} />
                <Text style={[styles.tipText, { color: isDark ? '#BBBBBB' : '#666666' }]}>{tip}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.applyButton, { backgroundColor: isDark ? '#7CFC00' : '#006400' }]}
            onPress={onApply}
          >
            <Text style={styles.applyButtonText}>Apply Recommendation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.closeButton, { backgroundColor: isDark ? '#444444' : '#EEEEEE' }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>Close</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollContent: {
    marginBottom: 15,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  recommendationBox: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    lineHeight: 22,
  },
  scheduleSection: {
    marginVertical: 15,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scheduleBox: {
    padding: 15,
    borderRadius: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scheduleLabel: {
    fontSize: 14,
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipsSection: {
    marginVertical: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  applyButton: {
    marginBottom: 10,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});