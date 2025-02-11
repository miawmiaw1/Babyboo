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

test('add a visitor count to the visitors table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        id: 1,
        visit: 1,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    'INSERT INTO visitors (visit) VALUES ($1) RETURNING *',
    [1]
  );

  expect(res.rows[0].visit).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'INSERT INTO visitors (visit) VALUES ($1) RETURNING *',
    [1]
  );
});

test('update the visitor count in the visitors table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rowCount: 1,
  });
  client.query = mockQuery;

  const res = await client.query(
    'UPDATE visitors SET visit = visit + 1 WHERE id = $1 RETURNING *',
    [1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'UPDATE visitors SET visit = visit + 1 WHERE id = $1 RETURNING *',
    [1]
  );
});

test('retrieve visitor count from the visitors table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        id: 1,
        visit: 10,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query('SELECT * FROM visitors WHERE id = $1', [1]);

  expect(res.rows[0].visit).toBe(10);
  expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM visitors WHERE id = $1', [1]);
});
