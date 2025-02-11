// src/pages/api/categories/[id]/update.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Update a category by ID
export const PUT: APIRoute = async ({ request, url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    const { categoryname, categoryimage, categorydescription } = await request.json();
    try {
        const result = await pool.pool.query(
            'UPDATE Category SET categoryname = $1, categoryimage = $2, categorydescription = $3 WHERE categoryid = $4 RETURNING *',
            [categoryname, categoryimage, categorydescription, id]
        );
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
        console.error('Error updating category:', error);
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