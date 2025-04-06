import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  FlatList, 
  Platform
} from 'react-native';
import { useLanguageStore, AvailableLanguage } from '../store/languageStore';
import { useThemeStore } from '../store/themeStore';
import { Check, X, Languages } from 'lucide-react-native';
import Colors from '../constants/colors';

interface LanguageSwitcherProps {
  buttonStyle?: any;
  iconSize?: number;
  showText?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  buttonStyle, 
  iconSize = 20,
  showText = false
}) => {
  const { language, setLanguage, translations: t } = useLanguageStore();
  const { isDark, primaryColor } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);
  
  // List of available languages from our type
  const availableLanguages: AvailableLanguage[] = ['English', 'Hindi', 'Kannada', 'Malayalam'];
  
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  const selectLanguage = async (selectedLanguage: AvailableLanguage) => {
    try {
      await setLanguage(selectedLanguage);
      toggleModal();
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };
  
  return (
    <>
      <TouchableOpacity
        style={[
          styles.languageButton,
          { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
          buttonStyle
        ]}
        onPress={toggleModal}
      >
        <Languages size={iconSize} color={isDark ? "#FFFFFF" : "#333333"} />
        {showText && (
          <Text style={[styles.buttonText, { color: isDark ? "#FFFFFF" : "#333333" }]}>
            {t.switchLanguage || "Switch Language"}
          </Text>
        )}
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#333333' }]}>
                {t.switchLanguage || "Switch Language"}
              </Text>
              <TouchableOpacity onPress={toggleModal}>
                <X size={24} color={isDark ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    { borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                  ]}
                  onPress={() => selectLanguage(item)}
                >
                  <Text style={{ color: isDark ? '#FFFFFF' : '#333333' }}>
                    {item}
                  </Text>
                  {language === item && (
                    <Check size={20} color={primaryColor} />
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: primaryColor }]}
              onPress={toggleModal}
            >
              <Text style={styles.closeButtonText}>{t.close || "Close"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 