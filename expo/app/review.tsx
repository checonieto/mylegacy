import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Edit3, Check, X, FileText, Camera, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLegacy } from '@/providers/LegacyProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { QUESTIONS, CATEGORIES } from '@/constants/questions';
import * as Haptics from 'expo-haptics';

export default function ReviewScreen() {
  const router = useRouter();
  const { answers, photos, personName, saveAnswer, clearAnswers, getProgress } = useLegacy();
  const { t, language } = useLanguage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const progress = getProgress();

  const handleEdit = (questionId: number) => {
    setEditingId(questionId);
    setEditText(answers[questionId] || '');
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSaveEdit = () => {
    if (editingId !== null && editText.trim()) {
      saveAnswer(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleGeneratePDF = () => {
    if (progress.answered === 0) {
      Alert.alert(
        t.pdf.noAnswersTitle,
        t.pdf.noAnswersMessage,
        [{ text: t.pdf.ok }]
      );
      return;
    }

    if (progress.answered < progress.total) {
      Alert.alert(
        t.pdf.incompleteTitle,
        t.pdf.incompleteMessage
          .replace('{{answered}}', String(progress.answered))
          .replace('{{total}}', String(progress.total)),
        [
          { text: t.questions.cancel, style: 'cancel' },
          { text: t.pdf.generateButton, onPress: () => router.push('/pdf' as any) }
        ]
      );
    } else {
      router.push('/pdf' as any);
    }
  };

  const handleStartNewStory = () => {
    Alert.alert(
      t.pdf.startNewTitle,
      t.pdf.startNewMessage,
      [
        { text: t.questions.cancel, style: 'cancel' },
        { 
          text: t.pdf.ok, 
          style: 'destructive',
          onPress: async () => {
            await clearAnswers();
            if (Platform.OS !== 'web') {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FBF5EA', '#F0E4D0']}
        style={styles.gradient}
      >
        {personName && (
          <View style={styles.nameHeader}>
            <Text style={styles.nameHeaderText}>
              {t.questions.recordingFor} {personName}
            </Text>
          </View>
        )}
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t.review.title}</Text>
            <Text style={styles.subtitle}>
              {t.review.subtitle
                .replace('{{answered}}', String(progress.answered))
                .replace('{{total}}', String(progress.total))}
            </Text>
          </View>

          {CATEGORIES.map(category => {
            const categoryQuestions = QUESTIONS.filter(
              q => q.id >= category.startIndex && q.id <= category.endIndex
            );
            const hasAnswers = categoryQuestions.some(q => answers[q.id]);
            
            if (!hasAnswers) return null;

            return (
              <View key={category.name} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{language === 'es' ? category.name : t.categories[category.name as keyof typeof t.categories]}</Text>
                </View>

                {categoryQuestions.map(question => {
                  const answer = answers[question.id];
                  if (!answer && editingId !== question.id) return null;
                  const questionText = language === 'es' ? question.textEs : question.textEn;

                  return (
                    <View key={question.id} style={styles.questionCard}>
                      <View style={styles.questionHeader}>
                        <Text style={styles.questionNumber}>
                          {t.questions.questionLabel.replace('{{number}}', String(question.id))}
                        </Text>
                        {editingId !== question.id && (
                          <TouchableOpacity
                            onPress={() => handleEdit(question.id)}
                            style={styles.editButton}
                          >
                            <Edit3 size={18} color="#6B5D4F" />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      <Text style={styles.questionText}>{questionText}</Text>
                      
                      {editingId === question.id ? (
                        <View style={styles.editSection}>
                          <TextInput
                            style={styles.editInput}
                            multiline
                            value={editText}
                            onChangeText={setEditText}
                            placeholder={t.review.placeholderEdit}
                            placeholderTextColor="#999999"
                            textAlignVertical="top"
                          />
                          <View style={styles.editActions}>
                            <TouchableOpacity
                              style={styles.saveEditButton}
                              onPress={handleSaveEdit}
                            >
                              <Check size={20} color="white" />
                              <Text style={styles.saveEditText}>{t.review.save}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.cancelEditButton}
                              onPress={handleCancelEdit}
                            >
                              <X size={20} color="#6B5D4F" />
                              <Text style={styles.cancelEditText}>{t.questions.cancel}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <Text style={styles.answerText}>
                            {answer || t.review.noAnswer}
                          </Text>
                          {photos[question.id] && (
                            <View style={styles.photoContainer}>
                              <View style={styles.photoHeader}>
                                <Camera size={16} color="#6B5D4F" />
                                <Text style={styles.photoLabel}>{t.review.photoLabel}</Text>
                              </View>
                              <Image 
                                source={{ uri: photos[question.id] }} 
                                style={styles.photoPreview}
                                resizeMode="cover"
                              />
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}

          {progress.answered === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t.review.emptyState}
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push('/questions')}
              >
                <Text style={styles.startButtonText}>{t.review.startNow}</Text>
              </TouchableOpacity>
            </View>
          )}

          {progress.answered > 0 && (
            <TouchableOpacity
              style={styles.startNewButton}
              onPress={handleStartNewStory}
              activeOpacity={0.8}
            >
              <RefreshCw size={20} color="#B54A32" />
              <Text style={styles.startNewButtonText}>{t.pdf.startNewButton}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGeneratePDF}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5C4332', '#7A5C42']}
              style={styles.generateGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <FileText size={24} color="white" />
              <Text style={styles.generateButtonText}>{t.review.generateButton}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5EA',
  },
  gradient: {
    flex: 1,
  },
  nameHeader: {
    backgroundColor: '#FFFDF7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E8DBC2',
  },
  nameHeaderText: {
    fontSize: 14,
    color: '#6B5D4F',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#4A4A4A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B5D4F',
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#4A4A4A',
  },
  questionCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8DBC2',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '600' as const,
  },
  editButton: {
    padding: 4,
  },
  questionText: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 24,
    fontWeight: '500' as const,
    marginBottom: 12,
  },
  answerText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  editSection: {
    marginTop: 12,
  },
  editInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#4A4A4A',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    lineHeight: 24,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  saveEditButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#6B5D4F',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveEditText: {
    color: 'white',
    fontWeight: '600' as const,
    fontSize: 14,
  },
  cancelEditButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    gap: 6,
  },
  cancelEditText: {
    color: '#6B5D4F',
    fontWeight: '600' as const,
    fontSize: 14,
  },
  startNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#B54A32',
    gap: 8,
    marginTop: 32,
    marginBottom: 20,
    backgroundColor: '#FFFDF7',
  },
  startNewButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#B54A32',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6B5D4F',
    marginBottom: 24,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#6B5D4F',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFDF7',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8DBC2',
  },
  generateButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  generateGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: 'white',
  },
  photoContainer: {
    marginTop: 16,
  },
  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  photoLabel: {
    fontSize: 14,
    color: '#6B5D4F',
    fontWeight: '500' as const,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
});
