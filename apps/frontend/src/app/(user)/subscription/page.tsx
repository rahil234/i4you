'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Card, CardHeader, CardContent, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {BadgeCheck, Heart, Star, ChevronLeft} from 'lucide-react';
import subscriptionService from '@/services/subcription.service';
import {plans} from "@/constants";
import {Plan} from "@/types";
import {useAuthStore} from "@/store/auth-store";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const handleSubscribe = async (planId: Plan['planId']) => {
    const {data, error} = await subscriptionService.subscribe(planId);
    if (error) {
        alert('Subscription failed. Please try again.');
    }
    if (data.url) {
        window.location.href = data.url;
    }
};

const handleCancel = async () => {
    const {error} = await subscriptionService.cancel();
    if (error) {
        alert('Subscription cancel failed. Please try again.');
    }
};

export default function SubscriptionPage() {

    const {user} = useAuthStore();

    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string>(user?.subscription?.planId || 'free');

    const userPlan = plans.find(plan => plan.planId === user?.subscription?.planId);

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto pb-20 pt-8 px-4 max-w-2xl md:max-w-4xl xl:max-w-6xl">

                {/* Back Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:bg-rose-100 hover:text-rose-500 transition"
                    onClick={() => router.push('/profile')}
                >
                    <ChevronLeft size={18}/>
                    Back to Profile
                </Button>

                {/* Gradient Title */}
                <h1 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow">
                    Upgrade Your Experience
                </h1>

                {/* Pricing Section */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-20">
                    {plans.map((plan) => {
                        const isSelected = plan.planId === selectedPlan;
                        return (
                            <div
                                key={plan.name}
                                className={`
                  flex flex-col flex-1 transition-transform duration-500
                  ${isSelected ? 'scale-105 shadow-pink-200 z-10' : 'scale-96 opacity-80 z-0'}
                  cursor-pointer
                  min-w-[350px] max-w-md
                `}
                                onClick={() => setSelectedPlan(plan.planId)}
                            >
                                <Card
                                    className={`
              flex flex-col rounded-2xl border-none
              bg-gradient-to-br ${plan.gradient}
              ${plan.highlight ? 'text-white shadow-xl' : 'text-black/80 shadow-md'}
              ${isSelected ? 'ring-2 ring-pink-400 scale-105' : 'hover:ring-2 hover:ring-pink-200'}
              transition-all duration-300
                  `}
                                    style={{
                                        boxShadow: isSelected
                                            ? '0 4px 18px #db277776'
                                            : '0 6px 18px #0002',
                                    }}
                                >
                                    <CardHeader>
                                        <CardTitle
                                            className="flex items-center justify-center gap-2 text-xl break-words">
                                            {plan.highlight ? (
                                                <BadgeCheck className="text-yellow-300"/>
                                            ) : (
                                                <Heart className="text-pink-500"/>
                                            )}
                                            <span>{plan.name}</span>
                                            {plan.highlight && (
                                                <span
                                                    className="ml-2 px-2 py-1 bg-yellow-400/80 text-xs rounded-lg font-semibold text-pink-700 shadow-lg whitespace-nowrap">
                          Best Value
                        </span>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-1">
                                        <div
                                            className={`
                                            text-3xl font-bold text-center mb-4 tracking-tight ${
                                                plan.name === 'Basic'
                                                    ? 'text-slate-500'
                                                    : plan.name === 'Plus'
                                                        ? 'text-[#FFD700]'
                                                        : 'text-white opacity-80'
                                            }
                                            `}
                                        >
                                            {plan.price}
                                        </div>
                                        <ul className="mb-7 space-y-3 flex-1">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-base">
                                                    <Star
                                                        size={17}
                                                        className={
                                                            plan.highlight
                                                                ? 'text-yellow-200 drop-shadow'
                                                                : 'text-pink-200'
                                                        }
                                                    />
                                                    <span className="break-words">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            size={plan.highlight ? 'lg' : 'default'}
                                            variant={plan.highlight && isSelected ? 'default' : 'secondary'}
                                            className={`w-full rounded-lg py-2.5 mt-2 shadow-md
                        ${
                                                plan.highlight && isSelected
                                                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white uppercase tracking-wider font-bold hover:from-pink-600 hover:to-red-600 shadow-lg'
                                                    : 'border-pink-200 text-pink-600 font-semibold hover:bg-pink-50/80'
                                            }
                        transition-all duration-200
                      `}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await handleSubscribe(plan.planId);
                                            }}
                                            disabled={plan.price === 'Free' || plan.planId === userPlan?.planId || !isSelected}
                                        >
                                            {plan.planId === userPlan?.planId
                                                ? 'Current Plan'
                                                : isSelected
                                                    ? 'Subscribe Now'
                                                    : 'Select Plan'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}

                    {/* Cancel Button */}
                    {userPlan?.planId !== "free" && (
                        <div className="mt-5 text-center">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        Cancel Subscription
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to cancel your subscription?
                                            You’ll lose access to premium features immediately after cancellation.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-lg">
                                            No, Keep It
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                            onClick={async () => {
                                                await handleCancel();
                                            }}
                                        >
                                            Yes, Cancel
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>

                {/* Stripe Assurance */}
                <div className="mt-10 text-center text-xs text-muted-foreground">
          <span className="inline-block bg-white/90 px-4 py-2 rounded-md shadow-sm">
            100% Secure, payments powered by{' '}
              <span className="font-bold text-pink-500">Stripe</span>
          </span>
                </div>
            </div>
        </div>
    );
}
