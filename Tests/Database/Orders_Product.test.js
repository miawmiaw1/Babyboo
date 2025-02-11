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

test('add a product to the Orders_Product table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        order_product_id: 1,
        orderid: 1,
        productid: 1,
        productname: 'Product A',
        colorname: 'Red',
        sizename: 'M',
        quantity: 2,
        købspris_ex_moms: 100.00,
        salgpris_ex_moms: 150.00,
        indgående_moms: 25.00,
        udgående_moms: 37.50,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `INSERT INTO Orders_Product 
      (orderid, productid, productname, colorname, sizename, quantity, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      1,
      1,
      'Product A',
      'Red',
      'M',
      2,
      100.00,
      150.00,
      25.00,
      37.50,
    ]
  );

  expect(res.rows[0].productname).toBe('Product A');
  expect(res.rows[0].colorname).toBe('Red');
  expect(res.rows[0].quantity).toBe(2);
  expect(res.rows[0].købspris_ex_moms).toBe(100.00);
  expect(mockQuery).toHaveBeenCalledWith(
    `INSERT INTO Orders_Product 
      (orderid, productid, productname, colorname, sizename, quantity, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      1,
      1,
      'Product A',
      'Red',
      'M',
      2,
      100.00,
      150.00,
      25.00,
      37.50,
    ]
  );
});

test('update a product in the Orders_Product table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        order_product_id: 1,
        orderid: 1,
        productid: 1,
        productname: 'Product A',
        colorname: 'Red',
        sizename: 'M',
        quantity: 3,
        købspris_ex_moms: 100.00,
        salgpris_ex_moms: 150.00,
        indgående_moms: 25.00,
        udgående_moms: 37.50,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `UPDATE Orders_Product 
      SET quantity = $1 
      WHERE order_product_id = $2 RETURNING *`,
    [3, 1]
  );

  expect(res.rows[0].quantity).toBe(3);
  expect(mockQuery).toHaveBeenCalledWith(
    `UPDATE Orders_Product 
      SET quantity = $1 
      WHERE order_product_id = $2 RETURNING *`,
    [3, 1]
  );
});

test('delete a product from the Orders_Product table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM Orders_Product WHERE order_product_id = $1 RETURNING *',
    [1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Orders_Product WHERE order_product_id = $1 RETURNING *',
    [1]
  );
});
