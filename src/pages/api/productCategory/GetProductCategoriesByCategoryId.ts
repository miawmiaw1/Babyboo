import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Read product categories by category ID
export const GET: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const categoryid = urlSearchParams.get('id');

    try {
        // Validate categoryid
        if (!categoryid) {
            return new Response(
                JSON.stringify({ error: 'categoryid is required' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Query to fetch product categories by categoryid
        const result = await pool.pool.query(
            'SELECT * FROM ProductCategory WHERE categoryid = $1',
            [categoryid]
        );

        if (result.rows.length > 0) {
            return new Response(
                JSON.stringify(result.rows),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'No product categories found for the given categoryid' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Error reading product categories:', error);
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