import axios from 'axios';
import { Mission } from '../types/Mission';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Forma en la que la API externa nos devuelve los datos (no es la nuestra)
interface ApiTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export async function fetchMissions(): Promise<Mission[]> {
  const response = await axios.get<ApiTodo[]>(API_URL, {
    params: { _limit: 5 }, // traemos solo 5, para no saturar la lista
  });

  // Transformamos la forma "ApiTodo" a nuestra forma "Mission"
  return response.data.map((todo) => ({
    id: String(todo.id),
    title: todo.title,
    description: `Misión importada de la API (usuario #${todo.userId})`,
    points: ((todo.id % 5) + 1) * 10,
    completed: todo.completed,
  }));
}