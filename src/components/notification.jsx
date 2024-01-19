import { toast } from "sonner"

import { Button } from "@/ui_components/ui/button"

export default function Notification() {
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
    )
}
