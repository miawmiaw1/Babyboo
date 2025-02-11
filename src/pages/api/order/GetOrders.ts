import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// src/pages/api/orders/index.json.ts
export const GET: APIRoute = async () => {
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
        `;
    const result = await pool.pool.query(query);
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