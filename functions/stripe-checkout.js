import Stripe from "stripe/lib/stripe.js";

// use web crypto
export const webCrypto = Stripe.createSubtleCryptoProvider();

export function getStripe({ env }) {
    if (!env?.STRIPE_SECRET_KEY) {
        throw new Error("Can not initialize Stripe without STRIPE_KEY");
    }
    const client = Stripe(env.STRIPE_SECRET_KEY, {
        httpClient: Stripe.createFetchHttpClient(), // ensure we use a Fetch client, and not Node's `http`
    });
    return client;
}

export default {
    async fetch(request, env) {
        const stripe = getStripe({ env });
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "T-shirt",
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });

        return Response.redirect(session.url);
    },
};
