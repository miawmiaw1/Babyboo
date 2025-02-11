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

test('add a user-payment relationship to the UserPayment table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        userid: 1,
        paymentid: 1,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `INSERT INTO UserPayment (userid, paymentid)
     VALUES ($1, $2) RETURNING *`,
    [1, 1]
  );

  expect(res.rows[0].userid).toBe(1);
  expect(res.rows[0].paymentid).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    `INSERT INTO UserPayment (userid, paymentid)
     VALUES ($1, $2) RETURNING *`,
    [1, 1]
  );
});

test('delete a user-payment relationship from the UserPayment table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM UserPayment WHERE userid = $1 AND paymentid = $2 RETURNING *',
    [1, 1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM UserPayment WHERE userid = $1 AND paymentid = $2 RETURNING *',
    [1, 1]
  );
});
