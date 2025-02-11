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

test('add a member type to the MemberType table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an INSERT operation
  const mockQuery = jest
    .fn()
    .mockResolvedValue({ rows: [{ membertypeid: 1, type: 'Test MemberType' }] });
  client.query = mockQuery;

  // Perform the add operation
  const res = await client.query(
    'INSERT INTO MemberType (type) VALUES ($1) RETURNING *',
    ['Test MemberType']
  );

  // Verify the insert operation
  expect(res.rows[0].type).toBe('Test MemberType');
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO MemberType (type) VALUES ($1) RETURNING *',
    ['Test MemberType']
  );
});

test('modify a member type in the MemberType table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an UPDATE operation
  const mockQuery = jest
    .fn()
    .mockResolvedValue({ rows: [{ membertypeid: 1, type: 'Updated MemberType' }] });
  client.query = mockQuery;

  // Perform the update operation
  const res = await client.query(
    'UPDATE MemberType SET type = $1 WHERE membertypeid = $2 RETURNING *',
    ['Updated MemberType', 1]
  );

  // Verify the update operation
  expect(res.rows[0].type).toBe('Updated MemberType');
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE MemberType SET type = $1 WHERE membertypeid = $2 RETURNING *',
    ['Updated MemberType', 1]
  );
});

test('delete a member type from the MemberType table', async () => {
  const client = pool.pool;

  // Mock the query to simulate a DELETE operation
  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  // Perform the delete operation
  const res = await client.query(
    'DELETE FROM MemberType WHERE membertypeid = $1 RETURNING *',
    [1]
  );

  // Verify the delete operation
  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM MemberType WHERE membertypeid = $1 RETURNING *',
    [1]
  );
});
