export interface MissionSuggestion {
  title: string;
  description: string;
  suggestedPoints: number;
}

const suggestionPool: MissionSuggestion[] = [
  {
    title: 'Compartí un viaje en auto con un compañero',
    description: 'Reducí emisiones combinando trayectos con otra persona.',
    suggestedPoints: 40,
  },
  {
    title: 'Registrá 7 días seguidos de movilidad sustentable',
    description: 'Mantené una racha completa durante una semana.',
    suggestedPoints: 70,
  },
  {
    title: 'Invitá a un amigo a usar la app',
    description: 'Sumá puntos por cada nuevo usuario que se registre por tu invitación.',
    suggestedPoints: 25,
  },
];

export function fetchAiSuggestion(): Promise<MissionSuggestion> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulamos que el "modelo de IA" elige una sugerencia al azar
      const random = suggestionPool[Math.floor(Math.random() * suggestionPool.length)];

      // Simulamos que a veces el servicio falla (10% de las veces), para practicar el manejo de error
      if (Math.random() < 0.1) {
        reject(new Error('El servicio de sugerencias no respondió'));
        return;
      }

      resolve(random);
    }, 1200); // las llamadas a IA suelen tardar más que un CRUD normal
  });
}