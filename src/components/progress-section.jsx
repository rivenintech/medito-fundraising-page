import { useEffect, useRef, useState } from 'react';
import { toast } from "sonner";

const countUpOptions = {
    raised: { duration: 3, prefix: '$' },
    progress: { duration: 4, suffix: '%' },
    donations: { duration: 4, suffix: ' donations' }
};

export default function CountUpComponent() {
    const raised = useRef(null);
    const progressPerc = useRef(null);
    const donations = useRef(null);
    const [raisedAmount, setRaisedAmount] = useState(0);
    const [goalAmount, setGoalAmount] = useState(0);
    const [donationsAmount, setDonationsAmount] = useState(0);
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

    // Mock data for testing - remove this when you integrate with your API
    let mockRaisedAmount = 0;
    const mockGoalAmount = 80000;
    let mockDonationsAmount = 0;

    const mockFetchData = async () => {
        mockRaisedAmount += 3500;
        mockDonationsAmount += 15;

        return {
            raisedAmount: mockRaisedAmount,
            goalAmount: mockGoalAmount,
            donationsAmount: mockDonationsAmount
        };
    };
    // ==============================================

    useEffect(() => {
        const fetchData = async () => {
            // Uncomment the following lines to fetch data from your API
            // const response = await fetch('https://your-api-url.com');
            // const data = await response.json();
            const data = await mockFetchData(); // Mock data for testing - remove this when you integrate with your API
            toast.success("New donation!", {
                description: "Anonymous donated $100", // Mock data for testing - modify this when you integrate with your API
            })
            setRaisedAmount(data.raisedAmount);
            setGoalAmount(data.goalAmount);
            setDonationsAmount(data.donationsAmount);
            const percentage = (data.raisedAmount / data.goalAmount) * 100;
            setProgressWidth(percentage);

            if (raisedCountUp.current) {
                raisedCountUp.current.update(data.raisedAmount);
            } else {
                raisedCountUp.current = await initCountUp(raised, data.raisedAmount, countUpOptions.raised);
            }

            if (progressCountUp.current) {
                progressCountUp.current.update(percentage);
            } else {
                progressCountUp.current = await initCountUp(progressPerc, percentage, countUpOptions.progress);
            }

            if (donationsCountUp.current) {
                donationsCountUp.current.update(data.donationsAmount);
            } else {
                donationsCountUp.current = await initCountUp(donations, data.donationsAmount, countUpOptions.donations);
            }
        };

        fetchData();

        // const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Send a request every 5 minutes
        const intervalId = setInterval(fetchData, 5000);  // Mock data for testing - remove this and use the line above

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className="text-lightGray">
                <span className="text-2xl text-orange font-medium mr-2" ref={raised}>${raisedAmount}</span>
                raised of ${goalAmount.toLocaleString("en-US")} goal
            </div>
            <div className="flex w-full h-4 overflow-hidden text-xs font-medium rounded-full flex-start bg-progressBar">
                <div
                    className="flex text-white items-center justify-center h-full overflow-hidden bg-[#fcad6c] rounded-full transition-all"
                    style={{ width: `${progressWidth}%`, transitionDuration: "2500ms" }}
                >
                    <span ref={progressPerc}>{progressWidth}%</span>
                </div>
            </div>
            <p className="text-lightGray mb-4" ref={donations}>{donationsAmount}</p>
        </>
    );
}