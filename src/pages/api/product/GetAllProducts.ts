// src/pages/api/products/index.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Read all products
export const GET: APIRoute = async () => {
    try {
        if (pool.connection) {
            const query = `
            SELECT p.*, 
                   (
                       SELECT json_agg(pi)
                       FROM (
                           SELECT DISTINCT *
                           FROM ProductImages
                           WHERE productid = p.productid
                       ) pi
                   ) AS images,
                   (
                       SELECT json_agg(pc)
                       FROM (
                           SELECT DISTINCT pc.colorid, c.colorname, pc.sizeid, s.sizename, pc.quantity
                           FROM ProductColorSize pc
                           JOIN Color c ON pc.colorid = c.colorid
                           JOIN Sizes s ON pc.sizeid = s.sizeid
                           WHERE pc.productid = p.productid
                       ) pc
                   ) AS ProductColorSizes,
                   (
                       SELECT json_agg(c)
                       FROM (
                           SELECT DISTINCT c.categoryid, c.categoryname, c.categoryimage, c.categorydescription
                           FROM ProductCategory pc
                           JOIN Category c ON pc.categoryid = c.categoryid
                           WHERE pc.productid = p.productid
                       ) c
                   ) AS categories
            FROM Product p;
            `;
            const result = await pool.pool.query(query);
            return new Response(
                JSON.stringify(result.rows),
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
                        'Content-Type': 'application/json',
                    },
                }
            );
        }
    } catch (error) {
        console.error('Database error', error);
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