// App.tsx - versión revisada
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task } from './types/Task';
import { getAllTasks, createTask, updateTaskStatus, deleteTask, forceTaskRefresh } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para obtener todas las tareas
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await getAllTasks();
      console.log('Tasks fetched successfully:', fetchedTasks);
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please check if the backend server is running.');
      
      // Intentar cargar desde localStorage como respaldo
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
        } catch (e) {
          console.error('Error parsing tasks from localStorage', e);
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Guardar tareas en localStorage como respaldo
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // Agregar una nueva tarea
  const handleAddTask = async (description: string) => {
    setLoading(true);
    try {
      const success = await createTask(description);
      if (success) {
        // Recargar todas las tareas después de agregar
        await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa
        const updatedTasks = await forceTaskRefresh();
        setTasks(updatedTasks);
        setError(null);
      } else {
        setError('Failed to add task. Please try again.');
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Marcar tarea como completada o pendiente
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setLoading(true);
    try {
      const success = await updateTaskStatus(id, !currentStatus);
      if (success) {
        // Recargar todas las tareas después de actualizar
        await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa
        const updatedTasks = await forceTaskRefresh();
        setTasks(updatedTasks);
        setError(null);
      } else {
        setError('Failed to update task status. Please try again.');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (id: number) => {
    setLoading(true);
    try {
      const success = await deleteTask(id);
      if (success) {
        // Recargar todas las tareas después de eliminar
        await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa
        const updatedTasks = await forceTaskRefresh();
        setTasks(updatedTasks);
        setError(null);
      } else {
        setError('Failed to delete task. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Asegurarse de que tasks siempre sea un array
  const safeTasksArray = Array.isArray(tasks) ? tasks : [];

  // Filtrar tareas pendientes y completadas
  const pendingTasks = safeTasksArray.filter(task => !task.is_completed);
  const completedTasks = safeTasksArray.filter(task => task.is_completed);

  return (
    <div className="todo-app">
      <div className="container">
        {/* App Header */}
        <Header pendingTasksCount={pendingTasks.length} />

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* New Task Form */}
        <TaskForm onAddTask={handleAddTask} isLoading={loading} />

        {/* Tasks Container */}
        <div className="tasks-container">
          {/* Loading Indicator */}
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : (
            <>
              {/* Pending Tasks */}
              <TaskList
                title="Pending Tasks"
                tasks={pendingTasks}
                emptyMessage="No pending tasks!"
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
              />
              
              {/* Completed Tasks */}
              <TaskList
                title="Completed Tasks"
                tasks={completedTasks}
                emptyMessage="No completed tasks yet."
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;