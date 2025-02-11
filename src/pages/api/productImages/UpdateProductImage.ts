// src/pages/api/product-images/[imageid].json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Update a specific ProductImage entry
export const PUT: APIRoute = async ({ url, request }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');

    const { image_url, description } = await request.json();

    try {
        const query = `
            UPDATE ProductImages
            SET image_url = $1, description = $2
            WHERE imageid = $3
            RETURNING *;
        `;
        const result = await pool.pool.query(query, [image_url, description, id]);

        if (result.rowCount === 0) {
            return new Response(
                JSON.stringify({ error: 'Image not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        return new Response(
            JSON.stringify(result.rows[0]),
            {
                status: 200,
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