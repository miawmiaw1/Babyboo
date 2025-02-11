// src/pages/api/categories/index.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Read all categories
export const GET: APIRoute = async () => {
    try {
        const result = await pool.pool.query('SELECT * FROM Category');
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
        console.error('Error reading categories:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};