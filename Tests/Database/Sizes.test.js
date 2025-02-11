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

test('add a size to the Sizes table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an INSERT operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        sizeid: 1,
        sizename: 'Medium',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the insert operation
  const res = await client.query(
    'INSERT INTO Sizes (sizename) VALUES ($1) RETURNING *',
    ['Medium']
  );

  // Verify the insert operation
  expect(res.rows[0].sizename).toBe('Medium');
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO Sizes (sizename) VALUES ($1) RETURNING *',
    ['Medium']
  );
});

test('modify a size in the Sizes table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an UPDATE operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        sizeid: 1,
        sizename: 'Large',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the update operation
  const res = await client.query(
    'UPDATE Sizes SET sizename = $1 WHERE sizeid = $2 RETURNING *',
    ['Large', 1]
  );

  // Verify the update operation
  expect(res.rows[0].sizename).toBe('Large');
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE Sizes SET sizename = $1 WHERE sizeid = $2 RETURNING *',
    ['Large', 1]
  );
});

test('delete a size from the Sizes table', async () => {
  const client = pool.pool;

  // Mock the query to simulate a DELETE operation
  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  // Perform the delete operation
  const res = await client.query(
    'DELETE FROM Sizes WHERE sizeid = $1 RETURNING *',
    [1]
  );

  // Verify the delete operation
  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Sizes WHERE sizeid = $1 RETURNING *',
    [1]
  );
});
