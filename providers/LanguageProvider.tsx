import { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import * as Localization from 'expo-localization';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.es;
}

const LANGUAGE_STORAGE_KEY = 'app_language';

const translations = {
  es: {
    welcome: {
      title: 'Mi Historia, Mi Legado',
      subtitle: 'Preserva tu historia de vida para las futuras generaciones',
      namePrompt: 'Esta es la historia y legado de:',
      namePlaceholder: 'Ingresa el nombre completo',
      nameButton: 'Comenzar',
      recordingFor: 'Registrando la historia y legado de',
      thanksTitle: 'Gracias por compartir tu historia',
      thanksText1: 'Cada recuerdo, cada reflexión y cada fotografía que has incluido en estas páginas son un regalo invaluable para tu familia y tus seres queridos. Este libro no solo guarda los detalles de tu vida, sino también la esencia de quién eres, lo que has aprendido y lo que deseas dejar como legado.',
      thanksText2: 'Te animamos a guardar este libro en un lugar especial, compartirlo con tu familia y, si lo deseas, hacer copias para tus hijos y nietos. Puedes seguir agregando recuerdos con el tiempo: no es un libro que se termina, sino uno que sigue creciendo junto con tu historia.',
      welcomeTitle: 'Bienvenido a "Mi Historia. Mi Legado."',
      welcomeText1: 'Este libro ha sido creado para ayudarte a recordar, reflexionar y compartir los momentos más importantes de tu vida. Es una forma hermosa de dejar un legado para tus hijos, nietos y futuras generaciones.',
      welcomeText2: 'Aquí no buscamos fechas exactas ni datos formales: lo que más valoramos son tus recuerdos, tus sentimientos, tus aprendizajes y todo aquello que te hace único.',
      whoCanFillTitle: '¿Quién puede llenarlo?',
      whoCanFillText: 'Este libro puede ser completado:',
      bullet1: 'Por ti mismo, a tu ritmo y con calma.',
      bullet2: 'Con ayuda de un familiar, como un hijo, nieto o sobrino que te haga las preguntas y anote tus respuestas.',
      bullet3: 'Durante una conversación grabada, para luego escribir las respuestas con más detalle.',
      howToUseTitle: '¿Cómo se usa?',
      step1Title: 'Lee las preguntas con calma.',
      step1Text: 'Cada una está diseñada para invitarte a recordar y contar una historia. No hay respuestas correctas o incorrectas.',
      step2Title: 'Escribe libremente.',
      step2Text: 'Usa los espacios debajo de cada pregunta para escribir lo que recuerdes. Puedes escribir mucho o poco, según lo que desees compartir.',
      step3Title: 'Si no recuerdas algo, pasa a la siguiente.',
      step3Text: 'No te preocupes si no puedes contestar todas. Vuelve después si quieres.',
      step4Title: 'Puedes añadir fotos a cada pregunta.',
      step4Text: 'Cada pregunta te permite agregar una foto opcional relacionada con tu respuesta para enriquecer tu historia.',
      step5Title: 'No hay prisa.',
      step5Text: 'Puedes llenarlo en varios días, semanas o meses. Lo importante es que refleje tu sabiduría y tu historia.',
      step6Title: 'Al final, imprime tu libro PDF.',
      step6Text: 'Una vez completadas las preguntas, podrás generar un hermoso libro PDF con diseño vintage para compartir con tu familia.',
      feature1Title: '48 Preguntas',
      feature1Text: 'Reflexiona sobre tu vida con preguntas cuidadosamente seleccionadas',
      feature2Title: 'Para Todos',
      feature2Text: 'Responde solo o con ayuda de familiares y amigos',
      progressTitle: 'Tu Progreso',
      progressText: '{{answered}} de {{total}} preguntas respondidas',
      startButton: 'Comenzar mi Historia',
      continueButton: 'Continuar mi Historia',
      viewAnswersButton: 'Ver Respuestas',
      footerQuote: '"Las historias de vida son el regalo más valioso que podemos dejar"',
    },
    questions: {
      recordingFor: 'Registrando la historia y legado de',
      title: 'Pregunta {{current}} de {{total}}',
      questionLabel: 'Pregunta {{number}}',
      writeMode: 'Escribir',
      recordMode: 'Grabar',
      placeholder: 'Escribe tu respuesta aquí...',
      voicePlaceholder: 'Tu respuesta aparecerá aquí después de grabar...',
      recording: 'Detener',
      recordPrompt: 'Mantén presionado para grabar',
      transcribing: 'Transcribiendo...',
      saveButton: 'Guardar respuesta',
      photoTitle: 'Foto opcional',
      photoSubtitle: 'Puedes agregar una foto relacionada con esta pregunta',
      addPhoto: 'Agregar foto',
      quickNav: 'Navegación rápida',
      previous: 'Anterior',
      next: 'Siguiente',
      finish: 'Finalizar',
      finishedTitle: '¡Felicidades!',
      finishedMessage: 'Has completado todas las preguntas. ¿Deseas revisar tus respuestas?',
      stayHere: 'Seguir aquí',
      viewAnswers: 'Ver respuestas',
      removePhotoTitle: 'Eliminar foto',
      removePhotoMessage: '¿Estás seguro de que quieres eliminar esta foto?',
      cancel: 'Cancelar',
      remove: 'Eliminar',
      micPermissionTitle: 'Permiso necesario',
      micPermissionMessage: 'Necesitamos acceso al micrófono para grabar tu voz.',
      galleryPermissionMessage: 'Necesitamos acceso a tu galería para agregar fotos.',
      recordError: 'No se pudo iniciar la grabación',
      transcribeError: 'No se pudo procesar la grabación',
      photoError: 'No se pudo agregar la foto',
    },
    review: {
      title: 'Tus Respuestas',
      subtitle: '{{answered}} de {{total}} preguntas respondidas',
      noAnswer: 'Sin respuesta',
      photoLabel: 'Foto adjunta',
      save: 'Guardar',
      emptyState: 'Aún no has respondido ninguna pregunta',
      startNow: 'Comenzar ahora',
      generateButton: 'Crear Libro del Legado',
      placeholderEdit: 'Escribe tu respuesta...',
    },
    pdf: {
      title: 'Crear tu Libro del Legado',
      subtitle: 'Un documento PDF con todas tus respuestas, diseñado con amor para preservar tu historia',
      summaryTitle: 'Resumen de tu historia',
      questionsAnswered: 'Preguntas respondidas:',
      categoriesCompleted: 'Categorías completadas:',
      previewTitle: '¿Qué incluirá tu libro?',
      preview1: 'Portada personalizada con la fecha',
      preview2: 'Todas tus respuestas organizadas por categorías',
      preview3: 'Diseño vintage cálido y nostálgico',
      preview4: 'Tipografía clara y fácil de leer',
      generateButton: 'Generar Libro PDF',
      generating: 'Generando...',
      download: 'Descargar',
      share: 'Compartir',
      back: 'Volver a las respuestas',
      successTitle: '¡Libro creado!',
      successMessage: 'Tu Libro del Legado ha sido generado exitosamente.',
      errorTitle: 'Error',
      errorMessage: 'No se pudo generar el PDF. Por favor, intenta de nuevo.',
      noAnswersTitle: 'Sin respuestas',
      noAnswersMessage: 'Necesitas responder al menos una pregunta para generar tu Libro del Legado.',
      incompleteTitle: 'Preguntas sin responder',
      incompleteMessage: 'Has respondido {{answered}} de {{total}} preguntas. ¿Deseas continuar y generar el libro con las respuestas actuales?',
      downloadTitle: 'Descargar PDF',
      downloadMessage: 'El PDF se descargará a tu dispositivo.',
      shareTitle: 'Compartir PDF',
      shareMessage: 'Podrás compartir tu Libro del Legado con tu familia.',
      startNewButton: 'Comenzar Nueva Historia',
      startNewTitle: 'Nueva historia',
      startNewMessage: 'Esto eliminará todas las respuestas y fotos actuales. ¿Estás seguro de que deseas comenzar una nueva historia?',
      ok: 'OK',
    },
    categories: {
      'Orígenes y familia': 'Orígenes y familia',
      'Infancia y hogar': 'Infancia y hogar',
      'Escuela y adolescencia': 'Escuela y adolescencia',
      'Amor y relaciones': 'Amor y relaciones',
      'Hijos y familia propia': 'Hijos y familia propia',
      'Trabajo y propósito': 'Trabajo y propósito',
      'Espiritualidad y creencias': 'Espiritualidad y creencias',
      'Reflexiones y legado': 'Reflexiones y legado',
    },
  },
  en: {
    welcome: {
      title: 'My Story, My Legacy',
      subtitle: 'Preserve your life story for future generations',
      namePrompt: 'This is the story and legacy of:',
      namePlaceholder: 'Enter full name',
      nameButton: 'Start',
      recordingFor: 'Recording the story and legacy of',
      thanksTitle: 'Thank you for sharing your story',
      thanksText1: 'Every memory, every reflection, and every photograph you have included in these pages is an invaluable gift to your family and loved ones. This book not only keeps the details of your life but also the essence of who you are, what you have learned, and what you wish to leave as a legacy.',
      thanksText2: 'We encourage you to keep this book in a special place, share it with your family, and if you wish, make copies for your children and grandchildren. You can continue adding memories over time: this is not a book that ends, but one that continues to grow along with your story.',
      welcomeTitle: 'Welcome to "My Story. My Legacy."',
      welcomeText1: 'This book has been created to help you remember, reflect, and share the most important moments of your life. It is a beautiful way to leave a legacy for your children, grandchildren, and future generations.',
      welcomeText2: 'Here we do not seek exact dates or formal data: what we value most are your memories, your feelings, your learnings, and everything that makes you unique.',
      whoCanFillTitle: 'Who can fill it out?',
      whoCanFillText: 'This book can be completed:',
      bullet1: 'By yourself, at your own pace and calmly.',
      bullet2: 'With the help of a family member, such as a child, grandchild, or nephew who asks you the questions and writes down your answers.',
      bullet3: 'During a recorded conversation, to later write the answers in more detail.',
      howToUseTitle: 'How to use it?',
      step1Title: 'Read the questions calmly.',
      step1Text: 'Each one is designed to invite you to remember and tell a story. There are no right or wrong answers.',
      step2Title: 'Write freely.',
      step2Text: 'Use the spaces below each question to write what you remember. You can write a lot or a little, depending on what you want to share.',
      step3Title: 'If you don\'t remember something, move on to the next.',
      step3Text: 'Don\'t worry if you can\'t answer them all. Come back later if you want.',
      step4Title: 'You can add photos to each question.',
      step4Text: 'Each question allows you to add an optional photo related to your answer to enrich your story.',
      step5Title: 'There is no rush.',
      step5Text: 'You can fill it out over several days, weeks, or months. What matters is that it reflects your wisdom and your story.',
      step6Title: 'At the end, print your PDF book.',
      step6Text: 'Once the questions are completed, you can generate a beautiful PDF book with vintage design to share with your family.',
      feature1Title: '48 Questions',
      feature1Text: 'Reflect on your life with carefully selected questions',
      feature2Title: 'For Everyone',
      feature2Text: 'Answer alone or with the help of family and friends',
      progressTitle: 'Your Progress',
      progressText: '{{answered}} of {{total}} questions answered',
      startButton: 'Start My Story',
      continueButton: 'Continue My Story',
      viewAnswersButton: 'View Answers',
      footerQuote: '"Life stories are the most valuable gift we can leave"',
    },
    questions: {
      recordingFor: 'Recording the story and legacy of',
      title: 'Question {{current}} of {{total}}',
      questionLabel: 'Question {{number}}',
      writeMode: 'Write',
      recordMode: 'Record',
      placeholder: 'Write your answer here...',
      voicePlaceholder: 'Your answer will appear here after recording...',
      recording: 'Stop',
      recordPrompt: 'Press and hold to record',
      transcribing: 'Transcribing...',
      saveButton: 'Save answer',
      photoTitle: 'Optional photo',
      photoSubtitle: 'You can add a photo related to this question',
      addPhoto: 'Add photo',
      quickNav: 'Quick navigation',
      previous: 'Previous',
      next: 'Next',
      finish: 'Finish',
      finishedTitle: 'Congratulations!',
      finishedMessage: 'You have completed all the questions. Would you like to review your answers?',
      stayHere: 'Stay here',
      viewAnswers: 'View answers',
      removePhotoTitle: 'Remove photo',
      removePhotoMessage: 'Are you sure you want to remove this photo?',
      cancel: 'Cancel',
      remove: 'Remove',
      micPermissionTitle: 'Permission needed',
      micPermissionMessage: 'We need access to the microphone to record your voice.',
      galleryPermissionMessage: 'We need access to your gallery to add photos.',
      recordError: 'Could not start recording',
      transcribeError: 'Could not process recording',
      photoError: 'Could not add photo',
    },
    review: {
      title: 'Your Answers',
      subtitle: '{{answered}} of {{total}} questions answered',
      noAnswer: 'No answer',
      photoLabel: 'Photo attached',
      save: 'Save',
      emptyState: 'You haven\'t answered any questions yet',
      startNow: 'Start now',
      generateButton: 'Create Legacy Book',
      placeholderEdit: 'Write your answer...',
    },
    pdf: {
      title: 'Create Your Legacy Book',
      subtitle: 'A PDF document with all your answers, lovingly designed to preserve your story',
      summaryTitle: 'Summary of your story',
      questionsAnswered: 'Questions answered:',
      categoriesCompleted: 'Categories completed:',
      previewTitle: 'What will your book include?',
      preview1: 'Personalized cover with the date',
      preview2: 'All your answers organized by categories',
      preview3: 'Warm and nostalgic vintage design',
      preview4: 'Clear and easy-to-read typography',
      generateButton: 'Generate PDF Book',
      generating: 'Generating...',
      download: 'Download',
      share: 'Share',
      back: 'Back to answers',
      successTitle: 'Book created!',
      successMessage: 'Your Legacy Book has been generated successfully.',
      errorTitle: 'Error',
      errorMessage: 'Could not generate PDF. Please try again.',
      noAnswersTitle: 'No answers',
      noAnswersMessage: 'You need to answer at least one question to generate your Legacy Book.',
      incompleteTitle: 'Unanswered questions',
      incompleteMessage: 'You have answered {{answered}} of {{total}} questions. Do you want to continue and generate the book with the current answers?',
      downloadTitle: 'Download PDF',
      downloadMessage: 'The PDF will be downloaded to your device.',
      shareTitle: 'Share PDF',
      shareMessage: 'You can share your Legacy Book with your family.',
      startNewButton: 'Start New Story',
      startNewTitle: 'New story',
      startNewMessage: 'This will delete all current answers and photos. Are you sure you want to start a new story?',
      ok: 'OK',
    },
    categories: {
      'Orígenes y familia': 'Origins and family',
      'Infancia y hogar': 'Childhood and home',
      'Escuela y adolescencia': 'School and adolescence',
      'Amor y relaciones': 'Love and relationships',
      'Hijos y familia propia': 'Children and own family',
      'Trabajo y propósito': 'Work and purpose',
      'Espiritualidad y creencias': 'Spirituality and beliefs',
      'Reflexiones y legado': 'Reflections and legacy',
    },
  },
};

function detectDeviceLanguage(): Language {
  const locale = Localization.getLocales()[0];
  const languageCode = locale?.languageCode || 'es';
  return languageCode === 'en' ? 'en' : 'es';
}

export const [LanguageProvider, useLanguage] = createContextHook<LanguageContextType>(() => {
  const [language, setLanguageState] = useState<Language>(detectDeviceLanguage());
  const [isLoaded, setIsLoaded] = useState(false);

  const loadLanguage = useCallback(async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es')) {
        setLanguageState(storedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveLanguage = useCallback(async () => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, [language]);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  useEffect(() => {
    if (isLoaded) {
      saveLanguage();
    }
  }, [isLoaded, saveLanguage]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useMemo(() => translations[language], [language]);

  return useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t]);
});