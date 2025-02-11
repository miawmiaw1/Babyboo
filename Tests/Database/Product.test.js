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

test('add a product to the Product table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        productid: 1,
        name: 'Laptop Pro X',
        description: 'High-performance laptop with Intel i9 processor',
        manufacturer: 'TechCorp',
        features: '16GB RAM, 1TB SSD, 4K Display',
        link: 'https://techcorp.com/laptop-pro-x',
        købspris_ex_moms: 8000.00,
        salgpris_ex_moms: 10000.00,
        indgående_moms: 2000.00,
        udgående_moms: 2500.00,
        tags: 'laptop, tech, professional',
        barcode: 1234567890123,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `INSERT INTO Product 
      (name, description, manufacturer, features, link, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms, tags, barcode) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      'Laptop Pro X',
      'High-performance laptop with Intel i9 processor',
      'TechCorp',
      '16GB RAM, 1TB SSD, 4K Display',
      'https://techcorp.com/laptop-pro-x',
      8000.00,
      10000.00,
      2000.00,
      2500.00,
      'laptop, tech, professional',
      1234567890123,
    ]
  );

  expect(res.rows[0].name).toBe('Laptop Pro X');
  expect(res.rows[0].manufacturer).toBe('TechCorp');
  expect(res.rows[0].salgpris_ex_moms).toBe(10000.00);
  expect(mockQuery).toHaveBeenCalledWith(
    `INSERT INTO Product 
      (name, description, manufacturer, features, link, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms, tags, barcode) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      'Laptop Pro X',
      'High-performance laptop with Intel i9 processor',
      'TechCorp',
      '16GB RAM, 1TB SSD, 4K Display',
      'https://techcorp.com/laptop-pro-x',
      8000.00,
      10000.00,
      2000.00,
      2500.00,
      'laptop, tech, professional',
      1234567890123,
    ]
  );
});

test('update a product in the Product table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        productid: 1,
        name: 'Laptop Ultra Z',
        description: 'Updated description with better specs',
        manufacturer: 'TechCorp',
        features: '32GB RAM, 2TB SSD, 5K Display',
        link: 'https://techcorp.com/laptop-ultra-z',
        købspris_ex_moms: 9000.00,
        salgpris_ex_moms: 11000.00,
        indgående_moms: 2250.00,
        udgående_moms: 2750.00,
        tags: 'laptop, premium, professional',
        barcode: 1234567890123,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `UPDATE Product 
      SET name = $1, description = $2, features = $3, link = $4, købspris_ex_moms = $5, salgpris_ex_moms = $6, 
      indgående_moms = $7, udgående_moms = $8, tags = $9 
      WHERE productid = $10 RETURNING *`,
    [
      'Laptop Ultra Z',
      'Updated description with better specs',
      '32GB RAM, 2TB SSD, 5K Display',
      'https://techcorp.com/laptop-ultra-z',
      9000.00,
      11000.00,
      2250.00,
      2750.00,
      'laptop, premium, professional',
      1,
    ]
  );

  expect(res.rows[0].name).toBe('Laptop Ultra Z');
  expect(res.rows[0].salgpris_ex_moms).toBe(11000.00);
  expect(mockQuery).toHaveBeenCalledWith(
    `UPDATE Product 
      SET name = $1, description = $2, features = $3, link = $4, købspris_ex_moms = $5, salgpris_ex_moms = $6, 
      indgående_moms = $7, udgående_moms = $8, tags = $9 
      WHERE productid = $10 RETURNING *`,
    [
      'Laptop Ultra Z',
      'Updated description with better specs',
      '32GB RAM, 2TB SSD, 5K Display',
      'https://techcorp.com/laptop-ultra-z',
      9000.00,
      11000.00,
      2250.00,
      2750.00,
      'laptop, premium, professional',
      1,
    ]
  );
});

test('delete a product from the Product table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM Product WHERE productid = $1 RETURNING *',
    [1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Product WHERE productid = $1 RETURNING *',
    [1]
  );
});
