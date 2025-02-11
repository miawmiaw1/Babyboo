import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';
import bcrypt from 'bcrypt';

function generateRandomPassword() {
    var lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    var uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numberChars = '0123456789';
    var specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    var allChars = lowercaseChars;
    var length = 16;
    allChars += uppercaseChars;
    allChars += numberChars;
    allChars += specialChars;
    if (!allChars) {
        throw new Error('At least one character set must be selected.');
    }
    var password = '';
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    return password;
}


export const POST: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');

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
    const newpassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newpassword, 10); // 10 is the salt rounds

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
        JSON.stringify(newpassword),
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