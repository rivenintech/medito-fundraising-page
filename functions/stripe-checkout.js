const Stripe = require("stripe");
const product = "prod_PO1AuTRpFRVaSM";

export async function onRequest(context) {
    const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);
    if (context.request.method === "POST") {
        const formData = await context.request.formData();
        const body = Object.fromEntries(formData.entries());

        const origin = context.request.headers.get("origin") || "http://localhost:4321";
        const success_url = `${origin}/thankyou`;
        const cancel_url = `${origin}/cancel`;

        try {
            const session = await stripe.checkout.sessions.create({
                mode: body.interval === "one-time" ? "payment" : "subscription",
                line_items: [
                    {
                        price_data: {
                            currency: body.currency.toLowerCase(),
                            recurring:
                                body.interval === "one-time"
                                    ? undefined
                                    : {
                                          interval: body.interval,
                                      },
                            unit_amount: body.amount * 100,
                            product,
                        },
                        quantity: 1,
                    },
                ],
                success_url,
                cancel_url,
            });
            return new Response(JSON.stringify(session), { status: 200 });
        } catch (error) {
            if (error instanceof Stripe.errors.StripeError) {
                const { message } = error;
                return new Response(JSON.stringify({ message }), { status: error.statusCode });
            } else {
                return new Response("Internal server error", { status: 500 });
            }
        }
    } else {
        return new Response("Method not allowed", { status: 405 });
    }
}
