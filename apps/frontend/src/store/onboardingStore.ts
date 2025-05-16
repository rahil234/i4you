import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingData, UserPreferences } from '@/types';
import onboardingService from '@/services/onboarding.service';
import { StateCreator } from 'zustand/index';

// Define all the steps in the onboarding process
export type OnboardingStep = 'welcome' | 'photos' | 'about' | 'interests' | 'preferences' | 'location' | 'complete'

// Define the structure for tracking step completion
export interface StepCompletion {
  welcome: boolean;
  photos: boolean;
  about: boolean;
  interests: boolean;
  preferences: boolean;
  location: boolean;
  complete: boolean;
}

// Define the onboarding store interface
interface OnboardingStore {
  // Current step tracking
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step completion tracking
  completedSteps: StepCompletion;
  markStepCompleted: (step: OnboardingStep) => void;
  markStepIncomplete: (step: OnboardingStep) => void;

  // Onboarding data
  data: OnboardingData;

  // Data setters (grouped by step for clarity)
  // Welcome step - no data to set

  // Photos step
  setPhotos: (photos: string[]) => void;
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;

  // About step
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setBio: (bio: string) => void;
  setGender: (gender: string) => void;

  // Interests step
  setInterests: (interests: string[]) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;

  // Preference step
  updatePreferences: (preferences: Partial<UserPreferences>) => void;

  // Location step
  setLocation: (location: Partial<OnboardingData['location'] & { error: string }>) => void;

  // Utility functions
  resetOnboarding: () => void;
  isStepValid: (step: OnboardingStep) => boolean;

  // Submit onboarding data to the backend
  submitOnboarding: () => Promise<void>;
}

// Define the step order for navigation
const STEP_ORDER: OnboardingStep[] = ['about', 'photos', 'interests', 'preferences', 'location', 'complete'];


const onboardingStore: StateCreator<OnboardingStore, [['zustand/devtools', never]]> = (set, get) => ({
  currentStep: 'photos',

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const currentStep = get().currentStep;
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    if (currentIndex < STEP_ORDER.length - 1) {
      // Mark the current step as completed
      get().markStepCompleted(currentStep);

      // Move to the next step
      set({ currentStep: STEP_ORDER[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const currentStep = get().currentStep;
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    if (currentIndex > 0) {
      set({ currentStep: STEP_ORDER[currentIndex - 1] });
    }
  },

  completedSteps: {
    welcome: false,
    photos: false,
    about: false,
    interests: false,
    preferences: false,
    location: false,
    complete: false,
  },

  markStepCompleted: (step) =>
    set((state) => ({
      completedSteps: {
        ...state.completedSteps,
        [step]: true,
      },
    })),

  markStepIncomplete: (step) =>
    set((state) => ({
      completedSteps: {
        ...state.completedSteps,
        [step]: false,
      },
    })),

  data: {
    name: '',
    age: null,
    gender: null,
    bio: '',
    photos: [],
    interests: [],
    preferences: {
      ageRange: [18, 35],
      distance: 25,
      gender: 'all',
      showMe: 'all',
      lookingFor: 'relationship',
    },
    location: {
      coordinates: [0, 0],
      displayName: '',
    },
  },

  setPhotos: (photos) =>
    set((state) => ({
      data: { ...state.data, photos },
    })),

  addPhoto: (photo) =>
    set((state) => ({
      data: { ...state.data, photos: [...state.data.photos, photo] },
    })),

  removePhoto: (index) =>
    set((state) => ({
      data: {
        ...state.data,
        photos: state.data.photos.filter((_, i) => i !== index),
      },
    })),

  // About step setters
  setName: (name) =>
    set((state) => ({
      data: { ...state.data, name },
    })),

  setAge: (age) =>
    set((state) => ({
      data: { ...state.data, age },
    })),

  setGender: (
    gender,
  ) =>
    set((state) => ({
      data: { ...state.data, gender },
    })),

  setBio: (bio) =>
    set((state) => ({
      data: { ...state.data, bio },
    })),

  // Interests step setters
  setInterests: (interests) =>
    set((state) => ({
      data: { ...state.data, interests },
    })),

  addInterest: (interest) =>
    set((state) => ({
      data: {
        ...state.data,
        interests: [...state.data.interests, interest],
      },
    })),

  removeInterest: (interest) =>
    set((state) => ({
      data: {
        ...state.data,
        interests: state.data.interests.filter((i) => i !== interest),
      },
    })),

  // Preferences step setters
  updatePreferences: (preferences) =>
    set((state) => ({
      data: {
        ...state.data,
        preferences: { ...state.data.preferences, ...preferences },
      },
    })),

  // Location step setters
  setLocation: (location) =>
    set((state) => ({
      data: { ...state.data, location: location as OnboardingData['location'] },
    })),

  // Utility functions
  resetOnboarding: () =>
    set({
      currentStep: 'welcome',
      completedSteps: {
        welcome: false,
        photos: false,
        about: false,
        interests: false,
        preferences: false,
        location: false,
        complete: false,
      },
      data: {
        name: '',
        age: null,
        gender: null,
        bio: '',
        photos: [],
        interests: [],
        preferences: {
          ageRange: [18, 35],
          distance: 25,
          showMe: 'all',
          lookingFor: 'relationship',
        },
        location: {
          coordinates: [0, 0],
          displayName: '',
        },
      },
    }),

  isStepValid: (step) => {
    const data = get().data;

    switch (step) {
      case 'welcome':
        return true;

      case 'photos':
        return data.photos.length > 1;

      case 'about':
        return !!data.name && !!data.age && !!data.bio && !!data.gender;

      case 'interests':
        return data.interests.length > 5;

      case 'preferences':
        return true;

      case 'location':
        return !!data.location;

      case 'complete':
        return true;

      default:
        return false;
    }
  },

  // Submit onboarding data
  submitOnboarding: async () => {
    const data = get().data;

    console.log('Submitting onboarding data:', data);

    const { error } = await onboardingService.submitUserOnBoarding(data);

    if (error) {
      console.error('Error submitting onboarding data:', error);
      return Promise.reject(error);
    }

    get().resetOnboarding();
    get().markStepCompleted('complete');

    return Promise.resolve();
  },
});

// Create the store
export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    onboardingStore,
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        data: state.data,
      }),
    },
  ),
);

export default useOnboardingStore;
