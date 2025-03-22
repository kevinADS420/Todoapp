// src/services/api.ts - versión completamente revisada
import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:3000/api/tasks';

// Configurar interceptores para debugging
axios.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Función para forzar una recarga de las tareas
export const forceTaskRefresh = async (): Promise<Task[]> => {
  try {
    const response = await axios.get(API_URL);
    console.log('Force refresh response:', response.data);
    
    // Asegurarse de que devolvemos un array incluso si la API no lo hace
    if (!Array.isArray(response.data)) {
      console.warn('API did not return an array, using empty array instead');
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in forceTaskRefresh:', error);
    return [];
  }
};

// Obtener todas las tareas
export const getAllTasks = async (): Promise<Task[]> => {
  return forceTaskRefresh();
};

// Crear una nueva tarea
export const createTask = async (description: string): Promise<boolean> => {
  try {
    await axios.post(API_URL, { description });
    return true; // Indicar éxito
  } catch (error) {
    console.error('Error creating task:', error);
    return false; // Indicar fallo
  }
};

// Actualizar estado de una tarea
export const updateTaskStatus = async (id: number, is_completed: boolean): Promise<boolean> => {
  try {
    await axios.put(`${API_URL}/${id}`, { is_completed });
    return true; // Indicar éxito
  } catch (error) {
    console.error('Error updating task:', error);
    return false; // Indicar fallo
  }
};

// Eliminar una tarea
export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true; // Indicar éxito
  } catch (error) {
    console.error('Error deleting task:', error);
    return false; // Indicar fallo
  }
};