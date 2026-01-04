import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  ChevronRight, 
  Mic, 
  Square,
  Edit3,
  Check,
  Camera,
  Trash2
} from 'lucide-react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useLegacy } from '@/providers/LegacyProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { QUESTIONS, CATEGORIES } from '@/constants/questions';
import * as Haptics from 'expo-haptics';

export default function QuestionsScreen() {
  const router = useRouter();
  const { answers, photos, personName, saveAnswer, savePhoto, removePhoto } = useLegacy();
  const { t, language } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const scrollViewRef = useRef<ScrollView>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentCategory = CATEGORIES.find(cat => 
    currentQuestionIndex >= cat.startIndex && currentQuestionIndex <= cat.endIndex
  );

  useEffect(() => {
    const savedAnswer = answers[currentQuestion.id];
    if (savedAnswer) {
      setCurrentAnswer(savedAnswer);
    } else {
      setCurrentAnswer('');
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentQuestionIndex, answers, currentQuestion.id]);

  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.questions.micPermissionTitle, t.questions.micPermissionMessage);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert(t.questions.micPermissionTitle, t.questions.recordError);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      setIsRecording(false);
      setIsTranscribing(true);
      
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      if (!uri) {
        throw new Error('No recording URI');
      }

      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('audio', blob, 'recording.webm');
      } else {
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        const audioFile: any = {
          uri,
          name: `recording.${fileType}`,
          type: `audio/${fileType}`,
        };
        
        formData.append('audio', audioFile);
      }
      
      formData.append('language', language);

      const transcriptionResponse = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error('Transcription failed');
      }

      const { text } = await transcriptionResponse.json();
      
      if (text) {
        setCurrentAnswer(prevAnswer => 
          prevAnswer ? `${prevAnswer} ${text}` : text
        );
      }
      
      setRecording(null);
      setIsTranscribing(false);
    } catch (err) {
      console.error('Failed to stop recording or transcribe', err);
      Alert.alert(t.questions.micPermissionTitle, t.questions.transcribeError);
      setRecording(null);
      setIsTranscribing(false);
    }
  };

  const handleSaveAnswer = () => {
    if (currentAnswer.trim()) {
      saveAnswer(currentQuestion.id, currentAnswer.trim());
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleAddPhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t.questions.micPermissionTitle, t.questions.galleryPermissionMessage);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        savePhoto(currentQuestion.id, base64Image);
        if (Platform.OS !== 'web') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert(t.questions.micPermissionTitle, t.questions.photoError);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      t.questions.removePhotoTitle,
      t.questions.removePhotoMessage,
      [
        { text: t.questions.cancel, style: 'cancel' },
        { 
          text: t.questions.remove, 
          style: 'destructive',
          onPress: () => {
            removePhoto(currentQuestion.id);
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
          }
        }
      ]
    );
  };

  const handleNext = () => {
    handleSaveAnswer();
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      Alert.alert(
        t.questions.finishedTitle,
        t.questions.finishedMessage,
        [
          { text: t.questions.stayHere, style: 'cancel' },
          { text: t.questions.viewAnswers, onPress: () => router.push('/review' as any) }
        ]
      );
    }
  };

  const handlePrevious = () => {
    handleSaveAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    handleSaveAnswer();
    setCurrentQuestionIndex(index);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#E8E8E8', '#D0D0D0']}
        style={styles.gradient}
      >
        {personName && (
          <View style={styles.nameHeader}>
            <Text style={styles.nameHeaderText}>
              {t.questions.recordingFor} {personName}
            </Text>
          </View>
        )}
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {t.questions.title
              .replace('{{current}}', String(currentQuestionIndex + 1))
              .replace('{{total}}', String(QUESTIONS.length))}
          </Text>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentCategory && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentCategory.icon} {currentCategory.name}</Text>
            </View>
          )}

          <View style={styles.questionCard}>
            <Text style={styles.questionNumber}>
              {t.questions.questionLabel.replace('{{number}}', String(currentQuestion.id))}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          <View style={styles.answerSection}>
            <View style={styles.inputModeSelector}>
              <TouchableOpacity
                style={[styles.modeButton, inputMode === 'text' && styles.modeButtonActive]}
                onPress={() => setInputMode('text')}
              >
                <Edit3 size={20} color={inputMode === 'text' ? 'white' : '#6B5D4F'} />
                <Text style={[styles.modeButtonText, inputMode === 'text' && styles.modeButtonTextActive]}>
                  {t.questions.writeMode}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, inputMode === 'voice' && styles.modeButtonActive]}
                onPress={() => setInputMode('voice')}
              >
                <Mic size={20} color={inputMode === 'voice' ? 'white' : '#6B5D4F'} />
                <Text style={[styles.modeButtonText, inputMode === 'voice' && styles.modeButtonTextActive]}>
                  {t.questions.recordMode}
                </Text>
              </TouchableOpacity>
            </View>

            {inputMode === 'text' ? (
              <TextInput
                style={styles.textInput}
                multiline
                placeholder={t.questions.placeholder}
                placeholderTextColor="#999999"
                value={currentAnswer}
                onChangeText={setCurrentAnswer}
                textAlignVertical="top"
              />
            ) : (
              <View style={styles.voiceSection}>
                <TextInput
                  style={[styles.textInput, styles.voiceTextInput]}
                  multiline
                  placeholder={t.questions.voicePlaceholder}
                  placeholderTextColor="#999999"
                  value={currentAnswer}
                  onChangeText={setCurrentAnswer}
                  textAlignVertical="top"
                  editable={!isRecording && !isTranscribing}
                />
                
                {isTranscribing ? (
                  <View style={styles.recordButton}>
                    <ActivityIndicator size="large" color="#6B5D4F" />
                    <Text style={styles.transcribingText}>{t.questions.transcribing}</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.recordButton, isRecording && styles.recordingButton]}
                    onPress={isRecording ? stopRecording : startRecording}
                    activeOpacity={0.8}
                  >
                    {isRecording ? (
                      <>
                        <Square size={32} color="white" fill="white" />
                        <Text style={styles.recordingText}>{t.questions.recording}</Text>
                      </>
                    ) : (
                      <>
                        <Mic size={32} color="#6B5D4F" />
                        <Text style={styles.recordText}>{t.questions.recordPrompt}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.photoSection}>
              <Text style={styles.photoSectionTitle}>{t.questions.photoTitle}</Text>
              <Text style={styles.photoSectionSubtitle}>
                {t.questions.photoSubtitle}
              </Text>
              
              {photos[currentQuestion.id] ? (
                <View style={styles.photoContainer}>
                  <Image 
                    source={{ uri: photos[currentQuestion.id] }} 
                    style={styles.photoPreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={handleRemovePhoto}
                    activeOpacity={0.8}
                  >
                    <Trash2 size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                  activeOpacity={0.8}
                >
                  <Camera size={24} color="#6B5D4F" />
                  <Text style={styles.addPhotoText}>{t.questions.addPhoto}</Text>
                </TouchableOpacity>
              )}
            </View>

            {currentAnswer.trim() && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAnswer}
                activeOpacity={0.8}
              >
                <Check size={20} color="white" />
                <Text style={styles.saveButtonText}>{t.questions.saveButton}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.quickNavigation}>
            <Text style={styles.quickNavTitle}>{t.questions.quickNav}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickNavContent}
            >
              {QUESTIONS.map((q, index) => (
                <TouchableOpacity
                  key={q.id}
                  style={[
                    styles.quickNavButton,
                    index === currentQuestionIndex && styles.quickNavButtonActive,
                    answers[q.id] && styles.quickNavButtonAnswered,
                    photos[q.id] && styles.quickNavButtonWithPhoto
                  ]}
                  onPress={() => handleQuestionSelect(index)}
                >
                  <Text style={[
                    styles.quickNavText,
                    index === currentQuestionIndex && styles.quickNavTextActive
                  ]}>
                    {q.id}
                  </Text>
                  {photos[q.id] && (
                    <View style={styles.photoIndicator}>
                      <Camera size={8} color="#6B5D4F" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft size={24} color={currentQuestionIndex === 0 ? '#CCCCCC' : '#6B5D4F'} />
            <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
              {t.questions.previous}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
              {currentQuestionIndex === QUESTIONS.length - 1 ? t.questions.finish : t.questions.next}
            </Text>
            <ChevronRight size={24} color="#6B5D4F" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  gradient: {
    flex: 1,
  },
  nameHeader: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  nameHeaderText: {
    fontSize: 14,
    color: '#6B5D4F',
    textAlign: 'center',
    fontWeight: '500' as const,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#CCCCCC',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B7355',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#6B5D4F',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  categoryBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B5D4F',
    fontWeight: '600' as const,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 20,
    color: '#4A4A4A',
    lineHeight: 30,
    fontWeight: '500' as const,
  },
  answerSection: {
    marginBottom: 24,
  },
  inputModeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: '#6B5D4F',
    borderColor: '#6B5D4F',
  },
  modeButtonText: {
    fontSize: 16,
    color: '#6B5D4F',
    fontWeight: '600' as const,
  },
  modeButtonTextActive: {
    color: 'white',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: '#4A4A4A',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    lineHeight: 26,
  },
  voiceSection: {
    gap: 16,
  },
  voiceTextInput: {
    minHeight: 120,
  },
  recordButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    gap: 12,
  },
  recordingButton: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  recordText: {
    fontSize: 16,
    color: '#6B5D4F',
    textAlign: 'center',
  },
  recordingText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600' as const,
  },
  transcribingText: {
    fontSize: 16,
    color: '#6B5D4F',
    marginTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#6B5D4F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600' as const,
  },
  quickNavigation: {
    marginBottom: 20,
  },
  quickNavTitle: {
    fontSize: 16,
    color: '#6B5D4F',
    marginBottom: 12,
    fontWeight: '600' as const,
  },
  quickNavContent: {
    flexDirection: 'row',
    gap: 8,
  },
  quickNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    position: 'relative',
  },
  quickNavButtonActive: {
    backgroundColor: '#6B5D4F',
    borderColor: '#6B5D4F',
  },
  quickNavButtonAnswered: {
    backgroundColor: '#8B7355',
    borderColor: '#8B7355',
  },
  quickNavText: {
    fontSize: 14,
    color: '#6B5D4F',
    fontWeight: '600' as const,
  },
  quickNavTextActive: {
    color: 'white',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#6B5D4F',
    fontWeight: '600' as const,
  },
  navButtonTextDisabled: {
    color: '#CCCCCC',
  },
  photoSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginBottom: 4,
  },
  photoSectionSubtitle: {
    fontSize: 14,
    color: '#6B5D4F',
    marginBottom: 12,
  },
  photoContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  photoPreview: {
    width: 120,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    gap: 8,
    alignSelf: 'flex-start',
  },
  addPhotoText: {
    fontSize: 14,
    color: '#6B5D4F',
    fontWeight: '500' as const,
  },
  quickNavButtonWithPhoto: {
    borderWidth: 2,
    borderColor: '#6B5D4F',
  },
  photoIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B5D4F',
  },
});
