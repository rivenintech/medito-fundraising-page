addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request): Promise<Response> {
    // Verify that the request method is POST
    if (request.method !== "POST") {
        return new Response("Invalid request method.", { status: 405 });
    }

    try {
        // Access the payload of the webhook event
        const event = await request.json();

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                // Then define and call a method to handle the successful payment intent.
                // handlePaymentIntentSucceeded(paymentIntent);
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                // Then define and call a method to handle the successful attachment of a PaymentMethod.
                // handlePaymentMethodAttached(paymentMethod);
                break;
            case 'product.created':
                const product = event.data.object;
                // Then define and call a method to handle the successful creation of a product.
                // handleProductCreated(product);
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response("Failed to process webhook event.", {
            status: 500,
        });
    }
}