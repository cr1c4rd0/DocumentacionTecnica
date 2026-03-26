// ── Relationship types ─────────────────────────────────────────
const REL_TYPES = {
  alimenta:    { label: "Alimenta",    color: "#43A047", desc: "Transfiere datos, eventos o señales de entrada hacia otra HU" },
  configura:   { label: "Configura",   color: "#F57C00", desc: "Define parámetros, reglas o condiciones que otra HU consume" },
  complementa: { label: "Complementa", color: "#9C27B0", desc: "Trabaja en paralelo hacia el mismo objetivo de negocio" },
  integra:     { label: "Integra",     color: "#0277BD", desc: "Dependencia técnica directa o flujo de navegación entre HUs" },
};

// ── Épicas ─────────────────────────────────────────────────────
const EPICS = [
  {
    id: "2.1", label: "Épica 2.1", name: "Motor Recomendación Personalizada", color: "#1565C0",
    href: "../Epica_2.1_Motor_Recomendacion_Personalizada/Diagrama_Epica_2.1_Motor_Recomendacion_Personalizada.html",
    hus: [{ id: "2.1.1", label: "Recomendar proactivamente" }, { id: "2.1.2", label: "Entrenar motor 6M/24M" }, { id: "2.1.3", label: "Aprende de clics" }, { id: "2.1.4", label: "Cold Start" }]
  },
  {
    id: "2.2", label: "Épica 2.2", name: "Panel Administración y Explicabilidad", color: "#6A1B9A",
    href: "../Epica_2.2_Panel_Administracion_Explicabilidad/Diagrama_Epica_2.2_Panel_Administracion_Explicabilidad.html",
    hus: [{ id: "2.2.1", label: "Explicar recomendaciones" }]
  },
  {
    id: "2.3", label: "Épica 2.3", name: "Gestión Promoción de Servicios", color: "#2E7D32",
    href: "../Epica_2.3_Gestion_Promocion_Servicios/Diagrama_Epica_2.3_Gestion_Promocion_Servicios.html",
    hus: [{ id: "2.3.1", label: "Resalta lo gratuito" }, { id: "2.3.2", label: "Destacar servicios" }]
  },
  {
    id: "2.4", label: "Épica 2.4", name: "Configuración y Gobernanza de Reglas", color: "#E65100",
    href: "../Epica_2.4_Configuracion_Gobernanza_Reglas/Diagrama_Epica_2.4_Configuracion_Gobernanza_Reglas.html",
    hus: [{ id: "2.4.1", label: "Reglas de negocio" }]
  },
  {
    id: "2.5", label: "Épica 2.5", name: "Resolución Identidad Omnicanal", color: "#00695C",
    href: "../Epica_2.5_Resolucion_Identidad_Omnicanal/Diagrama_Epica_2.5_Resolucion_Identidad_Omnicanal.html",
    hus: [{ id: "2.5.1", label: "Resolución identidad" }, { id: "2.5.2", label: "Identificación progresiva" }, { id: "2.5.3", label: "Respeta preferencias" }, { id: "2.5.4", label: "Privacidad UI" }]
  },
  {
    id: "2.6", label: "Épica 2.6", name: "Motor de Recomendación", color: "#1A237E",
    href: "../Epica_2.6_Motor_Recomendacion/Diagrama_Epica_2.6_Motor_Recomendacion.html",
    hus: [{ id: "2.6.1", label: "Modelo Top-N" }, { id: "2.6.2", label: "Parametrización sin redeploy" }, { id: "2.6.3", label: "Elegibilidad y membresía" }]
  },
  {
    id: "2.7", label: "Épica 2.7", name: "Reglas de Exclusión", color: "#B71C1C",
    href: "../Epica_2.7_Reglas_Exclusion/Diagrama_Epica_2.7_Reglas_Exclusion.html",
    hus: [{ id: "2.7.1", label: "Servicios ya consumidos" }, { id: "2.7.2", label: "Descarte explícito" }]
  },
  {
    id: "2.8", label: "Épica 2.8", name: "UI Recomendador Tipo Catálogo", color: "#0277BD",
    href: "../Epica_2.8_UI_Recomendador_Catalogo/Diagrama_Epica_2.8_UI_Recomendador_Catalogo.html",
    hus: [{ id: "2.8.1", label: "Carruseles" }, { id: "2.8.2", label: "Filtros y Sorpréndeme" }]
  },
  {
    id: "2.9", label: "Épica 2.9", name: "Lógica Explicativa", color: "#4527A0",
    href: "../Epica_2.9_Logica_Explicativa/Diagrama_Epica_2.9_Logica_Explicativa.html",
    hus: [{ id: "2.9.1", label: "Explicación por recomendación" }, { id: "2.9.2", label: "Reporte de segmentos" }]
  },
  {
    id: "2.10", label: "Épica 2.10", name: "Prueba Social", color: "#E65100",
    href: "../Epica_2.10_Prueba_Social/Diagrama_Epica_2.10_Prueba_Social.html",
    hus: [{ id: "2.10.1", label: "Reseñas y calificaciones" }, { id: "2.10.2", label: "Moderación de contenido" }]
  },
  {
    id: "2.11", label: "Épica 2.11", name: "Integración con Formularios", color: "#00796B",
    href: "../Epica_2.11_Integracion_Formularios/Diagrama_Epica_2.11_Integracion_Formularios.html",
    hus: [{ id: "2.11.1", label: "Redirección formulario" }, { id: "2.11.2", label: "Resultado inscripción" }, { id: "2.11.3", label: "Atribución conversión" }]
  },
  {
    id: "2.12", label: "Épica 2.12", name: "Micro-frontend Recomendador", color: "#37474F",
    href: "../Epica_2.12_Microfrontend_Recomendador/Diagrama_Epica_2.12_Microfrontend_Recomendador.html",
    hus: [{ id: "2.12.1", label: "Web Component" }, { id: "2.12.2", label: "Navegación con asistente" }]
  },
  {
    id: "2.13", label: "Épica 2.13", name: "Catálogo y Promoción de Servicios", color: "#AD1457",
    href: "../Epica_2.13_Catalogo_Promocion_Servicios/Diagrama_Epica_2.13_Catalogo_Promocion_Servicios.html",
    hus: [{ id: "2.13.1", label: "Clasificación servicios" }, { id: "2.13.2", label: "Notificación disponibilidad" }]
  },
  {
    id: "2.14", label: "Épica 2.14", name: "Backoffice y Reglas de Negocio", color: "#4E342E",
    href: "../Epica_2.14_Backoffice_Reglas_Negocio/Diagrama_Epica_2.14_Backoffice_Reglas_Negocio.html",
    hus: [{ id: "2.14.1", label: "Panel de reglas" }, { id: "2.14.2", label: "Registro de clics" }]
  },
  {
    id: "2.16", label: "Épica 2.16", name: "Aprendizaje Continuo", color: "#1B5E20",
    href: "../Epica_2.16_Aprendizaje_Continuo/Diagrama_Epica_2.16_Aprendizaje_Continuo.html",
    hus: [{ id: "2.16.1", label: "Captura de feedback" }, { id: "2.16.2", label: "Ajuste de modelo" }]
  },
];

