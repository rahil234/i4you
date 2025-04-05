import {create} from "zustand"
import {persist} from "zustand/middleware"
import type {UserPreferences} from "@/types"

interface PreferencesStore {
    preferences: UserPreferences
    updatePreferences: (preferences: Partial<UserPreferences>) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
    persist(
        (set, get) => ({
            preferences: {
                ageRange: [18, 35],
                distance: 25,
                gender: "all",
                showMe: "all",
                lookingFor: "relationship",
            },

            updatePreferences: (newPreferences) => {
                set((state) => ({
                    preferences: {...state.preferences, ...newPreferences},
                }))
            },

            savePreferences: async () => {
                console.log("Saving preferences", get().preferences)
            }
        }),
        {
            name: "preferences-storage",
        },
    ),
)

export default usePreferencesStore;
