import { Router, error, json } from "itty-router";

// Create a router instance
const router = Router();

// Get the total amount raised and the number of donations
router
    .get("/progress", (req, env, ctx) => env.DONATIONS_DB.prepare("SELECT raised_amount, donations_count FROM donation_progress").first())
    .all("*", () => error(404));

export const onRequest = (req, env, ctx) => router.handle(req, env, ctx).then(json).catch(error);
