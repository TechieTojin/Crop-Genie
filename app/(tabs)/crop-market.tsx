import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ArrowRight, 
  Map, 
  ChevronRight,
  BarChart, 
  BadgeDollarSign,
  Coins
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Sample market data
const marketData = [
  { 
    id: 1,
    crop: 'Rice',
    variety: 'Basmati',
    currentPrice: 48.5,
    previousPrice: 45.2,
    trend: 'up',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 2,
    crop: 'Tomato',
    variety: 'Roma',
    currentPrice: 35.0,
    previousPrice: 40.5,
    trend: 'down',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 3,
    crop: 'Cotton',
    variety: 'Long-staple',
    currentPrice: 78.5,
    previousPrice: 72.8,
    trend: 'up',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1594228730474-7e93f432d660?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 4,
    crop: 'Corn',
    variety: 'Sweet',
    currentPrice: 22.4,
    previousPrice: 21.9,
    trend: 'up',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1601593768799-76766c47a6e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  { 
    id: 5,
    crop: 'Wheat',
    variety: 'Durum',
    currentPrice: 28.8,
    previousPrice: 30.2,
    trend: 'down',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1c5a1ec21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
];

// Sample buyer opportunities
const buyerOpportunities = [
  {
    id: 1,
    name: 'Organic Produce Co.',
    looking: 'Certified Organic Vegetables',
    price: 'Premium +15%',
    distance: '12 km',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Green Harvest Exports',
    looking: 'Rice and Wheat (Bulk)',
    price: 'Market Rate',
    distance: '28 km',
    rating: 4.5
  },
  {
    id: 3,
    name: 'FreshDirect Market',
    looking: 'Tomatoes and Peppers',
    price: 'Premium +8%',
    distance: '5 km',
    rating: 4.6
  },
];

// Sample local markets
const localMarkets = [
  {
    id: 1,
    name: 'Rajendra Farmer Market',
    distance: '3.2 km',
    openHours: '6:00 AM - 2:00 PM',
    activeVendors: 42
  },
  {
    id: 2,
    name: 'Krishna Rural Marketplace',
    distance: '8.5 km',
    openHours: '5:30 AM - 1:00 PM',
    activeVendors: 75
  },
  {
    id: 3,
    name: 'Indira Gandhi Wholesale Center',
    distance: '12.1 km',
    openHours: '4:00 AM - 11:00 AM',
    activeVendors: 120
  },
];

export default function CropMarketScreen() {
  const { isDark } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  
  const getPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };
  
  const filteredMarketData = searchQuery 
    ? marketData.filter(item => 
        item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.variety.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : marketData;
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}
      edges={['right', 'left']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Crop Market
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#AAAAAA' : '#666666' }]}>
              Price insights & selling opportunities
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.marketAnalysisButton, 
              { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
            ]}
          >
            <BarChart size={20} color="#38B000" />
            <Text style={[styles.marketAnalysisText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              Analysis
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[
          styles.searchContainer, 
          { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <Search size={20} color={isDark ? '#AAAAAA' : '#666666'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : '#333333' }]}
            placeholder="Search crops, varieties, markets..."
            placeholderTextColor={isDark ? '#777777' : '#999999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <LinearGradient
          colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
          style={styles.priceAlertCard}
        >
          <View style={styles.priceAlertContent}>
            <Coins size={24} color="#FFFFFF" />
            <View style={styles.priceAlertTextContainer}>
              <Text style={styles.priceAlertTitle}>Today's Highest Price</Text>
              <Text style={styles.priceAlertCrop}>Cotton (Long-staple)</Text>
              <Text style={styles.priceAlertPrice}>₹78.50 / kg</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.priceAlertButton}>
            <Text style={styles.priceAlertButtonText}>Set Alert</Text>
          </TouchableOpacity>
        </LinearGradient>
        
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          Current Market Prices
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.cropCardsContainer}
        >
          {filteredMarketData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.cropCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
                selectedCrop === item.id && { borderColor: '#38B000', borderWidth: 2 }
              ]}
              onPress={() => setSelectedCrop(item.id === selectedCrop ? null : item.id)}
            >
              <View style={styles.cropImageContainer}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.cropImage}
                />
                <View 
                  style={[
                    styles.trendBadge,
                    { backgroundColor: item.trend === 'up' ? '#38B000' : '#FF7B67' }
                  ]}
                >
                  {item.trend === 'up' ? (
                    <TrendingUp size={14} color="#FFFFFF" />
                  ) : (
                    <TrendingDown size={14} color="#FFFFFF" />
                  )}
                </View>
              </View>
              
              <Text style={[styles.cropName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {item.crop}
              </Text>
              <Text style={[styles.cropVariety, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                {item.variety}
              </Text>
              
              <View style={styles.priceContainer}>
                <Text style={[styles.currentPrice, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  ₹{item.currentPrice} / {item.unit}
                </Text>
                <Text 
                  style={[
                    styles.priceChange,
                    { 
                      color: item.trend === 'up' ? '#38B000' : '#FF7B67' 
                    }
                  ]}
                >
                  {item.trend === 'up' ? '+' : ''}{getPercentageChange(item.currentPrice, item.previousPrice)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          Buyer Opportunities
        </Text>
        
        <View style={styles.opportunitiesContainer}>
          {buyerOpportunities.map((buyer) => (
            <TouchableOpacity
              key={buyer.id}
              style={[
                styles.buyerCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
            >
              <View style={styles.buyerHeader}>
                <View style={styles.buyerInfo}>
                  <Text style={[styles.buyerName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {buyer.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text 
                        key={star} 
                        style={[
                          styles.ratingStar,
                          { color: star <= Math.floor(buyer.rating) ? '#FFBB38' : '#CCCCCC' }
                        ]}
                      >
                        ★
                      </Text>
                    ))}
                    <Text style={[styles.ratingText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                      {buyer.rating}
                    </Text>
                  </View>
                </View>
                <BadgeDollarSign size={24} color="#38B000" />
              </View>
              
              <View style={styles.buyerDetails}>
                <View style={styles.buyerDetailItem}>
                  <Text style={[styles.buyerDetailLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                    Looking for:
                  </Text>
                  <Text style={[styles.buyerDetailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {buyer.looking}
                  </Text>
                </View>
                
                <View style={styles.buyerDetailItem}>
                  <Text style={[styles.buyerDetailLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                    Offered Price:
                  </Text>
                  <Text style={[styles.buyerDetailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {buyer.price}
                  </Text>
                </View>
                
                <View style={styles.buyerDetailItem}>
                  <Text style={[styles.buyerDetailLabel, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                    Distance:
                  </Text>
                  <Text style={[styles.buyerDetailValue, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {buyer.distance}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Buyer</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={[styles.viewAllText, { color: isDark ? '#00B4D8' : '#00B4D8' }]}>
              View all buyer opportunities
            </Text>
            <ChevronRight size={16} color="#00B4D8" />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          Nearby Markets
        </Text>
        
        <View style={styles.marketsContainer}>
          {localMarkets.map((market) => (
            <TouchableOpacity
              key={market.id}
              style={[
                styles.marketCard,
                { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }
              ]}
            >
              <View style={styles.marketInfo}>
                <Text style={[styles.marketName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  {market.name}
                </Text>
                <Text style={[styles.marketDistance, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  <Map size={14} color={isDark ? '#AAAAAA' : '#666666'} style={{ marginRight: 4 }} /> {market.distance}
                </Text>
              </View>
              
              <View style={styles.marketDetails}>
                <Text style={[styles.marketDetailText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Hours: {market.openHours}
                </Text>
                <Text style={[styles.marketDetailText, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                  Active Vendors: {market.activeVendors}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.marketButton, { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }]}
              >
                <Text style={[styles.marketButtonText, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                  View Market
                </Text>
                <ArrowRight size={16} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.sellCropsButton,
            { backgroundColor: '#38B000' }
          ]}
        >
          <ShoppingCart size={20} color="#FFFFFF" />
          <Text style={styles.sellCropsButtonText}>
            Sell Your Crops
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
  marketAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  marketAnalysisText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
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
  priceAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  priceAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceAlertTextContainer: {
    marginLeft: 12,
  },
  priceAlertTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  priceAlertCrop: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  priceAlertPrice: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
  priceAlertButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  priceAlertButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cropCardsContainer: {
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  cropCard: {
    width: 160,
    marginHorizontal: 8,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cropImageContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  cropImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cropVariety: {
    fontSize: 12,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  opportunitiesContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  buyerCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buyerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  buyerInfo: {
    flex: 1,
  },
  buyerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingStar: {
    fontSize: 14,
    marginRight: 1,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  buyerDetails: {
    marginBottom: 12,
  },
  buyerDetailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  buyerDetailLabel: {
    fontSize: 12,
    width: 90,
  },
  buyerDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  contactButton: {
    backgroundColor: '#38B000',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  marketsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  marketCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  marketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  marketName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketDistance: {
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketDetails: {
    marginBottom: 12,
  },
  marketDetailText: {
    fontSize: 12,
    marginBottom: 4,
  },
  marketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  marketButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  sellCropsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sellCropsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 