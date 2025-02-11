import pkg from 'pg';

const isProd = import.meta.env.PROD
var pool = {
    connection: false,
    pool: new pkg.Pool({})
}

if (isProd) {
    try {
        // Configure PostgreSQL connection
        const dbcon = new pkg.Pool({
        user: import.meta.env.USERCLOUD,
        host: import.meta.env.HOSTCLOUD,
        database: import.meta.env.DATABASE_NAMECLOUD,
        password: String(import.meta.env.PASSWORDCLOUD),
        port: Number(import.meta.env.DATABASEPORTCLOUD),
        ssl: {
            rejectUnauthorized: false, // Render requires SSL, disable strict SSL verification
        },
    });
        await dbcon.connect(); // Attempt to connect
        console.log('Connected to PostgreSQL successfully!');
        console.log('ENV: CLOUD');
        console.log(`Databasename : ${import.meta.env.DATABASE_NAMECLOUD}`);

        pool.connection = true;
        pool.pool = dbcon;
      } catch (error) {
        console.error('Error connecting to PostgreSQL:', error.message);

        pool.connection = false;
        pool.pool = new pkg.Pool({});
      } finally {
      }

} else {
    try {
        // Configure PostgreSQL connection
        const dbcon = new pkg.Pool({
            user: import.meta.env.USER,
            host: import.meta.env.HOST,
            database: import.meta.env.DATABASE_NAME,
            password: String(import.meta.env.PASSWORD),
            port: Number(import.meta.env.DATABASEPORT),
        });

        await dbcon.connect(); // Attempt to connect
        console.log('Connected to PostgreSQL successfully!');
        console.log('ENV: LOCAL');
        console.log(`Databasename : ${import.meta.env.DATABASE_NAME}`);

        pool.connection = true;
        pool.pool = dbcon;
      } catch (error) {
        console.error('Error connecting to PostgreSQL:', error.message);
        
        pool.connection = false;
        pool.pool = new pkg.Pool({});
      } finally {
      }
}

export default pool;