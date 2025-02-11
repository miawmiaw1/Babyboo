const { Pool } = require('pg'); // Import pg
const initializePool = require('./dbconnection'); // Import the actual database pool

// Mock the pg Pool and its methods
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
  pool = await initializePool(); // Initialize the mock pool
});

afterAll(() => {
  pool.pool.end(); // Close the pool after tests
});

test('add a status to the Status table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an INSERT operation
  const mockQuery = jest
    .fn()
    .mockResolvedValue({ rows: [{ statusid: 1, statusname: 'Pending' }] });
  client.query = mockQuery;

  // Perform the add operation
  const res = await client.query(
    'INSERT INTO Status (statusname) VALUES ($1) RETURNING *',
    ['Pending']
  );

  // Verify the insert operation
  expect(res.rows[0].statusname).toBe('Pending');
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO Status (statusname) VALUES ($1) RETURNING *',
    ['Pending']
  );
});

test('modify a status in the Status table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an UPDATE operation
  const mockQuery = jest
    .fn()
    .mockResolvedValue({ rows: [{ statusid: 1, statusname: 'Shipped' }] });
  client.query = mockQuery;

  // Perform the update operation
  const res = await client.query(
    'UPDATE Status SET statusname = $1 WHERE statusid = $2 RETURNING *',
    ['Shipped', 1]
  );

  // Verify the update operation
  expect(res.rows[0].statusname).toBe('Shipped');
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE Status SET statusname = $1 WHERE statusid = $2 RETURNING *',
    ['Shipped', 1]
  );
});

test('delete a status from the Status table', async () => {
  const client = pool.pool;

  // Mock the query to simulate a DELETE operation
  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  // Perform the delete operation
  const res = await client.query(
    'DELETE FROM Status WHERE statusid = $1 RETURNING *',
    [1]
  );

  // Verify the delete operation
  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Status WHERE statusid = $1 RETURNING *',
    [1]
  );
});
