import express from 'express';
import { Request, Response } from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';

// Define a type for controller handlers to avoid TypeScript errors
type ControllerFunction = (req: Request, res: Response) => Promise<any>;

const router = express.Router();

// Use the controller functions directly, with the type assertion if needed
router.get('/', getAllTasks as ControllerFunction);
router.post('/', createTask as ControllerFunction);
router.put('/:id', updateTask as ControllerFunction);
router.delete('/:id', deleteTask as ControllerFunction);

export default router;