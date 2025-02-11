import type { APIRoute } from 'astro';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const foldername = formData.get('foldername') as string;
        const medianame = formData.get('medianame') as string;
        const filetype = formData.get('filetype') as string;

        if (!file || file.type.split('/')[0] !== 'image') {
            return new Response(
                JSON.stringify({ error: 'Invalid image file' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const fileBuffer = await file.arrayBuffer();
        const base64Image = `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`;

        // Upload to Cloudinary with folder and replacement enabled
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: foldername, // Specify the folder
            format: filetype, // Convert to .jpg
            overwrite: true, // Replace if it already exists
            public_id: medianame, // Use file name as the public_id
        });

        return new Response(
            JSON.stringify(result.secure_url),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error uploading image:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
