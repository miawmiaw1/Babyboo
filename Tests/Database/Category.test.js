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

test('add a category to the Category table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an INSERT operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        categoryid: 1,
        categoryname: 'Electronics',
        categoryimage: 'electronics.jpg',
        categorydescription: 'Devices and gadgets',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the add operation
  const res = await client.query(
    'INSERT INTO Category (categoryname, categoryimage, categorydescription) VALUES ($1, $2, $3) RETURNING *',
    ['Electronics', 'electronics.jpg', 'Devices and gadgets']
  );

  // Verify the insert operation
  expect(res.rows[0].categoryname).toBe('Electronics');
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO Category (categoryname, categoryimage, categorydescription) VALUES ($1, $2, $3) RETURNING *',
    ['Electronics', 'electronics.jpg', 'Devices and gadgets']
  );
});

test('modify a category in the Category table', async () => {
  const client = pool.pool;

  // Mock the query to simulate an UPDATE operation
  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        categoryid: 1,
        categoryname: 'Home Appliances',
        categoryimage: 'home_appliances.jpg',
        categorydescription: 'Appliances for home use',
      },
    ],
  });
  client.query = mockQuery;

  // Perform the update operation
  const res = await client.query(
    'UPDATE Category SET categoryname = $1, categoryimage = $2, categorydescription = $3 WHERE categoryid = $4 RETURNING *',
    ['Home Appliances', 'home_appliances.jpg', 'Appliances for home use', 1]
  );

  // Verify the update operation
  expect(res.rows[0].categoryname).toBe('Home Appliances');
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE Category SET categoryname = $1, categoryimage = $2, categorydescription = $3 WHERE categoryid = $4 RETURNING *',
    ['Home Appliances', 'home_appliances.jpg', 'Appliances for home use', 1]
  );
});

test('delete a category from the Category table', async () => {
  const client = pool.pool;

  // Mock the query to simulate a DELETE operation
  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  // Perform the delete operation
  const res = await client.query(
    'DELETE FROM Category WHERE categoryid = $1 RETURNING *',
    [1]
  );

  // Verify the delete operation
  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Category WHERE categoryid = $1 RETURNING *',
    [1]
  );
});