// ── Relaciones entre HU (source → target) ─────────────────────
const HU_LINKS = [
  // ALIMENTA — transfiere datos o señales
  { source: "2.1.3",  target: "2.14.2", type: "alimenta",    desc: "Aprende de clics alimenta el registro de comportamiento" },
  { source: "2.14.2", target: "2.16.1", type: "alimenta",    desc: "Registro de clics aporta señales al motor de feedback" },
  { source: "2.10.1", target: "2.16.1", type: "alimenta",    desc: "Reseñas y calificaciones como señal de satisfacción" },
  { source: "2.11.2", target: "2.16.1", type: "alimenta",    desc: "El resultado de inscripción retroalimenta el aprendizaje" },
  { source: "2.11.3", target: "2.14.2", type: "alimenta",    desc: "La atribución de conversión registra el origen del clic" },
  { source: "2.16.1", target: "2.16.2", type: "alimenta",    desc: "Feedback capturado dispara el ajuste periódico del modelo" },
  { source: "2.6.1",  target: "2.1.1",  type: "alimenta",    desc: "El modelo Top-N provee las recomendaciones a mostrar proactivamente" },
  { source: "2.9.2",  target: "2.14.2", type: "alimenta",    desc: "El reporte de segmentos enriquece el registro de comportamiento" },

  // CONFIGURA — define reglas o parámetros
  { source: "2.4.1",  target: "2.6.1",  type: "configura",   desc: "Las reglas de negocio filtran y priorizan la salida del motor Top-N" },
  { source: "2.4.1",  target: "2.7.1",  type: "configura",   desc: "Las reglas de negocio definen qué servicios se excluyen por consumo" },
  { source: "2.14.1", target: "2.6.2",  type: "configura",   desc: "El panel de reglas ajusta parámetros del motor sin redeploy" },
  { source: "2.1.2",  target: "2.6.1",  type: "configura",   desc: "El entrenamiento periódico actualiza el modelo que usa Top-N" },
  { source: "2.16.2", target: "2.6.1",  type: "configura",   desc: "El ajuste de modelo recalibra el motor de recomendación" },

  // COMPLEMENTA — mismo objetivo de negocio
  { source: "2.2.1",  target: "2.9.1",  type: "complementa", desc: "Ambas HU abordan la explicabilidad: la 2.2.1 desde el panel admin y la 2.9.1 desde la lógica interna" },
  { source: "2.4.1",  target: "2.14.1", type: "complementa", desc: "Ambas gestionan reglas de negocio: la 2.4.1 las define y la 2.14.1 las administra en backoffice" },
  { source: "2.5.3",  target: "2.7.2",  type: "complementa", desc: "Respetar preferencias y descarte explícito son dos mecanismos del mismo objetivo: no molestar al usuario" },
  { source: "2.3.1",  target: "2.13.1", type: "complementa", desc: "Resaltar gratuito y clasificar servicios son estrategias complementarias de visibilidad" },
  { source: "2.5.2",  target: "2.1.4",  type: "complementa", desc: "Identificación progresiva y Cold Start son respuestas al mismo problema: usuario sin historial" },
  { source: "2.1.4",  target: "2.6.3",  type: "complementa", desc: "Cold Start se apoya en elegibilidad/membresía para generar recomendaciones iniciales" },

  // INTEGRA — dependencia técnica o de flujo
  { source: "2.5.1",  target: "2.6.3",  type: "integra",     desc: "Resolver la identidad del usuario es prerequisito para calcular su elegibilidad y membresía" },
  { source: "2.8.1",  target: "2.12.1", type: "integra",     desc: "Los carruseles se renderizan a través del Web Component del microfrontend" },
  { source: "2.8.2",  target: "2.1.1",  type: "integra",     desc: "Sorpréndeme consume el endpoint de recomendación proactiva" },
  { source: "2.12.2", target: "2.11.1", type: "integra",     desc: "El asistente de navegación redirige al usuario a formularios de inscripción" },
  { source: "2.3.2",  target: "2.6.1",  type: "integra",     desc: "Los servicios destacados por negocio se inyectan en la lista del motor Top-N" },
];

