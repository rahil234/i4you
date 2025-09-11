import {Plan} from "@/types";

export const plans: Plan[] = [
    {
        name: 'Basic',
        planName: 'basic',
        planId: 'free',
        price: 'Free',
        features: ['Limited matches', 'Ads', 'No boosts'],
        highlight: false,
        gradient: 'from-slate-50 to-slate-100',
        shadow: false,
    },
    {
        name: 'Plus',
        planName: 'M199',
        planId: 'plus',
        price: '₹199/mo',
        features: ['More matches', 'See who liked you', '1 boost per month', 'Ad-free'],
        highlight: true,
        gradient: 'from-pink-400 via-rose-500 to-red-400',
        shadow: true,
    },
    {
        name: 'Premium',
        planName: 'M399',
        planId: 'premium',
        price: '₹399/mo',
        features: [
            'Unlimited matches',
            'See all profile views',
            '5 boosts/month',
            'Message first',
        ],
        highlight: false,
        gradient: 'from-purple-500 via-pink-400 to-fuchsia-400',
        shadow: true,
    },
];