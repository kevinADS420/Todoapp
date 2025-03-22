import React from 'react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onDelete }) => {
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
      <span className={`task-text ${task.is_completed ? 'completed' : ''}`}>
        {task.description}
      </span>
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