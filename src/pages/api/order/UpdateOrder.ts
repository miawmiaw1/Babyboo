import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const PUT: APIRoute = async ({ request, url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    const {
        order_date,
        firstname,
        lastname,
        email,
        phonenumber,
        address,
        postalcode,
        city,
        country,
        parcel,
        ishomedelivery,
        totalprice,
        stripepaymentid,
        userid,
        statusid,
        paymentid
    } = await request.json();

    try {
        const result = await pool.pool.query(
            `UPDATE Orders 
            SET order_date = $1, firstname = $2, lastname = $3, email = $4, phonenumber = $5, 
                address = $6, postalcode = $7, city = $8, country = $9, parcel = $10, 
                ishomedelivery = $11, totalprice = $12, stripepaymentid = $13, userid = $14, statusid = $15, paymentid = $16
            WHERE orderid = $17
            RETURNING *`,
            [order_date, firstname, lastname, email, phonenumber, address, postalcode,
             city, country, parcel, ishomedelivery, totalprice, stripepaymentid, userid, statusid, paymentid, id]
        );

        if (result.rows.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Order not found' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        return new Response(
            JSON.stringify(result.rows[0]),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to update order' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};