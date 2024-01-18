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

export default function CurrencyPicker({ onChange }) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const scrollRef = React.useRef(null);

    const handleSelect = (currentValue) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);
        onChange({ target: { name: 'currency', value: currentValue } });
    }

    const handleWheel = (e) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop += e.deltaY;
        }
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
                    <div ref={scrollRef} onWheel={handleWheel} className="max-h-[200px] overflow-auto">
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
                    </div>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

const currencies = [
    "USD", // United States Dollar
    "EUR", // Euro
    "JPY", // Japanese Yen
    "GBP", // British Pound
    "AUD", // Australian Dollar
    "CAD", // Canadian Dollar
    "CHF", // Swiss Franc
    "CNY", // Chinese Yuan
    "SEK", // Swedish Krona
    "NZD", // New Zealand Dollar
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BRL",
    "BSD",
    "BWP",
    "BZD",
    "CDF",
    "CLP",
    "COP",
    "CRC",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ETB",
    "FJD",
    "FKP",
    "GEL",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "ISK",
    "JMD",
    "KES",
    "KGS",
    "KHR",
    "KMF",
    "KRW",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRO",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SGD",
    "SHP",
    "SLL",
    "SOS",
    "SRD",
    "STD",
    "SVC",
    "SZL",
    "THB",
    "TJS",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "UYU",
    "UZS",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XCD",
    "XOF",
    "XPF",
    "YER",
    "ZAR",
    "ZMW",
];