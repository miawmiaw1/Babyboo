import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const PUT: APIRoute = async ({ request, url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const colorid = urlSearchParams.get('colorid');
    const sizeid = urlSearchParams.get('sizeid');
    const productid = urlSearchParams.get('productid');
    const {
        quantity
    } = await request.json();

    try {
        const result = await pool.pool.query(
            `UPDATE ProductColorSize 
             SET quantity = $1 
             WHERE colorid = $2 AND sizeid = $3 AND productid = $4
             RETURNING *`,
            [quantity, colorid, sizeid, productid]
        );

        if (result.rows.length === 0) {
            return new Response(
                JSON.stringify({ error: 'productcolorsize not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        return new Response(
            JSON.stringify(result.rows[0]),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to update productcolorsize quantity' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};