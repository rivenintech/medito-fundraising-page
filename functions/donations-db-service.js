const Stripe = require("stripe");

export async function onRequest(context) {
    const url = new URL(context.request.url);

    if (url.pathname === "/webhook") {
        return await handleWebhook(context);
    } else if (url.pathname === "/donations") {
        return await getDonations(context);
    } else {
        return new Response("Not found", { status: 404 });
    }
}

async function handleWebhook(context) {
    const stripe = createStripeClient(process.env.STRIPE_API_KEY);
    const signature = context.request.headers.get("stripe-signature");
    try {
        if (!signature) {
            return new Response("", { status: 400 });
        }
        const body = await context.request.text();
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
            undefined,
            Stripe.createSubtleCryptoProvider()
        );
        switch (event.type) {
            case "charge.succeeded": {
                const data = event.data.object;
                const donor_details = data.billing_details;
                const transaction = await stripe.balanceTransactions.retrieve(data.balance_transaction);
                const exchange_rate = transaction.exchange_rate || 1; // Assign default value of 1 if exchange_rate is null
                const amount = Math.round(data.amount * exchange_rate); // Convert the amount to the currency of the Stripe account
                // Insert the donation into the database
                await context.env.DONATIONS_DB.prepare("INSERT INTO donations (id, amount, donor_name, donor_email) VALUES (?1, ?2, ?3, ?4)")
                    .bind(data.id, amount, donor_details.name, donor_details.email)
                    .run();
                break;
            }
            default:
                break;
        }
        return new Response("", { status: 200 });
    } catch (err) {
        const errorMessage = `⚠️  Webhook signature verification failed. ${err instanceof Error ? err.message : "Internal server error"}`;
        console.log(errorMessage);
        return new Response(errorMessage, { status: 400 });
    }
}

// Get the latest 5 donations from the database
async function getDonations(context) {
    const data = await context.env.DONATIONS_DB.prepare("SELECT * FROM donations LIMIT 5").all();

    return Response.json(data);

    // const rows = await DB.prepare("SELECT * FROM donations ORDER BY timestamp DESC LIMIT 5").all();
    // return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}
