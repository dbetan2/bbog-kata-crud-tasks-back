import sqlitedb from '../config/sqlite';
import taskRepository, { TaskData } from './taskRepository';

jest.mock('../config/sqlite');
jest.mock('uuid', () => ({ v4: jest.fn().mockReturnValue('test-uuid') }));

describe('TaskRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a task and return it', async () => {
            const taskData: TaskData = {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: '2024-12-31',
                priority: 'medium',
            };

            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null) => void) => {
                callback(null);
            });

            (sqlitedb.get as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null, arg1: { createdAt: Date; updatedAt: Date; title: string; description: string; dueDate: string; priority?: string; id: string; }) => void) => {
                callback(null, { id: 'test-uuid', ...taskData, createdAt: new Date(), updatedAt: new Date() });
            });

            await taskRepository.create(taskData);

            expect(sqlitedb.run).toHaveBeenCalled();
            expect(sqlitedb.get).toHaveBeenCalled();
        });

        it('should reject if there is an error while creating a task', async () => {
            const taskData: TaskData = {
                title: 'Test Task',
                description: 'Test Description',
                dueDate: '2024-12-31',
            };

            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: Error) => void) => {
                callback(new Error('Insertion error'));
            });

            await expect(taskRepository.create(taskData)).rejects.toThrow('Insertion error');
        });
    });

    describe('findAll', () => {
        it('should return all tasks', async () => {
            const tasks = [
                { id: '1', title: 'Task 1', description: 'Desc 1', dueDate: '2024-12-31', priority: 'high', createdAt: '2024-10-23', updatedAt: '2024-10-23' },
                { id: '2', title: 'Task 2', description: 'Desc 2', dueDate: '2024-12-31', priority: 'medium', createdAt: '2024-10-23', updatedAt: '2024-10-23' },
            ];

            (sqlitedb.all as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null, arg1: { id: string; title: string; description: string; dueDate: string; priority: string; createdAt: string; updatedAt: string; }[]) => void) => {
                callback(null, tasks);
            });

            const result = await taskRepository.findAll();
            expect(result).toEqual(tasks);
            expect(sqlitedb.all).toHaveBeenCalled();
        });

        it('should reject if there is an error while finding tasks', async () => {
            (sqlitedb.all as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: Error) => void) => {
                callback(new Error('Find error'));
            });

            await expect(taskRepository.findAll()).rejects.toThrow('Find error');
        });
    });

    describe('findById', () => {
        it('should return a task by id', async () => {
            const task = { id: '1', title: 'Task 1', description: 'Desc 1', dueDate: '2024-12-31', priority: 'high', createdAt: '2024-10-23', updatedAt: '2024-10-23' };

            (sqlitedb.get as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null, arg1: { id: string; title: string; description: string; dueDate: string; priority: string; createdAt: string; updatedAt: string; }) => void) => {
                callback(null, task);
            });

            const result = await taskRepository.findById('1');
            expect(result).toEqual(task);
            expect(sqlitedb.get).toHaveBeenCalled();
        });

        it('should reject if there is an error while finding a task by id', async () => {
            (sqlitedb.get as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: Error) => void) => {
                callback(new Error('Find by ID error'));
            });

            await expect(taskRepository.findById('1')).rejects.toThrow('Find by ID error');
        });
    });

    describe('update', () => {
        it('should update a task and return it', async () => {
            const taskData: TaskData = {
                title: 'Updated Task',
                description: 'Updated Description',
                dueDate: '2024-12-31',
                priority: 'medium',
            };

            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null) => void) => {
                callback(null);
            });

            (sqlitedb.get as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null, arg1: { createdAt: Date; updatedAt: Date; title: string; description: string; dueDate: string; priority?: string; id: string; }) => void) => {
                callback(null, { id: '1', ...taskData, createdAt: new Date(), updatedAt: new Date() });
            });

            await taskRepository.update('1', taskData);

            expect(sqlitedb.run).toHaveBeenCalled();
            expect(sqlitedb.get).toHaveBeenCalled();
        });

        it('should reject if there is an error while updating a task', async () => {
            const taskData: TaskData = {
                title: 'Updated Task',
                description: 'Updated Description',
                dueDate: '2024-12-31',
            };

            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: Error) => void) => {
                callback(new Error('Update error'));
            });

            await expect(taskRepository.update('1', taskData)).rejects.toThrow('Update error');
        });
    });

    describe('delete', () => {
        it('should delete a task and return its id', async () => {
            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null) => void) => {
                callback(null);
            });

            const result = await taskRepository.delete('1');

            expect(result).toEqual({ id: '1' });
            expect(sqlitedb.run).toHaveBeenCalled();
        });

        it('should reject if there is an error while deleting a task', async () => {
            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: Error) => void) => {
                callback(new Error('Delete error'));
            });

            await expect(taskRepository.delete('1')).rejects.toThrow('Delete error');
        });
    });

    describe('deleteAll', () => {
        it('should delete all tasks', async () => {
            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: null) => void) => {
                callback(null);
            });

            const result = await taskRepository.deleteAll();

            expect(result).toEqual(undefined);
            expect(sqlitedb.run).toHaveBeenCalled();
        });

        it('should reject if there is an error while deleting all tasks', async () => {
            (sqlitedb.run as jest.Mock).mockImplementation((query: any, params: any, callback: (arg0: Error) => void) => {
                callback(new Error('Delete all error'));
            });

            await expect(taskRepository.deleteAll()).rejects.toThrow('Delete all error');
        });
    });
});
