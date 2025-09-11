'use client';

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {ChevronLeft} from 'lucide-react';

export default function SubscriptionPage() {
    const router = useRouter();
    const [selectedPlan] = useState<string>('Plus');

    useEffect(() => {
    }, [selectedPlan]);

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
