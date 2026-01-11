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
    if (!str || typeof str !== 'string') return null;
    if (str.trim() === '') return null;
    try {
      const firstChar = str.trim().charAt(0);
      if (firstChar !== '{' && firstChar !== '[') {
        console.log('Invalid JSON format, clearing data');
        return null;
      }
      const parsed = JSON.parse(str);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
      return null;
    } catch (e) {
      console.error('JSON parse error:', e);
      return null;
    }
  };

  const loadData = useCallback(async () => {
    try {
      const [storedAnswers, storedPhotos, storedName] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(PHOTOS_STORAGE_KEY),
        AsyncStorage.getItem(NAME_STORAGE_KEY)
      ]);
      
      const parsedAnswers = safeJsonParse(storedAnswers);
      if (parsedAnswers) {
        setAnswers(parsedAnswers);
      } else if (storedAnswers) {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }

      const parsedPhotos = safeJsonParse(storedPhotos);
      if (parsedPhotos) {
        setPhotos(parsedPhotos);
      } else if (storedPhotos) {
        await AsyncStorage.removeItem(PHOTOS_STORAGE_KEY);
      }

      if (storedName && typeof storedName === 'string' && storedName.trim() !== '') {
        setPersonNameState(storedName);
      }
    } catch (error) {
      console.error('Error loading data:', error);
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