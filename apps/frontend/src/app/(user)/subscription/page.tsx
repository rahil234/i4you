'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Heart, Star, ChevronLeft } from 'lucide-react';
import subcriptionService from '@/services/subcription.service';

type Plan = {
  name: string;
  price: string;
  features: string[];
  highlight: boolean;
  gradient: string;
  shadow?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Basic',
    price: 'Free',
    features: ['Limited matches', 'Ads', 'No boosts'],
    highlight: false,
    gradient: 'from-slate-50 to-slate-100',
    shadow: false,
  },
  {
    name: 'Plus',
    price: '$9.99/mo',
    features: ['More matches', 'See who liked you', '1 boost per month', 'Ad-free'],
    highlight: true,
    gradient: 'from-slate-900 via-slate-400 to-slate-600',
  },
  {
    name: 'Premium',
    price: '$19.99/mo',
    features: [
      'Unlimited matches',
      'See all profile views',
      '5 boosts/month',
      'Message first',
    ],
    highlight: false,
    gradient: 'from-pink-500 via-purple-500 to-fuchsia-500',
  },
];

const handleSubscribe = async (planName: string) => {

  const { data, error } = await subcriptionService.subscribe(planName);
  if (error) {
    alert('Subscription failed. Please try again.');
  }
  if (data.url) {
    window.location.href = data.url;
  }
};

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('Plus');

  useEffect(() => {
  }, [selectedPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50 to-purple-50">
      <div className="mx-auto pt-8 px-2">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:bg-rose-100 hover:text-rose-500 transition"
          onClick={() => router.push('/profile')}
        >
          <ChevronLeft size={18} />
          Back to Profile
        </Button>

        {/* Title */}
        <h2
          className="text-3xl font-extrabold text-center mb-32 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow"
        >
          Upgrade Your Experience
        </h2>

        {/* Scrollable Pricing Cards */}
        <div
          className={`
            flex gap-8 items-stretch justify-center
            relative
          `}
          style={{
            WebkitOverflowScrolling: 'touch',
            overflowY: 'visible',
            scrollbarWidth: 'none' as any,
          }}
        >
          {plans.map((plan) => {
            const isSelected = plan.name === selectedPlan;
            return (
              <div
                key={plan.name}
                className={`
                  flex-shrink-0 snap-center
                  transition-transform duration-500
                  ${isSelected ? 'z-[2]' : 'z-[1]'}
                  px-1
                `}
                style={{
                  transform: isSelected
                    ? 'scale(1.12) translateY(-14px)'
                    : 'scale(0.93) translateY(18px)',
                  opacity: isSelected ? 1 : 0.68,
                  filter: isSelected ? plan.shadow ? 'drop-shadow(0 12px 14px #db2777aa)' : 'drop-shadow(0 0px 0px #db277720)' : 'blur(0.5px) brightness(0.93)',
                  transition: 'all 0.45s cubic-bezier(.29,1.33,.66,1)',
                  minWidth: 320,
                  maxWidth: 380,
                  width: '76vw',
                  cursor: 'pointer',
                  perspective: '1100px',
                }}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <Card
                  className={`
                    w-full rounded-2xl relative
                    shadow-2xl border-none
                    break-words
                    bg-gradient-to-br
                    transition-all duration-500
                    ${
                    isSelected
                      ? 'ring-2 ring-pink-400 border-pink-300 scale-105'
                      : 'hover:ring-2 hover:ring-pink-200 min-h-52'
                  }
                    ${
                    plan.highlight
                      ? 'bg-gradient-to-tr ' + plan.gradient + ' text-white'
                      : 'bg-gradient-to-br ' + plan.gradient + ' text-black/80'
                  }
                  `}
                  style={{
                    boxShadow: isSelected
                      ? '0 0px 0px 0 #ea41b97a, 0 2px 8px #0001'
                      : '0 6px 18px #0002',
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-xl break-words">
                      {plan.highlight ? (
                        <BadgeCheck className="text-yellow-300" />
                      ) : (
                        <Heart className="text-pink-500" />
                      )}
                      <span>{plan.name}</span>
                      {plan.highlight && (
                        <span
                          className="ml-2 px-2 py-1 bg-yellow-400/80 text-xs rounded-lg font-semibold text-pink-700 shadow-lg whitespace-nowrap"
                        >
                          Best Value
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-3xl font-bold text-center mb-4 tracking-tight ${
                        plan.name === 'Basic' ? 'text-slate-500' : plan.name === 'Plus' ? 'text-[#FFD700]' : 'text-white opacity-70'
                      }`}
                    >
                      {plan.price}
                    </div>
                    <ul className="mb-7 space-y-3">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-base"
                          style={{ wordBreak: 'break-word' }}
                        >
                          <Star
                            size={17}
                            className={
                              plan.highlight ? 'text-yellow-200 drop-shadow' : 'text-pink-200'
                            }
                          />
                          <span className="break-words">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size={plan.highlight ? 'lg' : 'default'}
                      variant={plan.highlight && isSelected ? 'default' : 'secondary'}
                      className={`w-full rounded-lg py-2.5 ${
                        plan.highlight && isSelected
                          ? 'i4you-gradient border-none font-bold shadow-lg text-white uppercase tracking-wider bg-pink-600/90 hover:bg-pink-500/80'
                          : 'border-pink-200 text-pink-600 font-semibold hover:bg-pink-50/80'
                      }`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await handleSubscribe(plan.name);
                      }}
                      disabled={plan.price === 'Free' || !isSelected}
                    >
                      {plan.price === 'Free'
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
        </div>

        {/* Stripe Assurance */}
        <div className="mt-32 text-center text-xs text-muted-foreground">
          <span className="inline-block bg-white/90 px-4 py-2 rounded-md shadow-sm">
            100% Secure, payments powered by{' '}
            <span className="font-bold text-pink-500">Stripe</span>
          </span>
        </div>
      </div>
    </div>
  );
}
