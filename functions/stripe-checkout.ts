/**
 * Handles the POST request for the Stripe checkout.
 * 
 * @param request - The incoming request object.
 * @param env - The environment variables.
 * @returns A response object indicating the success or failure of the payment.
 */
import Stripe from "stripe";

interface Env {
    STRIPE_API_KEY: string;
    PRODUCT_ID: string;
}

interface Body {
    amount: number;
    currency: string;
    interval: string; // 'month' | 'year' | 'payment (one-time)'
}

// Format the amount to the correct number of decimal places for the currency (https://stripe.com/docs/currencies#presentment-currencies)
function formatAmount(currency, amount) {
    const threeDecimalCurrencies = ["bhd", "jod", "kwd", "omr", "tnd"];
    const zeroDecimalCurrencies = [
        "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf",
        "ugx", "vnd", "vuv", "xaf", "xof", "xpf"
    ];

    const isZeroDecimal = zeroDecimalCurrencies.includes(currency.toLowerCase());
    const isThreeDecimal = threeDecimalCurrencies.includes(currency.toLowerCase());

    if (isZeroDecimal) {
        return parseInt(amount);
    } else if (isThreeDecimal) {
        // Round to the nearest ten for three-decimal currencies
        return Math.round(amount / 10) * 10;
    } else {
        // Standard two-decimal currencies
        return parseInt(amount) * 100;
    }
}

// Handles requests to the /stripe-checkout endpoint and returns a redirect URL to the Stripe checkout
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const body = await request.json<Body>();

        const stripe = new Stripe(env.STRIPE_API_KEY, {
            httpClient: Stripe.createFetchHttpClient()
        });

        // Create the success and cancel URLs
        const successUrl = new URL(request.url);
        successUrl.search = '?s=success';
        const cancelUrl = new URL(request.url);
        successUrl.search = '/?s=cancel';

        const session = await stripe.checkout.sessions.create({
            mode: body.interval === 'payment' ? 'payment' : 'subscription',
            line_items: [
                {
                    price_data: {
                        currency: body.currency.toLowerCase(),
                        recurring:
                            body.interval === 'payment'
                                ? undefined
                                : {
                                    interval: body.interval,
                                },
                        unit_amount: formatAmount(body.currency, body.amount),
                        product: env.PRODUCT_ID,
                    },
                    quantity: 1,
                },
            ],
            success_url: successUrl.toString(),
            cancel_url: cancelUrl.toString(),
        });

        return new Response(JSON.stringify({ success: true, data: { redirect_url: session.url } }));
    } catch (e) {
        return new Response(
            JSON.stringify({ success: false, error: e.message }),
            { status: 500 }
        );
    }
}