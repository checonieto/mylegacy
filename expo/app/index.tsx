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
import { BookOpen, ChevronRight, ChevronLeft, User, Sparkles } from 'lucide-react-native';
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
          colors={['#FBF5EA', '#F0E4D0']}
          style={styles.gradient}
        >
          <View style={styles.languageToggleContainer}>
            <LanguageToggle />
          </View>

          <View style={styles.nameInputContainer}>
            <View style={styles.nameInputCard}>
              <View style={styles.nameInputIconWrap}>
                <BookOpen size={44} color="#FFF8EC" />
              </View>
              <Text style={styles.nameInputTitle}>{t.welcome.title}</Text>
              <View style={styles.ornamentRow}>
                <View style={styles.ornamentLine} />
                <Sparkles size={16} color="#C9A227" />
                <View style={styles.ornamentLine} />
              </View>
              <Text style={styles.nameInputPrompt}>{t.welcome.namePrompt}</Text>
              <TextInput
                style={styles.nameInput}
                placeholder={t.welcome.namePlaceholder}
                placeholderTextColor="#A89B88"
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
                  colors={inputName.trim() ? ['#5C4332', '#7A5C42'] : ['#C9BBA8', '#B5A58F']}
                  style={styles.nameInputButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.nameInputButtonText}>{t.welcome.nameButton}</Text>
                  <ChevronRight size={18} color="#FFF8EC" />
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
          <View style={styles.slideCardHeader}>
            <BookOpen size={22} color="#C9A227" />
          </View>
          <Text style={styles.slideTitle}>{t.welcome.welcomeTitle}</Text>
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Sparkles size={14} color="#C9A227" />
            <View style={styles.ornamentLine} />
          </View>
          <ScrollView
            style={styles.slideScrollView}
            showsVerticalScrollIndicator={false}
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
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Sparkles size={14} color="#C9A227" />
            <View style={styles.ornamentLine} />
          </View>
          <ScrollView
            style={styles.slideScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <Text style={styles.slideText}>{t.welcome.whoCanFillText}</Text>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>❧</Text>
              <Text style={styles.bulletText}>{t.welcome.bullet1}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>❧</Text>
              <Text style={styles.bulletText}>{t.welcome.bullet2}</Text>
            </View>
            <View style={styles.bulletPoint}>
              <Text style={styles.bullet}>❧</Text>
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
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Sparkles size={14} color="#C9A227" />
            <View style={styles.ornamentLine} />
          </View>
          <ScrollView
            style={styles.slideScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {[
              { n: '1', title: t.welcome.step1Title, text: t.welcome.step1Text },
              { n: '2', title: t.welcome.step2Title, text: t.welcome.step2Text },
              { n: '3', title: t.welcome.step3Title, text: t.welcome.step3Text },
              { n: '4', title: t.welcome.step4Title, text: t.welcome.step4Text },
              { n: '5', title: t.welcome.step5Title, text: t.welcome.step5Text },
              { n: '6', title: t.welcome.step6Title, text: t.welcome.step6Text },
            ].map((step) => (
              <View key={step.n} style={styles.stepContainer}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{step.n}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FBF5EA', '#F0E4D0']}
        style={styles.gradient}
      >
        <View style={styles.languageToggleContainer}>
          <LanguageToggle />
        </View>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#5C4332', '#7A5C42']}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <BookOpen size={40} color="#FFF8EC" />
            </LinearGradient>
          </View>

          <View style={styles.elderlyIconsRow}>
            <View style={styles.elderlyIconContainer}>
              <View style={styles.elderlyIconBadge}>
                <User size={26} color="#FFF8EC" strokeWidth={2.5} />
              </View>
              <View style={styles.elderlyGlassesContainer}>
                <View style={styles.elderlyGlassesLens} />
                <View style={styles.elderlyGlassesBridge} />
                <View style={styles.elderlyGlassesLens} />
              </View>
            </View>
            <View style={styles.elderlyDivider} />
            <View style={styles.elderlyIconContainer}>
              <View style={[styles.elderlyIconBadge, styles.elderlyIconFemale]}>
                <User size={26} color="#FFF8EC" strokeWidth={2.5} />
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
                <ChevronLeft size={20} color="#5C4332" />
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
              <ChevronRight size={20} color="#5C4332" />
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
                colors={['#5C4332', '#7A5C42']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>{t.welcome.continueButton}</Text>
                <ChevronRight size={20} color="#FFF8EC" />
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
    backgroundColor: '#FBF5EA',
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
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  iconGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#C9A227',
    justifyContent: 'center',
    alignItems: 'center',
  },
  elderlyIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 14,
  },
  elderlyIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  elderlyIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7A6A55',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  elderlyIconFemale: {
    backgroundColor: '#B07A5A',
  },
  elderlyDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#D9C9AC',
  },
  elderlyGlassesContainer: {
    position: 'absolute',
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  elderlyGlassesLens: {
    width: 11,
    height: 9,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#FFF8EC',
    backgroundColor: 'rgba(255, 248, 236, 0.2)',
  },
  elderlyGlassesBridge: {
    width: 5,
    height: 2,
    backgroundColor: '#FFF8EC',
  },
  elderlyHairBun: {
    position: 'absolute',
    top: -5,
    width: 18,
    height: 12,
    borderRadius: 9,
    backgroundColor: '#F0E4D0',
    borderWidth: 1,
    borderColor: '#D9C9AC',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold' as const,
    color: '#3D2F24',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#7A6A55',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic' as const,
  },
  carouselHeader: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  carouselTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#9A7B3F',
    marginBottom: 10,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#D9C9AC',
  },
  dotActive: {
    backgroundColor: '#C9A227',
    width: 26,
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
    backgroundColor: '#FFFDF7',
    borderRadius: 22,
    padding: 24,
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8DBC2',
    flex: 1,
    maxHeight: '100%',
  },
  slideCardHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  slideScrollView: {
    flex: 1,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#3D2F24',
    marginBottom: 8,
    textAlign: 'center',
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  ornamentLine: {
    width: 40,
    height: 1,
    backgroundColor: '#C9A227',
    opacity: 0.5,
  },
  slideText: {
    fontSize: 15,
    color: '#5A4C3E',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 16,
    color: '#C9A227',
    fontWeight: 'bold' as const,
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: '#5A4C3E',
    lineHeight: 23,
    flex: 1,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#C9A227',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#FFFDF7',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#3D2F24',
    marginBottom: 2,
  },
  stepText: {
    fontSize: 13,
    color: '#7A6A55',
    lineHeight: 19,
  },
  navigationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
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
    backgroundColor: '#FFFDF7',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D9C9AC',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 104,
    justifyContent: 'center',
  },
  navButtonPlaceholder: {
    width: 104,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#5C4332',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 15,
    color: '#A89B88',
    fontWeight: '500' as const,
    textDecorationLine: 'underline' as const,
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  progressCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8DBC2',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#3D2F24',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EFE3CE',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9A227',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#7A6A55',
  },
  continueButton: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 28,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFF8EC',
  },
  nameInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  nameInputCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 26,
    padding: 36,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DBC2',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  nameInputIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#5C4332',
    borderWidth: 3,
    borderColor: '#C9A227',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  nameInputTitle: {
    fontSize: 26,
    fontWeight: 'bold' as const,
    color: '#3D2F24',
    marginBottom: 12,
    textAlign: 'center',
  },
  nameInputPrompt: {
    fontSize: 18,
    color: '#7A6A55',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  nameInput: {
    width: '100%',
    backgroundColor: '#FBF5EA',
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    color: '#3D2F24',
    borderWidth: 2,
    borderColor: '#D9C9AC',
    marginBottom: 24,
    textAlign: 'center',
  },
  nameInputButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  nameInputButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFF8EC',
  },
});
