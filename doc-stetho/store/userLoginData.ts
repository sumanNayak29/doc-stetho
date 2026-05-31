import { type StateCreator } from 'zustand'

export interface UserProfile {
    name: string
    email: string
    picture?: string
}

const initialState: { userLoginData: UserProfile | null } = {
    userLoginData: null
}

export type AuthSlice = typeof initialState & {
    setUserLoginData: (profile: UserProfile) => void
    clearUserLoginData: () => void
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
    ...initialState,
    setUserLoginData: (profile) => set({ userLoginData: profile }),
    clearUserLoginData: () => set({ userLoginData: null }),
})
