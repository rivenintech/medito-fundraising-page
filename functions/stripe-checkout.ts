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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
    try {
        const body = await request.json<Body>();

        const stripe = new Stripe(env.STRIPE_API_KEY, {
            httpClient: Stripe.createFetchHttpClient()
        });

        const successUrl = new URL(request.url);
        successUrl.pathname = '/success';
        const cancelUrl = new URL(request.url);
        cancelUrl.pathname = '/';

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
                        unit_amount: body.amount * 100,
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
            // @ts-ignore
            JSON.stringify({ success: false, error: "Payment failed - " + e.message }),
            { status: 500 }
        );
    }
}