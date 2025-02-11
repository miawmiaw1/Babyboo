// src/pages/api/product-images/[imageid]/delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Delete a specific ProductImage entry
export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');

    try {
        const query = `
            DELETE FROM ProductImages
            WHERE imageid = $1
            RETURNING *;
        `;
        const result = await pool.pool.query(query, [id]);

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