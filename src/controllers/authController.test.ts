import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userRepo from '../repositories/userRepository';
import { JWT_SECRET } from '../config/auth';
import authController from './authController';

jest.mock('jsonwebtoken');
jest.mock('../repositories/userRepository');

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { username: 'testUser', password: 'testPass' },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 401 if user credentials are invalid', async () => {
      (userRepo.findByCredentials as jest.Mock).mockResolvedValueOnce(undefined);
        
      await authController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales inválidas' });
    });

    it('should return a token if user credentials are valid', async () => {
      const mockUser = { id: '1', username: 'testUser' };
      (userRepo.findByCredentials as jest.Mock).mockResolvedValueOnce(mockUser);
      (jwt.sign as jest.Mock).mockReturnValueOnce('mockedToken');

      await authController.login(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ token: 'mockedToken' });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, username: mockUser.username },
        JWT_SECRET,
        { expiresIn: process.env.EXPIRATION_TIME }
      );
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const errorMessage = 'Unexpected error';
      (userRepo.findByCredentials as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await authController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
