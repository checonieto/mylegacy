import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, ChevronLeft, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLegacy } from '@/providers/LegacyProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { LanguageToggle } from '@/components/LanguageToggle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { personName, setPersonName, getProgress } = useLegacy();
  const { t } = useLanguage();
  const [inputName, setInputName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const progress = getProgress();

  const handleStart = () => {
    if (!personName) {
      setShowNameInput(true);
    } else {
      router.push('/questions' as any);
    }
  };

  const handleStartWithName = () => {
    if (inputName.trim()) {
      setPersonName(inputName.trim());
      setShowNameInput(false);
      router.push('/questions' as any);
    }
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setCurrentSlide(index);
  };

  const handleNext = () => {
    if (currentSlide < 2) {
      goToSlide(currentSlide + 1);
    } else {
      handleStart();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentSlide(slideIndex);
  };

  if (showNameInput) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#E8E8E8', '#D0D0D0']}
          style={styles.gradient}
        >
          <View style={styles.languageToggleContainer}>
            <LanguageToggle />
          </View>
          
          <View style={styles.nameInputContainer}>
            <View style={styles.nameInputCard}>
              <BookOpen size={60} color="#6B5D4F" style={styles.nameInputIcon} />
              <Text style={styles.nameInputTitle}>{t.welcome.title}</Text>
              <Text style={styles.nameInputPrompt}>{t.welcome.namePrompt}</Text>
              <TextInput
                style={styles.nameInput}
                placeholder={t.welcome.namePlaceholder}
                placeholderTextColor="#999999"
                value={inputName}
                onChangeText={setInputName}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.nameInputButton, !inputName.trim() && styles.nameInputButtonDisabled]}
                onPress={handleStartWithName}
                disabled={!inputName.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={inputName.trim() ? ['#6B5D4F', '#8B7355'] : ['#CCCCCC', '#AAAAAA']}
                  style={styles.nameInputButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nameInputButtonText}>{t.welcome.nameButton}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const renderSlide1 = () => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={styles.slideCard}>
          <Text style={styles.slideTitle}>{t.welcome.welcomeTitle}</Text>
          <ScrollView 
            style={styles.slideScrollView}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <Text style={styles.slideText}>{t.welcome.welcomeText1}</Text>
            <Text style={styles.slideText}>{t.welcome.welcomeText2}</Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );

  const renderSlide2 = () => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={styles.slideCard}>
          <Text style={styles.slideTitle}>{t.welcome.whoCanFillTitle}</Text>
          <ScrollView 
            style={styles.slideScrollView}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <Text style={styles.slideText}>{t.welcome.whoCanFillText}</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{t.welcome.bullet1}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{t.welcome.bullet2}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{t.welcome.bullet3}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );

  const renderSlide3 = () => (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={styles.slideCard}>
          <Text style={styles.slideTitle}>{t.welcome.howToUseTitle}</Text>
          <ScrollView 
            style={styles.slideScrollView}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>1.</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.welcome.step1Title}</Text>
                <Text style={styles.stepText}>{t.welcome.step1Text}</Text>
              </View>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>2.</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.welcome.step2Title}</Text>
                <Text style={styles.stepText}>{t.welcome.step2Text}</Text>
              </View>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>3.</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.welcome.step3Title}</Text>
                <Text style={styles.stepText}>{t.welcome.step3Text}</Text>
              </View>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>4.</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.welcome.step4Title}</Text>
                <Text style={styles.stepText}>{t.welcome.step4Text}</Text>
              </View>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>5.</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.welcome.step5Title}</Text>
                <Text style={styles.stepText}>{t.welcome.step5Text}</Text>
              </View>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>6.</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t.welcome.step6Title}</Text>
                <Text style={styles.stepText}>{t.welcome.step6Text}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8E8E8', '#D0D0D0']}
        style={styles.gradient}
      >
        <View style={styles.languageToggleContainer}>
          <LanguageToggle />
        </View>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <BookOpen size={50} color="#6B5D4F" />
          </View>
          
          <View style={styles.elderlyIconsRow}>
            <View style={styles.elderlyIconContainer}>
              <View style={styles.elderlyIconBadge}>
                <User size={28} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <View style={styles.elderlyGlassesContainer}>
                <View style={styles.elderlyGlassesLens} />
                <View style={styles.elderlyGlassesBridge} />
                <View style={styles.elderlyGlassesLens} />
              </View>
            </View>
            <View style={styles.elderlyIconContainer}>
              <View style={[styles.elderlyIconBadge, styles.elderlyIconFemale]}>
                <User size={28} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <View style={styles.elderlyHairBun} />
            </View>
          </View>
          
          <Text style={styles.title}>{t.welcome.title}</Text>
          <Text style={styles.subtitle}>{t.welcome.subtitle}</Text>
        </View>

        <View style={styles.carouselHeader}>
          <Text style={styles.carouselTitle}>{t.welcome.carouselTitle}</Text>
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={index}
                onPress={() => goToSlide(index)}
                style={[
                  styles.dot,
                  currentSlide === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.carousel}
          contentContainerStyle={styles.carouselContent}
        >
          {renderSlide1()}
          {renderSlide2()}
          {renderSlide3()}
        </ScrollView>

        <View style={styles.navigationContainer}>
          <View style={styles.navButtonsRow}>
            {currentSlide > 0 ? (
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
                activeOpacity={0.7}
              >
                <ChevronLeft size={20} color="#6B5D4F" />
                <Text style={styles.navButtonText}>{t.welcome.carouselPrevious}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.navButtonPlaceholder} />
            )}

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleStart}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>{t.welcome.carouselSkip}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>
                {currentSlide === 2 ? t.welcome.carouselStart : t.welcome.carouselNext}
              </Text>
              <ChevronRight size={20} color="#6B5D4F" />
            </TouchableOpacity>
          </View>
        </View>

        {progress.answered > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>{t.welcome.progressTitle}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(progress.answered / progress.total) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {t.welcome.progressText
                  .replace('{{answered}}', String(progress.answered))
                  .replace('{{total}}', String(progress.total))}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => router.push('/questions' as any)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6B5D4F', '#8B7355']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>{t.welcome.continueButton}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
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
  languageToggleContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elderlyIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  elderlyIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  elderlyIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7B8D9E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  elderlyIconFemale: {
    backgroundColor: '#B8907A',
  },
  elderlyGlassesContainer: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  elderlyGlassesLens: {
    width: 10,
    height: 8,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#3A3A3A',
    backgroundColor: 'rgba(200, 220, 255, 0.3)',
  },
  elderlyGlassesBridge: {
    width: 4,
    height: 1.5,
    backgroundColor: '#3A3A3A',
  },
  elderlyHairBun: {
    position: 'absolute',
    top: -4,
    width: 18,
    height: 12,
    borderRadius: 9,
    backgroundColor: '#E8E0D8',
    borderWidth: 1,
    borderColor: '#D0C8C0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold' as const,
    color: '#4A4A4A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B5D4F',
    textAlign: 'center',
    lineHeight: 22,
  },
  carouselHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#8B7355',
    marginBottom: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CCCCCC',
  },
  dotActive: {
    backgroundColor: '#6B5D4F',
    width: 24,
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    flexGrow: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },
  slideContent: {
    flex: 1,
  },
  slideCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#8B7355',
    flex: 1,
    maxHeight: '100%',
  },
  slideScrollView: {
    flex: 1,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#4A4A4A',
    marginBottom: 16,
    textAlign: 'center',
  },
  slideText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 23,
    marginBottom: 12,
    textAlign: 'justify',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: 'bold' as const,
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    flex: 1,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#8B7355',
    marginRight: 10,
    marginTop: 2,
    minWidth: 18,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginBottom: 2,
  },
  stepText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 19,
  },
  navigationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
    justifyContent: 'center',
  },
  navButtonPlaceholder: {
    width: 100,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#6B5D4F',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 15,
    color: '#999999',
    fontWeight: '500' as const,
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B7355',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#6B5D4F',
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: 'white',
  },
  nameInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  nameInputCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  nameInputIcon: {
    marginBottom: 20,
  },
  nameInputTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#4A4A4A',
    marginBottom: 24,
    textAlign: 'center',
  },
  nameInputPrompt: {
    fontSize: 18,
    color: '#6B5D4F',
    marginBottom: 20,
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#4A4A4A',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginBottom: 24,
    textAlign: 'center',
  },
  nameInputButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nameInputButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  nameInputButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  nameInputButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: 'white',
  },
});
