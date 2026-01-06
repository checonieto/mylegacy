export interface Question {
  id: number;
  textEs: string;
  textEn: string;
  category: string;
}

export interface Category {
  name: string;
  icon: string;
  startIndex: number;
  endIndex: number;
}

export const CATEGORIES: Category[] = [
  { name: 'Orígenes y familia', icon: '🏡', startIndex: 1, endIndex: 10 },
  { name: 'Infancia y hogar', icon: '👶', startIndex: 11, endIndex: 16 },
  { name: 'Escuela y adolescencia', icon: '🏫', startIndex: 17, endIndex: 24 },
  { name: 'Amor y relaciones', icon: '❤️', startIndex: 25, endIndex: 29 },
  { name: 'Hijos y familia propia', icon: '👨‍👧‍👦', startIndex: 30, endIndex: 35 },
  { name: 'Trabajo y propósito', icon: '💼', startIndex: 36, endIndex: 39 },
  { name: 'Espiritualidad y creencias', icon: '🌱', startIndex: 40, endIndex: 44 },
  { name: 'Reflexiones y legado', icon: '🌟', startIndex: 45, endIndex: 48 },
];

export const QUESTIONS: Question[] = [
  { id: 1, textEs: '¿Cuál es tu nombre completo y sabes por qué te lo pusieron?', textEn: 'What is your full name and do you know why they gave it to you?', category: 'Orígenes y familia' },
  { id: 2, textEs: '¿Dónde naciste y qué historias te han contado sobre tu nacimiento o tus primeros años?', textEn: 'Where were you born and what stories have been told about your birth or early years?', category: 'Orígenes y familia' },
  { id: 3, textEs: '¿Cómo se llamaban tus padres y qué recuerdas más de cada uno?', textEn: 'What were your parents\' names and what do you remember most about each of them?', category: 'Orígenes y familia' },
  { id: 4, textEs: '¿Qué hacía tu mamá que te hacía sentir amado(a) o cuidado(a)?', textEn: 'What did your mom do that made you feel loved or cared for?', category: 'Orígenes y familia' },
  { id: 5, textEs: '¿Qué enseñanzas o ejemplos te dejó tu papá?', textEn: 'What teachings or examples did your dad leave you?', category: 'Orígenes y familia' },
  { id: 6, textEs: '¿Sabes cómo se conocieron y se enamoraron tus padres? ¿Te contaron esa historia?', textEn: 'Do you know how your parents met and fell in love? Did they tell you that story?', category: 'Orígenes y familia' },
  { id: 7, textEs: '¿Cómo se llamaban tus abuelos y qué recuerdos o historias tienes de ellos?', textEn: 'What were your grandparents\' names and what memories or stories do you have of them?', category: 'Orígenes y familia' },
  { id: 8, textEs: '¿Había alguna costumbre o tradición familiar que viniera de tus abuelos?', textEn: 'Was there any family custom or tradition that came from your grandparents?', category: 'Orígenes y familia' },
  { id: 9, textEs: '¿Cómo se llaman tus hermanos y cómo los describirías de niños?', textEn: 'What are your siblings\' names and how would you describe them as children?', category: 'Orígenes y familia' },
  { id: 10, textEs: '¿Qué tipo de relación tenías con tus hermanos mientras crecían?', textEn: 'What kind of relationship did you have with your siblings while growing up?', category: 'Orígenes y familia' },
  
  { id: 11, textEs: '¿Cuál es uno de los primeros recuerdos que tienes de tu infancia?', textEn: 'What is one of the first memories you have of your childhood?', category: 'Infancia y hogar' },
  { id: 12, textEs: '¿Cómo era la casa en la que creciste? ¿Qué tenía de especial?', textEn: 'What was the house you grew up in like? What was special about it?', category: 'Infancia y hogar' },
  { id: 13, textEs: '¿Cómo eran las comidas familiares en tu casa?', textEn: 'What were family meals like in your home?', category: 'Infancia y hogar' },
  { id: 14, textEs: '¿Qué juegos, juguetes o actividades te gustaban más cuando eras niño(a)?', textEn: 'What games, toys, or activities did you like most as a child?', category: 'Infancia y hogar' },
  { id: 15, textEs: '¿Había un lugar secreto, rincón especial o escondite favorito donde jugabas?', textEn: 'Was there a secret place, special corner, or favorite hiding spot where you played?', category: 'Infancia y hogar' },
  { id: 16, textEs: '¿Quién fue tu mejor amigo(a) en la infancia y qué hacían juntos?', textEn: 'Who was your best friend in childhood and what did you do together?', category: 'Infancia y hogar' },
  
  { id: 17, textEs: '¿Dónde estudiaste la primaria y cómo fue tu primer día de clases?', textEn: 'Where did you attend elementary school and what was your first day of class like?', category: 'Escuela y adolescencia' },
  { id: 18, textEs: '¿Tuviste un maestro o maestra que marcó tu vida? ¿Por qué?', textEn: 'Did you have a teacher who made a mark on your life? Why?', category: 'Escuela y adolescencia' },
  { id: 19, textEs: '¿Qué materias o actividades escolares disfrutabas más?', textEn: 'What subjects or school activities did you enjoy most?', category: 'Escuela y adolescencia' },
  { id: 20, textEs: '¿Qué recuerdas del recreo, la hora de la comida o tus rutinas después de la escuela?', textEn: 'What do you remember about recess, lunch time, or your after-school routines?', category: 'Escuela y adolescencia' },
  { id: 21, textEs: '¿Hubo un momento en la escuela que te hizo sentir especialmente orgulloso(a)?', textEn: 'Was there a moment at school that made you feel especially proud?', category: 'Escuela y adolescencia' },
  { id: 22, textEs: '¿Cómo fue tu experiencia en la secundaria o preparatoria?', textEn: 'What was your experience in middle school or high school like?', category: 'Escuela y adolescencia' },
  { id: 23, textEs: '¿Qué recuerdas del día de tu graduación de la preparatoria?', textEn: 'What do you remember about your high school graduation day?', category: 'Escuela y adolescencia' },
  { id: 24, textEs: '¿Alguna vez tuviste problemas en la escuela? ¿Qué pasó y cómo lo resolviste?', textEn: 'Did you ever have problems at school? What happened and how did you resolve it?', category: 'Escuela y adolescencia' },
  
  { id: 25, textEs: '¿Puedes contarme la historia de tu primer amor o enamoramiento?', textEn: 'Can you tell me the story of your first love or crush?', category: 'Amor y relaciones' },
  { id: 26, textEs: '¿Cómo conociste a tu pareja o cónyuge?', textEn: 'How did you meet your partner or spouse?', category: 'Amor y relaciones' },
  { id: 27, textEs: '¿Qué recuerdas con más cariño del día de tu boda o de cuando comenzaron su vida juntos?', textEn: 'What do you remember most fondly about your wedding day or when you started your life together?', category: 'Amor y relaciones' },
  { id: 28, textEs: '¿Cuál ha sido el mayor reto y la mayor alegría en tu relación de pareja?', textEn: 'What has been the biggest challenge and the greatest joy in your relationship?', category: 'Amor y relaciones' },
  { id: 29, textEs: '¿Qué consejo darías sobre el amor, el perdón o una relación duradera?', textEn: 'What advice would you give about love, forgiveness, or a lasting relationship?', category: 'Amor y relaciones' },
  
  { id: 30, textEs: '¿Cómo te sentiste al convertirte en madre o padre por primera vez?', textEn: 'How did you feel when you became a mother or father for the first time?', category: 'Hijos y familia propia' },
  { id: 31, textEs: '¿Cómo se llaman tus hijos y cómo eligieron sus nombres?', textEn: 'What are your children\'s names and how did you choose them?', category: 'Hijos y familia propia' },
  { id: 32, textEs: '¿Cuáles han sido algunos de tus momentos favoritos al criar a tus hijos?', textEn: 'What have been some of your favorite moments raising your children?', category: 'Hijos y familia propia' },
  { id: 33, textEs: '¿Cómo les enseñabas valores o principios importantes en casa?', textEn: 'How did you teach important values or principles at home?', category: 'Hijos y familia propia' },
  { id: 34, textEs: '¿Qué tradiciones familiares crearon o continuaron en tu hogar?', textEn: 'What family traditions did you create or continue in your home?', category: 'Hijos y familia propia' },
  { id: 35, textEs: '¿Qué esperabas transmitirles a tus hijos para su vida adulta?', textEn: 'What did you hope to pass on to your children for their adult lives?', category: 'Hijos y familia propia' },
  
  { id: 36, textEs: '¿Cuál fue tu primer trabajo y cómo lo conseguiste?', textEn: 'What was your first job and how did you get it?', category: 'Trabajo y propósito' },
  { id: 37, textEs: '¿Qué trabajo o profesión te hizo sentir más útil o realizado(a)?', textEn: 'What job or profession made you feel most useful or fulfilled?', category: 'Trabajo y propósito' },
  { id: 38, textEs: '¿Cuál fue el trabajo más difícil que tuviste y qué aprendiste de él?', textEn: 'What was the hardest job you had and what did you learn from it?', category: 'Trabajo y propósito' },
  { id: 39, textEs: '¿Cómo afectó tu vida laboral a tu familia, o cómo influyó tu familia en tu trabajo?', textEn: 'How did your work life affect your family, or how did your family influence your work?', category: 'Trabajo y propósito' },
  
  { id: 40, textEs: '¿Qué aprendiste en tu familia sobre la fe, Dios o la espiritualidad?', textEn: 'What did you learn in your family about faith, God, or spirituality?', category: 'Espiritualidad y creencias' },
  { id: 41, textEs: '¿Formaste parte de alguna comunidad religiosa? ¿Qué significó para ti?', textEn: 'Were you part of any religious community? What did it mean to you?', category: 'Espiritualidad y creencias' },
  { id: 42, textEs: '¿Has vivido alguna experiencia espiritual que haya marcado tu vida?', textEn: 'Have you had any spiritual experience that marked your life?', category: 'Espiritualidad y creencias' },
  { id: 43, textEs: '¿Cómo han cambiado tus creencias o tu forma de ver la vida con el tiempo?', textEn: 'How have your beliefs or your way of seeing life changed over time?', category: 'Espiritualidad y creencias' },
  { id: 44, textEs: '¿Cómo expresabas gratitud, especialmente en los momentos difíciles?', textEn: 'How did you express gratitude, especially in difficult times?', category: 'Espiritualidad y creencias' },
  
  { id: 45, textEs: '¿Cuál consideras que ha sido tu mayor logro en la vida?', textEn: 'What do you consider to have been your greatest achievement in life?', category: 'Reflexiones y legado' },
  { id: 46, textEs: '¿Qué valores esperas que tus nietos o futuras generaciones conserven?', textEn: 'What values do you hope your grandchildren or future generations will preserve?', category: 'Reflexiones y legado' },
  { id: 47, textEs: '¿Cómo describirías una vida bien vivida?', textEn: 'How would you describe a life well lived?', category: 'Reflexiones y legado' },
  { id: 48, textEs: 'Si pudieras dejar un mensaje o una historia para tu familia, ¿cuál sería?', textEn: 'If you could leave a message or a story for your family, what would it be?', category: 'Reflexiones y legado' },
];
