import { Router } from "itty-router";

// Create a router instance
const router = Router();

// Get the total amount raised and the number of donations
router.get("/progress", async (context) => {
    const data = await context.env.DONATIONS_DB.prepare("SELECT raised_amount, donations_count FROM donation_progress").first();
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
});
