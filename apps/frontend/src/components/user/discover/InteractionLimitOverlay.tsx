'use client';

import {useEffect, useState} from "react";
import {useInteractionStore} from "@/store/interaction-store";
import {Heart, Zap} from "lucide-react";

export default function LimitOverlay() {
    const {showLimitOverlay, likeBalance, superLikeBalance, closeOverlay} =
        useInteractionStore();

    const [countdown, setCountdown] = useState<string>("");

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0); // today’s midnight (next day 12:00 AM)

            const diff = midnight.getTime() - now.getTime();

            if (diff <= 0) {
                setCountdown("Available now!");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(
                `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
                    seconds
                ).padStart(2, "0")}`
            );
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!showLimitOverlay) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-2xl border border-gray-100">
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">Out of Likes!</h2>
                <p className="text-sm text-gray-600 mb-6">
                    You’ve reached your daily limit.
                    <>
                        {" "}
                        Next refill at <b>12:00 AM</b> <br/>
                        <span className="text-pink-500 font-medium">
                            {countdown} left
                        </span>
                    </>
                </p>

                {/* Balances */}
                <div className="flex justify-around mb-6">
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-pink-100 rounded-full">
                            <Heart className="h-6 w-6 text-pink-500"/>
                        </div>
                        <span className="mt-2 font-semibold text-gray-800">
                            {likeBalance}
                        </span>
                        <span className="text-xs text-gray-500">Likes</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Zap className="h-6 w-6 text-blue-500"/>
                        </div>
                        <span className="mt-2 font-semibold text-gray-800">
                            {superLikeBalance}
                        </span>
                        <span className="text-xs text-gray-500">Super Likes</span>
                    </div>
                </div>

                {/* Action */}
                <button
                    onClick={closeOverlay}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:from-pink-600 hover:to-rose-600 transition"
                >
                    Okay
                </button>
            </div>
        </div>
    );
}
