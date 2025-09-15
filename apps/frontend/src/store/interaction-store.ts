'use client';

import type {User} from '@/types';
import {create, StateCreator} from 'zustand';
import {devtools} from 'zustand/middleware';
import InteractionService from '@/services/interaction.service';
import MatchService from '@/services/match.service';

interface InteractionStore {
    potentialMatches: User[];
    likeBalance: number;
    superLikeBalance: number;
    refillTime: Date | null;
    showLimitOverlay: boolean;
    loading: boolean;
    error: string | null;

    initial: () => Promise<void>;
    fetchBalances: () => Promise<void>;
    likeUser: (userId: string) => Promise<boolean>;
    superLikeUser: (userId: string) => Promise<boolean>;
    dislikeUser: (userId: string) => Promise<boolean>;
    closeOverlay: () => void;
    clear: () => Promise<void>;
}

const interactionStore: StateCreator<InteractionStore, [['zustand/devtools', never]]> = (set, get) => {
    return {
        potentialMatches: [],
        likeBalance: 0,
        superLikeBalance: 0,
        refillTime: null,
        showLimitOverlay: false,
        loading: true,
        error: null,

        initial: async () => {
            set({loading: true, error: null}, false, 'interactionStore/initial');

            const {data: potentialMatches, error: potentialMatchError} = await MatchService.getPotentialMatches();
            if (potentialMatchError) {
                set({error: 'Failed to fetch potential matches', loading: false});
                return;
            }

            await get().fetchBalances();

            set({
                potentialMatches,
                loading: false,
            }, false, 'interactionStore/initial/success');
        },

        fetchBalances: async () => {
            const {data, error} = await InteractionService.fetchBalances();
            if (error) {
                set({error: 'Failed to fetch balances'});
                return;
            }
            set({
                likeBalance: data.likes,
                superLikeBalance: data.superLikes,
                refillTime: data.refill_time ? new Date(data.refill_time) : new Date(Date.now() +  60 * 60 * 1000),
            }, false, 'interactionStore/fetchBalances');
        },

        likeUser: async (userId: string) => {
            const state = get();
            if (state.likeBalance <= 0) {
                set({showLimitOverlay: true}, false, 'interactionStore/likeUser/limit');
                return false;
            }

            const {error} = await InteractionService.likeUser(userId);
            if (error) {
                set({error: 'Failed to like user'});
                return false;
            }

            set((state) => ({
                potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
                likeBalance: Math.max(state.likeBalance - 1, 0),
            }), false, 'interactionStore/likeUser');

            return true;
        },

        superLikeUser: async (userId: string) => {
            const state = get();
            if (state.superLikeBalance <= 0) {
                set({showLimitOverlay: true}, false, 'interactionStore/superLikeUser/limit');
                return false;
            }

            const {error} = await InteractionService.superLikeUser(userId);
            if (error) {
                set({error: 'Failed to super like user'});
                return false;
            }

            set((state) => ({
                potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
                superLikeBalance: Math.max(state.superLikeBalance - 1, 0),
            }), false, 'interactionStore/superLikeUser');
            return true;
        },

        dislikeUser: async (userId: string) => {
            const {error} = await InteractionService.dislikeUser(userId);
            if (error) {
                set({error: 'Failed to dislike user'});
                return false;
            }

            set((state) => ({
                potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
            }), false, 'interactionStore/dislikeUser');
            return true;
        },

        closeOverlay: () => {
            set({showLimitOverlay: false}, false, 'interactionStore/closeOverlay');
        },

        clear: async () => {
            set({
                potentialMatches: [],
                likeBalance: 0,
                superLikeBalance: 0,
                refillTime: null,
                showLimitOverlay: false,
                loading: false,
                error: null,
            }, false, 'interactionStore/clear');
        },
    };
};

export const useInteractionStore = create<InteractionStore>()(
    devtools(interactionStore, {name: 'interaction-store', enabled: true}),
);