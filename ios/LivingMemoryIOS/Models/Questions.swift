import Foundation

enum StoryCategory: String, CaseIterable, Identifiable {
    case origins, childhood, school, love, children, work, spirituality, legacy

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .origins: "🏡"
        case .childhood: "👶"
        case .school: "🏫"
        case .love: "❤️"
        case .children: "👨‍👧‍👦"
        case .work: "💼"
        case .spirituality: "🌱"
        case .legacy: "🌟"
        }
    }

    func name(_ language: AppLanguage) -> String {
        switch (self, language) {
        case (.origins, .es): "Orígenes y familia"
        case (.origins, .en): "Origins and family"
        case (.childhood, .es): "Infancia y hogar"
        case (.childhood, .en): "Childhood and home"
        case (.school, .es): "Escuela y adolescencia"
        case (.school, .en): "School and adolescence"
        case (.love, .es): "Amor y relaciones"
        case (.love, .en): "Love and relationships"
        case (.children, .es): "Hijos y familia propia"
        case (.children, .en): "Children and own family"
        case (.work, .es): "Trabajo y propósito"
        case (.work, .en): "Work and purpose"
        case (.spirituality, .es): "Espiritualidad y creencias"
        case (.spirituality, .en): "Spirituality and beliefs"
        case (.legacy, .es): "Reflexiones y legado"
        case (.legacy, .en): "Reflections and legacy"
        }
    }

    var questions: [Question] { Question.all.filter { $0.category == self } }
}

struct Question: Identifiable, Hashable {
    let id: Int
    let es: String
    let en: String
    let category: StoryCategory

    func text(_ language: AppLanguage) -> String { language == .es ? es : en }

