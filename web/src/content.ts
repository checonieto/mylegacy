export type Lang = "es" | "en" | "pt";

export const SUPPORT_EMAIL = "bisonmarketingdigital@gmail.com";
export const EFFECTIVE_DATE: Record<Lang, string> = {
  es: "11 de noviembre de 2026",
  en: "November 11, 2026",
  pt: "11 de novembro de 2026",
};

export type Section = { title: string; paragraphs?: string[]; bullets?: string[] };

type Content = {
  appName: string;
  tagline: string;
  nav: { home: string; support: string; privacy: string; terms: string };
  home: {
    eyebrow: string;
    title: string;
    intro: string;
    features: { title: string; text: string }[];
    linksTitle: string;
    linksText: string;
    quote: string;
  };
  support: { title: string; intro: string; emailLabel: string; sections: Section[] };
  privacy: { title: string; intro: string; sections: Section[] };
  terms: { title: string; intro: string; sections: Section[] };
  effective: string;
  footer: string;
};

export const content: Record<Lang, Content> = {
  es: {
    appName: "Mi Historia, Mi Legado",
    tagline: "Living Memory",
    nav: { home: "Inicio", support: "Soporte", privacy: "Privacidad", terms: "Términos" },
    home: {
      eyebrow: "Living Memory para iPhone y iPad",
      title: "Tu vida, contada con tus propias palabras.",
      intro:
        "Mi Historia, Mi Legado te guía con 48 preguntas cálidas para que escribas o grabes tus recuerdos con tu voz. Al final, la app crea un Libro del Legado en PDF, listo para imprimir y regalar a tu familia.",
      features: [
        { title: "Preguntas leídas en voz alta", text: "Cada pregunta puede escucharse con una voz natural y amable." },
        { title: "Responde escribiendo o hablando", text: "Graba tu respuesta y la app la convierte en texto por ti." },
        { title: "Una foto por recuerdo", text: "Acompaña cada respuesta con una fotografía de tu álbum." },
        { title: "Tu Libro del Legado", text: "Un PDF de diseño clásico, para imprimir o compartir." },
      ],
      linksTitle: "Ayuda e información legal",
      linksText: "Estas páginas reúnen el soporte, la política de privacidad y los términos de uso de la app.",
      quote: "“Las historias de vida son el regalo más valioso que podemos dejar.”",
    },
    support: {
      title: "Soporte",
      intro: "¿Tienes una duda o algo no funciona como esperabas? Escríbenos y te ayudaremos con gusto.",
      emailLabel: "Escríbenos a",
      sections: [
        {
          title: "Qué incluir en tu mensaje",
          bullets: [
            "La versión de la app (Ajustes de iPhone › Apps › Mi Historia, Mi Legado).",
            "El modelo de tu dispositivo (por ejemplo, iPhone 15 o iPad Air).",
            "La versión de iOS o iPadOS.",
            "Una descripción de lo que pasó y, si puedes, una captura de pantalla.",
          ],
        },
        {
          title: "Preguntas frecuentes",
          bullets: [
            "¿Dónde se guardan mis respuestas? Solo en tu dispositivo. No hay cuentas ni nube.",
            "La grabación de voz no funciona: revisa en Ajustes › Privacidad y seguridad › Micrófono que la app tenga permiso. La transcripción necesita conexión a internet.",
            "No escucho las preguntas: activa el botón de voz en la app y sube el volumen; revisa que el interruptor de silencio esté apagado.",
            "¿Cómo empiezo una historia nueva? En la pantalla del Libro del Legado, toca “Comenzar Nueva Historia”. Esto borra las respuestas y fotos actuales.",
            "¿Cómo imprimo mi libro? Genera el PDF y toca “Imprimir” o “Compartir” para enviarlo a una impresora, a tu correo o a tus familiares.",
          ],
        },
        {
          title: "Compras y reembolsos",
          paragraphs: [
            "La app se compra una sola vez en el App Store; no tiene suscripciones ni compras dentro de la app. Los pagos y reembolsos los gestiona Apple en reportaproblem.apple.com.",
          ],
        },
      ],
    },
    privacy: {
      title: "Política de Privacidad",
      intro:
        "Tu historia es tuya. Mi Historia, Mi Legado está diseñada para guardar tus recuerdos en tu propio dispositivo, sin cuentas, sin publicidad y sin rastreo.",
      sections: [
        {
          title: "Quién opera la app",
          paragraphs: [`La app Living Memory — Mi Historia, Mi Legado. Para cualquier consulta de privacidad, escríbenos a ${SUPPORT_EMAIL}.`],
        },
        {
          title: "Qué información guarda la app",
          bullets: [
            "El nombre de la persona cuya historia se registra.",
            "Tus respuestas escritas o transcritas.",
            "Las fotos que eliges de tu galería para cada pregunta.",
            "Tus preferencias (idioma y voz activada o desactivada).",
          ],
          paragraphs: [
            "Toda esta información se guarda únicamente en tu dispositivo. No la recibimos, no la vemos y no la almacenamos en ningún servidor.",
          ],
        },
        {
          title: "Micrófono y transcripción de voz",
          paragraphs: [
            "Si eliges grabar una respuesta, la app usa el micrófono con tu permiso. Al terminar la grabación, el audio se envía de forma cifrada a un servicio de transcripción de voz por inteligencia artificial, que devuelve el texto. El audio se usa solo para producir esa transcripción; la app no lo conserva y nosotros no lo guardamos.",
          ],
        },
        {
          title: "Lectura de preguntas en voz alta",
          paragraphs: [
            "Para leer en voz alta, la app envía el texto de las preguntas e instrucciones (nunca tus respuestas, tu nombre ni tus fotos) a un servicio de voz por inteligencia artificial. El audio resultante se guarda en tu dispositivo para no volver a descargarlo. Si no hay conexión, se usa la voz integrada de iOS.",
          ],
        },
        {
          title: "Fotos",
          paragraphs: [
            "La app solo accede a las fotos que tú seleccionas mediante el selector de fotos de Apple. Una copia de cada foto elegida se guarda dentro de la app, en tu dispositivo.",
          ],
        },
        {
          title: "Lo que no hacemos",
          bullets: [
            "No pedimos crear una cuenta.",
            "No usamos publicidad, analítica ni herramientas de rastreo.",
            "No vendemos ni compartimos tu información con terceros.",
          ],
        },
        {
          title: "Compartir tu libro",
          paragraphs: [
            "El Libro del Legado en PDF se crea en tu dispositivo. Solo sale de él si tú decides compartirlo o imprimirlo mediante las opciones de iOS.",
          ],
        },
        {
          title: "Conservación y eliminación",
          paragraphs: [
            "Tus datos permanecen en tu dispositivo hasta que tú los borres. Puedes eliminarlos con “Comenzar Nueva Historia” o borrando la app. Si usas copias de seguridad de iCloud o del equipo, Apple puede incluir los datos de la app en esas copias según tu configuración.",
          ],
        },
        {
          title: "Niños",
          paragraphs: ["La app no está dirigida a niños menores de 13 años y no recopila intencionalmente información de ellos."],
        },
        {
          title: "Cambios a esta política",
          paragraphs: ["Si actualizamos esta política, publicaremos la nueva versión en esta página con su fecha de vigencia."],
        },
        { title: "Contacto", paragraphs: [`Escríbenos a ${SUPPORT_EMAIL}.`] },
      ],
    },
    terms: {
      title: "Términos de Uso",
      intro: "Al descargar o usar Mi Historia, Mi Legado aceptas estos términos. Por favor, léelos con calma.",
      sections: [
        {
          title: "Licencia de uso",
          paragraphs: [
            "Te otorgamos una licencia personal, no exclusiva e intransferible para usar la app en los dispositivos Apple que poseas o controles, de acuerdo con el Acuerdo de Licencia de Usuario Final estándar de Apple.",
          ],
        },
        {
          title: "Tu contenido",
          paragraphs: [
            "Tus respuestas, fotos y el Libro del Legado te pertenecen. Eres responsable del contenido que agregas, incluido contar con permiso para usar las fotos y la información de otras personas.",
          ],
        },
        {
          title: "Funciones con inteligencia artificial",
          paragraphs: [
            "La transcripción de voz y la lectura en voz alta usan servicios de inteligencia artificial. Las transcripciones pueden contener errores; revisa y edita tus respuestas antes de crear tu libro.",
          ],
        },
        {
          title: "Compra",
          paragraphs: [
            "La app se vende como compra única en el App Store. No hay suscripciones ni cargos recurrentes. Los reembolsos se rigen por las políticas de Apple.",
          ],
        },
        {
          title: "Uso aceptable",
          bullets: [
            "No uses la app para fines ilegales ni para dañar a otras personas.",
            "No intentes descompilar, modificar ni interferir con el funcionamiento de la app.",
          ],
        },
        {
          title: "Disponibilidad y cambios",
          paragraphs: [
            "Podemos mejorar o modificar la app con el tiempo. Las funciones de voz requieren conexión a internet y pueden no estar disponibles temporalmente.",
          ],
        },
        {
          title: "Respaldo de tu información",
          paragraphs: [
            "Como tus datos viven solo en tu dispositivo, te recomendamos generar y guardar tu PDF con frecuencia. No podemos recuperar información borrada o perdida.",
          ],
        },
        {
          title: "Exención y limitación de responsabilidad",
          paragraphs: [
            "La app se ofrece “tal cual”. En la medida permitida por la ley, no somos responsables de daños indirectos ni de la pérdida de datos derivada del uso de la app.",
          ],
        },
        { title: "Contacto", paragraphs: [`Escríbenos a ${SUPPORT_EMAIL}.`] },
      ],
    },
    effective: "Vigente desde",
    footer: "Hecho con cariño para preservar las historias de cada familia.",
  },

  en: {
    appName: "My Story, My Legacy",
    tagline: "Living Memory",
    nav: { home: "Home", support: "Support", privacy: "Privacy", terms: "Terms" },
    home: {
      eyebrow: "Living Memory for iPhone and iPad",
      title: "Your life, told in your own words.",
      intro:
        "My Story, My Legacy guides you through 48 warm questions so you can write or record your memories with your voice. At the end, the app creates a PDF Legacy Book, ready to print and give to your family.",
      features: [
        { title: "Questions read aloud", text: "Every question can be heard in a natural, friendly voice." },
        { title: "Answer by typing or speaking", text: "Record your answer and the app turns it into text for you." },
        { title: "A photo for every memory", text: "Pair each answer with a photograph from your library." },
        { title: "Your Legacy Book", text: "A classic-design PDF, ready to print or share." },
      ],
      linksTitle: "Help and legal information",
      linksText: "These pages contain the app's support, privacy policy, and terms of use.",
      quote: "“Life stories are the most valuable gift we can leave.”",
    },
    support: {
      title: "Support",
      intro: "Have a question, or is something not working as expected? Write to us and we'll gladly help.",
      emailLabel: "Email us at",
      sections: [
        {
          title: "What to include in your message",
          bullets: [
            "The app version (iPhone Settings › Apps › My Story, My Legacy).",
            "Your device model (for example, iPhone 15 or iPad Air).",
            "Your iOS or iPadOS version.",
            "A description of what happened and, if possible, a screenshot.",
          ],
        },
        {
          title: "Frequently asked questions",
          bullets: [
            "Where are my answers stored? Only on your device. There are no accounts and no cloud.",
            "Voice recording doesn't work: check Settings › Privacy & Security › Microphone to make sure the app has permission. Transcription needs an internet connection.",
            "I can't hear the questions: turn on the voice button in the app, raise the volume, and make sure silent mode is off.",
            "How do I start a new story? On the Legacy Book screen, tap “Start New Story”. This deletes the current answers and photos.",
            "How do I print my book? Generate the PDF and tap “Print” or “Share” to send it to a printer, your email, or your family.",
          ],
        },
        {
          title: "Purchases and refunds",
          paragraphs: [
            "The app is a one-time purchase on the App Store, with no subscriptions or in-app purchases. Payments and refunds are handled by Apple at reportaproblem.apple.com.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "Your story is yours. My Story, My Legacy is designed to keep your memories on your own device — no accounts, no ads, and no tracking.",
      sections: [
        {
          title: "Who operates the app",
          paragraphs: [`The Living Memory — My Story, My Legacy app. For any privacy question, email ${SUPPORT_EMAIL}.`],
        },
        {
          title: "What the app stores",
          bullets: [
            "The name of the person whose story is being recorded.",
            "Your typed or transcribed answers.",
            "The photos you choose from your library for each question.",
            "Your preferences (language and voice on or off).",
          ],
          paragraphs: ["All of this information is stored only on your device. We do not receive it, see it, or store it on any server."],
        },
        {
          title: "Microphone and voice transcription",
          paragraphs: [
            "If you choose to record an answer, the app uses the microphone with your permission. When you finish recording, the audio is sent over an encrypted connection to an AI speech-to-text service, which returns the text. The audio is used only to produce that transcription; the app does not keep it and we do not store it.",
          ],
        },
        {
          title: "Reading questions aloud",
          paragraphs: [
            "To read aloud, the app sends the text of the questions and instructions (never your answers, your name, or your photos) to an AI voice service. The resulting audio is saved on your device so it doesn't need to be downloaded again. Without a connection, the built-in iOS voice is used.",
          ],
        },
        {
          title: "Photos",
          paragraphs: [
            "The app only accesses the photos you select through Apple's photo picker. A copy of each chosen photo is saved inside the app, on your device.",
          ],
        },
        {
          title: "What we don't do",
          bullets: [
            "We don't ask you to create an account.",
            "We don't use advertising, analytics, or tracking tools.",
            "We don't sell or share your information with third parties.",
          ],
        },
        {
          title: "Sharing your book",
          paragraphs: [
            "The PDF Legacy Book is created on your device. It only leaves your device if you choose to share or print it using iOS options.",
          ],
        },
        {
          title: "Retention and deletion",
          paragraphs: [
            "Your data stays on your device until you delete it. You can remove it with “Start New Story” or by deleting the app. If you use iCloud or computer backups, Apple may include the app's data in those backups according to your settings.",
          ],
        },
        {
          title: "Children",
          paragraphs: ["The app is not directed at children under 13 and does not knowingly collect information from them."],
        },
        {
          title: "Changes to this policy",
          paragraphs: ["If we update this policy, we will post the new version on this page with its effective date."],
        },
        { title: "Contact", paragraphs: [`Email us at ${SUPPORT_EMAIL}.`] },
      ],
    },
    terms: {
      title: "Terms of Use",
      intro: "By downloading or using My Story, My Legacy, you agree to these terms. Please read them carefully.",
      sections: [
        {
          title: "License",
          paragraphs: [
            "We grant you a personal, non-exclusive, non-transferable license to use the app on Apple devices you own or control, in accordance with Apple's standard End User License Agreement.",
          ],
        },
        {
          title: "Your content",
          paragraphs: [
            "Your answers, photos, and Legacy Book belong to you. You are responsible for the content you add, including having permission to use other people's photos and information.",
          ],
        },
        {
          title: "AI-powered features",
          paragraphs: [
            "Voice transcription and read-aloud use AI services. Transcriptions may contain mistakes; review and edit your answers before creating your book.",
          ],
        },
        {
          title: "Purchase",
          paragraphs: [
            "The app is sold as a one-time purchase on the App Store. There are no subscriptions or recurring charges. Refunds are governed by Apple's policies.",
          ],
        },
        {
          title: "Acceptable use",
          bullets: [
            "Don't use the app for illegal purposes or to harm others.",
            "Don't attempt to decompile, modify, or interfere with the app.",
          ],
        },
        {
          title: "Availability and changes",
          paragraphs: [
            "We may improve or change the app over time. Voice features require an internet connection and may be temporarily unavailable.",
          ],
        },
        {
          title: "Backing up your information",
          paragraphs: [
            "Because your data lives only on your device, we recommend generating and saving your PDF regularly. We cannot recover deleted or lost information.",
          ],
        },
        {
          title: "Disclaimer and limitation of liability",
          paragraphs: [
            "The app is provided “as is”. To the extent permitted by law, we are not liable for indirect damages or data loss arising from use of the app.",
          ],
        },
        { title: "Contact", paragraphs: [`Email us at ${SUPPORT_EMAIL}.`] },
      ],
    },
    effective: "Effective",
    footer: "Made with care to preserve every family's stories.",
  },

  pt: {
    appName: "Minha História, Meu Legado",
    tagline: "Living Memory",
    nav: { home: "Início", support: "Suporte", privacy: "Privacidade", terms: "Termos" },
    home: {
      eyebrow: "Living Memory para iPhone e iPad",
      title: "A sua vida, contada com as suas próprias palavras.",
      intro:
        "Minha História, Meu Legado guia você com 48 perguntas acolhedoras para escrever ou gravar as suas memórias com a sua voz. No final, o app cria um Livro do Legado em PDF, pronto para imprimir e presentear a sua família.",
      features: [
        { title: "Perguntas lidas em voz alta", text: "Cada pergunta pode ser ouvida com uma voz natural e gentil." },
        { title: "Responda escrevendo ou falando", text: "Grave a sua resposta e o app a transforma em texto para você." },
        { title: "Uma foto para cada memória", text: "Acompanhe cada resposta com uma fotografia da sua galeria." },
        { title: "O seu Livro do Legado", text: "Um PDF com design clássico, para imprimir ou compartilhar." },
      ],
      linksTitle: "Ajuda e informações legais",
      linksText: "Estas páginas reúnem o suporte, a política de privacidade e os termos de uso do app.",
      quote: "“As histórias de vida são o presente mais valioso que podemos deixar.”",
    },
    support: {
      title: "Suporte",
      intro: "Tem alguma dúvida ou algo não funciona como esperado? Escreva para nós e teremos prazer em ajudar.",
      emailLabel: "Escreva para",
      sections: [
        {
          title: "O que incluir na sua mensagem",
          bullets: [
            "A versão do app (Ajustes do iPhone › Apps › Minha História, Meu Legado).",
            "O modelo do seu dispositivo (por exemplo, iPhone 15 ou iPad Air).",
            "A versão do iOS ou iPadOS.",
            "Uma descrição do que aconteceu e, se possível, uma captura de tela.",
          ],
        },
        {
          title: "Perguntas frequentes",
          bullets: [
            "Onde ficam as minhas respostas? Somente no seu dispositivo. Não há contas nem nuvem.",
            "A gravação de voz não funciona: verifique em Ajustes › Privacidade e Segurança › Microfone se o app tem permissão. A transcrição precisa de conexão com a internet.",
            "Não ouço as perguntas: ative o botão de voz no app, aumente o volume e verifique se o modo silencioso está desligado.",
            "Como começo uma nova história? Na tela do Livro do Legado, toque em “Começar Nova História”. Isso apaga as respostas e fotos atuais.",
            "Como imprimo o meu livro? Gere o PDF e toque em “Imprimir” ou “Compartilhar” para enviá-lo a uma impressora, ao seu e-mail ou à sua família.",
          ],
        },
        {
          title: "Compras e reembolsos",
          paragraphs: [
            "O app é uma compra única na App Store, sem assinaturas nem compras dentro do app. Pagamentos e reembolsos são gerenciados pela Apple em reportaproblem.apple.com.",
          ],
        },
      ],
    },
    privacy: {
      title: "Política de Privacidade",
      intro:
        "A sua história é sua. Minha História, Meu Legado foi criado para guardar as suas memórias no seu próprio dispositivo — sem contas, sem anúncios e sem rastreamento.",
      sections: [
        {
          title: "Quem opera o app",
          paragraphs: [`O app Living Memory — Minha História, Meu Legado. Para qualquer dúvida de privacidade, escreva para ${SUPPORT_EMAIL}.`],
        },
        {
          title: "O que o app guarda",
          bullets: [
            "O nome da pessoa cuja história está sendo registrada.",
            "As suas respostas escritas ou transcritas.",
            "As fotos que você escolhe da sua galeria para cada pergunta.",
            "As suas preferências (idioma e voz ativada ou desativada).",
          ],
          paragraphs: ["Todas essas informações ficam somente no seu dispositivo. Não as recebemos, não as vemos e não as armazenamos em nenhum servidor."],
        },
        {
          title: "Microfone e transcrição de voz",
          paragraphs: [
            "Se você escolher gravar uma resposta, o app usa o microfone com a sua permissão. Ao terminar a gravação, o áudio é enviado por conexão criptografada a um serviço de transcrição de voz com inteligência artificial, que devolve o texto. O áudio é usado apenas para produzir essa transcrição; o app não o guarda e nós não o armazenamos.",
          ],
        },
        {
          title: "Leitura das perguntas em voz alta",
          paragraphs: [
            "Para ler em voz alta, o app envia o texto das perguntas e instruções (nunca as suas respostas, o seu nome ou as suas fotos) a um serviço de voz com inteligência artificial. O áudio resultante fica salvo no seu dispositivo para não precisar ser baixado de novo. Sem conexão, é usada a voz integrada do iOS.",
          ],
        },
        {
          title: "Fotos",
          paragraphs: [
            "O app acessa apenas as fotos que você seleciona pelo seletor de fotos da Apple. Uma cópia de cada foto escolhida é salva dentro do app, no seu dispositivo.",
          ],
        },
        {
          title: "O que não fazemos",
          bullets: [
            "Não pedimos que você crie uma conta.",
            "Não usamos publicidade, análise de uso nem ferramentas de rastreamento.",
            "Não vendemos nem compartilhamos as suas informações com terceiros.",
          ],
        },
        {
          title: "Compartilhar o seu livro",
          paragraphs: [
            "O Livro do Legado em PDF é criado no seu dispositivo. Ele só sai do dispositivo se você decidir compartilhá-lo ou imprimi-lo pelas opções do iOS.",
          ],
        },
        {
          title: "Retenção e exclusão",
          paragraphs: [
            "Os seus dados permanecem no seu dispositivo até que você os apague. Você pode removê-los com “Começar Nova História” ou excluindo o app. Se você usa backups do iCloud ou do computador, a Apple pode incluir os dados do app nesses backups conforme as suas configurações.",
          ],
        },
        {
          title: "Crianças",
          paragraphs: ["O app não é direcionado a crianças menores de 13 anos e não coleta intencionalmente informações delas."],
        },
        {
          title: "Alterações nesta política",
          paragraphs: ["Se atualizarmos esta política, publicaremos a nova versão nesta página com a data de vigência."],
        },
        { title: "Contato", paragraphs: [`Escreva para ${SUPPORT_EMAIL}.`] },
      ],
    },
    terms: {
      title: "Termos de Uso",
      intro: "Ao baixar ou usar Minha História, Meu Legado, você aceita estes termos. Leia-os com calma, por favor.",
      sections: [
        {
          title: "Licença de uso",
          paragraphs: [
            "Concedemos a você uma licença pessoal, não exclusiva e intransferível para usar o app nos dispositivos Apple que você possui ou controla, de acordo com o Contrato de Licença de Usuário Final padrão da Apple.",
          ],
        },
        {
          title: "O seu conteúdo",
          paragraphs: [
            "As suas respostas, fotos e o Livro do Legado pertencem a você. Você é responsável pelo conteúdo que adiciona, incluindo ter permissão para usar fotos e informações de outras pessoas.",
          ],
        },
        {
          title: "Recursos com inteligência artificial",
          paragraphs: [
            "A transcrição de voz e a leitura em voz alta usam serviços de inteligência artificial. As transcrições podem conter erros; revise e edite as suas respostas antes de criar o seu livro.",
          ],
        },
        {
          title: "Compra",
          paragraphs: [
            "O app é vendido como compra única na App Store. Não há assinaturas nem cobranças recorrentes. Os reembolsos seguem as políticas da Apple.",
          ],
        },
        {
          title: "Uso aceitável",
          bullets: [
            "Não use o app para fins ilegais nem para prejudicar outras pessoas.",
            "Não tente descompilar, modificar ou interferir no funcionamento do app.",
          ],
        },
        {
          title: "Disponibilidade e alterações",
          paragraphs: [
            "Podemos melhorar ou modificar o app com o tempo. Os recursos de voz exigem conexão com a internet e podem ficar temporariamente indisponíveis.",
          ],
        },
        {
          title: "Backup das suas informações",
          paragraphs: [
            "Como os seus dados ficam apenas no seu dispositivo, recomendamos gerar e guardar o seu PDF com frequência. Não podemos recuperar informações apagadas ou perdidas.",
          ],
        },
        {
          title: "Isenção e limitação de responsabilidade",
          paragraphs: [
            "O app é oferecido “no estado em que se encontra”. Na medida permitida por lei, não nos responsabilizamos por danos indiretos ou perda de dados decorrentes do uso do app.",
          ],
        },
        { title: "Contato", paragraphs: [`Escreva para ${SUPPORT_EMAIL}.`] },
      ],
    },
    effective: "Em vigor desde",
    footer: "Feito com carinho para preservar as histórias de cada família.",
  },
};
