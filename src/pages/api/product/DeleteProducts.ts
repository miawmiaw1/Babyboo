// src/pages/api/products/[id]/delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Delete products by a range of product IDs
export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const startid = urlSearchParams.get('startid');
    const endid = urlSearchParams.get('endid');
    
    if (!startid || !endid) {
        return new Response(
            JSON.stringify({ error: 'Missing startid or endid' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        if (pool.connection) {
            const query = `DELETE FROM Product WHERE productid BETWEEN $1 AND $2 RETURNING *`;
            const result = await pool.pool.query(query, [startid, endid]);

            if (result.rowCount === 0) {
                console.error('No products found in the given range');
                return new Response(
                    JSON.stringify({ error: 'No products found in the given range' }),
                    {
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            return new Response(
                JSON.stringify({ message: 'Products deleted successfully' }),
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
