import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const GET: APIRoute = async () => {
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
                LEFT JOIN MemberType mt ON u.membertypeid = mt.membertypeid;
            `;
            const result = await pool.pool.query(query);
            return new Response(
                JSON.stringify(result.rows),
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