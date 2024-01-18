import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/ui_components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/ui_components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/ui_components/ui/popover"

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "RUB", "INR", "BRL", "CHF"];

export default function CurrencyPicker({ onChange }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    const handleSelect = (currentValue) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);
        onChange({ target: { name: 'currency', value: currentValue } });
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <input type="hidden" name="currency" value={value.toUpperCase()} required />
                    {value ? value.toUpperCase() : "Select currency..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search currency..." />
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup>
                        {currencies.map((currency) => (
                            <CommandItem
                                key={currency}
                                value={currency}
                                onSelect={handleSelect}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === currency ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {currency}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}