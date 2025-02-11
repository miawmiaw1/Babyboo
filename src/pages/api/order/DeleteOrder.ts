import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    try {
        const result = await pool.pool.query(
            'DELETE FROM Orders WHERE orderid = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Order not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to delete order' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};