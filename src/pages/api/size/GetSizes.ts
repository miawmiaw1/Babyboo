// src/pages/api/sizes/index.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Get all sizes
export const GET: APIRoute = async () => {
    try {
        const result = await pool.pool.query('SELECT * FROM Sizes');
        return new Response(
            JSON.stringify(result.rows),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error retrieving sizes:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to retrieve sizes' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};