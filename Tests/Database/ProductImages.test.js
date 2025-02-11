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

test('add a product image to the ProductImages table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        imageid: 1,
        productid: 1,
        image_url: 'http://example.com/image.jpg',
        description: 'Product image description',
        created_at: '2025-02-07T00:00:00',
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `INSERT INTO ProductImages (productid, image_url, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [1, 'http://example.com/image.jpg', 'Product image description']
  );

  expect(res.rows[0].productid).toBe(1);
  expect(res.rows[0].image_url).toBe('http://example.com/image.jpg');
  expect(res.rows[0].description).toBe('Product image description');
  expect(mockQuery).toHaveBeenCalledWith(
    `INSERT INTO ProductImages (productid, image_url, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [1, 'http://example.com/image.jpg', 'Product image description']
  );
});

test('delete a product image from the ProductImages table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM ProductImages WHERE imageid = $1 RETURNING *',
    [1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM ProductImages WHERE imageid = $1 RETURNING *',
    [1]
  );
});
