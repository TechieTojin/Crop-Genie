import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

// Type definitions for Google Maps API
declare global {
  interface Window {
    initMap: () => void;
    google: {
      maps: {
        Map: any;
        Marker: any;
        Animation: {
          DROP: any;
        };
      };
    };
  }
}

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Props {
  location?: Region;
  onRegionChange?: (region: Region) => void;
}

// Default location - Hamsah Organic Farm, Bangalore, India
const DEFAULT_LOCATION: Region = {
  latitude: 12.8425,
  longitude: 77.7214,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Check for Google Maps API key
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY || '';

export default function WebMap({ location = DEFAULT_LOCATION, onRegionChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    
    const loadMap = () => {
      try {
        // Create script tag to load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.defer = true;
        script.async = true;
        
        // Define global init function for callback
        window.initMap = () => {
          if (!mapRef.current) return;
          
          try {
            const mapOptions = {
              center: { lat: location.latitude, lng: location.longitude },
              zoom: 12,
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: false,
            };
            
            const map = new window.google.maps.Map(mapRef.current, mapOptions);
            
            // Add a marker for the current location
            const marker = new window.google.maps.Marker({
              position: { lat: location.latitude, lng: location.longitude },
              map: map,
              title: 'Your Location',
              animation: window.google.maps.Animation.DROP,
            });
            
            // Add event listener for map movements
            map.addListener('center_changed', () => {
              const center = map.getCenter();
              if (center && onRegionChange) {
                onRegionChange({
                  latitude: center.lat(),
                  longitude: center.lng(),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                });
              }
            });
            
            setMapLoaded(true);
          } catch (err) {
            console.error('Error initializing map:', err);
            setError('Failed to initialize map');
          }
        };
        
        // Handle errors
        script.onerror = () => {
          setError('Failed to load Google Maps');
        };
        
        document.head.appendChild(script);
      } catch (err) {
        console.error('Error loading map:', err);
        setError('Failed to load map');
      }
    };
    
    loadMap();
    
    // Cleanup on unmount
    return () => {
      if (window.initMap) {
        window.initMap = () => {};
      }
    };
  }, []);
  
  // Update map when location changes
  useEffect(() => {
    if (!mapLoaded || Platform.OS !== 'web' || !window.google || !mapRef.current) return;
    
    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 12,
      });
      
      // Add a marker for the current location
      const marker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        title: 'Your Location',
      });
    } catch (err) {
      console.error('Error updating map:', err);
    }
  }, [location, mapLoaded]);
  
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>
            Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '12px',
            overflow: 'hidden' 
          }} 
        />
      ) : (
        <View style={styles.mapOverlay}>
          <Text style={styles.mapText}>Google Maps</Text>
          <Text style={styles.coordinatesText}>
            Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E3DF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666666',
  },
}); 