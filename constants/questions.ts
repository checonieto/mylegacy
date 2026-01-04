export interface Question {
  id: number;
  text: string;
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
  // Orígenes y familia
  { id: 1, text: '¿Cuál es tu nombre completo y sabes por qué te lo pusieron?', category: 'Orígenes y familia' },
  { id: 2, text: '¿Dónde naciste y qué historias te han contado sobre tu nacimiento o tus primeros años?', category: 'Orígenes y familia' },
  { id: 3, text: '¿Cómo se llamaban tus padres y qué recuerdas más de cada uno?', category: 'Orígenes y familia' },
  { id: 4, text: '¿Qué hacía tu mamá que te hacía sentir amado(a) o cuidado(a)?', category: 'Orígenes y familia' },
  { id: 5, text: '¿Qué enseñanzas o ejemplos te dejó tu papá?', category: 'Orígenes y familia' },
  { id: 6, text: '¿Sabes cómo se conocieron y se enamoraron tus padres? ¿Te contaron esa historia?', category: 'Orígenes y familia' },
  { id: 7, text: '¿Cómo se llamaban tus abuelos y qué recuerdos o historias tienes de ellos?', category: 'Orígenes y familia' },
  { id: 8, text: '¿Había alguna costumbre o tradición familiar que viniera de tus abuelos?', category: 'Orígenes y familia' },
  { id: 9, text: '¿Cómo se llaman tus hermanos y cómo los describirías de niños?', category: 'Orígenes y familia' },
  { id: 10, text: '¿Qué tipo de relación tenías con tus hermanos mientras crecían?', category: 'Orígenes y familia' },
  
  // Infancia y hogar
  { id: 11, text: '¿Cuál es uno de los primeros recuerdos que tienes de tu infancia?', category: 'Infancia y hogar' },
  { id: 12, text: '¿Cómo era la casa en la que creciste? ¿Qué tenía de especial?', category: 'Infancia y hogar' },
  { id: 13, text: '¿Cómo eran las comidas familiares en tu casa?', category: 'Infancia y hogar' },
  { id: 14, text: '¿Qué juegos, juguetes o actividades te gustaban más cuando eras niño(a)?', category: 'Infancia y hogar' },
  { id: 15, text: '¿Había un lugar secreto, rincón especial o escondite favorito donde jugabas?', category: 'Infancia y hogar' },
  { id: 16, text: '¿Quién fue tu mejor amigo(a) en la infancia y qué hacían juntos?', category: 'Infancia y hogar' },
  
  // Escuela y adolescencia
  { id: 17, text: '¿Dónde estudiaste la primaria y cómo fue tu primer día de clases?', category: 'Escuela y adolescencia' },
  { id: 18, text: '¿Tuviste un maestro o maestra que marcó tu vida? ¿Por qué?', category: 'Escuela y adolescencia' },
  { id: 19, text: '¿Qué materias o actividades escolares disfrutabas más?', category: 'Escuela y adolescencia' },
  { id: 20, text: '¿Qué recuerdas del recreo, la hora de la comida o tus rutinas después de la escuela?', category: 'Escuela y adolescencia' },
  { id: 21, text: '¿Hubo un momento en la escuela que te hizo sentir especialmente orgulloso(a)?', category: 'Escuela y adolescencia' },
  { id: 22, text: '¿Cómo fue tu experiencia en la secundaria o preparatoria?', category: 'Escuela y adolescencia' },
  { id: 23, text: '¿Qué recuerdas del día de tu graduación de la preparatoria?', category: 'Escuela y adolescencia' },
  { id: 24, text: '¿Alguna vez tuviste problemas en la escuela? ¿Qué pasó y cómo lo resolviste?', category: 'Escuela y adolescencia' },
  
  // Amor y relaciones
  { id: 25, text: '¿Puedes contarme la historia de tu primer amor o enamoramiento?', category: 'Amor y relaciones' },
  { id: 26, text: '¿Cómo conociste a tu pareja o cónyuge?', category: 'Amor y relaciones' },
  { id: 27, text: '¿Qué recuerdas con más cariño del día de tu boda o de cuando comenzaron su vida juntos?', category: 'Amor y relaciones' },
  { id: 28, text: '¿Cuál ha sido el mayor reto y la mayor alegría en tu relación de pareja?', category: 'Amor y relaciones' },
  { id: 29, text: '¿Qué consejo darías sobre el amor, el perdón o una relación duradera?', category: 'Amor y relaciones' },
  
  // Hijos y familia propia
  { id: 30, text: '¿Cómo te sentiste al convertirte en madre o padre por primera vez?', category: 'Hijos y familia propia' },
  { id: 31, text: '¿Cómo se llaman tus hijos y cómo eligieron sus nombres?', category: 'Hijos y familia propia' },
  { id: 32, text: '¿Cuáles han sido algunos de tus momentos favoritos al criar a tus hijos?', category: 'Hijos y familia propia' },
  { id: 33, text: '¿Cómo les enseñabas valores o principios importantes en casa?', category: 'Hijos y familia propia' },
  { id: 34, text: '¿Qué tradiciones familiares crearon o continuaron en tu hogar?', category: 'Hijos y familia propia' },
  { id: 35, text: '¿Qué esperabas transmitirles a tus hijos para su vida adulta?', category: 'Hijos y familia propia' },
  
  // Trabajo y propósito
  { id: 36, text: '¿Cuál fue tu primer trabajo y cómo lo conseguiste?', category: 'Trabajo y propósito' },
  { id: 37, text: '¿Qué trabajo o profesión te hizo sentir más útil o realizado(a)?', category: 'Trabajo y propósito' },
  { id: 38, text: '¿Cuál fue el trabajo más difícil que tuviste y qué aprendiste de él?', category: 'Trabajo y propósito' },
  { id: 39, text: '¿Cómo afectó tu vida laboral a tu familia, o cómo influyó tu familia en tu trabajo?', category: 'Trabajo y propósito' },
  
  // Espiritualidad y creencias
  { id: 40, text: '¿Qué aprendiste en tu familia sobre la fe, Dios o la espiritualidad?', category: 'Espiritualidad y creencias' },
  { id: 41, text: '¿Formaste parte de alguna comunidad religiosa? ¿Qué significó para ti?', category: 'Espiritualidad y creencias' },
  { id: 42, text: '¿Has vivido alguna experiencia espiritual que haya marcado tu vida?', category: 'Espiritualidad y creencias' },
  { id: 43, text: '¿Cómo han cambiado tus creencias o tu forma de ver la vida con el tiempo?', category: 'Espiritualidad y creencias' },
  { id: 44, text: '¿Cómo expresabas gratitud, especialmente en los momentos difíciles?', category: 'Espiritualidad y creencias' },
  
  // Reflexiones y legado
  { id: 45, text: '¿Cuál consideras que ha sido tu mayor logro en la vida?', category: 'Reflexiones y legado' },
  { id: 46, text: '¿Qué valores esperas que tus nietos o futuras generaciones conserven?', category: 'Reflexiones y legado' },
  { id: 47, text: '¿Cómo describirías una vida bien vivida?', category: 'Reflexiones y legado' },
  { id: 48, text: 'Si pudieras dejar un mensaje o una historia para tu familia, ¿cuál sería?', category: 'Reflexiones y legado' },
];