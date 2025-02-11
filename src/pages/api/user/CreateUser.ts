import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';
import bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ request }) => {
    const { username, firstname, lastname, password, email, phonenumber, addressid, membertypeid } = await request.json();

    try {
        if (pool.connection) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await pool.pool.query(
                'INSERT INTO Users (username, firstname, lastname, password, email, phonenumber, addressid, membertypeid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [username, firstname, lastname, hashedPassword, email, phonenumber, addressid, membertypeid]
            );

            return new Response(
                JSON.stringify(result.rows[0]),
                {
                    status: 201,
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