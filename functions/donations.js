import { Router, json } from "itty-router";

// Create a router instance
const router = Router();

// Get the total amount raised and the number of donations
router.get("/progress", async (req, env, ctx) => {
    const data = await env.DONATIONS_DB.prepare("SELECT raised_amount, donations_count FROM donation_progress").first();
    return data;
});

export default {
    fetch: async (req, env, ctx) => router.handle(req, env, ctx).then(json).catch(error),
};
