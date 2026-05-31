import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PatientsStore {
  priorityPatients: Record<string, boolean>
  togglePriority: (id: string) => void
  resetPriorityPatients: () => void
}

export const usePatientsStore = create<PatientsStore>()(
  persist(
    (set) => ({
      priorityPatients: {},
      togglePriority: (id: string) =>
        set((state) => ({
          priorityPatients: {
            ...state.priorityPatients,
            [id]: !state.priorityPatients[id]
          }
        })),
      resetPriorityPatients: () => set({ priorityPatients: {} })
    }),
    {
      name: "docstetho-patients-storage"
    }
  )
)
