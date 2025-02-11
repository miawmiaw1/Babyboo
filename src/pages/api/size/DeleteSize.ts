// src/pages/api/sizes/[id]/delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Delete a size by ID
export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    try {
        const result = await pool.pool.query('DELETE FROM Sizes WHERE sizeid = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            return new Response(
                JSON.stringify({ message: 'Size deleted successfully' }),
                {
                    status: 204,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Size not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Error deleting size:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete size' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};