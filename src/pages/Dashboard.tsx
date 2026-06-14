import { useState, useEffect } from 'react'
import { type UserProfile, type Patient } from '../types/types'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import DashboardTab from '../components/DashboardTab'
import PatientsTab from '../components/PatientsTab'
import AppointmentsTab from '../components/AppointmentsTab'
import AnalyticsTab from '../components/AnalyticsTab'
import SettingsTab from '../components/SettingsTab'
import { useAppointmentsStore, usePatientsStore, useSettingsStore } from '../store'

interface DashboardProps {
  user: UserProfile
  onLogout: () => void
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')

  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const { appointmentStatuses, setAppointmentStatus } = useAppointmentsStore()
  const todayCount = Math.min(18, patients.length)
  const todayAppointments = patients.slice(0, todayCount)
  const attendedCount = todayAppointments.filter(p => appointmentStatuses[p.id] === 'attended').length
  const rejectedCount = todayAppointments.filter(p => appointmentStatuses[p.id] === 'rejected').length
  const pendingCount = todayAppointments.filter(p => !appointmentStatuses[p.id] || appointmentStatuses[p.id] === 'pending').length

  const [selectedApptId, setSelectedApptId] = useState<string | null>(null)
  const { priorityPatients } = usePatientsStore()
  const {
    emailNotifications,
    criticalAlerts,
    offlineMode,
    setEmailNotifications,
    setCriticalAlerts,
    setOfflineMode
  } = useSettingsStore()

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null)

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])


  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [priorityFilter, setPriorityFilter] = useState<string>('All')
  const [genderFilter, setGenderFilter] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('default')
  const [patientPictures, setPatientPictures] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('docstetho_patient_avatars')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const handlePictureChange = (patientId: string, base64: string) => {
    const updated = { ...patientPictures, [patientId]: base64 }
    setPatientPictures(updated)
    try {
      localStorage.setItem('docstetho_patient_avatars', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient)
    setActiveTab('Patients')
  }

  useEffect(() => {
    const controller = new AbortController();

    const fetchPatients = async () => {
      // 1. If offlineMode is enabled, try loading from cache first
      const cached = localStorage.getItem('docstetho_cached_patients')
      if (offlineMode && cached) {
        try {
          const parsed = JSON.parse(cached)
          setPatients(parsed)
          setLoading(false)
          return
        } catch {
          // ignore cache error and fetch
        }
      }

      try {
        const response = await fetch('/mockdatabase/patient_data.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch patient data');

        const data = await response.json();
        setPatients(data);
        // Cache the patient database
        localStorage.setItem('docstetho_cached_patients', JSON.stringify(data))
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          // Fallback to cache if request fails
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              setPatients(parsed)
              setToast({ message: "Network offline: Loaded from cache.", type: "info" })
              return
            } catch {
              // ignore
            }
          }
          setError(err.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();

    return () => controller.abort();
  }, [offlineMode]);

  // Filter & Sort patient list
  const filteredPatients = (() => {
    // 1. Search filter
    let result = patients.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 2. Status filter
    if (statusFilter !== 'All') {
      result = result.filter(p => p.status === statusFilter)
    }

    // 3. Priority filter
    if (priorityFilter === 'Priority') {
      result = result.filter(p => priorityPatients[p.id])
    }

    // 4. Gender filter
    if (genderFilter !== 'All') {
      result = result.filter(p => p.gender === genderFilter)
    }

    // 5. Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name)
      }
      if (sortBy === 'age-asc') {
        return a.age - b.age
      }
      if (sortBy === 'age-desc') {
        return b.age - a.age
      }
      if (sortBy === 'heart-desc') {
        return b.vitals.heartRate - a.vitals.heartRate
      }
      // Default/fallback (by ID)
      return a.id.localeCompare(b.id)
    })

    return result
  })()

  return (
    <div className="h-screen bg-[#EDF3F8] text-[#1B2D5E] flex font-['Inter',system-ui,sans-serif] w-full">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0 scrollbar-hide">
        <Header
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          patientsList={patients}
          onPatientClick={handlePatientClick}
          offlineMode={offlineMode}
          activeTab={activeTab}
        />

        {/* Dashboard Grid Content */}
        <main className="flex-1 p-8 flex flex-col gap-8">
          {activeTab === 'Dashboard' && (
            <DashboardTab
              loading={loading}
              error={error}
              patients={patients}
              attendedCount={attendedCount}
              rejectedCount={rejectedCount}
              pendingCount={pendingCount}
              todayCount={todayCount}
              appointmentStatuses={appointmentStatuses}
              patientPictures={patientPictures}
              setActiveTab={setActiveTab}
              setSelectedApptId={setSelectedApptId}
              handlePatientClick={handlePatientClick}
            />
          )}

          {activeTab === 'Patients' && (
            <PatientsTab
              selectedPatient={selectedPatient}
              setSelectedPatient={setSelectedPatient}
              loading={loading}
              error={error}
              filteredPatients={filteredPatients}
              handlePatientClick={handlePatientClick}
              patientPictures={patientPictures}
              handlePictureChange={handlePictureChange}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )}

          {activeTab === 'Appointments' && (
            <AppointmentsTab
              loading={loading}
              patients={patients}
              todayCount={todayCount}
              attendedCount={attendedCount}
              rejectedCount={rejectedCount}
              pendingCount={pendingCount}
              appointmentStatuses={appointmentStatuses}
              selectedApptId={selectedApptId}
              setSelectedApptId={setSelectedApptId}
              setAppointmentStatus={setAppointmentStatus}
            />
          )}

          {activeTab === 'Analytics' && (
            <AnalyticsTab
              loading={loading}
              patients={patients}
              handlePatientClick={handlePatientClick}
              patientPictures={patientPictures}
            />
          )}

          {activeTab === 'Settings' && (
            <SettingsTab
              emailNotifications={emailNotifications}
              setEmailNotifications={setEmailNotifications}
              criticalAlerts={criticalAlerts}
              setCriticalAlerts={setCriticalAlerts}
              offlineMode={offlineMode}
              setOfflineMode={setOfflineMode}
              user={user}
              setToast={setToast}
            />
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(27,45,94,0.08)] px-5 py-3 rounded-2xl flex items-center gap-3 z-50 animate-[slideUp_0.18s_ease_both] border-[#1A7A8A]/20">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-[#1A7A8A]'}`} />
          <span className="text-[13px] font-bold text-[#1B2D5E]">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default Dashboard
