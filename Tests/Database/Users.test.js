const { Pool } = require('pg');
const initializePool = require('./dbconnection');

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

let pool;

beforeAll(async () => {
  pool = await initializePool();
});

afterAll(() => {
  pool.pool.end();
});

test('add a user to the Users table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        userid: 1,
        username: 'johndoe',
        firstname: 'John',
        lastname: 'Doe',
        password: 'hashedpassword123',
        email: 'john.doe@example.com',
        phonenumber: 1234567890,
        addressid: 1,
        membertypeid: 2,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    'INSERT INTO Users (username, firstname, lastname, password, email, phonenumber, addressid, membertypeid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    ['johndoe', 'John', 'Doe', 'hashedpassword123', 'john.doe@example.com', 1234567890, 1, 2]
  );

  expect(res.rows[0].username).toBe('johndoe');
  expect(res.rows[0].email).toBe('john.doe@example.com');
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO Users (username, firstname, lastname, password, email, phonenumber, addressid, membertypeid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    ['johndoe', 'John', 'Doe', 'hashedpassword123', 'john.doe@example.com', 1234567890, 1, 2]
  );
});

test('update a user in the Users table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        userid: 1,
        username: 'johnsmith',
        firstname: 'John',
        lastname: 'Smith',
        password: 'hashedpassword456',
        email: 'john.smith@example.com',
        phonenumber: 9876543210,
        addressid: 2,
        membertypeid: 3,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    'UPDATE Users SET username = $1, firstname = $2, lastname = $3, password = $4, email = $5, phonenumber = $6, addressid = $7, membertypeid = $8 WHERE userid = $9 RETURNING *',
    ['johnsmith', 'John', 'Smith', 'hashedpassword456', 'john.smith@example.com', 9876543210, 2, 3, 1]
  );

  expect(res.rows[0].username).toBe('johnsmith');
  expect(res.rows[0].email).toBe('john.smith@example.com');
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE Users SET username = $1, firstname = $2, lastname = $3, password = $4, email = $5, phonenumber = $6, addressid = $7, membertypeid = $8 WHERE userid = $9 RETURNING *',
    ['johnsmith', 'John', 'Smith', 'hashedpassword456', 'john.smith@example.com', 9876543210, 2, 3, 1]
  );
});

test('delete a user from the Users table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM Users WHERE userid = $1 RETURNING *',
    [1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Users WHERE userid = $1 RETURNING *',
    [1]
  );
});
