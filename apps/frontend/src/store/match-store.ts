'use client';

import type {Match} from '@/types';
import {create, StateCreator} from 'zustand';
import {devtools} from 'zustand/middleware';
import MatchService from '@/services/match.service';
import matchService from '@/services/match.service';

interface MatchStore {
    matches: Match[];
    newMatches: Match[];
    newMatchesCount: number;
    loading: boolean;
    error: string | null;
    initial: () => Promise<void>;
    unmatchUser: (matchId: string) => Promise<void>;
    pushNewMatch: (newMatch: Match) => void;
    blockMatch: (matchId: string) => Promise<void>;
    reFetchMatches: () => Promise<void>;
    resetCount: () => void;
    closeMatch: () => void;
    clear: () => Promise<void>;
}

const matchStore: StateCreator<MatchStore, [['zustand/devtools', never]]> = (set, get) => ({
        matches: [],
        newMatches: [],
        newMatchesCount: 0,
        potentialMatches: [],
        loading: true,
        error: null,

        initial: async () => {
            set({loading: true, error: null}, undefined, 'matchStore/initial');
            const {data: matches, error} = await MatchService.getMatches();

            if (error) {
                console.log('Error fetching matches:', error);
                set({error: 'Failed to fetch matches', loading: false});
                return;
            }

            set({
                matches,
                newMatchesCount: matches.length,
                loading: false,
            }, undefined, 'matchStore/initial/success');
        },

        reFetchMatches: async () => {
            const {data: matches, error} = await MatchService.getMatches();
            if (error) {
                console.log('Error re-fetching matches:', error);
                set({error: 'Failed to re-fetch matches'});
                return;
            }
            set({matches}, undefined, 'matchStore/reFetchMatches');
        },

        unmatchUser: async (matchId) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));

                set((state) => ({
                    matches: state.matches.filter((match) => match.id !== matchId),
                }));
            } catch (error) {
                set({error: 'Failed to unmatch user'});
            }
        },

        pushNewMatch: (newMatch: Match) => {
            set((state) => ({
                newMatches: [...state.newMatches, newMatch],
            }), undefined, 'matchStore/pushNewMatch');
        },

        blockMatch: async (matchId) => {
            const {error} = await matchService.blockMatch(matchId);
            if (error) {
                console.log('Error blocking user:', error);
                set({error: 'Failed to block user'});
                return;
            }
            console.log(`Blocked user: ${matchId}`);
            set((state) => ({
                matches: state.matches.filter((match) => match.id !== matchId),
            }), undefined, 'matchStore/blockMatch/success');
        },

        resetCount: () => {
            set(() => ({
                newMatchesCount: 0,
            }), undefined, 'matchStore/resetCount');
        },

        closeMatch: () => {
            set(() => ({
                newMatches: get().newMatches.slice(1),
            }), undefined, 'matchStore/closeMatch');
        },

        clear: async () => {
            set({
                matches: [],
                newMatches: [],
                loading: false,
                error: null,
            }, undefined, 'matchStore/clear');
        },
    }
)

export const useMatchStore = create<MatchStore>()(
    devtools(
        matchStore,
        {
            name: 'matches-store',
            enabled: true,
        },
    ));
