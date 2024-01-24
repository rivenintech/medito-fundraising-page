import Stripe from "stripe";

export async function onRequestPost(context) {
    const stripe = new Stripe(context.env.STRIPE_API_KEY);
    const signature = context.request.headers.get("stripe-signature");
    try {
        if (!signature) {
            return new Response("", { status: 400 });
        }
        const body = await context.request.text();
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            context.env.STRIPE_WEBHOOK_SECRET,
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
                const db = context.env.DONATIONS_DB;
                await db
                    .prepare("INSERT INTO donations (id, amount, donor_name, donor_email) VALUES (?1, ?2, ?3, ?4)")
                    .bind(data.id, amount, donor_details.name, donor_details.email)
                    .run();
                // Update donation_progress table
                const { raised, donations_count } = await db.prepare("SELECT SUM(amount) AS raised, COUNT(*) AS donations_count FROM donations").first();
                await db.prepare("UPDATE donation_progress SET raised_amount = ?1, donations_count = ?2").bind(raised, donations_count).run();
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
