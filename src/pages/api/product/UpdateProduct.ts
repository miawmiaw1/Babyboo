// src/pages/api/products/[id]/update.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Update product by ID
export const PUT: APIRoute = async ({ request, url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const productId = urlSearchParams.get('id');
    const {
        name,
        description,
        features,
        link,
        købspris_ex_moms,
        salgpris_ex_moms,
        indgående_moms,
        udgående_moms,
        tags,
        barcode,
        images,
        productcolorsizes,
        manufacturer,
        categories
    } = await request.json();

    if (pool.connection) {

        const client = await pool.pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        await client.query(
            `UPDATE Product
             SET name = $1, description = $2, manufacturer = $3, features = $4, link = $5, købspris_ex_moms = $6, salgpris_ex_moms = $7, indgående_moms = $8, udgående_moms = $9, tags = $10, barcode = $11
             WHERE productid = $12`,
            [name, description, manufacturer, features, link, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms, tags, barcode, productId]
        );

        await client.query(`DELETE FROM ProductImages WHERE productid = $1`, [productId]);
        if (images && images.length > 0) {
            const imageInsertPromises = images.map((image: { image_url: any; description: any; }) => {
                return client.query(
                    `INSERT INTO ProductImages (productid, image_url, description)
                     VALUES ($1, $2, $3)`,
                    [productId, image.image_url, image.description]
                );
            });
            await Promise.all(imageInsertPromises);
        }

        await client.query(`DELETE FROM ProductColorSize WHERE productid = $1`, [productId]);
        if (productcolorsizes && productcolorsizes.length > 0) {
            const colorSizeInsertPromises = productcolorsizes.map(({ colorid, sizeid, quantity }: { colorid: Number, sizeid: Number, quantity: Number }) => {
                return client.query(
                    `INSERT INTO ProductColorSize (productid, colorid, sizeid, quantity)
                     VALUES ($1, $2, $3, $4)`,
                    [productId, colorid, sizeid, quantity]
                );
            });
            await Promise.all(colorSizeInsertPromises);
        }

        await client.query(`DELETE FROM ProductCategory WHERE productid = $1`, [productId]);
        if (categories && categories.length > 0) {
            const categoryInsertPromises = categories.map(({ categoryid }: {categoryid: number}) => {
                return client.query(
                    `INSERT INTO ProductCategory (productid, categoryid)
                     VALUES ($1, $2)`,
                    [productId, categoryid]
                );
            });
            await Promise.all(categoryInsertPromises);
        }

        await client.query('COMMIT');
        return new Response(
            JSON.stringify({ message: 'Product updated successfully' }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating product with relations:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update product with relations' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } finally {
        client.release();
    }

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
};