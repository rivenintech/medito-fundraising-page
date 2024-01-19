import { Button } from "@/ui_components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";

export function NotificationBtn() {
    return (
        <Button
            onClick={() =>
                toast("New donation!", {
                    description: "Anonymous donated $50",
                })
            }
        >
            See how notification will look like
        </Button>
    );
}

// Check the URL for the query parameter and display a toast notification based on the value
// Stripe Checkout uses the query parameter to indicate the status of the payment
export function CheckDonationStatus() {
    useEffect(() => {
        const params = new URL(document.location).searchParams;
        const status = params.get("s");

        if (status === "success") {
            toast.success("Thank you for your donation! ❤️");
        } else if (status === "cancel") {
            toast.warning("Donation canceled.");
        }
        // replace the current URL without the query parameters
        window.history.replaceState({}, document.title, "/");
    });
}
