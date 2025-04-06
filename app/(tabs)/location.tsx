import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { MapPin, Navigation, Search, List, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

// Get API key from constants or use a default one for development
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY || 'YOUR_GOOGLE_PLACES_API_KEY';

// For web, we would use a different maps library
const MapComponent = Platform.select({
  web: () => require('./components/WebMap').default,
  default: () => null,
})?.();

const { width, height } = Dimensions.get('window');

interface Place {
  id: string;
  name: string;
  distance: string;
  type: string;
}

// Default location - Hamsah Organic Farm, Bangalore, India
const DEFAULT_LOCATION = {
  latitude: 12.8425,
  longitude: 77.7214,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function LocationScreen() {
  const { isDark } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [placeName, setPlaceName] = useState('Hamsah Organic Farm, Survey No 36 & 39, Sulikunte Village, Dommasandra (P.O.), Bangalore East Taluk, Karnataka 562125, India');
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([
    { id: '1', name: 'Local Market', distance: '2.3 km', type: 'market' },
    { id: '2', name: 'Agricultural Supply Store', distance: '5.1 km', type: 'store' },
    { id: '3', name: 'Farmer Cooperative', distance: '7.8 km', type: 'cooperative' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const placesRef = useRef(null);

  // Get the current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Get the current location using geolocation API
  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      if (navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              setLocation({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              // Fetch the place name from coordinates
              fetchPlaceNameFromCoords(latitude, longitude);
            },
            error => {
              console.error('Error getting location:', error);
              setError('Unable to get your current location. Using default location.');
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );
        } catch (err) {
          console.error('Geolocation error:', err);
          setError('Location services error. Using default location.');
        }
      } else {
        setError('Geolocation is not supported by this browser. Using default location.');
      }
    } else {
      // For mobile, you would use Expo Location here
      // This is just a placeholder for now
      setError('Location services not implemented for this platform yet. Using default location.');
    }
  };

  // Fetch place name from coordinates using reverse geocoding
  const fetchPlaceNameFromCoords = async (latitude: number, longitude: number) => {
    try {
      if (GOOGLE_PLACES_API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY') {
        setPlaceName('Simulated Farm Location');
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results?.length > 0) {
        setPlaceName(data.results[0].formatted_address);
      } else {
        setPlaceName('Location found');
      }
    } catch (err) {
      console.error('Error fetching place name:', err);
      setPlaceName('Location found');
    }
  };

  const handleLocationSelect = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    try {
      if (details && details.geometry && details.geometry.location) {
        setLocation({
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setPlaceName(data.description || 'Selected Location');
        setSearchVisible(false);
        
        // Fetch nearby agricultural places
        fetchNearbyPlaces(details.geometry.location.lat, details.geometry.location.lng);
      } else {
        throw new Error('Invalid location data');
      }
    } catch (err) {
      console.error('Error selecting location:', err);
      setError('Failed to select location. Please try again.');
    }
  };

  // Fetch nearby agricultural places
  const fetchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // In dev mode with no API key, use mock data
      if (GOOGLE_PLACES_API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY') {
        setTimeout(() => {
          // Mock data
          setNearbyPlaces([
            { id: '1', name: 'Local Market', distance: '1.8 km', type: 'market' },
            { id: '2', name: 'Agricultural Store', distance: '3.5 km', type: 'store' },
            { id: '3', name: 'Farmer Cooperative', distance: '4.2 km', type: 'cooperative' },
            { id: '4', name: 'Seed Supplier', distance: '6.1 km', type: 'supplier' },
          ]);
          setLoading(false);
        }, 1500);
        return;
      }

      // In a real app, you would use Google Places API to fetch nearby places
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=store&keyword=agricultural&key=${GOOGLE_PLACES_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results?.length > 0) {
        const places = data.results.map((place: any, index: number) => ({
          id: place.place_id || String(index),
          name: place.name,
          distance: `${(place.distance / 1000).toFixed(1)} km`,
          type: place.types[0].replace('_', ' '),
        }));
        
        setNearbyPlaces(places);
      } else {
        // Fallback to mock data if no results
        setNearbyPlaces([
          { id: '1', name: 'Local Market', distance: '2.3 km', type: 'market' },
          { id: '2', name: 'Agricultural Supply Store', distance: '5.1 km', type: 'store' },
          { id: '3', name: 'Farmer Cooperative', distance: '7.8 km', type: 'cooperative' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching nearby places:', err);
      setError('Failed to fetch nearby places. Please try again.');
      // Fallback to mock data
      setNearbyPlaces([
        { id: '1', name: 'Local Market', distance: '2.3 km', type: 'market' },
        { id: '2', name: 'Agricultural Supply Store', distance: '5.1 km', type: 'store' },
        { id: '3', name: 'Farmer Cooperative', distance: '7.8 km', type: 'cooperative' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F9FA' }]}>
      <LinearGradient
        colors={isDark ? ['#1A2421', '#0F3123'] : ['#E9F5E1', '#F8FFEF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Farm Location</Text>
            <Text style={styles.headerSubtitle}>Find & manage your locations</Text>
          </View>
          
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setSearchVisible(true)}
          >
            <Search size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: isDark ? 'rgba(255, 82, 82, 0.1)' : 'rgba(255, 82, 82, 0.05)' }]}>
          <Text style={[styles.errorText, { color: isDark ? '#FF5252' : '#D32F2F' }]}>
            {error}
          </Text>
        </View>
      )}
      
      {MapComponent && (
        <View style={styles.mapContainer}>
          <MapComponent
            location={location}
            onRegionChange={setLocation}
          />
          <View style={[styles.locationNameContainer, { backgroundColor: isDark ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
            <MapPin size={18} color="#38B000" />
            <Text style={[styles.locationName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
              {placeName}
            </Text>
          </View>
        </View>
      )}
      
      {!MapComponent && (
        <View style={[styles.mapPlaceholder, { backgroundColor: isDark ? '#1A1A1A' : '#E0E0E0' }]}>
          <Text style={{ color: isDark ? '#FFFFFF' : '#333333' }}>
            Google Maps not available on this platform
          </Text>
        </View>
      )}
      
      <View style={[styles.nearbyContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={[styles.nearbyTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
          Nearby Agricultural Services
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#38B000" style={styles.loader} />
        ) : (
          <View style={styles.placesList}>
            {nearbyPlaces.map((place) => (
              <View 
                key={place.id} 
                style={[
                  styles.placeItem, 
                  { borderBottomColor: isDark ? '#2D2D2D' : '#F0F0F0' }
                ]}
              >
                <View style={styles.placeInfo}>
                  <Text style={[styles.placeName, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                    {place.name}
                  </Text>
                  <Text style={[styles.placeDetails, { color: isDark ? '#AAAAAA' : '#666666' }]}>
                    {place.type} • {place.distance}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.navigateButton}
                  onPress={() => {
                    // In a real app, this would open the navigation app
                    Alert.alert('Navigation', `Directions to ${place.name}`);
                  }}
                >
                  <Navigation size={20} color="#38B000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.findMoreButton, { backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0' }]}
          onPress={() => fetchNearbyPlaces(location.latitude, location.longitude)}
        >
          <Text style={{ color: isDark ? '#FFFFFF' : '#333333' }}>
            Find More Agricultural Services
          </Text>
        </TouchableOpacity>
      </View>
      
      {searchVisible && (
        <View style={styles.searchOverlay}>
          <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.searchHeader}>
              <Text style={[styles.searchTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                Search Location
              </Text>
              <TouchableOpacity onPress={() => setSearchVisible(false)}>
                <X size={24} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </View>
            
            <GooglePlacesAutocomplete
              ref={placesRef}
              placeholder='Enter location'
              onPress={handleLocationSelect}
              fetchDetails={true}
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: 'en',
              }}
              styles={{
                container: {
                  flex: 0,
                  marginTop: 10,
                },
                textInputContainer: {
                  backgroundColor: isDark ? '#2D2D2D' : '#F0F0F0',
                  borderRadius: 8,
                  padding: 5,
                },
                textInput: {
                  height: 50,
                  color: isDark ? '#FFFFFF' : '#333333',
                  fontSize: 16,
                  backgroundColor: 'transparent',
                },
                predefinedPlacesDescription: {
                  color: '#1faadb',
                },
                listView: {
                  backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                },
                row: {
                  backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                },
                description: {
                  color: isDark ? '#FFFFFF' : '#333333',
                },
              }}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    margin: 15,
    marginBottom: 0,
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  mapContainer: {
    height: height * 0.3,
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: height * 0.3,
    margin: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationNameContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  nearbyContainer: {
    flex: 1,
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nearbyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loader: {
    marginVertical: 20,
  },
  placesList: {
    flex: 1,
  },
  placeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  placeDetails: {
    fontSize: 14,
  },
  navigateButton: {
    padding: 10,
  },
  findMoreButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchContainer: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
    maxHeight: height * 0.7,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
}); 