import Foundation
import Observation

enum AppLanguage: String, CaseIterable, Identifiable {
    case es, en
    var id: String { rawValue }
    var speechCode: String { self == .es ? "es-ES" : "en-US" }
    var locale: Locale { Locale(identifier: self == .es ? "es_ES" : "en_US") }
}

@Observable
final class LanguageStore {
    private static let key = "app_language"

    var language: AppLanguage {
        didSet { UserDefaults.standard.set(language.rawValue, forKey: Self.key) }
    }

    var t: Strings { language == .es ? .es : .en }

    init() {
        if let stored = UserDefaults.standard.string(forKey: Self.key), let lang = AppLanguage(rawValue: stored) {
            language = lang
        } else {
            let code = Locale.preferredLanguages.first.map { String($0.prefix(2)) } ?? "es"
            language = code == "en" ? .en : .es
        }
    }
}

struct Strings {
    // Welcome
    let title: String
    let subtitle: String
    let namePrompt: String
    let namePlaceholder: String
    let nameButton: String
    let carouselTitle: String
    let carouselNext: String
    let carouselPrevious: String
    let carouselSkip: String
    let carouselStart: String
    let welcomeTitle: String
    let welcomeText1: String
    let welcomeText2: String
    let whoCanFillTitle: String
    let whoCanFillText: String
    let bullets: [String]
    let howToUseTitle: String
    let steps: [(title: String, text: String)]
    let progressTitle: String
    let progressText: String
    let continueButton: String
    let footerQuote: String

    // Navigation titles
    let navQuestions: String
    let navReview: String
    let navBook: String

    // Questions
    let recordingFor: String
    let questionOf: String
    let questionLabel: String
    let writeMode: String
    let recordMode: String
    let placeholder: String
    let voicePlaceholder: String
    let stop: String
    let recordPrompt: String
    let recordingNow: String
    let transcribing: String
    let saveButton: String
    let saved: String
    let photoTitle: String
    let photoSubtitle: String
    let addPhoto: String
    let changePhoto: String
    let quickNav: String
    let previous: String
    let next: String
    let finish: String
    let finishedTitle: String
    let finishedMessage: String
    let stayHere: String
    let viewAnswers: String
    let removePhotoTitle: String
    let removePhotoMessage: String
    let cancel: String
    let remove: String
    let micPermissionTitle: String
    let micPermissionMessage: String
    let openSettings: String
    let recordError: String
    let transcribeError: String
    let photoError: String
    let listen: String
    let stopListening: String
    let soundOn: String
    let soundOff: String
    let hint: String

    // Review
    let reviewTitle: String
    let reviewSubtitle: String
    let noAnswer: String
    let photoLabel: String
    let save: String
    let emptyState: String
    let startNow: String
    let generateBookButton: String
    let placeholderEdit: String
    let edit: String

    // PDF
    let pdfTitle: String
    let pdfSubtitle: String
    let summaryTitle: String
    let questionsAnswered: String
    let categoriesCompleted: String
    let photosIncluded: String
    let previewTitle: String
    let previews: [String]
    let generatePDF: String
    let generating: String
    let share: String
    let print: String
    let regenerate: String
    let back: String
    let successTitle: String
    let successMessage: String
    let errorTitle: String
    let errorMessage: String
    let noAnswersTitle: String
    let noAnswersMessage: String
    let incompleteTitle: String
    let incompleteMessage: String
    let startNewButton: String
    let startNewTitle: String
    let startNewMessage: String
    let ok: String
    let bookReady: String

    func fill(_ template: String, _ values: [String: Any]) -> String {
        values.reduce(template) { result, pair in
            result.replacingOccurrences(of: "{{\(pair.key)}}", with: "\(pair.value)")
        }
    }

