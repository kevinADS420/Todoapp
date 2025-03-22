import React from 'react';
import { Task } from '../types/Task';
import TaskItem from './TaskItem';

interface TaskListProps {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  title, 
  tasks, 
  emptyMessage, 
  onToggleStatus, 
  onDelete 
}) => {
  return (
    <div className="task-section">
      <h2>{title}</h2>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;