// src/pages/api/colors/[id]/delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Delete a color by ID
export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    try {
        const result = await pool.pool.query('DELETE FROM Color WHERE colorid = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            return new Response(
                JSON.stringify({ message: 'Color deleted successfully' }),
                {
                    status: 204,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Color not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Error deleting color:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete color' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};