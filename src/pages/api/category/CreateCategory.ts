// src/pages/api/categories/create.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Create a new category
export const POST: APIRoute = async ({ request }) => {
    const { categoryname, categoryimage, categorydescription } = await request.json();
    try {
        const result = await pool.pool.query(
            'INSERT INTO Category (categoryname, categoryimage, categorydescription) VALUES ($1, $2, $3) RETURNING *',
            [categoryname, categoryimage, categorydescription]
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
        console.error('Error creating category:', error);
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