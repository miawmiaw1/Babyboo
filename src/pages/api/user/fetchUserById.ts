import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const GET: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    try {
        if (pool.connection) {
            const query = `
                SELECT 
                    u.userid,
                    u.username,
                    u.firstname, 
                    u.lastname, 
                    u.email, 
                    u.phonenumber,
                    mt.membertypeid,
                    a.addressid,
                    u.password, 
                    a.address AS user_address, 
                    a.postalcode AS address_postalcode, 
                    a.city AS address_city, 
                    c.country AS country_name, 
                    mt.type AS member_type
                FROM Users u
                LEFT JOIN Address a ON u.addressid = a.addressid
                LEFT JOIN Country c ON a.countryid = c.countryid
                LEFT JOIN MemberType mt ON u.membertypeid = mt.membertypeid
                WHERE u.userid = $1;
            `;
            const result = await pool.pool.query(query, [id]);

            if (result.rows.length === 0) {
                console.error(`User with id ${id} not found`);

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