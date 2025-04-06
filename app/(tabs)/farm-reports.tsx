import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { 
  FileText, 
  Download, 
  Calendar, 
  ChevronDown, 
  Filter, 
  BarChart3,
  PieChart,
  Share2,
  Printer,
  Copy,
  CheckCircle2
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Sample report data
const reports = [
  {
    id: 1,
    title: 'Monthly Crop Analysis - May 2023',
    type: 'Crop Performance',
    date: 'May 30, 2023',
    size: '2.4 MB',
    insights: [
      '15% increase in rice yield compared to last season',
      'Pest activity reduced by 30% after new control measures',
      'Water usage optimization saved approximately 20%'
    ]
  },
  {
    id: 2,
    title: 'Soil Health Assessment',
    type: 'Soil Analysis',
    date: 'May 15, 2023',
    size: '1.8 MB',
    insights: [
      'Nitrogen levels optimal for current crop rotation',
      'Potassium deficiency detected in eastern field section',
      'pH balance improved after lime application'
    ]
  },
  {
    id: 3,
    title: 'Q1 2023 Financial Summary',
    type: 'Financial Report',
    date: 'April 10, 2023',
    size: '3.2 MB',
    insights: [
      'Profit margin increased by 12% compared to Q1 2022',
      'Input costs reduced by 8% through supplier negotiation',
      'New organic certification increased market price by 15%'
    ]
  },
  {
    id: 4,
    title: 'Irrigation Efficiency Report',
    type: 'Resource Management',
    date: 'March 22, 2023',
    size: '1.5 MB',
    insights: [
      'Drip irrigation system reduced water usage by 35%',
      'Evening watering schedule improved water retention by 22%',
      'Mulching further reduced evaporation losses by 18%'
    ]
  }
];

// Sample activity data
const recentActivities = [
  {
    id: 1,
    activity: 'Fertilizer Application',
    date: 'Today, 8:30 AM',
    location: 'North Field (Rice)',
    details: 'Applied NPK fertilizer at recommended rate.'
  },
  {
    id: 2,
    activity: 'Irrigation',
    date: 'Today, 6:15 AM',
    location: 'East Field (Vegetables)',
    details: 'Drip irrigation for 45 minutes.'
  },
  {
    id: 3,
    activity: 'Pest Control',
    date: 'Yesterday, 4:20 PM',
    location: 'West Field (Cotton)',
    details: 'Applied organic neem-based pesticide.'
  },
  {
    id: 4,
    activity: 'Harvest',
    date: 'May 28, 2023',
    location: 'South Field (Wheat)',
    details: 'Completed wheat harvest with 15% higher yield than expected.'
  }
];

// Sample filter options
const filterOptions = ['All Reports', 'Crop Performance', 'Soil Analysis', 'Financial', 'Resource Management'];

export default function FarmReportsScreen() {
  const { isDark } = useThemeStore();
  const [selectedFilter, setSelectedFilter] = useState('All Reports');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<number[]>([]);
  
  const handleDownload = (reportId: number) => {
    setDownloadingId(reportId);
    
    // Simulate download process
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedIds([...downloadedIds, reportId]);
      
      // Reset downloaded status after 3 seconds
      setTimeout(() => {
        setDownloadedIds(downloadedIds.filter(id => id !== reportId));
      }, 3000);
    }, 2000);
  };
  
  const isDownloaded = (reportId: number) => {
    return downloadedIds.includes(reportId);
  };
  
  const getReportTypeColor = (type: string) => {
    switch(type) {
      case 'Crop Performance':
        return '#38B000';
      case 'Soil Analysis':
        return '#00B4D8';
      case 'Financial Report':
        return '#FFBB38';
      case 'Resource Management':
        return '#9747FF';
      default:
        return '#38B000';
    }
  };
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}
      edges={['right', 'left']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Farm Reports
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#AAAAAA' : '#666666' }]}>
              Activity tracking & analytics
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.generateButton, 
              { backgroundColor: '#38B000' }
            ]}
          >
            <FileText size={18} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>
              New Report
            </Text>
          </TouchableOpacity>
        </View>
        
        <LinearGradient
          colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
          style={styles.reportsOverviewCard}
        >
          <View style={styles.reportsOverviewContent}>
            <View style={styles.reportsOverviewHeader}>
              <BarChart3 size={20} color="#FFFFFF" />
              <Text style={styles.reportsOverviewTitle}>Reports Overview</Text>
            </View>
            
            <View style={styles.reportsStats}>
              <View style={styles.reportsStat}>
                <Text style={styles.reportsStatNumber}>28</Text>
                <Text style={styles.reportsStatLabel}>Total Reports</Text>
              </View>
              
              <View style={styles.reportsStat}>
                <Text style={styles.reportsStatNumber}>5</Text>
                <Text style={styles.reportsStatLabel}>This Month</Text>
              </View>
              
              <View style={styles.reportsStat}>
                <Text style={styles.reportsStatNumber}>3</Text>
                <Text style={styles.reportsStatLabel}>Scheduled</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Reports Library
          </Text>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
              onPress={() => setShowFilterOptions(!showFilterOptions)}
            >
              <Filter size={16} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.filterText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {selectedFilter}
              </Text>
              <ChevronDown size={16} color={isDark ? '#AAAAAA' : '#666666'} />
            </TouchableOpacity>
            
            {showFilterOptions && (
              <View 
                style={[
                  styles.filterOptionsContainer,
                  { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }
                ]}
              >
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      selectedFilter === option && {
                        backgroundColor: isDark ? '#3A3A3A' : '#F0F0F0'
                      }
                    ]}
                    onPress={() => {
                      setSelectedFilter(option);
                      setShowFilterOptions(false);
                    }}
                  >
                    <Text 
                      style={[
                        styles.filterOptionText,
                        { color: isDark ? '#FFFFFF' : '#333333' }
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <TouchableOpacity 
              style={[
                styles.sortButton,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
            >
              <Calendar size={16} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.sortText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Recent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.reportsContainer}>
          {reports
            .filter(report => 
              selectedFilter === 'All Reports' || report.type === selectedFilter
            )
            .map((report) => (
              <View 
                key={report.id}
                style={[
                  styles.reportCard,
                  { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
                ]}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportTitleContainer}>
                    <View 
                      style={[
                        styles.reportTypeIndicator,
                        { backgroundColor: getReportTypeColor(report.type) }
                      ]}
                    />
                    <View>
                      <Text style={[styles.reportTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                        {report.title}
                      </Text>
                      <Text style={[styles.reportMeta, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                        {report.type} • {report.date} • {report.size}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.downloadButton,
                      isDownloaded(report.id) && { backgroundColor: 'rgba(56, 176, 0, 0.1)' }
                    ]}
                    onPress={() => handleDownload(report.id)}
                    disabled={downloadingId !== null}
                  >
                    {downloadingId === report.id ? (
                      <ActivityIndicator size="small" color="#38B000" />
                    ) : isDownloaded(report.id) ? (
                      <CheckCircle2 size={20} color="#38B000" />
                    ) : (
                      <Download size={20} color={isDark ? '#AAAAAA' : '#666666'} />
                    )}
                  </TouchableOpacity>
                </View>
                
                <View style={styles.reportInsights}>
                  <Text style={[styles.insightsTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    Key Insights:
                  </Text>
                  {report.insights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <View 
                        style={[
                          styles.insightBullet,
                          { backgroundColor: getReportTypeColor(report.type) }
                        ]}
                      />
                      <Text style={[styles.insightText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                        {insight}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.reportActions}>
                  <TouchableOpacity style={styles.reportActionButton}>
                    <Share2 size={16} color={isDark ? '#AAAAAA' : '#666666'} />
                    <Text style={[styles.actionText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                      Share
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.reportActionButton}>
                    <Printer size={16} color={isDark ? '#AAAAAA' : '#666666'} />
                    <Text style={[styles.actionText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                      Print
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.reportActionButton}>
                    <Copy size={16} color={isDark ? '#AAAAAA' : '#666666'} />
                    <Text style={[styles.actionText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                      Duplicate
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
        
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333', marginTop: 16 }]}>
          Recent Farm Activities
        </Text>
        
        <View style={styles.activitiesContainer}>
          {recentActivities.map((activity) => (
            <View 
              key={activity.id}
              style={[
                styles.activityCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
            >
              <View style={styles.activityHeader}>
                <Text style={[styles.activityName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {activity.activity}
                </Text>
                <Text style={[styles.activityDate, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  {activity.date}
                </Text>
              </View>
              
              <Text style={[styles.activityLocation, { color: isDark ? '#00B4D8' : '#00B4D8' }]}>
                {activity.location}
              </Text>
              
              <Text style={[styles.activityDetails, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                {activity.details}
              </Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.viewAllActivitiesButton,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}
        >
          <Text style={[styles.viewAllText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            View All Activities
          </Text>
          <ChevronDown size={16} color={isDark ? '#AAAAAA' : '#666666'} />
        </TouchableOpacity>
        
        <View style={styles.reportSummaryContainer}>
          <LinearGradient
            colors={isDark ? ['#0F3123', '#1A2421'] : ['#F8FFEF', '#E9F5E1']}
            style={styles.reportSummaryCard}
          >
            <View style={styles.reportSummaryHeader}>
              <PieChart size={24} color={isDark ? '#FFFFFF' : '#333333'} />
              <Text style={[styles.reportSummaryTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Farm Performance Summary
              </Text>
            </View>
            
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <View 
                  style={[
                    styles.summaryStatCircle, 
                    { borderColor: '#38B000' }
                  ]}
                >
                  <Text style={styles.summaryStatValue}>+15%</Text>
                </View>
                <Text style={[styles.summaryStatLabel, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  Yield
                </Text>
              </View>
              
              <View style={styles.summaryStat}>
                <View 
                  style={[
                    styles.summaryStatCircle, 
                    { borderColor: '#00B4D8' }
                  ]}
                >
                  <Text style={styles.summaryStatValue}>-20%</Text>
                </View>
                <Text style={[styles.summaryStatLabel, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  Water
                </Text>
              </View>
              
              <View style={styles.summaryStat}>
                <View 
                  style={[
                    styles.summaryStatCircle, 
                    { borderColor: '#FFBB38' }
                  ]}
                >
                  <Text style={styles.summaryStatValue}>+12%</Text>
                </View>
                <Text style={[styles.summaryStatLabel, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  Profit
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.generateReportButton, 
                { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(56, 176, 0, 0.1)' }
              ]}
            >
              <Text style={[styles.generateReportText, { color: isDark ? '#FFFFFF' : '#38B000' }]}>
                Generate Comprehensive Report
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  reportsOverviewCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  reportsOverviewContent: {
    padding: 16,
  },
  reportsOverviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportsOverviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  reportsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportsStat: {
    alignItems: 'center',
  },
  reportsStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reportsStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  filterOptionsContainer: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 200,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterOptionText: {
    fontSize: 14,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  sortText: {
    fontSize: 14,
    marginLeft: 8,
  },
  reportsContainer: {
    paddingHorizontal: 16,
  },
  reportCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportTypeIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  reportInsights: {
    padding: 16,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  insightText: {
    fontSize: 13,
    flex: 1,
  },
  reportActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  reportActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 12,
    marginLeft: 6,
  },
  activitiesContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityDate: {
    fontSize: 12,
  },
  activityLocation: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  activityDetails: {
    fontSize: 13,
  },
  viewAllActivitiesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  reportSummaryContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  reportSummaryCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  reportSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Platform.OS === 'ios' ? undefined : '#333333',
  },
  summaryStatLabel: {
    fontSize: 14,
  },
  generateReportButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateReportText: {
    fontSize: 14,
    fontWeight: '600',
  }
}); 