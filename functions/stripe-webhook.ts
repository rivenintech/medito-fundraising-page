// ./functions/stripe-webhook.ts

// Import the Stripe library
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_API_KEY as string);

// The function to handle the POST request
export default async function handleRequest(request: any): Promise<any> {
    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    const sig = request.headers.get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(await request.text(), sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntentOne = event.data.object;
            console.log(`PaymentIntent was successful!`);
            break;
        case "payment_intent.payment_failed":
            const paymentIntentTwo = event.data.object;
            console.log(`PaymentIntent was failed!`);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return new Response("Received event", { status: 200 });
}