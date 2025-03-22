// src/services/api.ts - improved version
import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:3000/api/tasks';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request/response logging for debugging
api.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get('/');
    console.log('Tasks data received:', response.data);
    
    if (!Array.isArray(response.data)) {
      console.warn('API did not return an array', response.data);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Let the component handle the error
  }
};

// Force refresh tasks (with more explicit error handling)
export const forceTaskRefresh = async (): Promise<Task[]> => {
  try {
    const response = await api.get('/');
    
    if (!Array.isArray(response.data)) {
      console.warn('API did not return an array during refresh', response.data);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error refreshing tasks:', error);
    return []; // Return empty array on error
  }
};

// Create a new task
export const createTask = async (description: string): Promise<Task | null> => {
  try {
    const response = await api.post('/', { description });
    console.log('Task created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

// Update task status
export const updateTaskStatus = async (id: number, is_completed: boolean): Promise<boolean> => {
  try {
    const response = await api.put(`/${id}`, { is_completed });
    console.log('Task updated:', response.data);
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

// Delete task
export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/${id}`);
    console.log('Task deleted, id:', id);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

export const updateTaskDescription = async (id: number, description: string): Promise<boolean> => {
  try {
    await api.put(`/${id}`, { description });
    console.log('Task description updated:', id, description);
    return true;
  } catch (error) {
    console.error('Error updating task description:', error);
    return false;
  }
};