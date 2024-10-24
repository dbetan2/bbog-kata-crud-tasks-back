import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, authenticateToken } from './auth';

jest.mock('jsonwebtoken');

describe('authenticateToken', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            headers: {} as Headers,
        };
        res = {
            sendStatus: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', () => {
        authenticateToken(req as AuthenticatedRequest, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token verification fails', () => {
        req.headers['authorization'] = 'Bearer invalidToken';
        (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        authenticateToken(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('should set req.user and call next if token is valid', () => {
        const mockUser = { id: '1', username: 'testUser' };
        req.headers['authorization'] = 'Bearer validToken';
        (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });

        authenticateToken(req, res, next);

        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });
});
