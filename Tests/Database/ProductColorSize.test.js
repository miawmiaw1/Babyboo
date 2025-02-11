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

test('add a product with color and size to the ProductColorSize table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        productid: 1,
        colorid: 1,
        sizeid: 1,
        quantity: 10,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `INSERT INTO ProductColorSize (productid, colorid, sizeid, quantity)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [1, 1, 1, 10]
  );

  expect(res.rows[0].productid).toBe(1);
  expect(res.rows[0].colorid).toBe(1);
  expect(res.rows[0].sizeid).toBe(1);
  expect(res.rows[0].quantity).toBe(10);
  expect(mockQuery).toHaveBeenCalledWith(
    `INSERT INTO ProductColorSize (productid, colorid, sizeid, quantity)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [1, 1, 1, 10]
  );
});

test('update the quantity of a product with color and size in the ProductColorSize table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        productid: 1,
        colorid: 1,
        sizeid: 1,
        quantity: 20,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `UPDATE ProductColorSize 
     SET quantity = $1 
     WHERE productid = $2 AND colorid = $3 AND sizeid = $4 
     RETURNING *`,
    [20, 1, 1, 1]
  );

  expect(res.rows[0].quantity).toBe(20);
  expect(mockQuery).toHaveBeenCalledWith(
    `UPDATE ProductColorSize 
     SET quantity = $1 
     WHERE productid = $2 AND colorid = $3 AND sizeid = $4 
     RETURNING *`,
    [20, 1, 1, 1]
  );
});

test('delete a product with color and size from the ProductColorSize table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM ProductColorSize WHERE productid = $1 AND colorid = $2 AND sizeid = $3 RETURNING *',
    [1, 1, 1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM ProductColorSize WHERE productid = $1 AND colorid = $2 AND sizeid = $3 RETURNING *',
    [1, 1, 1]
  );
});
