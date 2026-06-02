import { create, type ExtractState } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { createAuthSlice, type AuthSlice, type UserProfile } from './userLoginData'
import { createAppointmentsSlice, type AppointmentsSlice, type AppointmentStatus } from './appointments'
import { createPatientsSlice, type PatientsSlice } from './patients'

// ─── Full Bound Store Type ────────────────────────────────────────────────────

type BoundStore = AuthSlice & AppointmentsSlice & PatientsSlice

export type StoreState = ExtractState<typeof useBoundStore>

// ─── Single Bounded Store ─────────────────────────────────────────────────────

export const useBoundStore = create<BoundStore>()(
    persist(
        (...a) => ({
            ...createAuthSlice(...a),
            ...createAppointmentsSlice(...a),
            ...createPatientsSlice(...a),
        }),
        {
            name: 'docstetho-store',
        }
    )
)

// Subscribe to store changes to reset user-specific data on logout
let previousUser = useBoundStore.getState().userLoginData
useBoundStore.subscribe((state) => {
    const currentUser = state.userLoginData
    const wasLoggedIn = previousUser && !currentUser
    previousUser = currentUser
    if (wasLoggedIn) {
        state.resetAppointmentStatuses()
        state.resetPriorityPatients()
    }
})



// ─── Re-export types ──────────────────────────────────────────────────────────

export type { UserProfile, AppointmentStatus }

// ─── Named Selector Hooks (drop-in replacements for old per-file hooks) ───────

/** Auth – replaces useUserLoginData() */
export const useUserLoginData = () =>
    useBoundStore(
        useShallow((state: StoreState) => ({
            userLoginData: state.userLoginData,
            setUserLoginData: state.setUserLoginData,
            clearUserLoginData: state.clearUserLoginData,
        }))
    )

/** Appointments – replaces useAppointmentsStore() */
export const useAppointmentsStore = () =>
    useBoundStore(
        useShallow((state: StoreState) => ({
            appointmentStatuses: state.appointmentStatuses,
            setAppointmentStatus: state.setAppointmentStatus,
            resetAppointmentStatuses: state.resetAppointmentStatuses,
        }))
    )

/** Patients – replaces usePatientsStore() */
export const usePatientsStore = () =>
    useBoundStore(useShallow((state: StoreState) => ({
        priorityPatients: state.priorityPatients,
        togglePriority: state.togglePriority,
        resetPriorityPatients: state.resetPriorityPatients,
    })))
