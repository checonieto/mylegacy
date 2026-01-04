import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, Download, Share2, CheckCircle, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLegacy } from '@/providers/LegacyProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { QUESTIONS, CATEGORIES } from '@/constants/questions';
import * as Haptics from 'expo-haptics';

export default function PDFScreen() {
  const router = useRouter();
  const { answers, personName, clearAnswers, getProgress } = useLegacy();
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const progress = getProgress();

  const generatePDFContent = () => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&family=Open+Sans:wght@400;600&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Open Sans', sans-serif;
            line-height: 1.8;
            color: #4A4A4A;
            background: linear-gradient(to bottom, #E8E8E8, #D0D0D0);
            padding: 40px;
          }
          
          .book-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .cover-page {
            background: linear-gradient(135deg, #6B5D4F, #8B7355);
            color: white;
            padding: 80px 60px;
            text-align: center;
            page-break-after: always;
          }
          
          .cover-title {
            font-family: 'Crimson Text', serif;
            font-size: 48px;
            font-weight: 600;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          
          .cover-subtitle {
            font-size: 20px;
            opacity: 0.95;
            margin-bottom: 40px;
          }
          
          .cover-decoration {
            width: 100px;
            height: 2px;
            background: white;
            margin: 40px auto;
            opacity: 0.6;
          }
          
          .content-page {
            padding: 60px;
          }
          
          .category-section {
            margin-bottom: 60px;
            page-break-inside: avoid;
          }
          
          .category-header {
            border-bottom: 3px solid #8B7355;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          
          .category-title {
            font-family: 'Crimson Text', serif;
            font-size: 32px;
            color: #4A4A4A;
            font-weight: 600;
          }
          
          .question-block {
            margin-bottom: 40px;
            padding: 25px;
            background: #F5F5F5;
            border-left: 4px solid #8B7355;
            border-radius: 4px;
            page-break-inside: avoid;
          }
          
          .question-number {
            font-size: 14px;
            color: #8B7355;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          
          .question-text {
            font-family: 'Crimson Text', serif;
            font-size: 20px;
            color: #4A4A4A;
            margin-bottom: 15px;
            font-weight: 600;
          }
          
          .answer-text {
            font-size: 16px;
            color: #666666;
            line-height: 1.8;
            white-space: pre-wrap;
          }
          
          .footer {
            text-align: center;
            padding: 40px;
            background: #F5F5F5;
            margin-top: 60px;
            border-top: 2px solid #CCCCCC;
          }
          
          .footer-text {
            font-family: 'Crimson Text', serif;
            font-size: 18px;
            color: #6B5D4F;
            font-style: italic;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .book-container {
              box-shadow: none;
            }
            .question-block {
              page-break-inside: avoid;
            }
            .category-section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="book-container">
          <div class="cover-page">
            <h1 class="cover-title">${t.pdf.title}</h1>
            <p class="cover-subtitle">${t.pdf.subtitle}</p>
            <div class="cover-decoration"></div>
            <p style="margin-top: 60px; font-size: 16px; opacity: 0.9;">
              ${new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div class="content-page">
    `;

    CATEGORIES.forEach(category => {
      const categoryQuestions = QUESTIONS.filter(
        q => q.id >= category.startIndex && q.id <= category.endIndex
      );
      const hasAnswers = categoryQuestions.some(q => answers[q.id]);
      
      if (hasAnswers) {
        htmlContent += `
          <div class="category-section">
            <div class="category-header">
              <h2 class="category-title">${category.icon} ${category.name}</h2>
            </div>
        `;
        
        categoryQuestions.forEach(question => {
          const answer = answers[question.id];
          if (answer) {
            htmlContent += `
              <div class="question-block">
                <div class="question-number">${t.questions.questionLabel.replace('{{number}}', String(question.id))}</div>
                <div class="question-text">${question.text}</div>
                <div class="answer-text">${answer}</div>
              </div>
            `;
          }
        });
        
        htmlContent += `</div>`;
      }
    });

    htmlContent += `
          <div class="footer">
            <p class="footer-text">
              ${t.welcome.footerQuote}
            </p>
          </div>
        </div>
      </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      generatePDFContent();
      
      setPdfGenerated(true);
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        t.pdf.successTitle,
        t.pdf.successMessage,
        [{ text: t.pdf.ok }]
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(
        t.pdf.errorTitle,
        t.pdf.errorMessage,
        [{ text: t.pdf.ok }]
      );
    } finally {
      setIsGenerating(false);
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

  const handleDownload = () => {
    Alert.alert(
      t.pdf.downloadTitle,
      t.pdf.downloadMessage,
      [{ text: t.pdf.ok }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      t.pdf.shareTitle,
      t.pdf.shareMessage,
      [{ text: t.pdf.ok }]
    );
  };

  return (
    <View style={styles.container}>
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
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FileText size={60} color="#6B5D4F" />
            </View>
            <Text style={styles.title}>{t.pdf.title}</Text>
            <Text style={styles.subtitle}>
              {t.pdf.subtitle}
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{t.pdf.summaryTitle}</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t.pdf.questionsAnswered}</Text>
              <Text style={styles.statValue}>{progress.answered} / {progress.total}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t.pdf.categoriesCompleted}</Text>
              <Text style={styles.statValue}>
                {CATEGORIES.filter(cat => {
                  const questions = QUESTIONS.filter(
                    q => q.id >= cat.startIndex && q.id <= cat.endIndex
                  );
                  return questions.every(q => answers[q.id]);
                }).length} / {CATEGORIES.length}
              </Text>
            </View>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>{t.pdf.previewTitle}</Text>
            <View style={styles.previewItem}>
              <CheckCircle size={20} color="#6B5D4F" />
              <Text style={styles.previewText}>{t.pdf.preview1}</Text>
            </View>
            <View style={styles.previewItem}>
              <CheckCircle size={20} color="#6B5D4F" />
              <Text style={styles.previewText}>{t.pdf.preview2}</Text>
            </View>
            <View style={styles.previewItem}>
              <CheckCircle size={20} color="#6B5D4F" />
              <Text style={styles.previewText}>{t.pdf.preview3}</Text>
            </View>
            <View style={styles.previewItem}>
              <CheckCircle size={20} color="#6B5D4F" />
              <Text style={styles.previewText}>{t.pdf.preview4}</Text>
            </View>
          </View>

          {!pdfGenerated ? (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGeneratePDF}
              disabled={isGenerating}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#6B5D4F', '#8B7355']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isGenerating ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.buttonText}>{t.pdf.generating}</Text>
                  </>
                ) : (
                  <>
                    <FileText size={24} color="white" />
                    <Text style={styles.buttonText}>{t.pdf.generateButton}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDownload}
                activeOpacity={0.8}
              >
                <Download size={24} color="#6B5D4F" />
                <Text style={styles.actionButtonText}>{t.pdf.download}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <Share2 size={24} color="#6B5D4F" />
                <Text style={styles.actionButtonText}>{t.pdf.share}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>{t.pdf.back}</Text>
          </TouchableOpacity>

          {progress.answered > 0 && (
            <TouchableOpacity
              style={styles.startNewButton}
              onPress={handleStartNewStory}
              activeOpacity={0.8}
            >
              <RefreshCw size={20} color="#FF6B6B" />
              <Text style={styles.startNewButtonText}>{t.pdf.startNewButton}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#4A4A4A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B5D4F',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#6B5D4F',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4A4A4A',
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#4A4A4A',
    marginBottom: 16,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  previewText: {
    fontSize: 15,
    color: '#666666',
    flex: 1,
  },
  generateButton: {
    marginBottom: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B5D4F',
  },
  backButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B5D4F',
    textDecorationLine: 'underline',
  },
  startNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    gap: 8,
  },
  startNewButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FF6B6B',
  },
});
