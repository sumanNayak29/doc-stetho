import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserProfile {
    name: string
    email: string
    picture?: string
}

interface UserLoginDataStore {
    userLoginData: UserProfile | null
    setUserLoginData: (userLoginData: UserProfile) => void
    clearUserLoginData: () => void
}

export const useUserLoginData = create<UserLoginDataStore>()(
    persist(
        (set) => ({
            userLoginData: null,
            setUserLoginData: (userLoginData: UserProfile) => set({ userLoginData }),
            clearUserLoginData: () => set({ userLoginData: null }),
        }),
        {
            name: "user-login-data-storage",
            // By default, if you don't pass a custom storage engine, Zustand uses localStorage behind the scenes. This means your user profile will survive page refreshes automatically.
        }
    )
)