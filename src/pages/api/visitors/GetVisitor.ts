// src/pages/hello.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const GET: APIRoute = async () => {

    try {
        if (pool.connection) {
          const result = await pool.pool.query('SELECT * FROM visitors LIMIT 1');
          if (result.rows.length > 0) {
              return new Response(
                  JSON.stringify(result.rows[0]),
                  {
                    status: 200,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
          } else {
              console.error('Visitor entry not found');

              return new Response(
                  JSON.stringify({ error: 'Visitor entry not found' }),
                  {
                    status: 404,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
          }
        } else {

          console.error('Failed to fetch visitor entry');

          return new Response(
            JSON.stringify({ error: 'Failed to fetch visitor entry' }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
    } catch (error) {
      
        console.error('Database not connected');

        return new Response(
            JSON.stringify({ error: 'Database not connected' }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    }
};