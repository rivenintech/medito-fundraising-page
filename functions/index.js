import { Router } from "itty-router";

// Create a router instance
const router = Router();

// Get the total amount raised and the number of donations
router.get("/progress", async (request, env) => await env.DONATIONS_DB.prepare("SELECT raised_amount, donations_count FROM donation_progress").first());

export const onRequest = async (context) => {
    const { request, env } = context;
    return await router.handle(request, env).then(json).catch(error);
};
