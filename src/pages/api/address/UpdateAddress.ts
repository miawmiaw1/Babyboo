import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Update an address by ID
export const PUT: APIRoute = async ({ url, request }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    const { address, postalcode, city, countryid } = await request.json();
    try {
        if (pool.connection) {
            const result = await pool.pool.query(
                'UPDATE Address SET address = $1, postalcode = $2, city = $3, countryid = $4 WHERE addressid = $5 RETURNING *',
                [address, postalcode, city, countryid, id]
            );
            if (result.rows.length === 0) {
                return new Response(
                    JSON.stringify({ error: 'Address not found' }),
                    {
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
            return new Response(
                JSON.stringify(result.rows[0]),
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