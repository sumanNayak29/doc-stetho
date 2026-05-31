import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppointmentsStore {
  appointmentStatuses: Record<string, 'pending' | 'attended' | 'rejected'>
  setAppointmentStatus: (id: string, status: 'attended' | 'rejected') => void
  resetAppointmentStatuses: () => void
}

export const useAppointmentsStore = create<AppointmentsStore>()(
  persist(
    (set) => ({
      appointmentStatuses: {},
      setAppointmentStatus: (id: string, status: 'attended' | 'rejected') =>
        set((state) => ({
          appointmentStatuses: {
            ...state.appointmentStatuses,
            [id]: status
          }
        })),
      resetAppointmentStatuses: () => set({ appointmentStatuses: {} }),
    }),
    {
      name: "docstetho-appointments-storage",
    }
  )
)
