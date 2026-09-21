export type Memory = {
  id: string;
  eyebrow: string;
  title: string;
  date: string;
  text: string;
  image?: string;
};

export type GalleryItem = {
  id: string;
  word: string;
  caption: string;
  image?: string;
};

/**
 * PERSONALIZA TODO AQUÍ.
 * Puedes añadir fotos en /public/photos y poner, por ejemplo:
 * image: "/photos/nuestra-foto.jpg"
 */
export const siteContent = {
  recipientName: "[SU NOMBRE]",

  introEyebrow: "FELIZ 21 DE SEPTIEMBRE",
  introTitle: "La distancia me impide darte flores,",
  introAccent: "pero no me impide quererte.",
  introNote: "Así que hice esto para ti.",

  heroTitle: "Un pequeño universo para ti",
  heroSubtitle: "Porque hoy quería regalarte algo bonito.",
  heroHint: "Desliza para entrar en nuestro universo",

  midpointTitle: "Porque algunas personas merecen cosas bonitas.",
  midpointAccent: "Y tú eres una de ellas.",
  midpointNote: "Por eso hoy quería hacerte este pequeño detalle.",

  reasonsTitle: "Hay demasiadas razones.",
  reasonsSubtitle: "Estas son solo algunas.",
  reasons: [
    "Por cómo me miras.",
    "Por cómo haces especial hasta un plan cualquiera.",
    "Por nuestras tonterías.",
    "Por la calma que aparece cuando estás cerca.",
    "Porque consigues hacerme reír cuando menos lo espero.",
    "Por cada conversación que se alarga sin darnos cuenta.",
    "Porque contigo puedo ser yo.",
    "Por todas las cosas que todavía nos quedan por descubrir.",
    "Porque haces que los días normales tengan algo distinto.",
    "Por esa forma tuya de quedarte en mi cabeza.",
    "Porque algunos recuerdos ya llevan tu nombre.",
    "Porque esto solo acaba de empezar."
  ],

  memories: [
    {
      id: "01",
      eyebrow: "CAPÍTULO I",
      title: "El día que apareciste",
      date: "Nuestro comienzo",
      text: "Hay personas que llegan sin hacer ruido y, de repente, cambian la forma en la que miras los días."
    },
    {
      id: "02",
      eyebrow: "CAPÍTULO II",
      title: "Una de mis cosas favoritas de ti",
      date: "Ese detalle tuyo",
      text: "No es una sola cosa. Es la suma de gestos pequeños que probablemente ni siquiera sabes que haces."
    },
    {
      id: "03",
      eyebrow: "CAPÍTULO III",
      title: "Un momento que quiero repetir",
      date: "Otra vez",
      text: "Hay momentos que no necesitan ser perfectos para convertirse en los que más quieres volver a vivir."
    },
    {
      id: "04",
      eyebrow: "CAPÍTULO IV",
      title: "Una tontería que solo nosotros entendemos",
      date: "Nuestro idioma",
      text: "Las mejores historias siempre tienen pequeñas cosas que desde fuera no significan nada y para nosotros lo significan todo."
    },
    {
      id: "05",
      eyebrow: "CAPÍTULO V",
      title: "Lo que todavía nos queda",
      date: "Próximamente",
      text: "Me gusta pensar que algunos de nuestros mejores recuerdos todavía ni siquiera han ocurrido."
    }
  ] satisfies Memory[],

  constellation: [
    "La primera mirada",
    "La primera risa",
    "Ese mensaje",
    "Nuestro plan favorito",
    "Un día inesperado",
    "Lo que nadie entiende",
    "Lo que viene después"
  ],

  gallery: [
    { id: "g1", word: "Aquí.", caption: "Donde todo se siente un poco más cerca." },
    { id: "g2", word: "Contigo.", caption: "La parte que cambia por completo cualquier lugar." },
    { id: "g3", word: "Otra vez.", caption: "Porque hay momentos que merecen repetirse." },
    { id: "g4", word: "Nosotros.", caption: "Sin prisa. Sin ruido. A nuestra manera." }
  ] satisfies GalleryItem[],

  wowPrelude: "Porque algunas personas merecen cosas bonitas.",
  wowLine: "Y tú eres una de ellas.",

  finalePrelude: "Aunque no pueda estar contigo hoy, quiero que veas esto y sientas lo mucho que me importas.",
  finaleTitle: "Te quiero, preciosa.",
  finaleDate: "Feliz 21 de septiembre.",

  audioUrl: ""
};