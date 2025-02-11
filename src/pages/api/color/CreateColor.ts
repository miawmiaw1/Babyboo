// src/pages/api/colors/create.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Create a new color
export const POST: APIRoute = async ({ request }) => {
    const { colorname } = await request.json();
    try {
        const result = await pool.pool.query(
            'INSERT INTO Color (colorname) VALUES ($1) RETURNING *',
            [colorname]
        );
        return new Response(
            JSON.stringify(result.rows[0]),
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error creating color:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create color' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};