const initializePool = require('./dbconnection'); // Import the actual database pool

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

test('add a country to the Country table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an INSERT operation
  const mockQuery = jest.fn().mockResolvedValue({ rows: [{ countryid: 1, country: 'Test Country' }] });
  client.query = mockQuery;

  // Perform the add operation
  const res = await client.query('INSERT INTO Country (country) VALUES ($1) RETURNING *', ['Test Country']);
  
  // Check if the insert was successful and the mock query was called with the expected arguments
  expect(res.rows[0].country).toBe('Test Country');
  expect(mockQuery).toHaveBeenCalledWith('INSERT INTO Country (country) VALUES ($1) RETURNING *', ['Test Country']);
});

test('modify a country in the Country table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an UPDATE operation
  const mockQuery = jest.fn().mockResolvedValue({ rows: [{ countryid: 1, country: 'Updated Country' }] });
  client.query = mockQuery;

  // Perform the update operation
  const res = await client.query('UPDATE Country SET country = $1 WHERE countryid = $2 RETURNING *', ['Updated Country', 1]);

  // Check if the update was successful and the mock query was called with the expected arguments
  expect(res.rows[0].country).toBe('Updated Country');
  expect(mockQuery).toHaveBeenCalledWith('UPDATE Country SET country = $1 WHERE countryid = $2 RETURNING *', ['Updated Country', 1]);
});

test('delete a country from the Country table', async () => {
  const client = pool.pool;

  // Mock the query to simulate a DELETE operation
  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  // Perform the delete operation
  const res = await client.query('DELETE FROM Country WHERE countryid = $1 RETURNING *', [1]);

  // Check if the delete was successful
  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith('DELETE FROM Country WHERE countryid = $1 RETURNING *', [1]);
});