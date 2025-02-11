import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const GET: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const email = urlSearchParams.get('email');
    try {
        if (pool.connection) {
            const query = `
            SELECT userid FROM Users WHERE email = $1;
        `;
            const result = await pool.pool.query(query, [email]);

            if (result.rows.length === 0) {
                console.error(`User with email ${email} not found`);

                return new Response(
                    JSON.stringify({ error: "User does not exist" }),
                    {
                        status: 404,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            return new Response(
                JSON.stringify(result.rows[0]),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
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