    static let all: [Question] = [
        Question(id: 1, es: "¿Cuál es tu nombre completo y sabes por qué te lo pusieron?", en: "What is your full name and do you know why they gave it to you?", category: .origins),
        Question(id: 2, es: "¿Dónde naciste y qué historias te han contado sobre tu nacimiento o tus primeros años?", en: "Where were you born and what stories have been told about your birth or early years?", category: .origins),
        Question(id: 3, es: "¿Cómo se llamaban tus padres y qué recuerdas más de cada uno?", en: "What were your parents' names and what do you remember most about each of them?", category: .origins),
        Question(id: 4, es: "¿Qué hacía tu mamá que te hacía sentir amado(a) o cuidado(a)?", en: "What did your mom do that made you feel loved or cared for?", category: .origins),
        Question(id: 5, es: "¿Qué enseñanzas o ejemplos te dejó tu papá?", en: "What teachings or examples did your dad leave you?", category: .origins),
        Question(id: 6, es: "¿Sabes cómo se conocieron y se enamoraron tus padres? ¿Te contaron esa historia?", en: "Do you know how your parents met and fell in love? Did they tell you that story?", category: .origins),
        Question(id: 7, es: "¿Cómo se llamaban tus abuelos y qué recuerdos o historias tienes de ellos?", en: "What were your grandparents' names and what memories or stories do you have of them?", category: .origins),
        Question(id: 8, es: "¿Había alguna costumbre o tradición familiar que viniera de tus abuelos?", en: "Was there any family custom or tradition that came from your grandparents?", category: .origins),
        Question(id: 9, es: "¿Cómo se llaman tus hermanos y cómo los describirías de niños?", en: "What are your siblings' names and how would you describe them as children?", category: .origins),
        Question(id: 10, es: "¿Qué tipo de relación tenías con tus hermanos mientras crecían?", en: "What kind of relationship did you have with your siblings while growing up?", category: .origins),
        Question(id: 11, es: "¿Cuál es uno de los primeros recuerdos que tienes de tu infancia?", en: "What is one of the first memories you have of your childhood?", category: .childhood),
        Question(id: 12, es: "¿Cómo era la casa en la que creciste? ¿Qué tenía de especial?", en: "What was the house you grew up in like? What was special about it?", category: .childhood),
        Question(id: 13, es: "¿Cómo eran las comidas familiares en tu casa?", en: "What were family meals like in your home?", category: .childhood),
        Question(id: 14, es: "¿Qué juegos, juguetes o actividades te gustaban más cuando eras niño(a)?", en: "What games, toys, or activities did you like most as a child?", category: .childhood),
        Question(id: 15, es: "¿Había un lugar secreto, rincón especial o escondite favorito donde jugabas?", en: "Was there a secret place, special corner, or favorite hiding spot where you played?", category: .childhood),
        Question(id: 16, es: "¿Quién fue tu mejor amigo(a) en la infancia y qué hacían juntos?", en: "Who was your best friend in childhood and what did you do together?", category: .childhood),
        Question(id: 17, es: "¿Dónde estudiaste la primaria y cómo fue tu primer día de clases?", en: "Where did you attend elementary school and what was your first day of class like?", category: .school),
        Question(id: 18, es: "¿Tuviste un maestro o maestra que marcó tu vida? ¿Por qué?", en: "Did you have a teacher who made a mark on your life? Why?", category: .school),
        Question(id: 19, es: "¿Qué materias o actividades escolares disfrutabas más?", en: "What subjects or school activities did you enjoy most?", category: .school),
        Question(id: 20, es: "¿Qué recuerdas del recreo, la hora de la comida o tus rutinas después de la escuela?", en: "What do you remember about recess, lunch time, or your after-school routines?", category: .school),
        Question(id: 21, es: "¿Hubo un momento en la escuela que te hizo sentir especialmente orgulloso(a)?", en: "Was there a moment at school that made you feel especially proud?", category: .school),
        Question(id: 22, es: "¿Cómo fue tu experiencia en la secundaria o preparatoria?", en: "What was your experience in middle school or high school like?", category: .school),
        Question(id: 23, es: "¿Qué recuerdas del día de tu graduación de la preparatoria?", en: "What do you remember about your high school graduation day?", category: .school),
        Question(id: 24, es: "¿Alguna vez tuviste problemas en la escuela? ¿Qué pasó y cómo lo resolviste?", en: "Did you ever have problems at school? What happened and how did you resolve it?", category: .school),
        Question(id: 25, es: "¿Puedes contarme la historia de tu primer amor o enamoramiento?", en: "Can you tell me the story of your first love or crush?", category: .love),
        Question(id: 26, es: "¿Cómo conociste a tu pareja o cónyuge?", en: "How did you meet your partner or spouse?", category: .love),
        Question(id: 27, es: "¿Qué recuerdas con más cariño del día de tu boda o de cuando comenzaron su vida juntos?", en: "What do you remember most fondly about your wedding day or when you started your life together?", category: .love),
        Question(id: 28, es: "¿Cuál ha sido el mayor reto y la mayor alegría en tu relación de pareja?", en: "What has been the biggest challenge and the greatest joy in your relationship?", category: .love),
        Question(id: 29, es: "¿Qué consejo darías sobre el amor, el perdón o una relación duradera?", en: "What advice would you give about love, forgiveness, or a lasting relationship?", category: .love),
        Question(id: 30, es: "¿Cómo te sentiste al convertirte en madre o padre por primera vez?", en: "How did you feel when you became a mother or father for the first time?", category: .children),
        Question(id: 31, es: "¿Cómo se llaman tus hijos y cómo eligieron sus nombres?", en: "What are your children's names and how did you choose them?", category: .children),
        Question(id: 32, es: "¿Cuáles han sido algunos de tus momentos favoritos al criar a tus hijos?", en: "What have been some of your favorite moments raising your children?", category: .children),
        Question(id: 33, es: "¿Cómo les enseñabas valores o principios importantes en casa?", en: "How did you teach important values or principles at home?", category: .children),
        Question(id: 34, es: "¿Qué tradiciones familiares crearon o continuaron en tu hogar?", en: "What family traditions did you create or continue in your home?", category: .children),
        Question(id: 35, es: "¿Qué esperabas transmitirles a tus hijos para su vida adulta?", en: "What did you hope to pass on to your children for their adult lives?", category: .children),
        Question(id: 36, es: "¿Cuál fue tu primer trabajo y cómo lo conseguiste?", en: "What was your first job and how did you get it?", category: .work),
        Question(id: 37, es: "¿Qué trabajo o profesión te hizo sentir más útil o realizado(a)?", en: "What job or profession made you feel most useful or fulfilled?", category: .work),
        Question(id: 38, es: "¿Cuál fue el trabajo más difícil que tuviste y qué aprendiste de él?", en: "What was the hardest job you had and what did you learn from it?", category: .work),
        Question(id: 39, es: "¿Cómo afectó tu vida laboral a tu familia, o cómo influyó tu familia en tu trabajo?", en: "How did your work life affect your family, or how did your family influence your work?", category: .work),
        Question(id: 40, es: "¿Qué aprendiste en tu familia sobre la fe, Dios o la espiritualidad?", en: "What did you learn in your family about faith, God, or spirituality?", category: .spirituality),
        Question(id: 41, es: "¿Formaste parte de alguna comunidad religiosa? ¿Qué significó para ti?", en: "Were you part of any religious community? What did it mean to you?", category: .spirituality),
        Question(id: 42, es: "¿Has vivido alguna experiencia espiritual que haya marcado tu vida?", en: "Have you had any spiritual experience that marked your life?", category: .spirituality),
        Question(id: 43, es: "¿Cómo han cambiado tus creencias o tu forma de ver la vida con el tiempo?", en: "How have your beliefs or your way of seeing life changed over time?", category: .spirituality),
        Question(id: 44, es: "¿Cómo expresabas gratitud, especialmente en los momentos difíciles?", en: "How did you express gratitude, especially in difficult times?", category: .spirituality),
        Question(id: 45, es: "¿Cuál consideras que ha sido tu mayor logro en la vida?", en: "What do you consider to have been your greatest achievement in life?", category: .legacy),
        Question(id: 46, es: "¿Qué valores esperas que tus nietos o futuras generaciones conserven?", en: "What values do you hope your grandchildren or future generations will preserve?", category: .legacy),
        Question(id: 47, es: "¿Cómo describirías una vida bien vivida?", en: "How would you describe a life well lived?", category: .legacy),
        Question(id: 48, es: "Si pudieras dejar un mensaje o una historia para tu familia, ¿cuál sería?", en: "If you could leave a message or a story for your family, what would it be?", category: .legacy),
    ]
}
