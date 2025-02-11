// src/pages/api/products/create.json.ts
import type { APIRoute } from 'astro';
import pool from '../../../../Backend/database/dbconnection';

// Create a new product
export const POST: APIRoute = async ({ request, url }) => {
    const urlSearchParams = new URLSearchParams(url.search);
    const IsLocalCdn = urlSearchParams.get('IsLocalCdn') === 'true';
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
        images, // Array of image objects
        productcolorsizes, // Array of color/size/quantity objects
        manufacturer, // Array of manufacturer IDs
        categories // Array of category IDs
    } = await request.json();

    if (pool.connection) {
        const client = await pool.pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        const productResult = await client.query(
            `INSERT INTO Product 
            (name, description, manufacturer, features, link, købspris_ex_moms, salgpris_ex_moms, indgående_moms, udgående_moms, tags, barcode) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING *`,
            [
                name, 
                description, 
                manufacturer, 
                features, 
                link, 
                købspris_ex_moms, 
                salgpris_ex_moms, 
                indgående_moms, 
                udgående_moms,
                tags, 
                barcode
            ]
        );

        const newProductId = productResult.rows[0].productid;

        // Insert images
        if (images && images.length > 0) {
            const imageInsertPromises = images.map((image: { image_url: string; description: any; }) => {
                const newimageurl = `https://res.cloudinary.com/${import.meta.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${new Date().getTime()}/${categories[0].categoryname}/${newProductId}/${image.image_url}.jpg`
                return client.query(
                    `INSERT INTO ProductImages (productid, image_url, description)
                     VALUES ($1, $2, $3)`,
                    [newProductId, IsLocalCdn ? newimageurl : image.image_url, image.description]
                );
            });
            await Promise.all(imageInsertPromises);
        }

        // Insert product color/size relationships
        if (productcolorsizes && productcolorsizes.length > 0) {
            const colorSizeInsertPromises = productcolorsizes.map(({ colorid, sizeid, quantity }: {colorid: number, sizeid: number, quantity: number}) => {
                return client.query(
                    `INSERT INTO ProductColorSize (productid, colorid, sizeid, quantity)
                     VALUES ($1, $2, $3, $4)`,
                    [newProductId, colorid, sizeid, quantity]
                );
            });
            await Promise.all(colorSizeInsertPromises);
        }

        // Insert product-category relationships
        if (categories && categories.length > 0) {
            const categoryInsertPromises = categories.map(({ categoryid }: {categoryid: number}) => {
                return client.query(
                    `INSERT INTO ProductCategory (productid, categoryid)
                     VALUES ($1, $2)`,
                    [newProductId, categoryid]
                );
            });
            await Promise.all(categoryInsertPromises);
        }

        await client.query('COMMIT'); // Commit the transaction
        return new Response(
            JSON.stringify({ product: productResult.rows[0] }),
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating product with relations:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to create product with relations' }),
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