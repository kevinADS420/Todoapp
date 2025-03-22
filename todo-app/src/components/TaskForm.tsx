import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (description: string) => Promise<void>;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isLoading }) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddTask(description);
      setDescription('');
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="New Task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading || isSubmitting}
      />
      <button 
        type="submit" 
        disabled={isLoading || isSubmitting || !description.trim()}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
};

export default TaskForm;