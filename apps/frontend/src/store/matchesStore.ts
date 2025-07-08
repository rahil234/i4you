import type { Match, User } from '@/types';
import { create, StateCreator } from 'zustand/index';
import { devtools } from 'zustand/middleware';
import userService from '@/services/user.service';

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

      // const sampleMatches: Match[] = [
      //   {
      //     id: 'match1',
      //     userId: 'user1',
      //     matchedUserId: 'user2',
      //     createdAt: new Date().toISOString(),
      //     user: {
      //       id: 'user2',
      //       name: 'Jessica Parker',
      //       age: 28,
      //       bio: 'Adventure seeker, coffee enthusiast',
      //       photos: ['/placeholder.svg?height=500&width=400'],
      //       location: 'New York',
      //     },
      //   },
      //   {
      //     id: 'match2',
      //     userId: 'user1',
      //     matchedUserId: 'user3',
      //     createdAt: new Date().toISOString(),
      //     user: {
      //       id: 'user3',
      //       name: 'Michael Chen',
      //       age: 32,
      //       bio: 'Software developer by day, musician by night',
      //       photos: ['/placeholder.svg?height=500&width=400'],
      //       location: 'Boston',
      //     },
      //   },
      // ];

      const { data, error } = await userService.getMyMatches();

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

      // const sampleUsers: User[] = [
      //   {
      //     id: 'user4',
      //     name: 'Sophia',
      //     age: 26,
      //     bio: 'Art lover and yoga instructor',
      //     photos: ['/placeholder.svg?height=500&width=400', '/placeholder.svg?height=500&width=400'],
      //     location: 'Chicago',
      //     distance: '3 miles away',
      //     interests: ['Art', 'Yoga', 'Reading', 'Meditation'],
      //   },
      //   {
      //     id: 'user5',
      //     name: 'David',
      //     age: 31,
      //     bio: 'Fitness enthusiast and foodie',
      //     photos: ['/placeholder.svg?height=500&width=400', '/placeholder.svg?height=500&width=400'],
      //     location: 'Los Angeles',
      //     distance: '12 miles away',
      //     interests: ['Fitness', 'Food', 'Travel', 'Movies'],
      //   },
      //   {
      //     id: 'user6',
      //     name: 'Emma',
      //     age: 27,
      //     bio: 'Book lover, cat person, and aspiring chef',
      //     photos: ['/placeholder.svg?height=500&width=400', '/placeholder.svg?height=500&width=400'],
      //     location: 'Seattle',
      //     distance: '7 miles away',
      //     interests: ['Cooking', 'Reading', 'Cats', 'Wine'],
      //   },
      // ];

      const { data, error } = await userService.getMyMatches();

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

    const { data, error } = await userService.likeUser(userId);

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
