create database TodoApp;
use TodoApp;

CREATE TABLE tasks (
 id INT PRIMARY KEY AUTO_INCREMENT,
 description TEXT NOT NULL,
 is_completed BOOLEAN DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from tasks;