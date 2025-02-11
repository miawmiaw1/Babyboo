import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request }) => {
    const { email, password } = await request.json();
    try {

        if (pool.connection) {
                    // Query to get the user by email
                const query = `
                SELECT 
                    u.userid, 
                    u.email, 
                    u.password,
                    u.membertypeid
                FROM Users u
                WHERE u.email = $1;
            `;
            const result = await pool.pool.query(query, [email]);

            if (result.rows.length === 0) {
                return new Response(
                    JSON.stringify({ message: 'Invalid credentials' }),
                    {
                        status: 401,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            const user = result.rows[0];

            // Compare the entered password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return new Response(
                    JSON.stringify({ message: 'Invalid credentials' }),
                    {
                        status: 401,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            // Generate token with user information
            const token = jwt.sign(
                { userid: user.userid, email: email, membertypeid: user.membertypeid },
                import.meta.env.JWTSECRETKEY,
                { expiresIn: import.meta.env.JWEEXPIRATION } // Token expires as set in .env
            );

            return new Response(
                JSON.stringify({ token }),
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
        console.error(err);
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