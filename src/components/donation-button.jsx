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

export default function DonationModal() {
    const [intervalError, setIntervalError] = useState('');
    const [amountError, setAmountError] = useState('');
    const [currencyError, setCurrencyError] = useState('');
    const [interval, setInterval] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('');

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

    const handleInputChange = (event) => {
        // Clear the error message when the user interacts with the field
        if (event.target.name === 'interval') {
            setInterval(event.target.value);
            setIntervalError('');
        }
        if (event.target.name === 'amount') {
            setAmount(event.target.value);
            setAmountError('');
        }
        if (event.target.name === 'currency') {
            setCurrency(event.target.value);
            setCurrencyError('');
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
                                step="1"
                                min="1"
                                className="w-full rounded-md py-1.5 pl-7 pr-14 hover:ring-1 focus:ring-1 placeholder:text-gray-400 outline-none hover:ring-orange focus:ring-orange"
                                placeholder="1"
                                name="amount"
                                onChange={handleInputChange}
                                value={amount}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                {currency.toUpperCase()}
                            </div>
                        </div>
                        <p className="text-red-400 text-sm">{amountError}</p>

                        <button
                            type="submit"
                            className="text-center hover:text-white px-6 py-3 border-2 border-orange rounded hover:bg-orange duration-300 mt-2"
                        >
                            Donate 💛
                        </button>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}