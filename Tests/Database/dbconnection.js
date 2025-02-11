const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

async function initializePool() {
  let pool = {
    connection: false,
    pool: new Pool({}), // Fallback pool
  };

  try {
    // Create a new pool with configuration from environment variables
    const dbcon = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE_NAME,
      password: String(process.env.PASSWORD),
      port: Number(process.env.DATABASEPORT),
    });

    // Attempt to connect to verify the connection
    await dbcon.connect();
    pool.connection = true;
    pool.pool = dbcon;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    // Retain the fallback pool if connection fails
    pool.connection = false;
    pool.pool = new Pool({});
  }

  return pool;
}

module.exports = initializePool;