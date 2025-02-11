// src/pages/api/categories/[id]/delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Delete a category by ID
export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    try {
        const result = await pool.pool.query('DELETE FROM Category WHERE categoryid = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            return new Response(
                JSON.stringify({ message: 'Category deleted successfully' }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Category not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Error deleting category:', error);
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