    static let es = Strings(
        title: "Mi Historia, Mi Legado",
        subtitle: "Preserva tu historia de vida para las futuras generaciones",
        namePrompt: "Esta es la historia y legado de:",
        namePlaceholder: "Ingresa el nombre completo",
        nameButton: "Comenzar",
        carouselTitle: "Lee las instrucciones",
        carouselNext: "Siguiente",
        carouselPrevious: "Anterior",
        carouselSkip: "Saltar",
        carouselStart: "Comenzar",
        welcomeTitle: "Bienvenido a \u{201C}Mi Historia. Mi Legado.\u{201D}",
        welcomeText1: "Este libro ha sido creado para ayudarte a recordar, reflexionar y compartir los momentos más importantes de tu vida. Es una forma hermosa de dejar un legado para tus hijos, nietos y futuras generaciones.",
        welcomeText2: "Aquí no buscamos fechas exactas ni datos formales: lo que más valoramos son tus recuerdos, tus sentimientos, tus aprendizajes y todo aquello que te hace único.",
        whoCanFillTitle: "¿Quién puede llenarlo?",
        whoCanFillText: "Este libro puede ser completado:",
        bullets: [
            "Por ti mismo, a tu ritmo y con calma.",
            "Con ayuda de un familiar, como un hijo, nieto o sobrino que te haga las preguntas y anote tus respuestas.",
            "Durante una conversación grabada, para luego escribir las respuestas con más detalle.",
        ],
        howToUseTitle: "¿Cómo se usa?",
        steps: [
            ("Lee las preguntas con calma.", "Cada una está diseñada para invitarte a recordar y contar una historia. No hay respuestas correctas o incorrectas."),
            ("Escribe libremente.", "Usa los espacios debajo de cada pregunta para escribir lo que recuerdes. Puedes escribir mucho o poco, según lo que desees compartir."),
            ("Si no recuerdas algo, pasa a la siguiente.", "No te preocupes si no puedes contestar todas. Vuelve después si quieres."),
            ("Puedes añadir fotos a cada pregunta.", "Cada pregunta te permite agregar una foto opcional relacionada con tu respuesta para enriquecer tu historia."),
            ("No hay prisa.", "Puedes llenarlo en varios días, semanas o meses. Lo importante es que refleje tu sabiduría y tu historia."),
            ("Al final, imprime tu libro PDF.", "Una vez completadas las preguntas, podrás generar un hermoso libro PDF con diseño vintage para compartir con tu familia."),
        ],
        progressTitle: "Tu Progreso",
        progressText: "{{answered}} de {{total}} preguntas respondidas",
        continueButton: "Continuar mi Historia",
        footerQuote: "\u{201C}Las historias de vida son el regalo más valioso que podemos dejar\u{201D}",
        navQuestions: "Tu Historia",
        navReview: "Revisar Respuestas",
        navBook: "Libro del Legado",
        recordingFor: "Registrando la historia y legado de",
        questionOf: "Pregunta {{current}} de {{total}}",
        questionLabel: "Pregunta {{number}}",
        writeMode: "Escribir",
        recordMode: "Grabar",
        placeholder: "Escribe tu respuesta aquí...",
        voicePlaceholder: "Tu respuesta aparecerá aquí después de grabar...",
        stop: "Detener",
        recordPrompt: "Toca para grabar",
        recordingNow: "Grabando… toca para detener",
        transcribing: "Transcribiendo...",
        saveButton: "Guardar respuesta",
        saved: "Guardado",
        photoTitle: "Foto opcional",
        photoSubtitle: "Puedes agregar una foto relacionada con esta pregunta",
        addPhoto: "Agregar foto",
        changePhoto: "Cambiar",
        quickNav: "Navegación rápida",
        previous: "Anterior",
        next: "Siguiente",
        finish: "Finalizar",
        finishedTitle: "¡Felicidades!",
        finishedMessage: "Has completado todas las preguntas. ¿Deseas revisar tus respuestas?",
        stayHere: "Seguir aquí",
        viewAnswers: "Ver respuestas",
        removePhotoTitle: "Eliminar foto",
        removePhotoMessage: "¿Estás seguro de que quieres eliminar esta foto?",
        cancel: "Cancelar",
        remove: "Eliminar",
        micPermissionTitle: "Permiso necesario",
        micPermissionMessage: "Necesitamos acceso al micrófono para grabar tu voz.",
        openSettings: "Abrir Ajustes",
        recordError: "No se pudo iniciar la grabación",
        transcribeError: "No se pudo procesar la grabación",
        photoError: "No se pudo agregar la foto",
        listen: "Escuchar pregunta",
        stopListening: "Detener",
        soundOn: "Voz activada",
        soundOff: "Voz desactivada",
        hint: "Puedes escribir tu respuesta, grabarla con tu voz o agregar una foto, como prefieras.",
        reviewTitle: "Tus Respuestas",
        reviewSubtitle: "{{answered}} de {{total}} preguntas respondidas",
        noAnswer: "Sin respuesta",
        photoLabel: "Foto adjunta",
        save: "Guardar",
        emptyState: "Aún no has respondido ninguna pregunta",
        startNow: "Comenzar ahora",
        generateBookButton: "Crear Libro del Legado",
        placeholderEdit: "Escribe tu respuesta...",
        edit: "Editar",
        pdfTitle: "Crear tu Libro del Legado",
        pdfSubtitle: "Un documento PDF con todas tus respuestas, diseñado con amor para preservar tu historia",
        summaryTitle: "Resumen de tu historia",
        questionsAnswered: "Preguntas respondidas:",
        categoriesCompleted: "Categorías completadas:",
        photosIncluded: "Fotos incluidas:",
        previewTitle: "¿Qué incluirá tu libro?",
        previews: [
            "Portada personalizada con la fecha",
            "Todas tus respuestas organizadas por categorías",
            "Diseño vintage cálido y nostálgico",
            "Tipografía clara y fácil de leer",
        ],
        generatePDF: "Generar Libro PDF",
        generating: "Generando...",
        share: "Compartir",
        print: "Imprimir",
        regenerate: "Regenerar PDF",
        back: "Volver a las respuestas",
        successTitle: "¡Libro creado!",
        successMessage: "Tu Libro del Legado ha sido generado exitosamente.",
        errorTitle: "Error",
        errorMessage: "No se pudo generar el PDF. Por favor, intenta de nuevo.",
        noAnswersTitle: "Sin respuestas",
        noAnswersMessage: "Necesitas responder al menos una pregunta para generar tu Libro del Legado.",
        incompleteTitle: "Preguntas sin responder",
        incompleteMessage: "Has respondido {{answered}} de {{total}} preguntas. ¿Deseas continuar y generar el libro con las respuestas actuales?",
        startNewButton: "Comenzar Nueva Historia",
        startNewTitle: "Nueva historia",
        startNewMessage: "Esto eliminará todas las respuestas y fotos actuales. ¿Estás seguro de que deseas comenzar una nueva historia?",
        ok: "OK",
        bookReady: "Tu libro está listo"
    )

