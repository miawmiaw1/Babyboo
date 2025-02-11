// src/pages/api/sizes/[id]/update.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Update a size by ID
export const PUT: APIRoute = async ({ request, url }) => {
    
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');

    const { sizename } = await request.json();
    try {
        const result = await pool.pool.query(
            'UPDATE Sizes SET sizename = $1 WHERE sizeid = $2 RETURNING *',
            [sizename, id]
        );
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
        console.error('Error updating size:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update size' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};