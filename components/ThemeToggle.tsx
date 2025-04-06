import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { Moon, Sun } from 'lucide-react-native';
import Colors from '../constants/colors';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'switch';
  label?: boolean;
}

/**
 * Theme toggle component that can be displayed in different styles.
 * 
 * @param variant - The visual style of the toggle: 'icon', 'button', or 'switch'
 * @param label - Whether to show a label text
 */
export default function ThemeToggle({ 
  variant = 'button',
  label = true
}: ThemeToggleProps) {
  const { isDark, toggleTheme, primaryColor } = useThemeStore();
  
  // Get theme colors using the Colors constant
  const textColor = isDark ? Colors.DARK.TEXT.PRIMARY : Colors.NEUTRAL.TEXT.PRIMARY;
  
  // Icon-only version
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        style={[styles.iconToggle, { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
        }]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        {isDark ? (
          <Moon size={20} color={textColor} />
        ) : (
          <Sun size={20} color={textColor} />
        )}
      </TouchableOpacity>
    );
  }
  
  // Button version
  if (variant === 'button') {
    return (
      <TouchableOpacity
        style={[styles.buttonToggle, {
          backgroundColor: isDark ? Colors.DARK.CARD : primaryColor,
        }]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        {isDark ? (
          <Moon size={18} color="#FFFFFF" style={styles.buttonIcon} />
        ) : (
          <Sun size={18} color="#FFFFFF" style={styles.buttonIcon} />
        )}
        
        {label && (
          <Text style={styles.buttonText}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
  
  // Switch version
  return (
    <View style={styles.switchContainer}>
      {label && (
        <Text style={[styles.switchLabel, { color: textColor }]}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.switchTrack,
          { backgroundColor: isDark ? Colors.DARK.BORDER : Colors.NEUTRAL.BORDER }
        ]}
        onPress={toggleTheme}
        activeOpacity={0.9}
      >
        <View 
          style={[
            styles.switchThumb,
            { 
              backgroundColor: isDark ? Colors.NEUTRAL.WHITE : primaryColor,
              transform: [{ translateX: isDark ? 20 : 0 }],
            }
          ]}
        >
          {isDark ? (
            <Moon size={14} color={Colors.DARK.BACKGROUND} />
          ) : (
            <Sun size={14} color={Colors.NEUTRAL.WHITE} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Icon toggle styles
  iconToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Button toggle styles
  buttonToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Switch toggle styles
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  switchTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 