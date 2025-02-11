import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';
import jwt from 'jsonwebtoken';

export const POST: APIRoute = async ({ request }) => {
    const {
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
        paymentid,
        order_products
    } = await request.json();

    if (pool.connection) {
        const client = await pool.pool.connect();
        try {
            await client.query('BEGIN');

            const orderDate = new Date().toISOString().split('T')[0];
            const orderResult = await client.query(
                `INSERT INTO Orders (order_date, firstname, lastname, email, phonenumber, address, postalcode, city, country, parcel, ishomedelivery, totalprice, stripepaymentid, userid, statusid, paymentid) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
                [orderDate, firstname, lastname, email, phonenumber, address, postalcode, city, country, parcel, ishomedelivery, totalprice, stripepaymentid, userid, statusid, paymentid]
            );

            const newOrderId = orderResult.rows[0].orderid;

            if (Array.isArray(order_products) && order_products.length > 0) {
                const ordersProductInsertPromises = order_products.map((product) => {
                    if (!product.productid || !product.colorname || !product.sizename || !product.quantity) {
                        throw new Error('Invalid OrdersProduct data: missing required fields');
                    }
                    return client.query(
                        `INSERT INTO Orders_Product (orderid, productid, productname, colorname, sizename, quantity, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [newOrderId, product.productid, product.productname, product.colorname, product.sizename, product.quantity, product.købspris_ex_moms, product.salgpris_ex_moms, product.indgående_moms, product.udgående_moms]
                    );
                });
                await Promise.all(ordersProductInsertPromises);
            }

            await client.query('COMMIT');

            const token = jwt.sign(
                { order: orderResult.rows[0] },
                import.meta.env.JWTSECRETKEY,
                { expiresIn: "1m" }
            );

            return new Response(
                JSON.stringify({ order: orderResult.rows[0], jwt: token }),
                {
                    status: 201,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error creating order:', error);
            return new Response(
                JSON.stringify({ error: 'Failed to create order' }),
                {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        } finally {
            client.release();
        }
    } else {
        return new Response(
            JSON.stringify({ error: 'Database connection failed' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};