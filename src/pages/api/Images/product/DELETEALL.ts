import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const DELETE: APIRoute = async ({ request }) => {
    try {
        const { foldername } = await request.json();

        if (!foldername) {
            return new Response(
                JSON.stringify({ error: 'Image folder is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Wrap the callback-based API in a promise to allow async handling
        const deleteImages = () => {
            return new Promise((resolve, reject) => {
                cloudinary.api.delete_resources_by_prefix(`${foldername}/`, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        // Await the deleteImages function to complete before responding
        await deleteImages();

        return new Response(
            JSON.stringify({
                message: 'Images deleted successfully',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error deleting image:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};