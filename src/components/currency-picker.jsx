import { Check, ChevronsUpDown, DollarSign } from "lucide-react"
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

    const handleSelect = (currentValue) => {
        setValue(currentValue);
        setOpen(false);
        onChange({ target: { name: 'currency', value: currentValue } });
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-white bg-secondaryGray"
                >
                    <DollarSign className="mr-2 h-4 w-4" /> {value ? <div className="flex">
                        <img className="mr-2" src={`/flags/${value.trim().toLowerCase()}.svg`} alt="currency flag" width={"18"} height={"18"} loading={"lazy"} />
                        {value.toUpperCase()}</div>
                        : "Select currency..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command className="bg-secondaryGray text-white">
                    <CommandInput placeholder="Search currency..." />
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <div className="max-h-[200px] overflow-auto">
                        <CommandGroup className="text-white">
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
                                    <div className="flex">
                                        <img className="mr-2" src={`/flags/${currency.trim().toLowerCase()}.svg`} alt="currency flag" width={"18"} height={"18"} loading={"lazy"} />
                                        {currency}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </div>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

// List of Stripe supported currencies. Remove the ones you don't want to support.
const currencies = [
    "USD", // United States Dollar
    "EUR", // Euro
    "GBP", // British Pound
    "AUD", // Australian Dollar
    "CAD", // Canadian Dollar
    "CHF", // Swiss Franc
    "CNY", // Chinese Yuan
    "SEK", // Swedish Krona
    "NZD", // New Zealand Dollar
    "AED", // United Arab Emirates Dirham
    "AFN", // Afghan Afghani
    "ALL", // Albanian Lek
    "AMD", // Armenian Dram
    "ANG", // Netherlands Antillean Guilder
    "AOA", // Angolan Kwanza
    "ARS", // Argentine Peso
    "AWG", // Aruban Florin
    "AZN", // Azerbaijani Manat
    "BAM", // Bosnia and Herzegovina Convertible Mark
    "BBD", // Barbadian Dollar
    "BDT", // Bangladeshi Taka
    "BGN", // Bulgarian Lev
    "BIF", // Burundian Franc
    "BMD", // Bermudian Dollar
    "BND", // Brunei Dollar
    "BOB", // Bolivian Boliviano
    "BRL", // Brazilian Real
    "BSD", // Bahamian Dollar
    "BWP", // Botswana Pula
    "BZD", // Belize Dollar
    "CDF", // Congolese Franc
    "CLP", // Chilean Peso
    "COP", // Colombian Peso
    "CRC", // Costa Rican Colón
    "CVE", // Cape Verdean Escudo
    "JPY", // Japanese Yen
    "CZK", // Czech Koruna
    "DJF", // Djiboutian Franc
    "DKK", // Danish Krone
    "DOP", // Dominican Peso
    "DZD", // Algerian Dinar
    "EGP", // Egyptian Pound
    "ETB", // Ethiopian Birr
    "FJD", // Fijian Dollar
    "FKP", // Falkland Islands Pound
    "GEL", // Georgian Lari
    "GHS", // Ghanaian Cedi
    "GIP", // Gibraltar Pound
    "GMD", // Gambian Dalasi
    "GNF", // Guinean Franc
    "GTQ", // Guatemalan Quetzal
    "GYD", // Guyanese Dollar
    "HKD", // Hong Kong Dollar
    "HNL", // Honduran Lempira
    "HTG", // Haitian Gourde
    "HUF", // Hungarian Forint
    "IDR", // Indonesian Rupiah
    "ILS", // Israeli New Shekel
    "INR", // Indian Rupee
    "ISK", // Icelandic Króna
    "JMD", // Jamaican Dollar
    "KES", // Kenyan Shilling
    "KGS", // Kyrgyzstani Som
    "KHR", // Cambodian Riel
    "KMF", // Comorian Franc
    "KRW", // South Korean Won
    "KYD", // Cayman Islands Dollar
    "KZT", // Kazakhstani Tenge
    "LAK", // Lao Kip
    "LBP", // Lebanese Pound
    "LKR", // Sri Lankan Rupee
    "LRD", // Liberian Dollar
    "LSL", // Lesotho Loti
    "MAD", // Moroccan Dirham
    "MDL", // Moldovan Leu
    "MGA", // Malagasy Ariary
    "MKD", // Macedonian Denar
    "MMK", // Burmese Kyat
    "MNT", // Mongolian Tögrög
    "MOP", // Macanese Pataca
    "MUR", // Mauritian Rupee
    "MVR", // Maldivian Rufiyaa
    "MWK", // Malawian Kwacha
    "MXN", // Mexican Peso
    "MYR", // Malaysian Ringgit
    "MZN", // Mozambican Metical
    "NAD", // Namibian Dollar
    "NGN", // Nigerian Naira
    "NIO", // Nicaraguan Córdoba
    "NOK", // Norwegian Krone
    "NPR", // Nepalese Rupee
    "PAB", // Panamanian Balboa
    "PEN", // Peruvian Sol
    "PGK", // Papua New Guinean Kina
    "PHP", // Philippine Peso
    "PKR", // Pakistani Rupee
    "PLN", // Polish Złoty
    "PYG", // Paraguayan Guarani
    "QAR", // Qatari Riyal
    "RON", // Romanian Leu
    "RSD", // Serbian Dinar
    "RUB", // Russian Ruble
    "RWF", // Rwandan Franc
    "SAR", // Saudi Riyal
    "SBD", // Solomon Islands Dollar
    "SCR", // Seychellois Rupee
    "SGD", // Singapore Dollar
    "SHP", // Saint Helena Pound
    "SLL", // Sierra Leonean Leone
    "SOS", // Somali Shilling
    "SRD", // Surinamese Dollar
    "STD", // São Tomé and Príncipe Dobra
    "SVC", // Salvadoran Colón
    "SZL", // Swazi Lilangeni
    "THB", // Thai Baht
    "TJS", // Tajikistani Somoni
    "TOP", // Tongan Paʻanga
    "TRY", // Turkish Lira
    "TTD", // Trinidad and Tobago Dollar
    "TWD", // New Taiwan Dollar
    "TZS", // Tanzanian Shilling
    "UAH", // Ukrainian Hryvnia
    "UGX", // Ugandan Shilling
    "UYU", // Uruguayan Peso
    "UZS", // Uzbekistani Som
    "VND", // Vietnamese đồng
    "VUV", // Vanuatu Vatu
    "WST", // Samoan Tālā
    "XAF", // Central African CFA Franc
    "XCD", // East Caribbean Dollar
    "XOF", // West African CFA Franc
    "XPF", // CFP Franc
    "YER", // Yemeni Rial
    "ZAR", // South African Rand
    "ZMW", // Zambian Kwacha
    "BHD", // Bahraini Dinar
    "JOD", // Jordanian Dinar
    "KWD", // Kuwaiti Dinar
    "OMR", // Omani Rial
    "TND", // Tunisian Dinar
    "BYN", // Belarusian Ruble
    "SLE", // Sierra Leonean Leone
];