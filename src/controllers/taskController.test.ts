import { Request, Response } from 'express';
import taskRepo from '../repositories/taskRepository';
import taskController from './taskController';


jest.mock('../repositories/taskRepository');

describe('TaskController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: { title: 'Test Task', description: 'Test description' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task and return it', async () => {
      const mockTask = { id: '1', ...req.body };
      (taskRepo.create as jest.Mock).mockResolvedValueOnce(mockTask);

      await taskController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 400 if an error occurs during task creation', async () => {
      const errorMessage = 'Error creating task';
      (taskRepo.create as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await taskController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getAll', () => {
    it('should return all tasks', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task' }];
      (taskRepo.findAll as jest.Mock).mockResolvedValueOnce(mockTasks);

      await taskController.getAll(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should return 500 if an error occurs', async () => {
      const errorMessage = 'Error fetching tasks';
      (taskRepo.findAll as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await taskController.getAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getOne', () => {
    it('should return a task if found', async () => {
      const mockTask = { id: '1', title: 'Test Task' };
      req.params = { id: '1' };
      (taskRepo.findById as jest.Mock).mockResolvedValueOnce(mockTask);

      await taskController.getOne(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 if the task is not found', async () => {
      req.params = { id: '1' };
      (taskRepo.findById as jest.Mock).mockResolvedValueOnce(undefined);

      await taskController.getOne(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 if an error occurs', async () => {
      req.params = { id: '1' };
      const errorMessage = 'Error fetching task';
      (taskRepo.findById as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await taskController.getOne(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('update', () => {
    it('should update a task and return it', async () => {
      const mockTask = { id: '1', ...req.body };
      req.params = { id: '1' };
      (taskRepo.update as jest.Mock).mockResolvedValueOnce(mockTask);

      await taskController.update(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 404 if the task is not found', async () => {
      req.params = { id: '1' };
      (taskRepo.update as jest.Mock).mockResolvedValueOnce(undefined);

      await taskController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 400 if an error occurs during update', async () => {
      req.params = { id: '1' };
      const errorMessage = 'Error updating task';
      (taskRepo.update as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await taskController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('delete', () => {
    it('should delete a task successfully', async () => {
      req.params = { id: '1' };
      const result = { id: '1' };
      (taskRepo.delete as jest.Mock).mockResolvedValueOnce(result);

      await taskController.delete(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should return 404 if the task is not found', async () => {
      req.params = { id: '1' };
      (taskRepo.delete as jest.Mock).mockResolvedValueOnce(undefined);

      await taskController.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
    });

    it('should return 500 if an error occurs during deletion', async () => {
      req.params = { id: '1' };
      const errorMessage = 'Error deleting task';
      (taskRepo.delete as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await taskController.delete(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('deleteAll', () => {
    it('should delete all tasks and return them', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task' }];
      (taskRepo.deleteAll as jest.Mock).mockResolvedValueOnce(mockTasks);

      await taskController.deleteAll(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should return 500 if an error occurs during deletion', async () => {
      const errorMessage = 'Error deleting tasks';
      (taskRepo.deleteAll as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await taskController.deleteAll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
