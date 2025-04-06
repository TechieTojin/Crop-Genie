import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useColorScheme, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, DollarSign, ArrowUp, ArrowDown, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define types for chart components
type ChartComponent = React.ComponentType<any>;

// Conditionally import charts to avoid web issues
let LineChart: ChartComponent | undefined;
let BarChart: ChartComponent | undefined;

if (Platform.OS !== 'web') {
  // Only import on native platforms
  const Charts = require('react-native-chart-kit');
  LineChart = Charts.LineChart;
  BarChart = Charts.BarChart;
}

const { width } = Dimensions.get('window');

export default function MarketScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCrop, setSelectedCrop] = useState('rice');
  
  const marketData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ],
        color: (opacity = 1) => `rgba(56, 176, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Rice Price Trends"]
  };
  
  const cropProductionData = {
    labels: ["Rice", "Wheat", "Corn", "Soy", "Cotton"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99]
      }
    ]
  };
  
  const chartConfig = {
    backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
    backgroundGradientTo: isDark ? '#1E1E1E' : '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#38B000"
    }
  };
  
  const marketInsights = [
    { crop: 'Rice', price: '₹2,540/qt', change: '+4.2%', isPositive: true },
    { crop: 'Wheat', price: '₹2,100/qt', change: '+1.8%', isPositive: true },
    { crop: 'Corn', price: '₹1,680/qt', change: '-2.3%', isPositive: false },
    { crop: 'Soybean', price: '₹4,280/qt', change: '+5.1%', isPositive: true },
    { crop: 'Cotton', price: '₹6,350/qt', change: '-0.7%', isPositive: false },
  ];

  // Render chart or web fallback
  const renderPriceChart = () => {
    if (Platform.OS !== 'web' && LineChart) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={marketData}
            width={width * 1.2}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </ScrollView>
      );
    } else {
      // Web fallback
      return (
        <View style={styles.chartFallback}>
          <Text style={[styles.fallbackText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Price trend chart (available on mobile app)
          </Text>
          <View style={styles.mockChart}>
            {marketData.datasets[0].data.map((value, index) => (
              <View 
                key={index}
                style={[
                  styles.mockBar, 
                  { 
                    height: value / 2, 
                    backgroundColor: '#38B000',
                    marginRight: (width - 80) / marketData.labels.length / 2
                  }
                ]} 
              />
            ))}
          </View>
          <View style={styles.mockLabels}>
            {marketData.labels.map((label, index) => (
              <Text 
                key={index} 
                style={[styles.mockLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>
      );
    }
  };

  // Render production chart or web fallback
  const renderProductionChart = () => {
    if (Platform.OS !== 'web' && BarChart) {
      return (
        <BarChart
          data={cropProductionData}
          width={width - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(56, 176, 0, ${opacity})`,
          }}
          style={styles.chart}
          verticalLabelRotation={0}
        />
      );
    } else {
      // Web fallback
      return (
        <View style={styles.chartFallback}>
          <Text style={[styles.fallbackText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Production data chart (available on mobile app)
          </Text>
          <View style={styles.mockBarChart}>
            {cropProductionData.datasets[0].data.map((value, index) => (
              <View key={index} style={styles.mockBarContainer}>
                <Text style={[styles.mockBarLabel, { color: isDark ? '#BBBBBB' : '#666666' }]}>
                  {cropProductionData.labels[index]}
                </Text>
                <View 
                  style={[
                    styles.mockBarItem, 
                    { 
                      width: value * 2, 
                      backgroundColor: '#38B000'
                    }
                  ]} 
                />
                <Text style={[styles.mockBarValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
          style={styles.headerSection}
        >
          <Text style={styles.headerTitle}>Market Analysis</Text>
          <Text style={styles.headerSubtitle}>Track prices and make informed decisions</Text>
          
          <View style={styles.insightBadge}>
            <TrendingUp size={16} color="#FFFFFF" />
            <Text style={styles.insightText}>Market trending upward</Text>
          </View>
        </LinearGradient>
        
        <View style={styles.timeframeSelector}>
          {['day', 'week', 'month', 'year'].map(timeframe => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.selectedTimeframe,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe && styles.selectedTimeframeText,
                  { color: isDark ? '#FFFFFF' : '#333333' }
                ]}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[styles.chartContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>Price Trends</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color={isDark ? '#BBBBBB' : '#666666'} />
            </TouchableOpacity>
          </View>
          
          {renderPriceChart()}
          
          <View style={styles.cropSelector}>
            {['rice', 'wheat', 'corn', 'soybean', 'cotton'].map(crop => (
              <TouchableOpacity
                key={crop}
                style={[
                  styles.cropButton,
                  selectedCrop === crop && styles.selectedCrop,
                  { borderColor: isDark ? '#444444' : '#E0E0E0' }
                ]}
                onPress={() => setSelectedCrop(crop)}
              >
                <Text
                  style={[
                    styles.cropText,
                    selectedCrop === crop && styles.selectedCropText,
                    { color: isDark ? '#FFFFFF' : '#333333' }
                  ]}
                >
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={[styles.insightsContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          <Text style={[styles.insightsTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Current Market Prices
          </Text>
          
          {marketInsights.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.insightCard,
                index < marketInsights.length - 1 && styles.cardDivider,
                { borderBottomColor: isDark ? '#2D2D2D' : '#F0F0F0' }
              ]}
            >
              <View style={styles.insightLeft}>
                <DollarSign size={20} color="#38B000" style={styles.insightIcon} />
                <Text style={[styles.cropName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {item.crop}
                </Text>
              </View>
              
              <View style={styles.insightRight}>
                <Text style={[styles.priceText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {item.price}
                </Text>
                <View style={[
                  styles.changeContainer,
                  { backgroundColor: item.isPositive ? 'rgba(56, 176, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)' }
                ]}>
                  {item.isPositive ? (
                    <ArrowUp size={12} color="#38B000" />
                  ) : (
                    <ArrowDown size={12} color="#FF0000" />
                  )}
                  <Text style={[
                    styles.changeText,
                    { color: item.isPositive ? '#38B000' : '#FF0000' }
                  ]}>
                    {item.change}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        
        <View style={[styles.chartContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', marginBottom: 30 }]}>
          <Text style={[styles.chartTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Regional Production
          </Text>
          
          {renderProductionChart()}
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#999999' : '#999999' }]}>
            CropGenies and Co v1.0.0
          </Text>
          <Text style={[styles.footerDeveloper, { color: isDark ? '#38B000' : '#38B000' }]}>
            Developed by TOJIN VARKEY SIMSON
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 176, 0, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  insightText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTimeframe: {
    backgroundColor: '#38B000',
  },
  timeframeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  selectedTimeframeText: {
    color: '#FFFFFF',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 6,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  chartFallback: {
    marginVertical: 10,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 14,
    marginBottom: 20,
  },
  mockChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    width: '100%',
    justifyContent: 'center',
  },
  mockBar: {
    width: 20,
    borderRadius: 5,
  },
  mockLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  mockLabel: {
    fontSize: 12,
  },
  mockBarChart: {
    width: '100%',
  },
  mockBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mockBarItem: {
    height: 20,
    borderRadius: 4,
  },
  mockBarLabel: {
    width: 60,
    fontSize: 12,
    marginRight: 10,
  },
  mockBarValue: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '500',
  },
  cropSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  cropButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    marginRight: 10,
    marginBottom: 5,
  },
  selectedCrop: {
    backgroundColor: '#38B000',
    borderColor: '#38B000',
  },
  cropText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedCropText: {
    color: '#FFFFFF',
  },
  insightsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  insightCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cardDivider: {
    borderBottomWidth: 1,
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    marginRight: 10,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '500',
  },
  insightRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footerDeveloper: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 