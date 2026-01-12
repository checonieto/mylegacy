import { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { QUESTIONS } from '@/constants/questions';

interface LegacyContextType {
  answers: Record<number, string>;
  photos: Record<number, string>;
  personName: string;
  saveAnswer: (questionId: number, answer: string) => void;
  savePhoto: (questionId: number, photo: string) => void;
  removePhoto: (questionId: number) => void;
  setPersonName: (name: string) => void;
  clearAnswers: () => void;
  getProgress: () => { answered: number; total: number };
}

const STORAGE_KEY = 'legacy_answers';
const PHOTOS_STORAGE_KEY = 'legacy_photos';
const NAME_STORAGE_KEY = 'legacy_person_name';

export const [LegacyProvider, useLegacy] = createContextHook<LegacyContextType>(() => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const [personName, setPersonNameState] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  const safeJsonParse = (str: string | null): Record<number, string> | null => {
    if (str === null || str === undefined) return null;
    if (typeof str !== 'string') return null;
    
    const trimmed = str.trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return null;
    
    try {
      const firstChar = trimmed.charAt(0);
      const lastChar = trimmed.charAt(trimmed.length - 1);
      
      if (firstChar === '{' && lastChar === '}') {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } else if (firstChar === '[' && lastChar === ']') {
        if (trimmed.includes('object Object')) {
          console.log('Detected corrupted array data, clearing');
          return null;
        }
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed as unknown as Record<number, string>;
        }
      }
      
      console.log('Invalid JSON structure:', trimmed.substring(0, 50));
      return null;
    } catch (e) {
      console.error('JSON parse error:', e, 'Data preview:', str?.substring(0, 100));
      return null;
    }
  };

  const loadData = useCallback(async () => {
    try {
      let storedAnswers: string | null = null;
      let storedPhotos: string | null = null;
      let storedName: string | null = null;
      
      try {
        storedAnswers = await AsyncStorage.getItem(STORAGE_KEY);
      } catch (e) {
        console.error('Error reading answers:', e);
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      }
      
      try {
        storedPhotos = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
      } catch (e) {
        console.error('Error reading photos:', e);
        await AsyncStorage.removeItem(PHOTOS_STORAGE_KEY).catch(() => {});
      }
      
      try {
        storedName = await AsyncStorage.getItem(NAME_STORAGE_KEY);
      } catch (e) {
        console.error('Error reading name:', e);
        await AsyncStorage.removeItem(NAME_STORAGE_KEY).catch(() => {});
      }
      
      const parsedAnswers = safeJsonParse(storedAnswers);
      if (parsedAnswers) {
        setAnswers(parsedAnswers);
      } else if (storedAnswers && storedAnswers.trim() !== '') {
        console.log('Removing corrupted answers data');
        await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      }

      const parsedPhotos = safeJsonParse(storedPhotos);
      if (parsedPhotos) {
        setPhotos(parsedPhotos);
      } else if (storedPhotos && storedPhotos.trim() !== '') {
        console.log('Removing corrupted photos data');
        await AsyncStorage.removeItem(PHOTOS_STORAGE_KEY).catch(() => {});
      }

      if (storedName && typeof storedName === 'string' && storedName.trim() !== '' && !storedName.includes('object Object')) {
        setPersonNameState(storedName);
      } else if (storedName) {
        console.log('Removing corrupted name data');
        await AsyncStorage.removeItem(NAME_STORAGE_KEY).catch(() => {});
      }
    } catch (error) {
      console.error('Error loading data:', error);
      try {
        await AsyncStorage.multiRemove([STORAGE_KEY, PHOTOS_STORAGE_KEY, NAME_STORAGE_KEY]);
      } catch (clearError) {
        console.error('Error clearing corrupted data:', clearError);
      }
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isLoaded) return;
    
    const saveToStorage = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(answers)),
          AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos)),
          AsyncStorage.setItem(NAME_STORAGE_KEY, personName)
        ]);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    
    saveToStorage();
  }, [answers, photos, personName, isLoaded]);

  const saveAnswer = useCallback((questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const savePhoto = useCallback((questionId: number, photo: string) => {
    setPhotos(prev => ({
      ...prev,
      [questionId]: photo
    }));
  }, []);

  const removePhoto = useCallback((questionId: number) => {
    setPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[questionId];
      return newPhotos;
    });
  }, []);

  const setPersonName = useCallback((name: string) => {
    setPersonNameState(name);
  }, []);

  const clearAnswers = useCallback(async () => {
    setAnswers({});
    setPhotos({});
    setPersonNameState('');
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEY),
        AsyncStorage.removeItem(PHOTOS_STORAGE_KEY),
        AsyncStorage.removeItem(NAME_STORAGE_KEY)
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }, []);

  const getProgress = useCallback(() => {
    const answered = Object.keys(answers).filter(key => {
      const keyStr = String(key);
      return keyStr.trim() && answers[Number(key)];
    }).length;
    return {
      answered,
      total: QUESTIONS.length
    };
  }, [answers]);

  return useMemo(() => ({
    answers,
    photos,
    personName,
    saveAnswer,
    savePhoto,
    removePhoto,
    setPersonName,
    clearAnswers,
    getProgress
  }), [answers, photos, personName, saveAnswer, savePhoto, removePhoto, setPersonName, clearAnswers, getProgress]);
});