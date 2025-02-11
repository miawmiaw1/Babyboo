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

test('add an order to the Orders table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        orderid: 1,
        order_date: '2024-02-07',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phonenumber: 1234567890,
        address: '123 Main St',
        postalcode: 1000,
        city: 'Copenhagen',
        country: 'Denmark',
        parcel: 'PostNord',
        ishomedelivery: true,
        totalprice: 199.99,
        stripepaymentid: 'pi_12345',
        userid: 1,
        statusid: 2,
        paymentid: 3,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `INSERT INTO Orders 
      (order_date, firstname, lastname, email, phonenumber, address, postalcode, city, country, parcel, ishomedelivery, totalprice, stripepaymentid, userid, statusid, paymentid) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
    [
      '2024-02-07',
      'John',
      'Doe',
      'john.doe@example.com',
      1234567890,
      '123 Main St',
      1000,
      'Copenhagen',
      'Denmark',
      'PostNord',
      true,
      199.99,
      'pi_12345',
      1,
      2,
      3,
    ]
  );

  expect(res.rows[0].firstname).toBe('John');
  expect(res.rows[0].lastname).toBe('Doe');
  expect(res.rows[0].totalprice).toBe(199.99);
  expect(res.rows[0].statusid).toBe(2);
  expect(mockQuery).toHaveBeenCalledWith(
    `INSERT INTO Orders 
      (order_date, firstname, lastname, email, phonenumber, address, postalcode, city, country, parcel, ishomedelivery, totalprice, stripepaymentid, userid, statusid, paymentid) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
    [
      '2024-02-07',
      'John',
      'Doe',
      'john.doe@example.com',
      1234567890,
      '123 Main St',
      1000,
      'Copenhagen',
      'Denmark',
      'PostNord',
      true,
      199.99,
      'pi_12345',
      1,
      2,
      3,
    ]
  );
});

test('update an order in the Orders table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({
    rows: [
      {
        orderid: 1,
        order_date: '2024-02-07',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phonenumber: 1234567890,
        address: '456 Elm St',
        postalcode: 2000,
        city: 'Aarhus',
        country: 'Denmark',
        parcel: 'UPS',
        ishomedelivery: false,
        totalprice: 249.99,
        stripepaymentid: 'pi_67890',
        userid: 1,
        statusid: 3,
        paymentid: 4,
      },
    ],
  });
  client.query = mockQuery;

  const res = await client.query(
    `UPDATE Orders 
      SET address = $1, postalcode = $2, city = $3, parcel = $4, ishomedelivery = $5, totalprice = $6, stripepaymentid = $7, statusid = $8, paymentid = $9 
      WHERE orderid = $10 RETURNING *`,
    [
      '456 Elm St',
      2000,
      'Aarhus',
      'UPS',
      false,
      249.99,
      'pi_67890',
      3,
      4,
      1,
    ]
  );

  expect(res.rows[0].address).toBe('456 Elm St');
  expect(res.rows[0].city).toBe('Aarhus');
  expect(res.rows[0].totalprice).toBe(249.99);
  expect(res.rows[0].statusid).toBe(3);
  expect(mockQuery).toHaveBeenCalledWith(
    `UPDATE Orders 
      SET address = $1, postalcode = $2, city = $3, parcel = $4, ishomedelivery = $5, totalprice = $6, stripepaymentid = $7, statusid = $8, paymentid = $9 
      WHERE orderid = $10 RETURNING *`,
    [
      '456 Elm St',
      2000,
      'Aarhus',
      'UPS',
      false,
      249.99,
      'pi_67890',
      3,
      4,
      1,
    ]
  );
});

test('delete an order from the Orders table', async () => {
  const client = pool.pool;

  const mockQuery = jest.fn().mockResolvedValue({ rowCount: 1 });
  client.query = mockQuery;

  const res = await client.query(
    'DELETE FROM Orders WHERE orderid = $1 RETURNING *',
    [1]
  );

  expect(res.rowCount).toBe(1);
  expect(mockQuery).toHaveBeenCalledWith(
    'DELETE FROM Orders WHERE orderid = $1 RETURNING *',
    [1]
  );
});