// ── Flat HU list (derivado de EPICS) ──────────────────────────
const ALL_HUS = [];
EPICS.forEach(e => e.hus.forEach(hu => {
  ALL_HUS.push({
    id: hu.id,
    label: hu.label,
    epicId: e.id,
    epicColor: e.color,
    epicLabel: e.label,
    epicName: e.name,
    epicHref: e.href,
  });
}));

// ── Recorrido del Usuario ──────────────────────────────────────
const USER_JOURNEY = [
  {
    phase: 1, icon: "🚪", color: "#0277BD",
    label: "Llegada e Identificación",
    userAction: "El usuario accede al portal por primera vez o inicia sesión",
    hus: ["2.5.1", "2.5.2", "2.5.4"],
    steps: [
      "El sistema resuelve la identidad omnicanal del usuario (2.5.1).",
      "Si el usuario es anónimo, se activa identificación progresiva para reconocerlo con señales mínimas (2.5.2).",
      "Se presenta la UI de privacidad para informar al usuario cómo se usan sus datos (2.5.4).",
    ],
  },
  {
    phase: 2, icon: "🏠", color: "#1565C0",
    label: "Pantalla de Inicio — Recomendaciones Proactivas",
    userAction: "El usuario ve la pantalla principal del recomendador",
    hus: ["2.1.1", "2.1.4", "2.6.1", "2.6.3", "2.8.1"],
    steps: [
      "El motor Top-N calcula las mejores N recomendaciones (2.6.1) validando elegibilidad y membresía (2.6.3).",
      "Si el usuario no tiene historial, se activa Cold Start para recomendaciones iniciales (2.1.4).",
      "Las recomendaciones se muestran proactivamente en carruseles (2.1.1 + 2.8.1).",
    ],
  },
  {
    phase: 3, icon: "🔍", color: "#2E7D32",
    label: "Exploración del Catálogo",
    userAction: "El usuario navega, filtra o usa 'Sorpréndeme'",
    hus: ["2.8.2", "2.13.1", "2.3.1", "2.3.2"],
    steps: [
      "El usuario aplica filtros o activa la función 'Sorpréndeme' para descubrir servicios nuevos (2.8.2).",
      "Se muestran servicios clasificados por categorías y tipo (2.13.1).",
      "Los servicios gratuitos se destacan visualmente (2.3.1) y los servicios destacados por negocio aparecen en posición prioritaria (2.3.2).",
    ],
  },
  {
    phase: 4, icon: "💡", color: "#6A1B9A",
    label: "Detalle y Explicación de una Recomendación",
    userAction: "El usuario hace clic en una recomendación para saber más",
    hus: ["2.9.1", "2.2.1", "2.10.1", "2.13.2"],
    steps: [
      "Se muestra la explicación de por qué ese servicio fue recomendado (2.9.1).",
      "El panel de administración expone la lógica de explicabilidad al operador (2.2.1).",
      "El usuario puede leer reseñas y calificaciones de otros usuarios (2.10.1).",
      "Si el servicio tiene disponibilidad limitada, se muestra una notificación de disponibilidad (2.13.2).",
    ],
  },
  {
    phase: 5, icon: "✋", color: "#B71C1C",
    label: "Gestión de Preferencias y Exclusiones",
    userAction: "El usuario descarta una recomendación o ajusta preferencias",
    hus: ["2.7.2", "2.7.1", "2.5.3"],
    steps: [
      "El usuario descarta explícitamente una recomendación para no verla más (2.7.2).",
      "El sistema excluye automáticamente servicios que el usuario ya consumió (2.7.1).",
      "Las preferencias del usuario (privacidad, categorías excluidas) son respetadas en todo momento (2.5.3).",
    ],
  },
  {
    phase: 6, icon: "📝", color: "#00796B",
    label: "Inscripción / Conversión",
    userAction: "El usuario decide inscribirse a un servicio recomendado",
    hus: ["2.12.2", "2.11.1", "2.11.2", "2.11.3"],
    steps: [
      "El asistente de navegación guía al usuario hacia el formulario de inscripción (2.12.2).",
      "El usuario es redirigido al formulario correspondiente del servicio (2.11.1).",
      "Al completar el formulario, el sistema recibe el resultado de la inscripción (2.11.2).",
      "La conversión queda atribuida a la recomendación que la originó (2.11.3).",
    ],
  },
  {
    phase: 7, icon: "⭐", color: "#1B5E20",
    label: "Retroalimentación y Aprendizaje",
    userAction: "El usuario valora el servicio o el sistema captura sus interacciones implícitas",
    hus: ["2.1.3", "2.14.2", "2.16.1", "2.16.2"],
    steps: [
      "Cada clic e interacción del usuario es registrada por el motor de aprendizaje (2.1.3 + 2.14.2).",
      "El feedback explícito (reseñas) e implícito (clics, inscripciones) se captura (2.16.1).",
      "Periódicamente el modelo se recalibra con las nuevas señales para mejorar futuras recomendaciones (2.16.2).",
    ],
  },
];

// ── Índice de fase por HU (derivado de USER_JOURNEY) ──────────
const HU_PHASE = {};
USER_JOURNEY.forEach(p => p.hus.forEach(id => { HU_PHASE[id] = p.phase; }));
