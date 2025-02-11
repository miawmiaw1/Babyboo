import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

export const GET: APIRoute = async ({ request }) => {
    const token = request.headers.get('authorization');
    if (!token) {
        return new Response(
            JSON.stringify({ message: 'A token is required for authentication' }),
            {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], import.meta.env.JWTSECRETKEY);
        // Attach user info to the request object (if needed)
        // request.user = decoded; // Astro doesn't support directly modifying request, so this part is omitted
        // You can use the decoded data in your endpoint logic

        return new Response(
            JSON.stringify({ message: 'Token is valid', user: decoded }), // Or proceed with next logic
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ message: 'Invalid token' }),
            {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};