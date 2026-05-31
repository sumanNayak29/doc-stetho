import { useState, useEffect } from 'react'
import CalendarIcon from './assets/icons/CalendarIcon'
import UsersGroupIcon from './assets/icons/UsersGroupIcon'
import AlertTriangleIcon from './assets/icons/AlertTriangleIcon'
import ShieldCheckIcon from './assets/icons/ShieldCheckIcon'

import { type UserProfile, type Patient } from './types'
import AdmissionsCanvasChart from './components/AdmissionsCanvasChart'
import ConditionsCanvasChart from './components/ConditionsCanvasChart'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import PatientTable from './components/PatientTable'
import PatientDetailsPane from './components/PatientDetailsPane'
import { useAppointmentsStore } from '../store/appointments'

interface DashboardProps {
  user: UserProfile
  onLogout: () => void
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [searchQuery, setSearchQuery] = useState('')

  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [chartType, setChartType] = useState<'heartRate' | 'temp'>('heartRate')
  const { appointmentStatuses, setAppointmentStatus } = useAppointmentsStore()
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null)
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
      try {
        const response = await fetch('/mockdatabase/patient_data.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to fetch patient data');

        const data = await response.json();
        setPatients(data);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();

    return () => controller.abort();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#EDF3F8] text-[#1B2D5E] flex font-['Inter',system-ui,sans-serif] w-full">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Header Bar */}
        <Header user={user} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Dashboard Grid Content */}
        <main className="flex-1 p-8 flex flex-col gap-8">
          {activeTab === 'Overview' && (
            <>
              {/* Stats Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Patients', value: loading ? '...' : patients.length.toLocaleString(), change: loading ? '...' : 'Live database count', isPos: true, icon: <UsersGroupIcon className="w-6 h-6 text-[#1A7A8A]" />, color: 'from-[#1A7A8A]/10 to-[#1A7A8A]/5', onClick: () => setActiveTab('Patients') },
                  { title: 'Today Appointments', value: loading ? '...' : Math.min(18, patients.length).toString(), change: loading ? '...' : 'Derived from schedule', isPos: true, icon: <CalendarIcon className="w-6 h-6 text-[#4DBFBF]" strokeWidth={2.5} />, color: 'from-[#4DBFBF]/10 to-[#4DBFBF]/5', onClick: () => setActiveTab('Appointments') },
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
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </section>

              {/* Table and Right Sidebar Panels */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Weekly Admissions Trend Chart (Left Side) */}
                <div className="xl:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-4 animate-[cardIn_0.3s_ease_both]">
                  <div>
                    <h3 className="text-[18px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Weekly Admissions Trend</h3>
                    <p className="text-[13px] text-gray-400 font-medium">Daily statistics of new patient check-ins</p>
                  </div>
                  <div className="relative bg-gray-50/50 rounded-xl border border-gray-100 p-4">
                    <AdmissionsCanvasChart />
                  </div>
                </div>

                {/* Today Schedule Panel (Right) */}
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
                      patients.slice(0, 4).map((appointment, idx) => (
                        <div key={idx} className="flex gap-4 items-start relative group">
                          {/* Time Column */}
                          <div className="w-[72px] shrink-0 text-right">
                            <span className="text-[13px] font-bold text-[#1B2D5E]">{appointment.time}</span>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">EST</p>
                          </div>

                          {/* Timeline line/dot */}
                          <div className="flex flex-col items-center h-full">
                            <div className="w-3.5 h-3.5 rounded-full border-[3px] border-[#EDF3F8] bg-[#1A7A8A] shadow-sm z-10" />
                            {idx !== 3 && <div className="w-0.5 bg-gray-200 flex-1 my-1 absolute top-4 bottom-[-16px] left-[88px]" />}
                          </div>

                          {/* Details Box */}
                          <div className="flex-1 bg-gray-50/60 group-hover:bg-gray-50 group-hover:shadow-[0_2px_12px_rgba(27,45,94,0.02)] border border-gray-100 rounded-xl p-3.5 transition-all duration-150">
                            <h4 className="text-[13.5px] font-bold text-[#1B2D5E] mb-0.5 leading-snug">{appointment.name}</h4>
                            <p className="text-[12.5px] text-gray-500 font-medium mb-2">{appointment.condition}</p>
                            <span className="inline-flex items-center text-[10px] font-bold text-[#1A7A8A] bg-[#1A7A8A]/10 px-2 py-0.5 rounded-md">
                              Room {100 + idx * 2}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-sm text-gray-400 font-medium">No appointments scheduled</div>
                    )}
                  </div>
                </div>
              </div>
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

                {/* Patient Table */}
                <div className="overflow-x-auto">
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
                <div className="xl:col-span-5 w-full">
                  <PatientDetailsPane
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    patientPictures={patientPictures}
                    onAvatarChange={handlePictureChange}
                    chartType={chartType}
                    setChartType={setChartType}
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
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${appointment.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
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
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
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
                    <h4 className="text-[16px] font-bold text-[#1B2D5E] mb-1">Weekly Admissions Trend</h4>
                    <p className="text-xs text-gray-400 font-medium">Daily statistics of new patient check-ins</p>
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
                  <input type="checkbox" defaultChecked className="accent-[#1A7A8A]" />
                </div>
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-[#1B2D5E]">Critical Alerts</span>
                    <p className="text-xs text-gray-400 font-medium">Sound alert when a patient vital is critical</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#1A7A8A]" />
                </div>
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-[#1B2D5E]">Offline Mode</span>
                    <p className="text-xs text-gray-400 font-medium">Keep database cached for offline view</p>
                  </div>
                  <input type="checkbox" className="accent-[#1A7A8A]" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
