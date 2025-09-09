'use client';

import type { Match, User } from '@/types';
import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import MatchService from '@/services/match.service';
import matchService from '@/services/match.service';
import InteractionService from '@/services/interaction.service';

interface MatchesStore {
  matches: Match[];
  newMatches: Match[];
  newMatchesCount: number;
  potentialMatches: User[];
  loading: boolean;
  error: string | null;
  initial: () => Promise<void>;
  likeUser: (userId: string) => Promise<void>;
  superLikeUser: (userId: string) => Promise<void>;
  dislikeUser: (userId: string) => Promise<void>;
  unmatchUser: (matchId: string) => Promise<void>;
  pushNewMatch: (newMatch: Match) => void;
  blockMatch: (matchId: string) => Promise<void>;
  reFetchMatches: () => Promise<void>;
  resetCount: () => void;
  closeMatch: () => void;
  clear: () => Promise<void>;
}

const matchStore: StateCreator<MatchesStore, [['zustand/devtools', never]]> = (set, get) => {

  (async () => {
    set({ loading: true, error: null }, undefined, 'matchStore/initial');

    const { data: potentialMatches, error: potentialMatchError } = await MatchService.getPotentialMatches();

    if (potentialMatchError) {
      set({ error: 'Failed to fetch potential matches', loading: false });
      console.log('Error fetching potential matches:', potentialMatchError);
      return;
    }

    const { data: matches, error } = await MatchService.getMatches();

    if (error) {
      console.log('Error fetching potential matches:', error);
      set({ error: 'Failed to fetch potential matches', loading: false });
      return;
    }


    set({
      potentialMatches, matches,
      newMatchesCount: matches.length,
      loading: false,
    }, undefined, 'matchStore/initial/success');
  })();

  return {
    matches: [],
    newMatches: [],
    newMatchesCount: 0,
    potentialMatches: [],
    loading: true,
    error: null,

    initial: async () => {
      console.log('Initializing match store...');
      set({ loading: true, error: null }, undefined, 'matchStore/initial');

      const { data: potentialMatches, error: potentialMatchError } = await MatchService.getPotentialMatches();

      if (potentialMatchError) {
        set({ error: 'Failed to fetch potential matches', loading: false });
        console.log('Error fetching potential matches:', potentialMatchError);
        return;
      }

      const { data: matches, error } = await MatchService.getMatches();

      if (error) {
        console.log('Error fetching potential matches:', error);
        set({ error: 'Failed to fetch potential matches', loading: false });
        return;
      }

      set({
        potentialMatches,
        matches,
        newMatchesCount: matches.length,
        loading: false,
      }, undefined, 'matchStore/initial/success');
    },

    likeUser: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { error } = await InteractionService.likeUser(userId);

      if (error) {
        console.log('Error liking user:', error);
        set({ error: 'Failed to like user' });
        return;
      }

      set((state) => ({
        potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
      }), undefined, 'matchStore/likeUser');
    },

    superLikeUser: async (userId) => {
      const { error } = await InteractionService.superLikeUser(userId);

      if (error) {
        console.log('Error Super liking user:', error);
        set({ error: 'Failed to superlike user' });
        return;
      }

      set((state) => ({
        potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
      }), undefined, 'matchStore/superLikeUser');
    },

    dislikeUser: async (userId) => {
      const { error } = await InteractionService.dislikeUser(userId);

      if (error) {
        console.log('Error disliking user:', error);
        set({ error: 'Failed to dislike user' });
        return;
      }

      set((state) => ({
        potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
      }), undefined, 'matchStore/dislikeUser');
    },

    reFetchMatches: async () => {
      const { data: matches, error } = await MatchService.getMatches();
      if (error) {
        console.log('Error re-fetching matches:', error);
        set({ error: 'Failed to re-fetch matches' });
        return;
      }
      set({ matches }, undefined, 'matchStore/reFetchMatches');
    },

    unmatchUser: async (matchId) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          matches: state.matches.filter((match) => match.id !== matchId),
        }));
      } catch (error) {
        set({ error: 'Failed to unmatch user' });
      }
    },

    pushNewMatch: (newMatch: Match) => {
      set((state) => ({
        newMatches: [...state.newMatches, newMatch],
      }), undefined, 'matchStore/pushNewMatch');
    },

    blockMatch: async (matchId) => {
      const { error } = await matchService.blockMatch(matchId);
      if (error) {
        console.log('Error blocking user:', error);
        set({ error: 'Failed to block user' });
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
        potentialMatches: [],
        loading: false,
        error: null,
      }, undefined, 'matchStore/clear');
    },
  };
};

export const useMatchesStore = create<MatchesStore>()(
  devtools(
    matchStore,
    {
      name: 'matches-store',
      enabled: true,
    },
  ));
