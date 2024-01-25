import { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";
import { updateRecentDonations, updateFundraiserInfo } from "../stateVariables.js";

const countUpOptions = {
    raised: { duration: 3, prefix: '$' },
    progress: { duration: 4, suffix: '%' },
    donations: { duration: 4, suffix: ' donations' }
};

export default function CountUpComponent() {
    const raised = useRef(null);
    const progressPerc = useRef(null);
    const donations = useRef(null);
    const [newestTimestamp, setNewestTimestamp] = useState(0);
    const [totalRaised, setTotalRaised] = useState(0);
    const [goalAmount, setGoalAmount] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);

    const raisedCountUp = useRef(null);
    const progressCountUp = useRef(null);
    const donationsCountUp = useRef(null);

    async function initCountUp(ref, targetNum, options = {}) {
        const countUpModule = await import('countup.js');
        const countUpAnim = new countUpModule.CountUp(ref.current, targetNum, options);
        if (!countUpAnim.error) {
            countUpAnim.start();
            return countUpAnim;
        } else {
            console.error(countUpAnim.error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/donations');
            const { data, recent_donations } = await response.json();

            updateFundraiserInfo(data.title, data.description);

            // If there are no new donations, don't update the UI
            if (new Date(recent_donations[0].timestamp) === newestTimestamp) {
                return;
            }

            // Send notifications for each new donation
            recent_donations.forEach((donation) => {
                donation.timestamp = new Date(donation.timestamp);

                if (donation.timestamp > newestTimestamp) {
                    toast.success(`New donation from ${donation.donorName}!`, {
                        description: `Thank you for donating ${donation.amount}.`,
                    })
                }
            });

            // Update the newest timestamp
            setNewestTimestamp(recent_donations[0].timestamp);

            updateRecentDonations(recent_donations);
            setTotalRaised(data.totalRaised);
            setGoalAmount(data.goalAmount);
            setTotalDonations(data.totalDonations);
            const percentage = (data.totalRaised / data.goalAmount) * 100;
            setProgressWidth(percentage);

            if (raisedCountUp.current) {
                raisedCountUp.current.update(data.totalRaised);
            } else {
                raisedCountUp.current = await initCountUp(raised, data.totalRaised, countUpOptions.raised);
            }

            if (progressCountUp.current) {
                progressCountUp.current.update(percentage);
            } else {
                progressCountUp.current = await initCountUp(progressPerc, percentage, countUpOptions.progress);
            }

            if (donationsCountUp.current) {
                donationsCountUp.current.update(data.totalDonations);
            } else {
                donationsCountUp.current = await initCountUp(donations, data.totalDonations, countUpOptions.donations);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 30 * 1000); // Send a request every 30 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className="text-lightGray">
                <span className="text-2xl text-orange font-medium mr-2" ref={raised}>${totalRaised}</span>
                raised of ${goalAmount.toLocaleString("en-US")} goal
            </div>
            <div className="flex w-full h-4 overflow-hidden text-xs font-medium rounded-full flex-start bg-progressBar">
                <div
                    className="flex text-white items-center justify-center h-full overflow-hidden bg-orange rounded-full transition-all"
                    style={{ width: `${progressWidth}%`, transitionDuration: "2500ms" }}
                >
                    <span ref={progressPerc}>{progressWidth}%</span>
                </div>
            </div>
            <p className="text-lightGray mb-4" ref={donations}>{totalDonations}</p>
        </>
    );
}