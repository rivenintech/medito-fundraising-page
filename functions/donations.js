import { Router, error, json } from "itty-router";

// Create a router instance
const router = Router((base = "/donations"));

// Get the total amount raised and the number of donations
router.get("/progress", (req, env, ctx) => env.DONATIONS_DB.prepare("SELECT raised_amount, donations_count FROM donation_progress").first());

export default {
    fetch: (req, env, ctx) => router.handle(req, env, ctx).then(json).catch(error),
};
