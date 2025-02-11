import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const DELETE: APIRoute = async ({ request }) => {
    try {
        const { medianame } = await request.json();

        if (!medianame) {
            return new Response(
                JSON.stringify({ error: 'Public ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Delete the image from Cloudinary
        const result = await cloudinary.uploader.destroy(medianame, {
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