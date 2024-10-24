
import sqlitedb from './sqlite';

beforeAll((done) => {
    sqlitedb.serialize(() => {
    sqlitedb.run("DELETE FROM users", () => {
      sqlitedb.run("DELETE FROM tasks", done);
    });
  });
});

afterAll((done) => {
  sqlitedb.close(done);
});

describe('Database Initialization', () => {
  test('should create users table', (done) => {
    sqlitedb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (_err: any, row: { name: any; }) => {
      expect(row).not.toBeUndefined();
      expect(row.name).toBe('users');
      done();
    });
  });

  test('should create tasks table', (done) => {
    sqlitedb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'", (_err: any, row: { name: any; }) => {
      expect(row).not.toBeUndefined();
      expect(row.name).toBe('tasks');
      done();
    });
  });
});
