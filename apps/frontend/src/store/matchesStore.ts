import type { Match, User } from '@/types';
import { create, StateCreator } from 'zustand/index';
import { devtools } from 'zustand/middleware';
import UserService from '@/services/user.service';
import MatchService from '@/services/match.service';

interface MatchesStore {
  matches: Match[];
  newMatches: Match[];
  potentialMatches: User[];
  loading: boolean;
  error: string | null;
  fetchMatches: () => Promise<void>;
  fetchPotentialMatches: () => Promise<void>;
  likeUser: (userId: string) => Promise<Match | null>;
  dislikeUser: (userId: string) => Promise<void>;
  unmatchUser: (matchId: string) => Promise<void>;
  pushNewMatch: (newMatch: Match) => void;
  closeMatch: () => void;
}

const matchStore: StateCreator<MatchesStore, [['zustand/devtools', never]]> = (set, get) => ({
  matches: [],
  newMatches: [],
  potentialMatches: [],
  loading: true,
  error: null,

  fetchMatches: async () => {
    set({ loading: true, error: null });
    console.log('Fetching matches...');
    try {

      const { data, error } = await MatchService.getMatches();

      if (error) {
        console.log('Error fetching potential matches:', error);
        set({ error: 'Failed to fetch potential matches', loading: false });
        return;
      }

      console.log('Potential matches response:', data);

      set({ matches: data, loading: false }, undefined, 'matchstore/fetchMatches');
    } catch (error) {
      set({ error: 'Failed to fetch matches', loading: false });
    }
  },

  fetchPotentialMatches: async () => {
    set({ loading: true, error: null }, undefined, 'matchStore/fetchMatches/intial');
    try {
      const { data, error } = await UserService.getPotentialMatches();

      if (error) {
        console.log('Error fetching potential matches:', error);
        set({ error: 'Failed to fetch potential matches', loading: false });
        return;
      }

      console.log('Potential matches response:', data);

      set({ potentialMatches: data, loading: false }, undefined, 'matchStore/fetchPotentialMatches/success');
    } catch (error) {
      set({ error: 'Failed to fetch potential matches', loading: false });
    }
  },

  likeUser: async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { data, error } = await UserService.likeUser(userId);

    if (error) {
      console.log('Error liking user:', error);
      set({ error: 'Failed to like user' });
      return null;
    }

    console.log('Like user response:', data);

    // const isMatch = Math.random() < 0.2;

    // if (isMatch) {
    //   const matchedUser = get().potentialMatches.find((user) => user.id === userId);
    //
    //   if (!matchedUser) return null;

    // const newMatch: Match = {
    //   id: `match-${Date.now()}`,
    //   userId: 'user1',
    //   matchedUserId: userId,
    //   createdAt: new Date().toISOString(),
    //   user: matchedUser,
    // };

    // set((state) => ({
    //   matches: [...state.matches, newMatch],
    //   potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
    // }));

    //   return null;
    // } else {
    // }

    set((state) => ({
      potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
    }), undefined, 'matchStore/likeUser');

    return null;
  },

  dislikeUser: async (userId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        potentialMatches: state.potentialMatches.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      set({ error: 'Failed to dislike user' });
    }
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
    console.log('🥰Pushed new match to store:', newMatch);
    // setTimeout(() => {
    //   set((state) => ({
    //     newMatches: state.newMatches.filter((match) => match.id !== newMatch.id),
    //   }), undefined, 'matchStore/pushNewMatch/cleanup');
    // }, 5000);
  },

  closeMatch: () => {
    set(() => ({
      newMatches: get().newMatches.slice(1),
    }), undefined, 'matchStore/closeMatch');
  },

});

export const useMatchesStore = create<MatchesStore>()(
  devtools(
    matchStore,
    {
      name: 'matches-store',
      enabled: true,
    },
  ));

export default useMatchesStore;
