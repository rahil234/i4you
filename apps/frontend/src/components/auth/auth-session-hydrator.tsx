'use client';

import {useEffect} from 'react';
import {useAuthStore} from '@/store/auth-store';
import {User} from '@i4you/shared';
import {useRouter} from 'next/navigation';

export default function AuthSessionHydrator({user}: {
    user: Omit<User, 'location'> & { location: string, onboarding: boolean }
}) {
    const {setState} = useAuthStore();

    const router = useRouter();

    if (!user) {
        return null;
    }

    useEffect(() => {
        if (user) {
            setState({user, isAuthenticated: true, isLoading: false});
            if (user.onboarding) {
                router.push('/onboarding');
            }
        } else {
            setState({user: null, isAuthenticated: false, isLoading: false});
        }
    }, [user, setState]);

    return null;
}
