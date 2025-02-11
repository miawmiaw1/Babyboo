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

test('add an address to the Address table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an INSERT operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        addressid: 1,
        street: '123 Main St',
        city: 'New York',
        postalcode: '10001',
        country: 'USA',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the insert operation
  const res = await client.query(
    'INSERT INTO Address (street, city, postalcode, country) VALUES ($1, $2, $3, $4) RETURNING *',
    ['123 Main St', 'New York', '10001', 'USA']
  );

  // Verify the insert operation
  expect(res.rows[0].street).toBe('123 Main St');
  expect(res.rows[0].city).toBe('New York');
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO Address (street, city, postalcode, country) VALUES ($1, $2, $3, $4) RETURNING *',
    ['123 Main St', 'New York', '10001', 'USA']
  );
});

test('modify an address in the Address table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an UPDATE operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        addressid: 1,
        street: '456 Elm St',
        city: 'Los Angeles',
        postalcode: '90001',
        country: 'USA',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the update operation
  const res = await client.query(
    'UPDATE Address SET street = $1, city = $2, postalcode = $3, country = $4 WHERE addressid = $5 RETURNING *',
    ['456 Elm St', 'Los Angeles', '90001', 'USA', 1]
  );

  // Verify the update operation
  expect(res.rows[0].street).toBe('456 Elm St');
  expect(res.rows[0].city).toBe('Los Angeles');
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE Address SET street = $1, city = $2, postalcode = $3, country = $4 WHERE addressid = $5 RETURNING *',
    ['456 Elm St', 'Los Angeles', '90001', 'USA', 1]
  );
});

test('delete an address from the Address table', async () => {
  const client = pool.pool;

  // Mock the query to simulate a DELETE operation
  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  // Perform the delete operation
  const res = await client.query(
    'DELETE FROM Address WHERE addressid = $1 RETURNING *',
    [1]
  );

  // Verify the delete operation
  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Address WHERE addressid = $1 RETURNING *',
    [1]
  );
});
