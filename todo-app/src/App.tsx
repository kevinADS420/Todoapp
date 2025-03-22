// App.tsx - with task description update functionality
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Task } from './types/Task';
import { 
  getAllTasks, 
  createTask, 
  updateTaskStatus, 
  deleteTask,
  updateTaskDescription // Import the new function
} from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks function
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTasks = await getAllTasks();
      console.log('Tasks fetched:', fetchedTasks);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please check if the backend server is running.');
      
      // Try to load from localStorage as a backup
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
        } catch (e) {
          console.error('Error parsing tasks from localStorage', e);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks on initial render
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (!loading && tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  // Add a new task
  const handleAddTask = async (description: string) => {
    setLoading(true);
    try {
      const newTask = await createTask(description);
      if (newTask) {
        // Add the new task to the state
        setTasks(prevTasks => [...prevTasks, newTask]);
        setError(null);
      } else {
        // If the API call was successful but didn't return a task
        setError('Failed to add task. Please try again.');
        // Refresh all tasks to ensure synchronization
        fetchTasks();
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, is_completed: !currentStatus } : task
      )
    );
    
    try {
      const success = await updateTaskStatus(id, !currentStatus);
      if (!success) {
        // Revert the optimistic update if the API call failed
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? { ...task, is_completed: currentStatus } : task
          )
        );
        setError('Failed to update task status. Please try again.');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      // Revert the optimistic update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, is_completed: currentStatus } : task
        )
      );
      setError('Failed to update task status. Please try again.');
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: number) => {
    // Optimistic update - remove the task immediately
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    try {
      const success = await deleteTask(id);
      if (!success && taskToDelete) {
        // Revert the optimistic delete if the API call failed
        setTasks(prevTasks => [...prevTasks, taskToDelete]);
        setError('Failed to delete task. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      if (taskToDelete) {
        // Revert the optimistic delete
        setTasks(prevTasks => [...prevTasks, taskToDelete]);
      }
      setError('Failed to delete task. Please try again.');
    }
  };

  // Update task description - New function
  const handleUpdateTask = async (id: number, newDescription: string) => {
    // Check if the description has actually changed
    const task = tasks.find(t => t.id === id);
    if (!task || task.description === newDescription) {
      return; // Don't do anything if the description hasn't changed
    }

    // Store original description for reverting if needed
    const originalDescription = task.description;

    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, description: newDescription } : task
      )
    );
    
    try {
      const success = await updateTaskDescription(id, newDescription);
      if (!success) {
        // Revert the optimistic update if the API call failed
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? { ...task, description: originalDescription } : task
          )
        );
        setError('Failed to update task description. Please try again.');
      }
    } catch (err) {
      console.error('Error updating task description:', err);
      // Revert the optimistic update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, description: originalDescription } : task
        )
      );
      setError('Failed to update task description. Please try again.');
    }
  };

  // Filter tasks for pending and completed lists
  const pendingTasks = tasks.filter(task => !task.is_completed);
  const completedTasks = tasks.filter(task => task.is_completed);

  return (
    <div className="todo-app">
      <div className="container">
        <Header pendingTasksCount={pendingTasks.length} />

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <TaskForm onAddTask={handleAddTask} isLoading={loading} />

        <div className="tasks-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : (
            <>
              <TaskList
                title="Pending Tasks"
                tasks={pendingTasks}
                emptyMessage="No pending tasks!"
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
              />
              
              <TaskList
                title="Completed Tasks"
                tasks={completedTasks}
                emptyMessage="No completed tasks yet."
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;