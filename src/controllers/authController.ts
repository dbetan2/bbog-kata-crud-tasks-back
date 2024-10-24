import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth";
import userRepo, { User } from "../repositories/userRepository";

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password }: { username: string; password: string } =
        req.body;
      const user: User | undefined = await userRepo.findByCredentials(
        username,
        password
      );

      if (!user) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      const token: string = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET as string,
        { expiresIn: process.env.EXPIRATION_TIME }
      );

      res.json({ token });
    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null && 'message' in error) {
            res.status(500).json({ message: error.message });
        } else {
            console.error('Unknown error happened');
            res.status(500).json({ message: error });
        }
    }
  }
}

export default new AuthController();
