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
  likeUser: (userId: string) => Promise<Match | null>;
  dislikeUser: (userId: string) => Promise<void>;
  unmatchUser: (matchId: string) => Promise<void>;
  pushNewMatch: (newMatch: Match) => void;
  closeMatch: () => void;
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


    set({ potentialMatches, matches, loading: false }, undefined, 'matchStore/initial/success');
  })();

  return {
    matches: [],
    newMatches: [],
    potentialMatches: [],
    loading: true,
    error: null,

    likeUser: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { error } = await UserService.likeUser(userId);

      if (error) {
        console.log('Error liking user:', error);
        set({ error: 'Failed to like user' });
        return null;
      }

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
    },

    closeMatch: () => {
      set(() => ({
        newMatches: get().newMatches.slice(1),
      }), undefined, 'matchStore/closeMatch');
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

export default useMatchesStore;
