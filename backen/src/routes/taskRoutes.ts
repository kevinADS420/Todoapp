import { Request, Response, NextFunction } from 'express';

// Define un tipo para el controlador de Express
type ExpressHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Usa este tipo en tus controladores
export const updateTask: ExpressHandler = async (req, res) => {
  try {
    // Tu código...
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default updateTask;