// src/pages/api/create-payment-intent.json.ts
import type { APIRoute } from 'astro';
import type {stripe} from '../../../../FrontendRequests/Requests-Api/stripe';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Replace 'your-stripe-secret-key' with your actual Stripe secret key
const stripelib = new Stripe(process.env.PRIVATEKEY as string);

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const requestData: stripe = await request.json();

    // Validate input
    if (!requestData.amount || !requestData.currency) {
      return new Response(
        JSON.stringify({ error: 'Amount and currency are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a payment intent
    const paymentIntent = await stripelib.paymentIntents.create({
      amount : requestData.amount,
      currency : requestData.currency,
      automatic_payment_methods: { enabled: true },
    });

    // Return the client secret
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};