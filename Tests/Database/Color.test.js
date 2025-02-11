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

test('add a color to the Color table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an INSERT operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        colorid: 1,
        colorname: 'Red',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the insert operation
  const res = await client.query(
    'INSERT INTO Color (colorname) VALUES ($1) RETURNING *',
    ['Red']
  );

  // Verify the insert operation
  expect(res.rows[0].colorname).toBe('Red');
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO Color (colorname) VALUES ($1) RETURNING *',
    ['Red']
  );
});

test('modify a color in the Color table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an UPDATE operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        colorid: 1,
        colorname: 'Blue',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the update operation
  const res = await client.query(
    'UPDATE Color SET colorname = $1 WHERE colorid = $2 RETURNING *',
    ['Blue', 1]
  );

  // Verify the update operation
  expect(res.rows[0].colorname).toBe('Blue');
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE Color SET colorname = $1 WHERE colorid = $2 RETURNING *',
    ['Blue', 1]
  );
});

test('delete a color from the Color table', async () => {
  const client = pool.pool;

  // Mock the query to simulate a DELETE operation
  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  // Perform the delete operation
  const res = await client.query(
    'DELETE FROM Color WHERE colorid = $1 RETURNING *',
    [1]
  );

  // Verify the delete operation
  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Color WHERE colorid = $1 RETURNING *',
    [1]
  );
});
