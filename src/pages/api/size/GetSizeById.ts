// src/pages/api/sizes/[id].json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Get a size by ID
export const GET: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    try {
        const result = await pool.pool.query('SELECT * FROM Sizes WHERE sizeid = $1', [id]);
        if (result.rows.length > 0) {
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
            return new Response(
                JSON.stringify({ error: 'Size not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Error retrieving size:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to retrieve size' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};