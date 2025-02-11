// src/pages/api/colors/[id]/update.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Update a color by ID
export const PUT: APIRoute = async ({ request, url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    const { colorname } = await request.json();
    try {
        const result = await pool.pool.query(
            'UPDATE Color SET colorname = $1 WHERE colorid = $2 RETURNING *',
            [colorname, id]
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
                JSON.stringify({ error: 'Color not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Error updating color:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update color' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};