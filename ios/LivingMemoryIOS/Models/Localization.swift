import Foundation
import Observation

enum AppLanguage: String, CaseIterable, Identifiable {
    case es, en, pt
    var id: String { rawValue }

    var speechCode: String {
        switch self {
        case .es: "es-ES"
        case .en: "en-US"
        case .pt: "pt-BR"
        }
    }

    var locale: Locale {
        switch self {
        case .es: Locale(identifier: "es_ES")
        case .en: Locale(identifier: "en_US")
        case .pt: Locale(identifier: "pt_BR")
        }
    }

    var strings: Strings {
        switch self {
        case .es: .es
        case .en: .en
        case .pt: .pt
        }
    }
}

@Observable
final class LanguageStore {
    private static let key = "app_language"

    var language: AppLanguage {
        didSet { UserDefaults.standard.set(language.rawValue, forKey: Self.key) }
    }

    var t: Strings { language.strings }

    init() {
        if let stored = UserDefaults.standard.string(forKey: Self.key), let lang = AppLanguage(rawValue: stored) {
            language = lang
        } else {
            let code = Locale.preferredLanguages.first.map { String($0.prefix(2)) } ?? "es"
            switch code {
            case "en": language = .en
            case "pt": language = .pt
            default: language = .es
            }
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
        welcomeText1: "Esta aplicación te ayudará a recordar y compartir los momentos más importantes de tu vida. Con tus respuestas, crearé para ti un libro muy especial: tu historia, contada con tus propias palabras.",
        welcomeText2: "Tus hijos, tus nietos y todos tus descendientes podrán conocer algún día tu historia y tu legado. No hay prisa ni respuestas equivocadas: solo tus recuerdos, contados como tú quieras.",
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
        welcomeText1: "This app will help you remember and share the most important moments of your life. With your answers, I will create a very special book for you: your story, told in your own words.",
        welcomeText2: "Your children, grandchildren, and all your descendants will one day get to know your story and your legacy. There is no rush and there are no wrong answers — only your memories, told exactly as you wish.",
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

    static let pt = Strings(
        title: "Minha História, Meu Legado",
        subtitle: "Preserve a sua história de vida para as futuras gerações",
        namePrompt: "Esta é a história e o legado de:",
        namePlaceholder: "Digite o nome completo",
        nameButton: "Começar",
        carouselTitle: "Leia as instruções",
        carouselNext: "Próximo",
        carouselPrevious: "Anterior",
        carouselSkip: "Pular",
        carouselStart: "Começar",
        welcomeTitle: "Bem-vindo(a) a \u{201C}Minha História. Meu Legado.\u{201D}",
        welcomeText1: "Esta aplicação vai ajudar você a lembrar e compartilhar os momentos mais importantes da sua vida. Com as suas respostas, criarei para você um livro muito especial: a sua história, contada com as suas próprias palavras.",
        welcomeText2: "Seus filhos, netos e todos os seus descendentes vão poder conhecer um dia a sua história e o seu legado. Não há pressa nem respostas erradas — apenas as suas memórias, contadas do jeito que você quiser.",
        whoCanFillTitle: "Quem pode preencher?",
        whoCanFillText: "Este livro pode ser preenchido:",
        bullets: [
            "Por você mesmo, no seu próprio ritmo e com calma.",
            "Com a ajuda de um familiar, como um filho, neto ou sobrinho, que faça as perguntas e anote as suas respostas.",
            "Durante uma conversa gravada, para depois escrever as respostas com mais detalhes.",
        ],
        howToUseTitle: "Como se usa?",
        steps: [
            ("Leia as perguntas com calma.", "Cada uma foi criada para convidar você a lembrar e contar uma história. Não existem respostas certas ou erradas."),
            ("Escreva com liberdade.", "Use os espaços abaixo de cada pergunta para escrever o que lembrar. Você pode escrever muito ou pouco, como quiser."),
            ("Se não lembrar de algo, siga para a próxima.", "Não se preocupe se não puder responder todas. Volte depois, se quiser."),
            ("Você pode adicionar fotos a cada pergunta.", "Cada pergunta permite adicionar uma foto opcional relacionada à sua resposta para enriquecer a sua história."),
            ("Não há pressa.", "Você pode preencher ao longo de vários dias, semanas ou meses. O importante é que reflita a sua sabedoria e a sua história."),
            ("No final, imprima o seu livro em PDF.", "Depois de responder às perguntas, você poderá gerar um belo livro em PDF com design vintage para compartilhar com a sua família."),
        ],
        progressTitle: "Seu Progresso",
        progressText: "{{answered}} de {{total}} perguntas respondidas",
        continueButton: "Continuar minha História",
        footerQuote: "\u{201C}As histórias de vida são o presente mais valioso que podemos deixar\u{201D}",
        navQuestions: "Sua História",
        navReview: "Revisar Respostas",
        navBook: "Livro do Legado",
        recordingFor: "Registrando a história e o legado de",
        questionOf: "Pergunta {{current}} de {{total}}",
        questionLabel: "Pergunta {{number}}",
        writeMode: "Escrever",
        recordMode: "Gravar",
        placeholder: "Escreva a sua resposta aqui...",
        voicePlaceholder: "A sua resposta aparecerá aqui depois de gravar...",
        stop: "Parar",
        recordPrompt: "Toque para gravar",
        recordingNow: "Gravando… toque para parar",
        transcribing: "Transcrevendo...",
        saveButton: "Salvar resposta",
        saved: "Salvo",
        photoTitle: "Foto opcional",
        photoSubtitle: "Você pode adicionar uma foto relacionada a esta pergunta",
        addPhoto: "Adicionar foto",
        changePhoto: "Alterar",
        quickNav: "Navegação rápida",
        previous: "Anterior",
        next: "Próxima",
        finish: "Finalizar",
        finishedTitle: "Parabéns!",
        finishedMessage: "Você respondeu todas as perguntas. Deseja revisar as suas respostas?",
        stayHere: "Ficar aqui",
        viewAnswers: "Ver respostas",
        removePhotoTitle: "Excluir foto",
        removePhotoMessage: "Tem certeza de que deseja excluir esta foto?",
        cancel: "Cancelar",
        remove: "Excluir",
        micPermissionTitle: "Permissão necessária",
        micPermissionMessage: "Precisamos de acesso ao microfone para gravar a sua voz.",
        openSettings: "Abrir Ajustes",
        recordError: "Não foi possível iniciar a gravação",
        transcribeError: "Não foi possível processar a gravação",
        photoError: "Não foi possível adicionar a foto",
        listen: "Ouvir pergunta",
        stopListening: "Parar",
        soundOn: "Voz ativada",
        soundOff: "Voz desativada",
        hint: "Você pode escrever a sua resposta, gravá-la com a sua voz ou adicionar uma foto — como preferir.",
        reviewTitle: "Suas Respostas",
        reviewSubtitle: "{{answered}} de {{total}} perguntas respondidas",
        noAnswer: "Sem resposta",
        photoLabel: "Foto anexada",
        save: "Salvar",
        emptyState: "Você ainda não respondeu nenhuma pergunta",
        startNow: "Começar agora",
        generateBookButton: "Criar Livro do Legado",
        placeholderEdit: "Escreva a sua resposta...",
        edit: "Editar",
        pdfTitle: "Criar o seu Livro do Legado",
        pdfSubtitle: "Um documento PDF com todas as suas respostas, criado com carinho para preservar a sua história",
        summaryTitle: "Resumo da sua história",
        questionsAnswered: "Perguntas respondidas:",
        categoriesCompleted: "Categorias concluídas:",
        photosIncluded: "Fotos incluídas:",
        previewTitle: "O que o seu livro incluirá?",
        previews: [
            "Capa personalizada com a data",
            "Todas as suas respostas organizadas por categorias",
            "Design vintage acolhedor e nostálgico",
            "Tipografia clara e fácil de ler",
        ],
        generatePDF: "Gerar Livro em PDF",
        generating: "Gerando...",
        share: "Compartilhar",
        print: "Imprimir",
        regenerate: "Gerar PDF novamente",
        back: "Voltar às respostas",
        successTitle: "Livro criado!",
        successMessage: "O seu Livro do Legado foi gerado com sucesso.",
        errorTitle: "Erro",
        errorMessage: "Não foi possível gerar o PDF. Tente novamente, por favor.",
        noAnswersTitle: "Sem respostas",
        noAnswersMessage: "Você precisa responder a pelo menos uma pergunta para gerar o seu Livro do Legado.",
        incompleteTitle: "Perguntas sem responder",
        incompleteMessage: "Você respondeu {{answered}} de {{total}} perguntas. Deseja continuar e gerar o livro com as respostas atuais?",
        startNewButton: "Começar Nova História",
        startNewTitle: "Nova história",
        startNewMessage: "Isso apagará todas as respostas e fotos atuais. Tem certeza de que deseja começar uma nova história?",
        ok: "OK",
        bookReady: "O seu livro está pronto"
    )
}
