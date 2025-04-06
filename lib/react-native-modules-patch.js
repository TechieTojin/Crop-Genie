// This file is used to provide compatible modules for web

import React from 'react';
import * as RNW from 'react-native-web';

// Patch for missing modules on web
const Image = RNW.Image;
const ImageBackground = RNW.ImageBackground;
const Text = RNW.Text;
const View = RNW.View;
const TouchableOpacity = RNW.TouchableOpacity;
const ScrollView = RNW.ScrollView;
const StyleSheet = RNW.StyleSheet;
const Platform = RNW.Platform;

// Export them for module resolution
export {
  Image,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform
};

// Default for wildcard imports
export default {
  Image,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform
}; 