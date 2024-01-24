export async function onRequestGet(context) {
    if (context.params.path === "progress") {
        const data = await context.env.DONATIONS_DB.prepare("SELECT raised_amount, donations_count FROM donation_progress").first();
        return new Response(JSON.stringify(data), {
            headers: {
                "content-type": "application/json",
            },
        });
    }
}
