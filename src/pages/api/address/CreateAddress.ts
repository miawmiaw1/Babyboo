import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const POST: APIRoute = async ({ request }) => {
    const { address, postalcode, city, countryid } = await request.json();
    try {
        if (pool.connection) {
            const result = await pool.pool.query(
                'INSERT INTO Address (address, postalcode, city, countryid) VALUES ($1, $2, $3, $4) RETURNING *',
                [address, postalcode, city, countryid]
            );
            return new Response(
                JSON.stringify({ addressid: result.rows[0].addressid }),
                {
                    status: 201,
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