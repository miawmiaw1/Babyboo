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

test('add a product-category relationship to the ProductCategory table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        productid: 1,
        categoryid: 1,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `INSERT INTO ProductCategory (productid, categoryid)
     VALUES ($1, $2) RETURNING *`,
    [1, 1]
  );

  expect(res.rows[0].productid).toBe(1);
  expect(res.rows[0].categoryid).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    `INSERT INTO ProductCategory (productid, categoryid)
     VALUES ($1, $2) RETURNING *`,
    [1, 1]
  );
});

test('delete a product-category relationship from the ProductCategory table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM ProductCategory WHERE productid = $1 AND categoryid = $2 RETURNING *',
    [1, 1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM ProductCategory WHERE productid = $1 AND categoryid = $2 RETURNING *',
    [1, 1]
  );
});
