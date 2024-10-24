import { v4 as uuidv4 } from "uuid";
import sqlitedb from "../config/sqlite";

export interface TaskData {
  title: string;
  description: string;
  dueDate: string;
  priority?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export class TaskRepository {
  create(taskData: TaskData): Promise<Task> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const {
        title,
        description,
        dueDate,
        priority = "high",
      } = taskData;

      sqlitedb.run(
        `
        INSERT INTO tasks (id, title, description, dueDate, priority)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          id,
          title,
          description,
          dueDate,
          priority,
        ],
        function (err: unknown) {
          if (err) {
            reject(err);
          } else {
            sqlitedb.get(
              `SELECT * FROM tasks WHERE id = ?`,
              [id],
              (err: Error, row: Task) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(row);
                }
              }
            );
          }
        }
      );
    });
  }

  findAll(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      sqlitedb.all("SELECT * FROM tasks", [], (err: Error, rows: Task[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  findById(id: string): Promise<Task | undefined> {
    return new Promise((resolve, reject) => {
      sqlitedb.get(
        "SELECT * FROM tasks WHERE id = ?",
        [id],
        (err: Error, row: Task) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  update(id: string, taskData: TaskData): Promise<Task | undefined> {
    return new Promise((resolve, reject) => {
      const { title, description, dueDate, priority } = taskData;

      sqlitedb.run(
        `
        UPDATE tasks 
        SET title = ?, description = ?, dueDate = ?, priority = ?, 
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
        [
          title,
          description,
          dueDate,
          priority,
          id,
        ],
        function (err: Error) {
          if (err) {
            reject(err);
          } else {
            sqlitedb.get(
              `SELECT * FROM tasks WHERE id = ?`,
              [id],
              (err: Error, row: Task) => {
                if (err) {
                  reject(err);
                } else {
                  console.warn("### Row is", row);
                  resolve(row);
                }
              }
            );
          }
        }
      );
    });
  }

  delete(id: string): Promise<{ id: string }> {
    return new Promise((resolve, reject) => {
      sqlitedb.run("DELETE FROM tasks WHERE id = ?", [id], (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id });
        }
      });
    });
  }

  deleteAll(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      sqlitedb.run("DELETE FROM tasks", [], (err: Error, rows: Task[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

export default new TaskRepository();
