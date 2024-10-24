import { Request, Response } from 'express';
import taskRepo, { Task } from '../repositories/taskRepository';

export class TaskController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const task: Task = await taskRepo.create(req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const tasks: Task[] = await taskRepo.findAll();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const task: Task | undefined = await taskRepo.findById(req.params.id);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const task: Task | undefined = await taskRepo.update(req.params.id, req.body);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result: { id: string } = await taskRepo.delete(req.params.id);
      if (result) {
        res.json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      const tasks: Task[] = await taskRepo.deleteAll();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new TaskController();
