// src/pages/api/product-images/index.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Create a new ProductImage entry
export const POST: APIRoute = async ({ request }) => {
    const { productid, image_url, description } = await request.json();

    try {
        const query = `
            INSERT INTO ProductImages (productid, image_url, description)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.pool.query(query, [productid, image_url, description]);
        return new Response(
            JSON.stringify(result.rows[0]),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (err) {
        console.error('Database error:', err);
        return new Response(
            JSON.stringify({ error: 'Database error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};