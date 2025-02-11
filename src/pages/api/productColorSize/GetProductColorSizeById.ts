// src/pages/api/categories/[id].json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Read a single category by ID
export const GET: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const colorid = urlSearchParams.get('colorid');
    const sizeid = urlSearchParams.get('sizeid');
    const productid = urlSearchParams.get('productid');
    try {
        const result = await pool.pool.query('SELECT * FROM ProductColorSize WHERE colorid = $1 AND sizeid = $2 AND productid = $3', [colorid, sizeid, productid]);
        if (result.rows.length > 0) {
            return new Response(
                JSON.stringify(result.rows[0]),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'ProductColorSize not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Error reading category:', error);
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