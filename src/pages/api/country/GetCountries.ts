// src/pages/api/Country/index.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Read all countries
export const GET: APIRoute = async () => {
    try {
        if (pool.connection) {
            const result = await pool.pool.query('SELECT * FROM Country');
            return new Response(
                JSON.stringify(result.rows),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            console.error('Failed to connect to the database');
            return new Response(
                JSON.stringify({ error: 'Failed to connect to the database' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (err) {
        console.error('Database error', err);
        return new Response(
            JSON.stringify({ error: 'Database error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};