"""App Store listing text for Living Memory (es-ES, en-US, pt-BR).

Prints a JSON file used by the shell steps that push it to App Store Connect.
Run: python3 screenshots/store_metadata.py > "$TMPDIR/meta.json"
"""

import json

SITE = "https://livingmemory-familylegacy.rork.app"

META = {
    "es-ES": {
        "name": "Mi Historia, Mi Legado",
        "subtitle": "Guarda tu historia de vida",
        "keywords": "memorias,abuelos,familia,biografía,autobiografía,recuerdos,diario,voz,mayores,herencia,genealogía",
        "promotionalText": "Regálale a tu familia la historia de tu vida: 48 preguntas guiadas, respuestas con tu voz y un Libro del Legado en PDF.",
        "description": """¿Te gustaría dejar, para tu familia, la historia de tu vida contada con tus propias palabras?

Living Memory — Mi Historia, Mi Legado te acompaña, paso a paso, con preguntas cálidas y sencillas para que escribas tus recuerdos sin esfuerzo. Y al final te entrega un Libro del Legado en PDF, listo para imprimir y regalar.

CÓMO FUNCIONA

• 48 preguntas sinceras en 8 áreas de tu vida: tu infancia, tu familia, el amor, las tradiciones y más.

• Cada pregunta puede escucharse en voz alta, con una voz natural y amable.

• Responde como prefieras: escribiendo con el teclado o grabando tu voz — la app escribe por ti lo que dictas.

• Agrega una fotografía a cada recuerdo.

• Cuando termines, la app crea tu Libro del Legado: un PDF con diseño clásico y elegante, listo para compartir con quien tú quieras.

PENSADA PARA TI

Letra grande y clara, botones generosos y navegación sencilla: todo está pensado para que se sienta cómoda a cualquier edad. No necesitas saber de tecnología: la app te guía en todo momento.

TU PRIVACIDAD, RESPETADA

Tus respuestas, tu nombre y tus fotografías se guardan únicamente en tu propio dispositivo. No hay cuentas ni publicidad. Cuando grabas tu voz, el audio se envía de forma segura solo para convertirlo en texto y no se conserva.

EN TU IDIOMA

Disponible en español, inglés y portugués.

El regalo más valioso no se compra: se cuenta. Comienza tu historia hoy.""",
    },
    "en-US": {
        "name": "Mi Historia, Mi Legado",
        "subtitle": "Save your life story",
        "keywords": "memories,grandparents,family,biography,legacy,memoir,voice journal,seniors,autobiography,heritage",
        "promotionalText": "Give your family the story of your life: 48 guided questions, voice-recorded answers, and a PDF Legacy Book.",
        "description": """Would you like to leave your family the story of your life, told in your own words?

Living Memory — Mi Historia, Mi Legado guides you, step by step, with warm and simple questions so you can write down your memories without effort. At the end, it gives you a PDF Legacy Book, ready to print and share.

HOW IT WORKS

• 48 heartfelt questions across 8 areas of your life: childhood, family, love, traditions, and more.

• Every question can be read aloud with a natural, friendly voice.

• Answer the way you prefer: typing with the keyboard, or recording your voice — the app writes down what you dictate.

• Add a photograph to each memory.

• When you finish, the app creates your Legacy Book: a beautifully designed PDF, ready to share with whoever you choose.

DESIGNED FOR YOU

Large, clear text, generous buttons, and simple navigation: everything is designed to feel comfortable at any age. You don't need to be a tech expert — the app guides you every step of the way.

YOUR PRIVACY, RESPECTED

Your answers, your name, and your photographs are stored only on your own device. No accounts and no ads. When you record your voice, the audio is sent securely only to turn it into text, and it is not kept.

IN YOUR LANGUAGE

Available in Spanish, English, and Portuguese.

The most valuable gift can't be bought: it's told. Start your story today.""",
    },
    "pt-BR": {
        "name": "Minha História, Meu Legado",
        "subtitle": "Guarde a história da sua vida",
        "keywords": "memórias,avós,família,biografia,autobiografia,lembranças,recordações,diário,voz,idosos,herança",
        "promotionalText": "Presenteie sua família com a história da sua vida: 48 perguntas guiadas, respostas com sua voz e um Livro do Legado em PDF.",
        "description": """Você gostaria de deixar para sua família a história da sua vida, contada com suas próprias palavras?

Living Memory — Minha História, Meu Legado acompanha você, passo a passo, com perguntas calorosas e simples para que você registre suas lembranças sem esforço. No final, você recebe um Livro do Legado em PDF, pronto para imprimir e presentear.

COMO FUNCIONA

• 48 perguntas sinceras em 8 áreas da sua vida: infância, família, amor, tradições e muito mais.

• Cada pergunta pode ser ouvida em voz alta, com uma voz natural e gentil.

• Responda como preferir: digitando no teclado ou gravando sua voz — o app escreve para você o que você dita.

• Adicione uma fotografia a cada lembrança.

• Quando terminar, o app cria o seu Livro do Legado: um PDF com design clássico e elegante, pronto para compartilhar com quem você quiser.

PENSADO PARA VOCÊ

Letras grandes e claras, botões generosos e navegação simples: tudo foi pensado para ser confortável em qualquer idade. Você não precisa entender de tecnologia — o app guia você o tempo todo.

SUA PRIVACIDADE, RESPEITADA

Suas respostas, seu nome e suas fotografias ficam guardados apenas no seu próprio aparelho. Sem contas e sem anúncios. Quando você grava sua voz, o áudio é enviado com segurança apenas para ser transformado em texto e não é armazenado.

NO SEU IDIOMA

Disponível em espanhol, inglês e português.

O presente mais valioso não se compra: se conta. Comece sua história hoje.""",
    },
}

for loc, m in META.items():
    assert len(m["name"]) <= 30, loc
    assert len(m["subtitle"]) <= 30, loc
    assert len(m["keywords"].encode("utf-8")) <= 100 or len(m["keywords"]) <= 100, loc
    assert len(m["promotionalText"]) <= 170, loc
    assert len(m["description"]) <= 4000, loc
    m["supportUrl"] = f"{SITE}/support?lang={loc[:2]}"
    m["marketingUrl"] = f"{SITE}/?lang={loc[:2]}"
    m["privacyPolicyUrl"] = f"{SITE}/privacy?lang={loc[:2]}"

print(json.dumps(META, ensure_ascii=False))
