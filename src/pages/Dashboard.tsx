import { useState, useEffect } from 'react'
import UsersGroupIcon from '../assets/icons/UsersGroupIcon'
import AlertTriangleIcon from '../assets/icons/AlertTriangleIcon'
import ShieldCheckIcon from '../assets/icons/ShieldCheckIcon'

import { type UserProfile, type Patient } from '../types/types'
import AdmissionsCanvasChart from '../components/AdmissionsCanvasChart'
import ConditionsCanvasChart from '../components/ConditionsCanvasChart'
import DiseaseDoughnutChart from '../components/DiseaseDoughnutChart'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import PatientTable from '../components/PatientTable'
import PatientDetailsPane from '../components/PatientDetailsPane'
import PriorityWatchlist from '../components/PriorityWatchlist'
import { useAppointmentsStore, usePatientsStore, useSettingsStore } from '../store'
import StatusIndicator from '../components/StatusIndicator'

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
            <>
              {/* Stats Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Patients', value: loading ? '...' : patients.length.toLocaleString(), change: loading ? '...' : 'Live database count', isPos: true, icon: <UsersGroupIcon className="w-6 h-6 text-[#1A7A8A]" />, color: 'from-[#1A7A8A]/10 to-[#1A7A8A]/5', onClick: () => setActiveTab('Patients') },
                  {
                    title: 'Today Appointments',
                    value: loading ? '...' : Math.min(18, patients.length).toString(),
                    change: loading ? '...' : `${attendedCount} attended · ${rejectedCount} rejected`,
                    isPos: true,
                    customVisual: (
                      <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <span className="absolute text-[10px] font-black text-[#1B2D5E] z-10">
                          {attendedCount + rejectedCount}
                        </span>
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            stroke="#E2E8F0"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          {attendedCount > 0 && todayCount > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              stroke="#10B981"
                              strokeWidth="10"
                              fill="transparent"
                              strokeDasharray={`${(attendedCount / todayCount) * 238.76} 238.76`}
                              strokeDashoffset="0"
                              strokeLinecap="round"
                            />
                          )}
                          {rejectedCount > 0 && todayCount > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              stroke="#EF4444"
                              strokeWidth="10"
                              fill="transparent"
                              strokeDasharray={`${(rejectedCount / todayCount) * 238.76} 238.76`}
                              strokeDashoffset={`${-((attendedCount / todayCount) * 238.76)}`}
                              strokeLinecap="round"
                            />
                          )}
                          {pendingCount > 0 && todayCount > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              stroke="#1A7A8A"
                              strokeWidth="10"
                              fill="transparent"
                              strokeDasharray={`${(pendingCount / todayCount) * 238.76} 238.76`}
                              strokeDashoffset={`${-(((attendedCount + rejectedCount) / todayCount) * 238.76)}`}
                              strokeLinecap="round"
                            />
                          )}
                        </svg>
                      </div>
                    ),
                    color: 'from-[#4DBFBF]/10 to-[#4DBFBF]/5',
                    onClick: () => setActiveTab('Appointments')
                  },
                  { title: 'Critical Cases', value: loading ? '...' : patients.filter(p => p.status === 'Critical').length.toString(), change: loading ? '...' : 'Urgent attention', isPos: false, icon: <AlertTriangleIcon className="w-6 h-6 text-red-500 animate-pulse" />, color: 'from-red-500/10 to-red-500/5' },
                  { title: 'System Status', value: '99.9%', change: 'All nodes healthy', isPos: true, icon: <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />, color: 'from-emerald-500/10 to-emerald-500/5' }
                ].map(stat => (
                  <div
                    key={stat.title}
                    onClick={stat.onClick}
                    className={`bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 flex items-center justify-between shadow-[0_4px_24px_rgba(27,45,94,0.02)] transition-all duration-300 ${stat.onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(27,45,94,0.06)] hover:border-[#4DBFBF]/30' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[13px] text-gray-500 font-semibold mb-1.5 uppercase tracking-wide">{stat.title}</span>
                      <span className="text-[26px] font-extrabold text-[#1B2D5E] tracking-tight leading-none mb-2">{stat.value}</span>
                      <span className={`text-[12.5px] font-bold ${stat.isPos ? (stat.title.includes('Appointments') ? 'text-[#1A7A8A]' : 'text-emerald-500') : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                    {stat.customVisual ? (
                      stat.customVisual
                    ) : (
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                    )}
                  </div>
                ))}
              </section>

              {/* Table and Right Sidebar Panels */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Left Column (Weekly Admissions Trend & Disease Distribution) */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                  {/* Weekly Admissions Trend Chart */}
                  <div className="w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-4 animate-[cardIn_0.3s_ease_both]">
                    <div>
                      <h3 className="text-[18px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Admissions Trend</h3>
                      <p className="text-[13px] text-gray-400 font-medium">Bi-weekly statistics of new patient check-ins</p>
                    </div>
                    <div className="relative bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                      <AdmissionsCanvasChart />
                    </div>
                  </div>
                  {/* Priority Watchlist Panel */}
                  {!loading && (
                    <PriorityWatchlist
                      patientsList={patients}
                      onPatientClick={handlePatientClick}
                      patientPictures={patientPictures}
                    />
                  )}
                </div>

                {/* Right Column (Today's Schedule & Priority Watchlist) */}
                <div className="flex flex-col gap-8">
                  {/* Today Schedule Panel */}
                  <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
                    <div>
                      <h3 className="text-[18px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Today's Schedule</h3>
                      <p className="text-[13px] text-gray-400 font-medium">Your appointments for the day</p>
                    </div>

                    {/* Timeline list */}
                    <div className="flex flex-col gap-4">
                      {loading ? (
                        <div className="text-center py-6 text-sm text-[#1A7A8A] font-medium">Loading schedule...</div>
                      ) : error ? (
                        <div className="text-center py-6 text-sm text-red-500 font-medium">Error loading schedule</div>
                      ) : patients.length > 0 ? (
                        patients.slice(0, 5).map((appointment, idx) => {
                          const status = appointmentStatuses[appointment.id] || 'pending'

                          let dotColorClass = 'bg-[#1A7A8A]'
                          let cardBgClass = 'bg-gray-50/60 group-hover:bg-gray-50 border-gray-100'

                          if (status === 'attended') {
                            dotColorClass = 'bg-emerald-500'
                            cardBgClass = 'bg-emerald-50/20 border-emerald-100 group-hover:bg-emerald-50/30'
                          } else if (status === 'rejected') {
                            dotColorClass = 'bg-red-400'
                            cardBgClass = 'bg-red-50/10 border-red-100 opacity-60 group-hover:bg-red-50/15'
                          }

                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedApptId(appointment.id)
                                setActiveTab('Appointments')
                              }}
                              className="flex gap-4 items-start relative group cursor-pointer hover:translate-x-1 transition-all duration-200"
                            >
                              {/* Time Column */}
                              <div className="w-[72px] shrink-0 text-right">
                                <span className="text-[13px] font-bold text-[#1B2D5E]">{appointment.time}</span>
                                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">EST</p>
                              </div>

                              {/* Timeline line/dot */}
                              <div className="flex flex-col items-center h-full">
                                <div className={`w-3.5 h-3.5 rounded-full border-[3px] border-[#EDF3F8] ${dotColorClass} shadow-sm z-10`} />
                                {idx !== 3 && <div className="w-0.5 bg-gray-200 flex-1 my-1 absolute top-4 bottom-[-16px] left-[88px]" />}
                              </div>

                              {/* Details Box */}
                              <div className={`flex-1 border rounded-xl p-3.5 transition-all duration-150 ${cardBgClass}`}>
                                <h4 className="text-[13.5px] font-bold text-[#1B2D5E] mb-0.5 leading-snug">{appointment.name}</h4>
                                <p className="text-[12.5px] text-gray-500 font-medium mb-2">{appointment.condition}</p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center text-[10px] font-bold text-[#1A7A8A] bg-[#1A7A8A]/10 px-2 py-0.5 rounded-md">
                                    Room {100 + idx * 2}
                                  </span>
                                  {status === 'attended' && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                      Attended
                                    </span>
                                  )}
                                  {status === 'rejected' && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
                                      Rejected
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-6 text-sm text-gray-400 font-medium">No appointments scheduled</div>
                      )}
                    </div>
                  </div>


                </div>
              </div>

              {/* Disease breakdown doughnut chart and matching patient list */}
              {!loading && (
                <DiseaseDoughnutChart
                  patientsList={patients}
                  onPatientClick={handlePatientClick}
                  patientPictures={patientPictures}
                />
              )}
            </>
          )}

          {activeTab === 'Patients' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
              {/* Left Column: Patient List Directory */}
              <div className={`${selectedPatient ? 'xl:col-span-7' : 'xl:col-span-12'} bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6 transition-all duration-300 w-full`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Patient Directory</h3>
                    <p className="text-[13px] text-gray-400 font-medium">Viewing all patient records in the database</p>
                  </div>
                </div>

                {/* Filter & Sort Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100/80">
                  {/* Status Filter */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-[#1B2D5E] focus:outline-none focus:border-[#1A7A8A]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Stable">Stable</option>
                      <option value="Critical">Critical</option>
                      <option value="Recovering">Recovering</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Priority</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-[#1B2D5E] focus:outline-none focus:border-[#1A7A8A]"
                    >
                      <option value="All">All Patients</option>
                      <option value="Priority">Priority Only</option>
                    </select>
                  </div>

                  {/* Gender Filter */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Gender</label>
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-[#1B2D5E] focus:outline-none focus:border-[#1A7A8A]"
                    >
                      <option value="All">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-[#1B2D5E] uppercase tracking-wider">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-[#1B2D5E] focus:outline-none focus:border-[#1A7A8A]"
                    >
                      <option value="default">Default (ID)</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="age-asc">Age (Youngest first)</option>
                      <option value="age-desc">Age (Oldest first)</option>
                      <option value="heart-desc">Heart Rate (High to Low)</option>
                    </select>
                  </div>
                </div>

                {/* Patient Table */}
                <div className="overflow-y-auto overflow-x-auto max-h-[650px] pr-1.5 custom-scrollbar">
                  <PatientTable
                    loading={loading}
                    error={error}
                    filteredPatients={filteredPatients}
                    selectedPatientId={selectedPatient?.id}
                    handlePatientClick={handlePatientClick}
                    patientPictures={patientPictures}
                  />
                </div>
              </div>

              {/* Right Column: Selected Patient Details (Full info, Custom Pic, Vitals Chart) */}
              {selectedPatient && (
                <div className="xl:col-span-5 w-full sticky top-0 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide rounded-2xl">
                  <PatientDetailsPane
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    patientPictures={patientPictures}
                    onAvatarChange={handlePictureChange}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'Appointments' && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Appointments Schedule</h3>
                <p className="text-[13px] text-gray-400 font-medium">Click on any schedule to attend or reject the appointment</p>
              </div>

              {/* Doughnut Chart Stats */}
              {!loading && patients.length > 0 && todayCount > 0 && (
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-around gap-6 animate-[logoGrow_0.4s_ease-out] max-w-xl mx-auto w-full">
                  {/* SVG Doughnut */}
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-[#1B2D5E] leading-none">
                        {todayCount > 0 ? Math.round(((attendedCount + rejectedCount) / todayCount) * 100) : 0}%
                      </span>
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide mt-1.5">Processed</span>
                    </div>
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#E2E8F0"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      {attendedCount > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#10B981"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={`${(attendedCount / todayCount) * 238.76} 238.76`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-out"
                        />
                      )}
                      {rejectedCount > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#EF4444"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={`${(rejectedCount / todayCount) * 238.76} 238.76`}
                          strokeDashoffset={`${-((attendedCount / todayCount) * 238.76)}`}
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-out"
                        />
                      )}
                      {pendingCount > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#1A7A8A"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={`${(pendingCount / todayCount) * 238.76} 238.76`}
                          strokeDashoffset={`${-(((attendedCount + rejectedCount) / todayCount) * 238.76)}`}
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-out"
                        />
                      )}
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 group">
                      <span className="w-3 h-3 rounded-full bg-[#10B981] group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-extrabold text-[#1B2D5E] leading-none mb-0.5">Attended</span>
                        <span className="text-[11.5px] text-gray-400 font-semibold">{attendedCount} patient{attendedCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444] group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-extrabold text-[#1B2D5E] leading-none mb-0.5">Rejected</span>
                        <span className="text-[11.5px] text-gray-400 font-semibold">{rejectedCount} patient{rejectedCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <span className="w-3 h-3 rounded-full bg-[#1A7A8A] group-hover:scale-110 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-extrabold text-[#1B2D5E] leading-none mb-0.5">Pending</span>
                        <span className="text-[11.5px] text-gray-400 font-semibold">{pendingCount} patient{pendingCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {patients.slice(0, 10).map((appointment, idx) => {
                  const status = appointmentStatuses[appointment.id] || 'pending'
                  const isSelected = selectedApptId === appointment.id

                  let cardBorderClass = 'border-gray-100'
                  let cardBgClass = 'bg-gray-50/50 hover:bg-gray-50'
                  if (status === 'attended') {
                    cardBorderClass = 'border-emerald-200'
                    cardBgClass = 'bg-emerald-50/20'
                  } else if (status === 'rejected') {
                    cardBorderClass = 'border-red-200'
                    cardBgClass = 'bg-red-50/20 opacity-75'
                  } else if (isSelected) {
                    cardBorderClass = 'border-[#1A7A8A]/50 ring-2 ring-[#1A7A8A]/10'
                  }

                  return (
                    <div
                      key={appointment.id}
                      onClick={() => {
                        if (status === 'pending') {
                          setSelectedApptId(isSelected ? null : appointment.id)
                        }
                      }}
                      className={`flex flex-col border rounded-2xl p-5 transition-all duration-300 relative cursor-pointer ${cardBorderClass} ${cardBgClass}`}
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-[80px] shrink-0 text-center border-r border-gray-200/80 pr-4">
                          <span className="text-[14.5px] font-extrabold text-[#1B2D5E]">{appointment.time}</span>
                          <p className="text-[9px] text-[#1A7A8A] font-extrabold uppercase mt-0.5">Room {100 + idx * 2}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[15px] font-extrabold text-[#1B2D5E] truncate">{appointment.name}</h4>
                          <p className="text-[13px] text-gray-500 font-medium mb-1 truncate">{appointment.condition}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${appointment.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {appointment.status === 'Critical' && (
                                <StatusIndicator color="red" size="sm" pulse={true} className="mr-0.5" />
                              )}
                              {appointment.status}
                            </span>
                            {status === 'attended' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 animate-[slideUp_0.2s_ease_both]">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Attended
                              </span>
                            )}
                            {status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-700 animate-[slideUp_0.2s_ease_both]">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Rejected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Action Panel */}
                      {isSelected && status === 'pending' && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 animate-[slideUp_0.2s_ease_both]">
                          <span className="text-[12px] text-gray-500 font-bold">Action:</span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setAppointmentStatus(appointment.id, 'attended')
                                setSelectedApptId(null)
                              }}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
                            >
                              Attend
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setAppointmentStatus(appointment.id, 'rejected')
                                setSelectedApptId(null)
                              }}
                              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Display attended text */}
                      {status === 'attended' && (
                        <div className="mt-3 pt-3 border-t border-emerald-100/50 text-[12px] text-emerald-700 font-semibold flex items-center gap-1.5 animate-[slideUp_0.2s_ease_both]">
                          <StatusIndicator color="emerald" size="sm" pulse={true} />
                          I attended this appointment
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Analytics Dashboard</h3>
                <p className="text-[13px] text-gray-400 font-medium">Performance metrics and patient statistics</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between h-40">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Patient Recovery Rate</span>
                  <span className="text-4xl font-extrabold text-[#1B2D5E]">84.2%</span>
                  <span className="text-xs text-emerald-500 font-bold">↑ 2.5% from last week</span>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between h-40">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Avg Consultation Time</span>
                  <span className="text-4xl font-extrabold text-[#1B2D5E]">18 min</span>
                  <span className="text-xs text-gray-400 font-medium">Within target range (15-20 min)</span>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between h-40">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Satisfaction Score</span>
                  <span className="text-4xl font-extrabold text-[#1B2D5E]">4.9 / 5.0</span>
                  <span className="text-xs text-[#1A7A8A] font-bold">Based on 320 feedback entries</span>
                </div>
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-4">
                  <div>
                    <h4 className="text-[16px] font-bold text-[#1B2D5E] mb-1">Admissions Trend</h4>
                    <p className="text-xs text-gray-400 font-medium">Bi-weekly statistics of new patient check-ins</p>
                  </div>
                  <div className="relative bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                    <AdmissionsCanvasChart />
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-4">
                  <div>
                    <h4 className="text-[16px] font-bold text-[#1B2D5E] mb-1">Top Patient Conditions</h4>
                    <p className="text-xs text-gray-400 font-medium">Distribution breakdown based on active medical records</p>
                  </div>
                  <div className="relative bg-gray-50/50 rounded-xl border border-gray-100 p-4 flex flex-col justify-center flex-1">
                    <ConditionsCanvasChart patientsList={patients} />
                  </div>
                </div>
              </div>

              {/* Disease breakdown doughnut chart and matching patient list */}
              {!loading && (
                <DiseaseDoughnutChart
                  patientsList={patients}
                  onPatientClick={handlePatientClick}
                  patientPictures={patientPictures}
                />
              )}
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Account & Settings</h3>
                <p className="text-[13px] text-gray-400 font-medium">Manage your profile, hospital preferences, and security settings</p>
              </div>
              <div className="divide-y divide-gray-100 max-w-xl">
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-[#1B2D5E]">Email Notifications</span>
                    <p className="text-xs text-gray-400 font-medium">Receive daily schedule summaries via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => {
                      setEmailNotifications(e.target.checked)
                      setToast({
                        message: e.target.checked
                          ? `Email notifications enabled for ${user.email}`
                          : "Email notifications disabled",
                        type: "success"
                      })
                    }}
                    className="accent-[#1A7A8A] h-5 w-5 rounded cursor-pointer"
                  />
                </div>
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-[#1B2D5E]">Critical Alerts</span>
                    <p className="text-xs text-gray-400 font-medium">Show alert when a patient vital is critical</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={criticalAlerts}
                    onChange={(e) => {
                      setCriticalAlerts(e.target.checked)
                      setToast({
                        message: e.target.checked ? "Critical alerts enabled" : "Critical alerts disabled",
                        type: "success"
                      })
                    }}
                    className="accent-[#1A7A8A] h-5 w-5 rounded cursor-pointer"
                  />
                </div>
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-[#1B2D5E]">Offline Mode</span>
                    <p className="text-xs text-gray-400 font-medium">Keep database cached for offline view</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={offlineMode}
                    onChange={(e) => {
                      setOfflineMode(e.target.checked)
                      setToast({
                        message: e.target.checked
                          ? "Offline mode enabled: Database cached"
                          : "Offline mode disabled",
                        type: "success"
                      })
                    }}
                    className="accent-[#1A7A8A] h-5 w-5 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
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
