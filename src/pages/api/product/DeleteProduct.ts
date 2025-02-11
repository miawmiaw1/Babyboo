// src/pages/api/products/[id]/delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Delete a product by ID
export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');

    try {
        if (pool.connection) {
            const query = `DELETE FROM Product WHERE productid = $1 RETURNING *`;
            const result = await pool.pool.query(query, [id]);

            if (result.rowCount === 0) {
                console.error('Product not found');
                return new Response(
                    JSON.stringify({ error: 'Product not found' }),
                    {
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
            
            return new Response(
                JSON.stringify({ message: 'Product deleted successfully' }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        } else {
            console.error('Failed to connect to the database');
            return new Response(
                JSON.stringify({ error: 'Failed to connect to the database' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Database error', error);
        return new Response(
            JSON.stringify({ error: 'Database error' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};