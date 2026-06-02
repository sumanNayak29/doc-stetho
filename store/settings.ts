import { type StateCreator } from 'zustand'

export interface SettingsSlice {
    emailNotifications: boolean
    criticalAlerts: boolean
    offlineMode: boolean
    setEmailNotifications: (val: boolean) => void
    setCriticalAlerts: (val: boolean) => void
    setOfflineMode: (val: boolean) => void
    resetSettings: () => void
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
    emailNotifications: true,
    criticalAlerts: true,
    offlineMode: false,
    setEmailNotifications: (val) => set({ emailNotifications: val }),
    setCriticalAlerts: (val) => set({ criticalAlerts: val }),
    setOfflineMode: (val) => set({ offlineMode: val }),
    resetSettings: () => set({ emailNotifications: true, criticalAlerts: true, offlineMode: false }),
})
