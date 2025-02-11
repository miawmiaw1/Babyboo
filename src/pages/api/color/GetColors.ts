// src/pages/api/colors/index.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Get all colors
export const GET: APIRoute = async () => {
    try {
        const result = await pool.pool.query('SELECT * FROM Color');
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
        console.error('Error retrieving colors:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to retrieve colors' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};