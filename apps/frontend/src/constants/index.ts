import {Plan} from "@/types";


export const SUBSCRIPTION_LIMITS = {
    free: {likes: 10, superLikes: 1, distanceKm: 500},
    plus: {likes: 50, superLikes: 5, distanceKm: 2000},
    premium: {likes: 200, superLikes: 20, distanceKm: 4000},
};

export const plans: Plan[] = [
    {
        name: 'Basic',
        planName: 'basic',
        planId: 'free',
        price: 'Free',
        features: [`${SUBSCRIPTION_LIMITS['free'].likes} Likes/day`, `${SUBSCRIPTION_LIMITS['free'].superLikes} Super Likes/day`, `Distance: ${SUBSCRIPTION_LIMITS['free'].distanceKm} km`],
        highlight: false,
        gradient: 'from-slate-50 to-slate-100',
        shadow: false,
    },
    {
        name: 'Plus',
        planName: 'M199',
        planId: 'plus',
        price: '₹199/mo',
        features: [`${SUBSCRIPTION_LIMITS['plus'].likes} Likes/day`, `${SUBSCRIPTION_LIMITS['plus'].superLikes} Super Likes/day`, `Distance: ${SUBSCRIPTION_LIMITS['plus'].distanceKm} km`],
        highlight: true,
        gradient: 'from-pink-400 via-rose-500 to-red-400',
        shadow: true,
    },
    {
        name: 'Premium',
        planName: 'M399',
        planId: 'premium',
        price: '₹399/mo',
        features: [`Unlimited Likes/day`, `${SUBSCRIPTION_LIMITS['premium'].superLikes} Super Likes/day`, `Distance: ${SUBSCRIPTION_LIMITS['premium'].distanceKm} km`],
        highlight: false,
        gradient: 'from-purple-500 via-pink-400 to-fuchsia-400',
        shadow: true,
    },
];