import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Heart, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLegacy } from '@/providers/LegacyProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function WelcomeScreen() {
  const router = useRouter();
  const { personName, setPersonName, getProgress } = useLegacy();
  const { t } = useLanguage();
  const [inputName, setInputName] = React.useState('');
  const [showNameInput, setShowNameInput] = React.useState(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8E8E8', '#D0D0D0']}
        style={styles.gradient}
      >
        <View style={styles.languageToggleContainer}>
          <LanguageToggle />
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <BookOpen size={60} color="#6B5D4F" />
            </View>
            <Text style={styles.title}>{t.welcome.title}</Text>
            <Text style={styles.subtitle}>
              {t.welcome.subtitle}
            </Text>
          </View>

          <View style={styles.introductionContainer}>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>{t.welcome.thanksTitle}</Text>
              <Text style={styles.introText}>
                {t.welcome.thanksText1}
              </Text>
              <Text style={styles.introText}>
                {t.welcome.thanksText2}
              </Text>
            </View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>{t.welcome.welcomeTitle}</Text>
              <Text style={styles.introText}>
                {t.welcome.welcomeText1}
              </Text>
              <Text style={styles.introText}>
                {t.welcome.welcomeText2}
              </Text>
            </View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>{t.welcome.whoCanFillTitle}</Text>
              <Text style={styles.introText}>{t.welcome.whoCanFillText}</Text>
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
            </View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>{t.welcome.howToUseTitle}</Text>
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
            </View>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Heart size={32} color="#8B7355" />
              <Text style={styles.featureTitle}>{t.welcome.feature1Title}</Text>
              <Text style={styles.featureText}>
                {t.welcome.feature1Text}
              </Text>
            </View>

            <View style={styles.feature}>
              <Users size={32} color="#8B7355" />
              <Text style={styles.featureTitle}>{t.welcome.feature2Title}</Text>
              <Text style={styles.featureText}>
                {t.welcome.feature2Text}
              </Text>
            </View>
          </View>

          {progress.answered > 0 && (
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
          )}

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6B5D4F', '#8B7355']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>
                {progress.answered > 0 ? t.welcome.continueButton : t.welcome.startButton}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {progress.answered > 0 && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/review' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>{t.welcome.viewAnswersButton}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t.welcome.footerQuote}
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#4A4A4A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B5D4F',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  introductionContainer: {
    marginBottom: 32,
  },
  introCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#8B7355',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#4A4A4A',
    marginBottom: 16,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#8B7355',
    fontWeight: 'bold' as const,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
    flex: 1,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 8,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#8B7355',
    marginRight: 12,
    marginTop: 2,
    minWidth: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 21,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  feature: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginTop: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#6B5D4F',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B7355',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B5D4F',
  },
  startButton: {
    marginBottom: 16,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: 'white',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#8B7355',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#6B5D4F',
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  footerText: {
    fontSize: 16,
    color: '#6B5D4F',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
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
