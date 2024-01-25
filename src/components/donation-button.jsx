import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/ui_components/ui/dialog";
import { useState } from 'react';
import { toast } from "sonner";
import CurrencyPicker from "./currency-picker";

export default function DonationModal({ baseCurrency, rewards }) {
    const [intervalError, setIntervalError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [currencyError, setCurrencyError] = useState('');
    const [interval, setInterval] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState(1);
    const [tier, setTier] = useState('');

    rewards.sort((a, b) => a.amount - b.amount);
    const zeroDecimalCurrencies = ["BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA", "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF"];
    const isZeroDecimal = zeroDecimalCurrencies.includes(baseCurrency);
    const rewardsConv = rewards.map((reward) => {
        return {
            ...reward,
            amount: convertCurrency(reward.amount)
        }
    });
    const maxAmount = rewardsConv[rewardsConv.length - 1].amount;

    function convertCurrency(amount) {
        const value = Math.round(amount * exchangeRate * 100) / 100;

        if (isZeroDecimal) {
            return Math.round(value);
        }

        return value;
    }

    function nFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
        const item = lookup.findLast(item => num >= item.value);
        return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Form validation
        let intervalError = '';
        let amountError = '';
        let currencyError = '';

        // If validation fails, set the error message in the local variable
        if (!interval) {
            intervalError = 'Please select a donation period.';
        }
        if (!amount || amount < 1) {
            amountError = 'Please enter a donation amount.';
        }
        if (!currency) {
            currencyError = 'Please select a currency.';
        }

        // Set the state for all error messages
        setIntervalError(intervalError);
        setAmountError(amountError);
        setCurrencyError(currencyError);

        if (intervalError || amountError || currencyError) {
            return;
        }

        // If validation passes, send the data to the Cloudflare Function to create a Checkout Session
        try {
            const res = await fetch("/stripe-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ interval, amount, currency }),
            });
            const data = await res.json();
            if (!data.success) {
                console.error(data.error);
                toast.error("Donation failed", {
                    description: data.error,
                })
                return;
            }
            window.location = data.data.redirect_url;
        } catch (e) {
            console.error(e);
            toast.error("Network error", {
                description: "Couldn't reach the server. Please try again later.",
            })
        }
    }

    const handleInputChange = async (event) => {
        // Clear the error message when the user interacts with the field
        if (event.target.name === 'interval') {
            setInterval(event.target.value);
            setIntervalError('');
        }
        if (event.target.name === 'amount') {
            const value = Number(event.target.value);
            setAmount(value === 0 ? '' : value);
            setAmountError('');

            // Set the highest tier based on the amount
            setTier('');
            rewardsConv.forEach((reward) => {
                if (value >= reward.amount) {
                    setTier(`Tier ${reward.tier}`);
                }
            });
        }
        if (event.target.name === 'currency') {
            const value = event.target.value;
            setCurrency(value.toUpperCase());
            setCurrencyError('');

            // Make an API request when the currency is selected
            try {
                const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${baseCurrency}/${value}.json`);
                const data = await res.json();
                setExchangeRate(data[value]);
            } catch (e) {
                console.error(e);
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger className="px-6 py-3 border-2 border-orange rounded duration-300 hover:bg-orange">Donate 💛</DialogTrigger>
            <DialogContent className="bg-primaryGray border-none ring-1 ring-darkGray">
                <DialogHeader>
                    <DialogTitle className="mb-2 text-xl">Donation Form</DialogTitle>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <p className="text-sm">1. Donation period:</p>
                        <div className="flex gap-2">
                            <div className="flex flex-1 items-center">
                                <input type="radio" id="one-time" name="interval" value="payment" className="peer hidden" onChange={handleInputChange} />
                                <label
                                    htmlFor="one-time"
                                    className="flex-1 text-center px-6 py-3 border-2 border-orange rounded hover:bg-orange hover:text-white duration-300 cursor-pointer peer-checked:bg-orange peer-checked:text-white">
                                    Once
                                </label>
                            </div>

                            <div className="flex flex-1 items-center">
                                <input type="radio" id="monthly" name="interval" value="month" className="peer hidden" onChange={handleInputChange} />
                                <label
                                    htmlFor="monthly"
                                    className="flex-1 text-center px-6 py-3 border-2 border-orange rounded hover:bg-orange hover:text-white duration-300 cursor-pointer peer-checked:bg-orange peer-checked:text-white">
                                    Monthly
                                </label>
                            </div>

                            <div className="flex flex-1 items-center">
                                <input type="radio" id="yearly" name="interval" value="year" className="peer hidden" onChange={handleInputChange} />
                                <label htmlFor="yearly" className="flex-1 text-center px-6 py-3 border-2 border-orange rounded hover:bg-orange hover:text-white duration-300 cursor-pointer peer-checked:bg-orange peer-checked:text-white"
                                >
                                    Yearly
                                </label>
                            </div>
                        </div>
                        <p className="text-red-400 text-sm">{intervalError}</p>

                        <p className="text-sm">2. Donation currency:</p>
                        <CurrencyPicker aria-label="Select currency" onChange={handleInputChange} value={currency}></CurrencyPicker>
                        <p className="text-red-400 text-sm">{currencyError}</p>

                        <p className="text-sm">3. Donation amount:</p>
                        <div className="relative rounded-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                $
                            </div>
                            <input
                                type="number"
                                step={isZeroDecimal ? "1" : "0.01"}
                                min="1"
                                className="w-full rounded-md py-1.5 pl-7 pr-14 hover:ring-1 focus:ring-1 placeholder:text-gray-400 outline-none hover:ring-orange focus:ring-orange"
                                placeholder="1.50"
                                name="amount"
                                onChange={handleInputChange}
                                value={amount}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                {currency}
                            </div>
                        </div>
                        <p className="text-red-400 text-sm">{amountError}</p>

                        {currency && (
                            <div>
                                <p className="text-sm text-center text-gray-400 mb-1">Donation Reward Tiers</p>
                                <div className="relative flex h-4 overflow-hidden text-xs rounded-full bg-progressBar">
                                    {rewardsConv.map((reward, index) => (
                                        <div
                                            key={index}
                                            className="border-r"
                                            style={{ width: `${(reward.amount - (rewardsConv[index - 1]?.amount || 0)) / maxAmount * 100}%` }}>
                                        </div>
                                    ))}
                                    <div
                                        className="absolute flex items-center justify-center h-full bg-orange transition-all"
                                        style={{ width: `${Math.min(amount / maxAmount * 100, 100)}%`, transitionDuration: "2500ms" }}
                                    >
                                        <span className="truncate">{tier}</span>
                                    </div>
                                </div>
                                <div className="relative mt-2 text-xs">
                                    {rewardsConv.slice(0, -1).map((reward, index) => (
                                        <div
                                            key={index}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                                            style={{ left: `${reward.amount / maxAmount * 100}%` }}
                                        >
                                            <p>{nFormatter(reward.amount, 2)}</p>
                                        </div>
                                    ))}
                                    <div
                                        className="absolute transform -translate-y-1/2 flex flex-col items-center"
                                        style={{ right: "0%" }}
                                    >
                                        <p>{nFormatter(maxAmount, 2)} {currency}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="text-center hover:text-white px-6 py-3 border-2 border-orange rounded hover:bg-orange duration-300 mt-2"
                        >
                            Donate {amount.toLocaleString("en-US")} {currency} {(interval === "month" || interval === "year") && `(${interval}ly)`}
                        </button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}