    static let en = Strings(
        title: "My Story, My Legacy",
        subtitle: "Preserve your life story for future generations",
        namePrompt: "This is the story and legacy of:",
        namePlaceholder: "Enter full name",
        nameButton: "Start",
        carouselTitle: "Read the instructions",
        carouselNext: "Next",
        carouselPrevious: "Previous",
        carouselSkip: "Skip",
        carouselStart: "Start",
        welcomeTitle: "Welcome to \u{201C}My Story. My Legacy.\u{201D}",
        welcomeText1: "This book has been created to help you remember, reflect, and share the most important moments of your life. It is a beautiful way to leave a legacy for your children, grandchildren, and future generations.",
        welcomeText2: "Here we do not seek exact dates or formal data: what we value most are your memories, your feelings, your learnings, and everything that makes you unique.",
        whoCanFillTitle: "Who can fill it out?",
        whoCanFillText: "This book can be completed:",
        bullets: [
            "By yourself, at your own pace and calmly.",
            "With the help of a family member, such as a child, grandchild, or nephew who asks you the questions and writes down your answers.",
            "During a recorded conversation, to later write the answers in more detail.",
        ],
        howToUseTitle: "How to use it?",
        steps: [
            ("Read the questions calmly.", "Each one is designed to invite you to remember and tell a story. There are no right or wrong answers."),
            ("Write freely.", "Use the spaces below each question to write what you remember. You can write a lot or a little, depending on what you want to share."),
            ("If you don't remember something, move on to the next.", "Don't worry if you can't answer them all. Come back later if you want."),
            ("You can add photos to each question.", "Each question allows you to add an optional photo related to your answer to enrich your story."),
            ("There is no rush.", "You can fill it out over several days, weeks, or months. What matters is that it reflects your wisdom and your story."),
            ("At the end, print your PDF book.", "Once the questions are completed, you can generate a beautiful PDF book with vintage design to share with your family."),
        ],
        progressTitle: "Your Progress",
        progressText: "{{answered}} of {{total}} questions answered",
        continueButton: "Continue My Story",
        footerQuote: "\u{201C}Life stories are the most valuable gift we can leave\u{201D}",
        navQuestions: "Your Story",
        navReview: "Review Answers",
        navBook: "Legacy Book",
        recordingFor: "Recording the story and legacy of",
        questionOf: "Question {{current}} of {{total}}",
        questionLabel: "Question {{number}}",
        writeMode: "Write",
        recordMode: "Record",
        placeholder: "Write your answer here...",
        voicePlaceholder: "Your answer will appear here after recording...",
        stop: "Stop",
        recordPrompt: "Tap to record",
        recordingNow: "Recording… tap to stop",
        transcribing: "Transcribing...",
        saveButton: "Save answer",
        saved: "Saved",
        photoTitle: "Optional photo",
        photoSubtitle: "You can add a photo related to this question",
        addPhoto: "Add photo",
        changePhoto: "Change",
        quickNav: "Quick navigation",
        previous: "Previous",
        next: "Next",
        finish: "Finish",
        finishedTitle: "Congratulations!",
        finishedMessage: "You have completed all the questions. Would you like to review your answers?",
        stayHere: "Stay here",
        viewAnswers: "View answers",
        removePhotoTitle: "Remove photo",
        removePhotoMessage: "Are you sure you want to remove this photo?",
        cancel: "Cancel",
        remove: "Remove",
        micPermissionTitle: "Permission needed",
        micPermissionMessage: "We need access to the microphone to record your voice.",
        openSettings: "Open Settings",
        recordError: "Could not start recording",
        transcribeError: "Could not process recording",
        photoError: "Could not add photo",
        listen: "Listen to question",
        stopListening: "Stop",
        soundOn: "Voice on",
        soundOff: "Voice off",
        hint: "You can write your answer, record it with your voice, or add a photo — whatever you prefer.",
        reviewTitle: "Your Answers",
        reviewSubtitle: "{{answered}} of {{total}} questions answered",
        noAnswer: "No answer",
        photoLabel: "Photo attached",
        save: "Save",
        emptyState: "You haven't answered any questions yet",
        startNow: "Start now",
        generateBookButton: "Create Legacy Book",
        placeholderEdit: "Write your answer...",
        edit: "Edit",
        pdfTitle: "Create Your Legacy Book",
        pdfSubtitle: "A PDF document with all your answers, lovingly designed to preserve your story",
        summaryTitle: "Summary of your story",
        questionsAnswered: "Questions answered:",
        categoriesCompleted: "Categories completed:",
        photosIncluded: "Photos included:",
        previewTitle: "What will your book include?",
        previews: [
            "Personalized cover with the date",
            "All your answers organized by categories",
            "Warm and nostalgic vintage design",
            "Clear and easy-to-read typography",
        ],
        generatePDF: "Generate PDF Book",
        generating: "Generating...",
        share: "Share",
        print: "Print",
        regenerate: "Regenerate PDF",
        back: "Back to answers",
        successTitle: "Book created!",
        successMessage: "Your Legacy Book has been generated successfully.",
        errorTitle: "Error",
        errorMessage: "Could not generate PDF. Please try again.",
        noAnswersTitle: "No answers",
        noAnswersMessage: "You need to answer at least one question to generate your Legacy Book.",
        incompleteTitle: "Unanswered questions",
        incompleteMessage: "You have answered {{answered}} of {{total}} questions. Do you want to continue and generate the book with the current answers?",
        startNewButton: "Start New Story",
        startNewTitle: "New story",
        startNewMessage: "This will delete all current answers and photos. Are you sure you want to start a new story?",
        ok: "OK",
        bookReady: "Your book is ready"
    )
}
