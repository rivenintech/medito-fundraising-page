export default async function handleRequest(request) {
    // Verify that the request method is POST (forwarded by Hookdeck)
    if (request.method !== "POST") {
        return new Response("Invalid request method.", { status: 405 });
    }

    // Verify any necessary security measures, such as validating the request origin or adding authentication checks

    try {
        // Access the payload of the webhook event
        const payload = await request.text();

        // Process the webhook event and perform necessary actions
        // ...

        console.log(payload);

        return new Response("Webhook event processed successfully.", {
            status: 200,
        });
    } catch (error) {
        return new Response("Failed to process webhook event.", {
            status: 500,
        });
    }
}
