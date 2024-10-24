import sqlitedb from '../config/sqlite';
import { v4 as uuidv4 } from "uuid";
import userRepository, { User } from './userRepository';

jest.mock('../config/sqlite');
jest.mock('uuid', () => ({ v4: jest.fn().mockReturnValue('test-uuid') }));

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByCredentials', () => {
    it('should return a user if credentials are valid', async () => {
      const mockUser: User = { id: '1', username: 'admin', password: 'admin123' };
      
      (sqlitedb.get as jest.Mock).mockImplementation((query: string, params: any[], callback: (err: Error | null, user?: User) => void) => {
        callback(null, mockUser);
      });

      const user = await userRepository.findByCredentials('admin', 'admin123');

      expect(user).toEqual(mockUser);
      expect(sqlitedb.get).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        ['admin', 'admin123'],
        expect.any(Function)
      );
    });

    it('should return undefined if credentials are invalid', async () => {
      (sqlitedb.get as jest.Mock).mockImplementation((query: string, params: any[], callback: (err: Error | null, user?: User) => void) => {
        callback(null, undefined);
      });

      const user = await userRepository.findByCredentials('wronguser', 'wrongpassword');

      expect(user).toBeUndefined();
    });

    it('should reject with an error if there is a database error', async () => {
      (sqlitedb.get as jest.Mock).mockImplementation((query: string, params: any[], callback: (err: Error | null) => void) => {
        callback(new Error('Database error'));
      });

      await expect(userRepository.findByCredentials('admin', 'admin123')).rejects.toThrow('Database error');
    });
  });

  describe('createInitialUser', () => {
    it('should create the initial user successfully', async () => {
      (sqlitedb.run as jest.Mock).mockImplementation((query: string, params: any[], callback: (err: Error | null) => void) => {
        callback(null);
      });

      await userRepository.createInitialUser();

      expect(sqlitedb.run).toHaveBeenCalledWith(
        expect.stringContaining("INSERT OR IGNORE INTO users (id, username, password)"),
        ['test-uuid', 'admin', 'admin123'],
        expect.any(Function)
      );
    });

    it('should reject with an error if there is an error creating the user', async () => {
      (sqlitedb.run as jest.Mock).mockImplementation((query: string, params: any[], callback: (err: Error | null) => void) => {
        callback(new Error('Insertion error'));
      });

      await expect(userRepository.createInitialUser()).rejects.toThrow('Insertion error');
    });
  });
});
