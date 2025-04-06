import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { 
  Sprout, 
  Search, 
  Leaf, 
  Bug, 
  Info, 
  Clock, 
  Zap, 
  ShieldCheck, 
  ThumbsUp,
  Star,
  Camera
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Sample fertilizer recommendations
const fertilizerRecommendations = [
  {
    id: 1,
    name: 'NPK 14-14-14 Complex',
    type: 'Chemical',
    description: 'Balanced fertilizer suitable for most crops. Contains equal parts of Nitrogen, Phosphorous, and Potassium.',
    recommendation: 'Apply 25kg per acre, evenly distributed.',
    suitableFor: ['Rice', 'Wheat', 'Corn'],
    rating: 4.8,
    price: '₹850 per 50kg'
  },
  {
    id: 2,
    name: 'Organic Vermicompost',
    type: 'Organic',
    description: 'Nutrient-rich natural fertilizer produced by earthworms. Improves soil structure and water retention.',
    recommendation: 'Apply 2-3 tons per acre before planting.',
    suitableFor: ['Vegetables', 'Fruits', 'Ornamentals'],
    rating: 4.6,
    price: '₹400 per 40kg'
  },
  {
    id: 3,
    name: 'Urea (46-0-0)',
    type: 'Chemical',
    description: 'High nitrogen fertilizer for leafy growth. Critical for vegetative phase of plant growth.',
    recommendation: 'Apply 10kg per acre in split doses.',
    suitableFor: ['Rice', 'Sugarcane', 'Maize'],
    rating: 4.4,
    price: '₹750 per 50kg'
  }
];

// Sample pesticide recommendations
const pesticideRecommendations = [
  {
    id: 1,
    name: 'Neem Oil Extract',
    type: 'Organic',
    description: 'Natural pesticide effective against a wide range of insects and fungal diseases.',
    recommendation: 'Mix 5ml per liter of water and spray biweekly.',
    targetPests: ['Aphids', 'Whiteflies', 'Mealybugs'],
    safetyPeriod: '1 day',
    rating: 4.7,
    price: '₹320 per liter'
  },
  {
    id: 2,
    name: 'Chlorpyrifos 20% EC',
    type: 'Chemical',
    description: 'Broad-spectrum insecticide effective against soil insects and many foliar pests.',
    recommendation: 'Mix 2ml per liter of water, maximum 2 applications per season.',
    targetPests: ['Termites', 'Borers', 'Cutworms'],
    safetyPeriod: '15 days',
    rating: 4.2,
    price: '₹450 per liter'
  },
  {
    id: 3,
    name: 'Bacillus thuringiensis (Bt)',
    type: 'Biological',
    description: 'Microbial insecticide that targets caterpillars and doesn\'t harm beneficial insects.',
    recommendation: 'Mix 1g per liter of water and spray when caterpillars are young.',
    targetPests: ['Caterpillars', 'Loopers', 'Borers'],
    safetyPeriod: 'None',
    rating: 4.5,
    price: '₹280 per 500g'
  }
];

export default function FertilizerPesticideScreen() {
  const { isDark } = useThemeStore();
  const [activeTab, setActiveTab] = useState('fertilizer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Rice');
  
  const cropOptions = ['Rice', 'Wheat', 'Cotton', 'Vegetables', 'Fruits', 'Corn', 'Sugarcane'];
  
  const filteredFertilizers = searchQuery 
    ? fertilizerRecommendations.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.suitableFor.some(crop => crop.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : fertilizerRecommendations.filter(item => selectedCrop ? item.suitableFor.includes(selectedCrop) : true);
    
  const filteredPesticides = searchQuery 
    ? pesticideRecommendations.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetPests.some(pest => pest.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : pesticideRecommendations;
    
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Organic':
        return '#38B000';
      case 'Chemical':
        return '#FF7B67';
      case 'Biological':
        return '#00B4D8';
      default:
        return '#9747FF';
    }
  };
  
  const renderFertilizers = () => (
    <View style={styles.recommendationsContainer}>
      {filteredFertilizers.map((item) => (
        <View 
          key={item.id}
          style={[
            styles.recommendationCard, 
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}
        >
          <View style={styles.recommendationHeader}>
            <View 
              style={[
                styles.typeTag, 
                { backgroundColor: getTypeColor(item.type) }
              ]}
            >
              <Text style={styles.typeTagText}>{item.type}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFBB38" fill="#FFBB38" />
              <Text style={[styles.ratingText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                {item.rating}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.recommendationName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {item.name}
          </Text>
          
          <Text style={[styles.recommendationDescription, { color: isDark ? '#CCCCCC' : '#555555' }]}>
            {item.description}
          </Text>
          
          <View style={styles.recommendationDetails}>
            <View style={styles.detailItem}>
              <Info size={14} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                {item.recommendation}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Sprout size={14} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                Suitable for: {item.suitableFor.join(', ')}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Zap size={14} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                Price: {item.price}
              </Text>
            </View>
          </View>
          
          <View style={styles.recommendationActions}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { backgroundColor: '#38B000' }
              ]}
            >
              <Text style={styles.actionButtonText}>Buy Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
              ]}
            >
              <Text style={[styles.actionButtonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                More Info
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
  
  const renderPesticides = () => (
    <View style={styles.recommendationsContainer}>
      {filteredPesticides.map((item) => (
        <View 
          key={item.id}
          style={[
            styles.recommendationCard, 
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}
        >
          <View style={styles.recommendationHeader}>
            <View 
              style={[
                styles.typeTag, 
                { backgroundColor: getTypeColor(item.type) }
              ]}
            >
              <Text style={styles.typeTagText}>{item.type}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFBB38" fill="#FFBB38" />
              <Text style={[styles.ratingText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                {item.rating}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.recommendationName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            {item.name}
          </Text>
          
          <Text style={[styles.recommendationDescription, { color: isDark ? '#CCCCCC' : '#555555' }]}>
            {item.description}
          </Text>
          
          <View style={styles.recommendationDetails}>
            <View style={styles.detailItem}>
              <Info size={14} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                {item.recommendation}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Bug size={14} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                Targets: {item.targetPests.join(', ')}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={14} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                Safety Period: {item.safetyPeriod}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Zap size={14} color={isDark ? '#AAAAAA' : '#666666'} />
              <Text style={[styles.detailText, { color: isDark ? '#CCCCCC' : '#555555' }]}>
                Price: {item.price}
              </Text>
            </View>
          </View>
          
          <View style={styles.recommendationActions}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { backgroundColor: '#38B000' }
              ]}
            >
              <Text style={styles.actionButtonText}>Buy Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
              ]}
            >
              <Text style={[styles.actionButtonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                More Info
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}
      edges={['right', 'left']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              AI Recommendations
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#AAAAAA' : '#666666' }]}>
              Fertilizers & Pesticides
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.cameraButton, 
              { backgroundColor: '#38B000' }
            ]}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.cameraButtonText}>Analyze</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[
          styles.searchContainer, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <Search size={20} color={isDark ? '#AAAAAA' : '#666666'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#333333' }]}
            placeholder="Search by name, type, or crop..."
            placeholderTextColor={isDark ? '#777777' : '#999999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton,
              activeTab === 'fertilizer' && styles.activeTabButton,
              { 
                backgroundColor: isDark 
                  ? activeTab === 'fertilizer' ? '#38B000' : '#1E1E1E' 
                  : activeTab === 'fertilizer' ? '#38B000' : '#FFFFFF' 
              }
            ]}
            onPress={() => setActiveTab('fertilizer')}
          >
            <Leaf 
              size={18} 
              color={activeTab === 'fertilizer' ? '#FFFFFF' : (isDark ? '#AAAAAA' : '#666666')} 
            />
            <Text 
              style={[
                styles.tabText,
                { 
                  color: activeTab === 'fertilizer' 
                    ? '#FFFFFF' 
                    : (isDark ? '#FFFFFF' : '#333333') 
                }
              ]}
            >
              Fertilizers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tabButton,
              activeTab === 'pesticide' && styles.activeTabButton,
              { 
                backgroundColor: isDark 
                  ? activeTab === 'pesticide' ? '#38B000' : '#1E1E1E' 
                  : activeTab === 'pesticide' ? '#38B000' : '#FFFFFF' 
              }
            ]}
            onPress={() => setActiveTab('pesticide')}
          >
            <Bug 
              size={18} 
              color={activeTab === 'pesticide' ? '#FFFFFF' : (isDark ? '#AAAAAA' : '#666666')} 
            />
            <Text 
              style={[
                styles.tabText,
                { 
                  color: activeTab === 'pesticide' 
                    ? '#FFFFFF' 
                    : (isDark ? '#FFFFFF' : '#333333') 
                }
              ]}
            >
              Pesticides
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'fertilizer' && (
          <>
            <View style={styles.cropSelectionContainer}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Select Your Crop
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cropOptionsContainer}
              >
                {cropOptions.map((crop) => (
                  <TouchableOpacity
                    key={crop}
                    style={[
                      styles.cropOption,
                      selectedCrop === crop && styles.selectedCropOption,
                      { 
                        backgroundColor: isDark 
                          ? selectedCrop === crop ? '#38B000' : '#1E1E1E' 
                          : selectedCrop === crop ? '#38B000' : '#FFFFFF' 
                      }
                    ]}
                    onPress={() => setSelectedCrop(crop)}
                  >
                    <Text 
                      style={[
                        styles.cropOptionText,
                        { 
                          color: selectedCrop === crop 
                            ? '#FFFFFF' 
                            : (isDark ? '#FFFFFF' : '#333333') 
                        }
                      ]}
                    >
                      {crop}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <LinearGradient
              colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
              style={styles.aiTipCard}
            >
              <View style={styles.aiTipContent}>
                <ThumbsUp size={24} color="#FFFFFF" />
                <View style={styles.aiTipTextContainer}>
                  <Text style={styles.aiTipTitle}>Smart Fertilizer Tip</Text>
                  <Text style={styles.aiTipDescription}>
                    For {selectedCrop} crops, applying NPK fertilizer in split doses can improve nutrient uptake efficiency. First application during sowing and second during vegetative growth.
                  </Text>
                </View>
              </View>
            </LinearGradient>
            
            {renderFertilizers()}
          </>
        )}
        
        {activeTab === 'pesticide' && (
          <>
            <LinearGradient
              colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
              style={styles.aiTipCard}
            >
              <View style={styles.aiTipContent}>
                <ShieldCheck size={24} color="#FFFFFF" />
                <View style={styles.aiTipTextContainer}>
                  <Text style={styles.aiTipTitle}>Safe Application Reminder</Text>
                  <Text style={styles.aiTipDescription}>
                    Always wear protective gear when applying pesticides. Apply during early morning or late afternoon to minimize drift and protect beneficial insects like bees.
                  </Text>
                </View>
              </View>
            </LinearGradient>
            
            {renderPesticides()}
          </>
        )}
        
        <TouchableOpacity 
          style={[
            styles.customAnalysisButton,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
          ]}
        >
          <Text style={[styles.customAnalysisText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
            Request Custom Analysis for Your Farm
          </Text>
        </TouchableOpacity>
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
  cameraButton: {
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
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    paddingVertical: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  activeTabButton: {
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  cropSelectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cropOptionsContainer: {
    paddingHorizontal: 16,
  },
  cropOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  selectedCropOption: {
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cropOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  aiTipCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
  },
  aiTipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTipTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  aiTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiTipDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  recommendationsContainer: {
    paddingHorizontal: 16,
  },
  recommendationCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  recommendationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  recommendationActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customAnalysisButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
  customAnalysisText: {
    fontSize: 16,
    fontWeight: '600',
  }
}); 