import { v4 as uuidv4 } from "uuid";
import sqlitedb from "../config/sqlite";

export interface User {
  id: string;
  username: string;
  password: string;
}

export class UserRepository {
  findByCredentials(
    username: string,
    password: string
  ): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      sqlitedb.get(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err: Error, user: User) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        }
      );
    });
  }

  createInitialUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      sqlitedb.run(
        `
        INSERT OR IGNORE INTO users (id, username, password)
        VALUES (?, ?, ?)
      `,
        [uuidv4(), "admin", "admin123"],
        (err: Error) => {
          if (err) {
            console.error('Failed creating first user');
            reject(err);
          } else {
            console.info('First user successfully created');
            resolve();
          }
        }
      );
    });
  }
}

export default new UserRepository();
