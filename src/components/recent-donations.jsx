import { useStore } from '@nanostores/react';
import { AnimatePresence, motion } from "framer-motion";
import { recentDonations } from "../stateVariables.js";

function getTimeAgo(date) {
    const MINUTE = 60,
        HOUR = 3600,
        DAY = 86400,
        WEEK = 6048e2,
        MONTH = 2592e3,
        YEAR = 31536e3;

    const secondsAgo = Math.round((Date.now() - Date.parse(date + "Z")) / 1e3);

    if (secondsAgo < MINUTE) {
        return "just now";
    }

    let timeUnit, timeDivisor;

    if (secondsAgo < HOUR) {
        timeUnit = "minute";
        timeDivisor = MINUTE;
    } else if (secondsAgo < DAY) {
        timeUnit = "hour";
        timeDivisor = HOUR;
    } else if (secondsAgo < WEEK) {
        timeUnit = "day";
        timeDivisor = DAY;
    } else if (secondsAgo < MONTH) {
        timeUnit = "week";
        timeDivisor = WEEK;
    } else if (secondsAgo < YEAR) {
        timeUnit = "month";
        timeDivisor = MONTH;
    } else {
        timeUnit = "year";
        timeDivisor = YEAR;
    }

    const count = Math.floor(secondsAgo / timeDivisor);
    return `${count} ${timeUnit}${count !== 1 ? "s" : ""} ago`;
}

export default function RecentDonationsRender() {
    const $recentDonations = useStore(recentDonations);

    return (
        <motion.ul layout>
            <AnimatePresence>
                {
                    Object.values($recentDonations).map((donation) => (
                        <motion.li
                            initial={{ x: -200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={donation.id}
                            className="flex items-center p-2"
                        >

                            <svg width="42" height="42" fill="none" viewBox="0 0 24 24" className="mr-3">
                                <path
                                    stroke="white"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M16 6.28a2.28 2.28 0 0 1-.662 1.606c-.976.984-1.923 2.01-2.936 2.958a.597.597 0 0 1-.822-.017l-2.918-2.94a2.281 2.281 0 0 1 0-3.214 2.277 2.277 0 0 1 3.232 0L12 4.78l.106-.107A2.276 2.276 0 0 1 16 6.28Z"
                                />
                                <>
                                    <path
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="m18 20 3.824-3.824a.6.6 0 0 0 .176-.424V10.5A1.5 1.5 0 0 0 20.5 9v0a1.5 1.5 0 0 0-1.5 1.5V15"
                                    />
                                    <path
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="m18 16 .858-.858a.484.484 0 0 0 .142-.343v0a.485.485 0 0 0-.268-.433l-.443-.221a2 2 0 0 0-2.308.374l-.895.895a2 2 0 0 0-.586 1.414V20M6 20l-3.824-3.824A.6.6 0 0 1 2 15.752V10.5A1.5 1.5 0 0 1 3.5 9v0A1.5 1.5 0 0 1 5 10.5V15"
                                    />
                                </>
                                <path
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="m6 16-.858-.858A.485.485 0 0 1 5 14.799v0c0-.183.104-.35.268-.433l.443-.221a2 2 0 0 1 2.308.374l.895.895a2 2 0 0 1 .586 1.414V20"
                                />
                            </svg>
                            <div>
                                <span className="text-sm">{donation.donorName}</span>
                                <p className="flex items-center gap-2">
                                    <span className="font-semibold">${donation.amount}</span>•<span className="text-xs">{getTimeAgo(donation.timestamp)}</span>
                                </p>
                            </div>
                        </motion.li>
                    ))
                }
            </AnimatePresence>
        </motion.ul>
    );
};