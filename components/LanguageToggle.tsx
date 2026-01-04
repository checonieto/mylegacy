import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '@/providers/LanguageProvider';
import { Globe } from 'lucide-react-native';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <Globe size={16} color="#6B5D4F" style={styles.icon} />
      <TouchableOpacity
        style={[styles.button, language === 'es' && styles.activeButton]}
        onPress={() => setLanguage('es')}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, language === 'es' && styles.activeText]}>ES</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, language === 'en' && styles.activeButton]}
        onPress={() => setLanguage('en')}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, language === 'en' && styles.activeText]}>EN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginLeft: 8,
    marginRight: 4,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: '#6B5D4F',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B5D4F',
  },
  activeText: {
    color: 'white',
  },
});
