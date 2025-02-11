import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';
import bcrypt from 'bcrypt';

export const POST: APIRoute = async ({ request, url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    const { kodeord, nykode } = await request.json();

    try {
        
        if (pool.connection) {
                // Query to get the user by userid
        const query = `
        SELECT 
            u.userid, 
            u.email, 
            u.password,
            u.membertypeid
        FROM Users u
        WHERE u.userid = $1;
    `;
    const result = await pool.pool.query(query, [id]);

    if (result.rows.length === 0) {
        return new Response(
            JSON.stringify({ message: 'User does not exist' }),
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    const user = result.rows[0];

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(kodeord, user.password);

    if (!isPasswordValid) {
        return new Response(
            JSON.stringify({ message: 'Invalid credentials' }),
            {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    const hashedPassword = await bcrypt.hash(nykode, 10); // 10 is the salt rounds

    const resultUpdate = await pool.pool.query(
        'UPDATE Users SET password = $1 WHERE userid = $2 RETURNING *',
        [hashedPassword, id]
    );

    if (resultUpdate.rows.length === 0) {
        return new Response(
            JSON.stringify({ message: 'Cannot update user' }),
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    return new Response(
        JSON.stringify(resultUpdate.rows[0]),
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
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};