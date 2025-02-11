import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const connectdb = () => {
  const isProd = process.env.PROD === "true";
  var pool = new pkg.Pool({})

  try {
    if (isProd) {
      pool = new pkg.Pool({
          user: process.env.USERCLOUD,
          host: process.env.HOSTCLOUD,
          database: process.env.DATABASE_NAMECLOUD,
          password: String(process.env.PASSWORDCLOUD),
          port: Number(process.env.DATABASEPORTCLOUD),
          ssl: {
              rejectUnauthorized: false, // Render requires SSL, disable strict SSL verification
          },
      });
    } else {
      pool = new pkg.Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE_NAME,
        password: String(process.env.PASSWORD),
        port: Number(process.env.DATABASEPORT)
    });
    }
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }

  console.log('Connected to PostgreSQL successfully!');
  return pool;
}

export const AdjustCronTime = (minute: number, hour: number) => {
    const dayOfMonth = '*'; // Every day of the month
    const month = '*';      // Every month
    const dayOfWeek = '*';  // Every day of the week

    return {
        minute: minute, 
        hour: hour,
        expression: `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
    };
}

// Your function to run daily
export const UpdateVisitors = async () => {
    console.log('Running daily task at', new Date().toISOString());
    // Add your business logic here
    const pool = connectdb();
    try {
        const { rows } = await pool.query(`SELECT id FROM visitors LIMIT 1`);
    
        if (rows.length === 0) {
          console.error('No visitors found');
        }
  
        const firstId = rows[0].id;
  
        const result = await pool.query(
          `UPDATE visitors SET visit = 0 WHERE id = $1 RETURNING *`,
          [firstId]
        );
  
        if (result.rowCount === 0) {
            console.error('Visitor ID not found');
        }
        
        console.error('Visitors updated');

      } catch (error) {
        console.error('Database not connected');
      }
};