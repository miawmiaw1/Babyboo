import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const DELETE: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');

    try {
        if (pool.connection) {
            const result = await pool.pool.query('DELETE FROM Users WHERE userid = $1 RETURNING *', [id]);

            if (result.rows.length === 0) {
                console.error(`User with id ${id} not found`);

                return new Response(
                    JSON.stringify({ error: 'User not found' }),
                    {
                        status: 404,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            return new Response(
                null,
                { status: 204 } // No content to return
            );
        } else {
            console.error('Failed to connect to the database');

            return new Response(
                JSON.stringify({ error: 'Failed to connect to the database' }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }
    } catch (err) {
        console.error('Database error', err);

        return new Response(
            JSON.stringify({ error: 'Database error' }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
};