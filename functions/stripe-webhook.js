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
                const amount = Math.round(data.amount * exchange_rate) / 100; // Convert the amount to the currency of the Stripe account and round to 2 decimal places

                // Get the active fundraiser ID
                const db = context.env.DONATIONS_DB;
                const activeFundraiserID = await db.prepare("SELECT id FROM Fundraisers WHERE isActive = true").first("id");

                if (!activeFundraiserID) {
                    return new Response("No active fundraiser", { status: 404 });
                }

                // Insert the donation into the database
                await db
                    .prepare("INSERT INTO Donations (id, amount, donorName, donorEmail, fundraiserID) VALUES (?1, ?2, ?3, ?4, ?5)")
                    .bind(data.id, amount, donor_details.name, donor_details.email, activeFundraiserID)
                    .run();

                // Update Fundraisers table
                const { totalRaised, totalDonations } = await db
                    .prepare("SELECT SUM(amount) AS totalRaised, COUNT(*) AS totalDonations FROM Donations WHERE fundraiserID = ?1")
                    .bind(activeFundraiserID)
                    .first();
                await db
                    .prepare("UPDATE Fundraisers SET totalRaised = ?1, totalDonations = ?2 WHERE id = ?3")
                    .bind(totalRaised, totalDonations, activeFundraiserID)
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
