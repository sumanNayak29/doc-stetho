import { type StateCreator } from 'zustand'

export interface PatientsSlice {
    priorityPatients: Record<string, boolean>
    togglePriority: (id: string) => void
    resetPriorityPatients: () => void
}

export const createPatientsSlice: StateCreator<PatientsSlice, [], [], PatientsSlice> = (set) => ({
    priorityPatients: {},
    togglePriority: (id) =>
        set((state) => ({
            priorityPatients: {
                ...state.priorityPatients,
                [id]: !state.priorityPatients[id],
            },
        })),
    resetPriorityPatients: () => set({ priorityPatients: {} }),
})
