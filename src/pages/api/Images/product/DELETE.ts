import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const DELETE: APIRoute = async ({ request }) => {
    try {
        const { imageurl } = await request.json();

        if (!imageurl) {
            return new Response(
                JSON.stringify({ error: 'Image URL is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Extract public_id from image URL
        const regex = /\/image\/upload\/(?:v\d+\/)?(.+?)\.(jpg|png|jpeg|gif|webp|bmp)/;
        const match = imageurl.match(regex);

        if (!match) {
            return new Response(
                JSON.stringify({ error: 'Invalid Cloudinary image URL' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const publicId = match[1]; // Extracted public_id
        console.log(publicId)
        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true, // Optional: Invalidate cached versions of the file
        });

        if (result.result === 'ok') {
            return new Response(
                JSON.stringify({
                    message: 'Image deleted successfully',
                }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({ error: 'Failed to delete image' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
