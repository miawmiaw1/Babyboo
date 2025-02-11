// src/pages/api/colors/[id]/delete.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

export const GET: APIRoute = async ({ url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const id = urlSearchParams.get('id');
    try {
            const query = `
            SELECT 
                o.*, 
                s.statusname, 
                p.paymentname,
                (
                    SELECT json_agg(op)
                    FROM (
                        SELECT 
                            op.*, 
                            pr.name AS productname
                        FROM Orders_Product op
                        JOIN Product pr ON op.productid = pr.productid
                        WHERE op.orderid = o.orderid
                    ) op
                ) AS order_products
            FROM Orders o
            JOIN Status s ON o.statusid = s.statusid
            JOIN Payment p ON o.paymentid = p.paymentid
            WHERE o.userid = $1
        `;
        const result = await pool.pool.query(query, [id]);

        if (result.rows.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No orders found for this user' }),
                {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        return new Response(
            JSON.stringify(result.rows),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to fetch orders' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};