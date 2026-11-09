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
import { FileText, Share2, CheckCircle, RefreshCw, Printer } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useLegacy } from '@/providers/LegacyProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { QUESTIONS, CATEGORIES } from '@/constants/questions';
import * as Haptics from 'expo-haptics';

export default function PDFScreen() {
  const router = useRouter();
  const { answers, personName, clearAnswers, getProgress } = useLegacy();
  const { t, language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const progress = getProgress();

  const generatePDFContent = () => {
    const dateLocale = language === 'es' ? 'es-ES' : 'en-US';
    const formattedDate = new Date().toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.8;
            color: #4A4A4A;
            background: white;
            padding: 0;
          }
          
          .cover-page {
            background: linear-gradient(135deg, #6B5D4F, #8B7355);
            color: white;
            padding: 80px 60px;
            text-align: center;
            page-break-after: always;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          
          .cover-title {
            font-size: 42px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          
          .cover-subtitle {
            font-size: 18px;
            opacity: 0.95;
            margin-bottom: 40px;
          }

          .cover-name {
            font-size: 28px;
            font-style: italic;
            margin-bottom: 40px;
            opacity: 0.9;
          }
          
          .cover-decoration {
            width: 100px;
            height: 2px;
            background: white;
            margin: 30px auto;
            opacity: 0.6;
          }

          .cover-date {
            margin-top: 40px;
            font-size: 16px;
            opacity: 0.8;
          }
          
          .content-page {
            padding: 40px;
          }
          
          .category-section {
            margin-bottom: 50px;
            page-break-inside: avoid;
          }
          
          .category-header {
            border-bottom: 3px solid #8B7355;
            padding-bottom: 12px;
            margin-bottom: 25px;
          }
          
          .category-title {
            font-size: 28px;
            color: #4A4A4A;
            font-weight: bold;
          }
          
          .question-block {
            margin-bottom: 35px;
            padding: 20px;
            background: #FAFAFA;
            border-left: 4px solid #8B7355;
            border-radius: 4px;
            page-break-inside: avoid;
          }
          
          .question-number {
            font-size: 12px;
            color: #8B7355;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
          }
          
          .question-text {
            font-size: 18px;
            color: #4A4A4A;
            margin-bottom: 12px;
            font-weight: bold;
          }
          
          .answer-text {
            font-size: 15px;
            color: #555555;
            line-height: 1.8;
            white-space: pre-wrap;
          }
          
          .footer {
            text-align: center;
            padding: 40px;
            background: #F5F5F5;
            margin-top: 50px;
            border-top: 2px solid #CCCCCC;
          }
          
          .footer-text {
            font-size: 16px;
            color: #6B5D4F;
            font-style: italic;
          }
          
          @page {
            margin: 20px;
          }
        </style>
      </head>
      <body>
        <div class="cover-page">
          <h1 class="cover-title">${t.pdf.title}</h1>
          <p class="cover-subtitle">${t.pdf.subtitle}</p>
          <div class="cover-decoration"></div>
          ${personName ? `<p class="cover-name">${personName}</p>` : ''}
          <p class="cover-date">${formattedDate}</p>
        </div>
        
        <div class="content-page">
    `;

    CATEGORIES.forEach(category => {
      const categoryQuestions = QUESTIONS.filter(
        q => q.id >= category.startIndex && q.id <= category.endIndex
      );
      const hasAnswers = categoryQuestions.some(q => answers[q.id]);

      if (hasAnswers) {
        const categoryName = language === 'es' ? category.name : t.categories[category.name as keyof typeof t.categories];
        htmlContent += `
          <div class="category-section">
            <div class="category-header">
              <h2 class="category-title">${category.icon} ${categoryName}</h2>
            </div>
        `;

        categoryQuestions.forEach(question => {
          const answer = answers[question.id];
          if (answer) {
            const questionText = language === 'es' ? question.textEs : question.textEn;
            const escapedAnswer = answer
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/\n/g, '<br/>');
            const escapedQuestion = questionText
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');

            htmlContent += `
              <div class="question-block">
                <div class="question-number">${t.questions.questionLabel.replace('{{number}}', String(question.id))}</div>
                <div class="question-text">${escapedQuestion}</div>
                <div class="answer-text">${escapedAnswer}</div>
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
      </body>
      </html>
    `;

    return htmlContent;
  };

  const handleGeneratePDF = async () => {
    if (progress.answered === 0) {
      Alert.alert(
        t.pdf.noAnswersTitle,
        t.pdf.noAnswersMessage,
        [{ text: t.pdf.ok }]
      );
      return;
    }

    setIsGenerating(true);
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const htmlContent = generatePDFContent();
      console.log('Generating PDF from HTML...');

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      console.log('PDF generated at:', uri);
      setPdfUri(uri);

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

  const handlePrint = async () => {
    if (!pdfUri) return;

    try {
      await Print.printAsync({
        uri: pdfUri,
      });
    } catch (error) {
      console.error('Error printing PDF:', error);
      Alert.alert(t.pdf.errorTitle, t.pdf.errorMessage, [{ text: t.pdf.ok }]);
    }
  };

  const handleShare = async () => {
    if (!pdfUri) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (Platform.OS === 'web' && !isAvailable) {
        Alert.alert(
          t.pdf.shareTitle,
          language === 'es'
            ? 'Compartir no está disponible en este navegador. Usa el botón de imprimir para guardar como PDF.'
            : 'Sharing is not available in this browser. Use the print button to save as PDF.',
          [{ text: t.pdf.ok }]
        );
        return;
      }

      await Sharing.shareAsync(pdfUri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: language === 'es' ? 'Compartir Libro del Legado' : 'Share Legacy Book',
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert(t.pdf.errorTitle, t.pdf.errorMessage, [{ text: t.pdf.ok }]);
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
            clearAnswers();
            if (Platform.OS !== 'web') {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FBF5EA', '#F0E4D0']}
        style={styles.gradient}
      >
        {personName ? (
          <View style={styles.nameHeader}>
            <Text style={styles.nameHeaderText}>
              {t.questions.recordingFor} {personName}
            </Text>
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FileText size={60} color="#6B5D4F" />
            </View>
            <Text style={styles.title}>{t.pdf.title}</Text>
            <Text style={styles.subtitle}>{t.pdf.subtitle}</Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{t.pdf.summaryTitle}</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t.pdf.questionsAnswered}</Text>
              <Text style={styles.statValue}>
                {progress.answered} / {progress.total}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>{t.pdf.categoriesCompleted}</Text>
              <Text style={styles.statValue}>
                {CATEGORIES.filter(cat => {
                  const questions = QUESTIONS.filter(
                    q => q.id >= cat.startIndex && q.id <= cat.endIndex
                  );
                  return questions.every(q => answers[q.id]);
                }).length}{' '}
                / {CATEGORIES.length}
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

          {!pdfUri ? (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGeneratePDF}
              disabled={isGenerating}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5C4332', '#7A5C42']}
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
                onPress={handlePrint}
                activeOpacity={0.8}
              >
                <Printer size={24} color="#6B5D4F" />
                <Text style={styles.actionButtonText}>
                  {language === 'es' ? 'Imprimir' : 'Print'}
                </Text>
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

          {pdfUri ? (
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={() => {
                setPdfUri(null);
              }}
              activeOpacity={0.8}
            >
              <RefreshCw size={18} color="#6B5D4F" />
              <Text style={styles.regenerateText}>
                {language === 'es' ? 'Regenerar PDF' : 'Regenerate PDF'}
              </Text>
            </TouchableOpacity>
          ) : null}

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
              <RefreshCw size={20} color="#B54A32" />
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
    backgroundColor: '#F5EBD8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8DBC2',
    shadowColor: '#5C4332',
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
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8DBC2',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
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
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E8DBC2',
    shadowColor: '#5C4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
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
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#D9C9AC',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B5D4F',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    marginBottom: 8,
  },
  regenerateText: {
    fontSize: 15,
    color: '#6B5D4F',
    fontWeight: '500' as const,
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
    borderColor: '#B54A32',
    gap: 8,
    backgroundColor: '#FFFDF7',
  },
  startNewButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#B54A32',
  },
});
