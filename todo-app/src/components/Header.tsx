import React from 'react';

interface HeaderProps {
  pendingTasksCount: number;
}

const Header: React.FC<HeaderProps> = ({ pendingTasksCount }) => {
  return (
    <header className="app-header">
      <div className="app-logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </div>
      <h1>Todo App</h1>
      <p className="task-counter">
        {pendingTasksCount === 0 
          ? "All tasks completed!" 
          : `${pendingTasksCount} pending task${pendingTasksCount !== 1 ? 's' : ''}`}
      </p>
    </header>
  );
};

export default Header;