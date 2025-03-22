import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  onUpdateTask: (id: number, newDescription: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onToggleStatus, 
  onDelete,
  onUpdateTask
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.description);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Handle double click to enter edit mode
  const handleDoubleClick = () => {
    if (!task.is_completed) { // Only allow editing for non-completed tasks
      setIsEditing(true);
    }
  };

  // Handle saving the edited task
  const handleSave = () => {
    if (editValue.trim() !== '') {
      onUpdateTask(task.id!, editValue.trim());
      setIsEditing(false);
    }
  };

  // Handle keydown events in the edit input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      // Cancel editing and revert to original value
      setEditValue(task.description);
      setIsEditing(false);
    }
  };

  return (
    <li className="task-item">
      <div className="task-checkbox">
        <input
          type="checkbox"
          id={`task-${task.id}`}
          checked={task.is_completed}
          onChange={() => onToggleStatus(task.id!, task.is_completed)}
        />
        <label htmlFor={`task-${task.id}`}></label>
      </div>
      
      {isEditing ? (
        <input
          ref={inputRef}
          className="task-edit-input"
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span 
          className={`task-text ${task.is_completed ? 'completed' : ''}`}
          onDoubleClick={handleDoubleClick}
          title="Double-click to edit"
        >
          {task.description}
        </span>
      )}
      
      <button 
        className="delete-button"
        onClick={() => onDelete(task.id!)}
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </li>
  );
};

export default TaskItem;