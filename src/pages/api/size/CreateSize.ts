// src/pages/api/sizes/create.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Create a new size
export const POST: APIRoute = async ({ request }) => {
    const { sizename } = await request.json();
    try {
        const result = await pool.pool.query(
            'INSERT INTO Sizes (sizename) VALUES ($1) RETURNING *',
            [sizename]
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
        console.error('Error creating size:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create size' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};