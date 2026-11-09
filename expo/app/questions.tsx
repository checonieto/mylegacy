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
  Trash2,
  Volume2,
  VolumeX,
  Pencil,
} from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
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
  const [soundOn, setSoundOn] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const questionText = language === 'es' ? currentQuestion.textEs : currentQuestion.textEn;
  const currentCategory = CATEGORIES.find(cat =>
    currentQuestion.id >= cat.startIndex && currentQuestion.id <= cat.endIndex
  );
  const categoryName = currentCategory ? (language === 'es' ? currentCategory.name : t.categories[currentCategory.name as keyof typeof t.categories]) : '';

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: language === 'es' ? 'es-ES' : 'en-US',
      rate: 0.92,
      pitch: 1.0,
    });
  };

  useEffect(() => {
    const savedAnswer = answers[currentQuestion.id];
    if (savedAnswer) {
      setCurrentAnswer(savedAnswer);
    } else {
      setCurrentAnswer('');
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });

    if (soundOn) {
      // On the first question, also tell the person they can write, record, or add a photo
      const textToSpeak =
        currentQuestion.id === 1
          ? `${questionText} ${t.questions.hint}`
          : questionText;
      speak(textToSpeak);
    }

    return () => {
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const toggleSound = () => {
    if (soundOn) {
      Speech.stop();
    } else {
      speak(questionText);
    }
    setSoundOn(!soundOn);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const startRecording = async () => {
    try {
      Speech.stop();
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

        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }
                ]}
              />
            </View>
            <TouchableOpacity
              style={[styles.soundToggle, soundOn && styles.soundToggleActive]}
              onPress={toggleSound}
              activeOpacity={0.7}
              accessibilityLabel={soundOn ? t.questions.soundOn : t.questions.soundOff}
            >
              {soundOn ? (
                <Volume2 size={18} color="#FFF8EC" />
              ) : (
                <VolumeX size={18} color="#A89B88" />
              )}
            </TouchableOpacity>
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
              <Text style={styles.categoryText}>{currentCategory.icon} {categoryName}</Text>
            </View>
          )}

          <View style={styles.questionCard}>
            <Text style={styles.questionNumber}>
              {t.questions.questionLabel.replace('{{number}}', String(currentQuestion.id))}
            </Text>
            <Text style={styles.questionText}>{questionText}</Text>
            <TouchableOpacity
              style={styles.listenButton}
              onPress={() => speak(
                currentQuestion.id === 1
                  ? `${questionText} ${t.questions.hint}`
                  : questionText
              )}
              activeOpacity={0.7}
            >
              <Volume2 size={16} color="#9A7B3F" />
              <Text style={styles.listenButtonText}>{t.questions.listen}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hintCard}>
            <View style={styles.hintIconsRow}>
              <View style={styles.hintIconChip}>
                <Pencil size={16} color="#7A5C42" />
              </View>
              <View style={styles.hintIconChip}>
                <Mic size={16} color="#7A5C42" />
              </View>
              <View style={styles.hintIconChip}>
                <Camera size={16} color="#7A5C42" />
              </View>
            </View>
            <Text style={styles.hintText}>{t.questions.hint}</Text>
          </View>

          <View style={styles.answerSection}>
            <View style={styles.inputModeSelector}>
              <TouchableOpacity
                style={[styles.modeButton, inputMode === 'text' && styles.modeButtonActive]}
                onPress={() => setInputMode('text')}
              >
                <Edit3 size={20} color={inputMode === 'text' ? '#FFF8EC' : '#7A5C42'} />
                <Text style={[styles.modeButtonText, inputMode === 'text' && styles.modeButtonTextActive]}>
                  {t.questions.writeMode}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, inputMode === 'voice' && styles.modeButtonActive]}
                onPress={() => setInputMode('voice')}
              >
                <Mic size={20} color={inputMode === 'voice' ? '#FFF8EC' : '#7A5C42'} />
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
                placeholderTextColor="#A89B88"
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
                  placeholderTextColor="#A89B88"
                  value={currentAnswer}
                  onChangeText={setCurrentAnswer}
                  textAlignVertical="top"
                  editable={!isRecording && !isTranscribing}
                />

                {isTranscribing ? (
                  <View style={styles.recordButton}>
                    <ActivityIndicator size="large" color="#7A5C42" />
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
                        <Square size={32} color="#FFF8EC" fill="#FFF8EC" />
                        <Text style={styles.recordingText}>{t.questions.recording}</Text>
                      </>
                    ) : (
                      <>
                        <Mic size={32} color="#7A5C42" />
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
                    <Trash2 size={14} color="#FFF8EC" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                  activeOpacity={0.8}
                >
                  <Camera size={24} color="#7A5C42" />
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
                <LinearGradient
                  colors={['#5C4332', '#7A5C42']}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Check size={20} color="#FFF8EC" />
                  <Text style={styles.saveButtonText}>{t.questions.saveButton}</Text>
                </LinearGradient>
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
                      <Camera size={8} color="#7A5C42" />
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
            <ChevronLeft size={24} color={currentQuestionIndex === 0 ? '#D9C9AC' : '#7A5C42'} />
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
            <ChevronRight size={24} color="#7A5C42" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
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
    color: '#7A5C42',
    textAlign: 'center',
    fontWeight: '500' as const,
    fontStyle: 'italic' as const,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8DBC2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9A227',
    borderRadius: 4,
  },
  soundToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFE3CE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9C9AC',
  },
  soundToggleActive: {
    backgroundColor: '#7A5C42',
    borderColor: '#5C4332',
  },
  progressText: {
    fontSize: 14,
    color: '#7A5C42',
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
    backgroundColor: '#FFFDF7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C9A227',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryText: {
    fontSize: 14,
    color: '#7A5C42',
    fontWeight: '600' as const,
  },
  questionCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8DBC2',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 13,
    color: '#9A7B3F',
    fontWeight: '700' as const,
    marginBottom: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
  questionText: {
    fontSize: 21,
    color: '#3D2F24',
    lineHeight: 31,
    fontWeight: '600' as const,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F5EBD8',
    borderWidth: 1,
    borderColor: '#D9C9AC',
    gap: 6,
  },
  listenButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#9A7B3F',
  },
  hintCard: {
    backgroundColor: '#F5EBD8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0D0A8',
    alignItems: 'center',
  },
  hintIconsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  hintIconChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFDF7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9C9AC',
  },
  hintText: {
    fontSize: 13.5,
    color: '#7A6A55',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic' as const,
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
    borderRadius: 14,
    backgroundColor: '#FFFDF7',
    borderWidth: 2,
    borderColor: '#D9C9AC',
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: '#5C4332',
    borderColor: '#5C4332',
  },
  modeButtonText: {
    fontSize: 16,
    color: '#7A5C42',
    fontWeight: '600' as const,
  },
  modeButtonTextActive: {
    color: '#FFF8EC',
  },
  textInput: {
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: '#3D2F24',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#D9C9AC',
    lineHeight: 26,
  },
  voiceSection: {
    gap: 16,
  },
  voiceTextInput: {
    minHeight: 120,
  },
  recordButton: {
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D9C9AC',
    gap: 12,
  },
  recordingButton: {
    backgroundColor: '#B54A32',
    borderColor: '#9A3D28',
  },
  recordText: {
    fontSize: 16,
    color: '#7A5C42',
    textAlign: 'center',
  },
  recordingText: {
    fontSize: 16,
    color: '#FFF8EC',
    fontWeight: '600' as const,
  },
  transcribingText: {
    fontSize: 16,
    color: '#7A5C42',
    marginTop: 8,
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFF8EC',
    fontWeight: '600' as const,
  },
  quickNavigation: {
    marginBottom: 20,
  },
  quickNavTitle: {
    fontSize: 15,
    color: '#7A5C42',
    marginBottom: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  quickNavContent: {
    flexDirection: 'row',
    gap: 8,
  },
  quickNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFDF7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9C9AC',
    position: 'relative',
  },
  quickNavButtonActive: {
    backgroundColor: '#C9A227',
    borderColor: '#9A7B3F',
  },
  quickNavButtonAnswered: {
    backgroundColor: '#7A5C42',
    borderColor: '#5C4332',
  },
  quickNavText: {
    fontSize: 14,
    color: '#7A5C42',
    fontWeight: '600' as const,
  },
  quickNavTextActive: {
    color: '#FFF8EC',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFFDF7',
    borderTopWidth: 1,
    borderTopColor: '#E8DBC2',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#F5EBD8',
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#5C4332',
    fontWeight: '600' as const,
  },
  navButtonTextDisabled: {
    color: '#D9C9AC',
  },
  photoSection: {
    marginTop: 20,
    marginBottom: 16,
  },
  photoSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#3D2F24',
    marginBottom: 4,
  },
  photoSectionSubtitle: {
    fontSize: 14,
    color: '#7A5C42',
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
    backgroundColor: '#EFE3CE',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#B54A32',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D9C9AC',
    borderStyle: 'dashed' as const,
    gap: 8,
    alignSelf: 'flex-start',
  },
  addPhotoText: {
    fontSize: 14,
    color: '#7A5C42',
    fontWeight: '500' as const,
  },
  quickNavButtonWithPhoto: {
    borderWidth: 2,
    borderColor: '#C9A227',
  },
  photoIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFDF7',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9A227',
  },
});
