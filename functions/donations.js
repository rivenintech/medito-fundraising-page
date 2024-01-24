export async function onRequestGet(context) {
    const activeFundraiserID = await context.env.DONATIONS_DB.prepare("SELECT id FROM Fundraisers WHERE isActive = true").first("id");

    if (!activeFundraiserID) {
        return new Response("No active fundraiser", { status: 404 });
    }

    const data = await context.env.DONATIONS_DB.prepare("SELECT totalRaised, goalAmount, totalDonations FROM Fundraisers WHERE id = ?1")
        .bind(activeFundraiserID)
        .first();
    const { results } = await context.env.DONATIONS_DB.prepare(
        "SELECT id, donorName, amount, timestamp FROM Donations WHERE fundraiserID = ?1 ORDER BY timestamp DESC LIMIT 3"
    )
        .bind(activeFundraiserID)
        .all();

    return new Response(JSON.stringify({ data, recent_donations: results }), {
        headers: {
            "content-type": "application/json",
        },
    });
}
