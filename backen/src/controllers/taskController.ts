import { Request, Response } from 'express';
import pool from '../../config/config-db';
import { Task } from '../models/Task';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Task description is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO tasks (description) VALUES (?)',
      [description]
    );
    
    const id = (result as any).insertId;
    const newTask: Task = {
      id,
      description,
      is_completed: false,
      created_at: new Date().toISOString()
    };
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_completed } = req.body;
    
    if (is_completed === undefined) {
      return res.status(400).json({ message: 'is_completed field is required' });
    }
    
    await pool.query(
      'UPDATE tasks SET is_completed = ? WHERE id = ?',
      [is_completed, id]
    );
    
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};