import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const PUT: APIRoute = async ({ url, request }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    const { username, firstname, lastname, password, email, phonenumber, addressid, membertypeid } = await request.json();

    try {
        if (pool.connection) {
            const result = await pool.pool.query(
                'UPDATE Users SET username = $1, firstname = $2, lastname = $3, password = $4, email = $5, phonenumber = $6, addressid = $7, membertypeid = $8 WHERE userid = $9 RETURNING *',
                [username, firstname, lastname, password, email, phonenumber, addressid, membertypeid, id]
            );

            if (result.rows.length === 0) {
                console.error(`User with id ${id} not found`);

                return new Response(
                    JSON.stringify({ error: 'User does not exist' }),
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