import Stripe from "stripe";

// use web crypto 
export const webCrypto = Stripe.createSubtleCryptoProvider();

export function getStripe({ env }) {
  if (!env?.STRIPE_API_KEY) {
    throw new Error('Can not initialize Stripe without STRIPE_KEY');
  }
  const client = new Stripe(env.STRIPE_KEY, {
    httpClient: Stripe.createFetchHttpClient(), // ensure we use a Fetch client, and not Node's `http`
  });
  return client;
}

export default {
  async fetch(request, env) {
    const stripe = getStripe({ env })
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    const event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      webCrypto
    );


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
        // Then define and call a method to handle the creation of a product.
        // handleProductCreated(product);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-type': 'application/json' }
    })
  }
}