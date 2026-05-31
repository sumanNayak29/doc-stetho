import { type StateCreator } from 'zustand'

export type AppointmentStatus = 'pending' | 'attended' | 'rejected'

export interface AppointmentsSlice {
    appointmentStatuses: Record<string, AppointmentStatus>
    setAppointmentStatus: (id: string, status: 'attended' | 'rejected') => void
    resetAppointmentStatuses: () => void
}

export const createAppointmentsSlice: StateCreator<AppointmentsSlice, [], [], AppointmentsSlice> = (set) => ({
    appointmentStatuses: {},
    setAppointmentStatus: (id, status) =>
        set((state) => ({
            appointmentStatuses: {
                ...state.appointmentStatuses,
                [id]: status,
            },
        })),
    resetAppointmentStatuses: () => set({ appointmentStatuses: {} }),
})
