import { useState, useEffect } from 'react'
import DocStethoIcon from './assets/icons/DocStethoIcon'
import GridIcon from './assets/icons/GridIcon'
import PatientsIcon from './assets/icons/PatientsIcon'
import CalendarIcon from './assets/icons/CalendarIcon'
import BarChartIcon from './assets/icons/BarChartIcon'
import SettingsIcon from './assets/icons/SettingsIcon'
import SignOutIcon from './assets/icons/SignOutIcon'
import SearchIcon from './assets/icons/SearchIcon'
import BellIcon from './assets/icons/BellIcon'
import UsersGroupIcon from './assets/icons/UsersGroupIcon'
import AlertTriangleIcon from './assets/icons/AlertTriangleIcon'
import ShieldCheckIcon from './assets/icons/ShieldCheckIcon'
import SpinnerIcon from './assets/icons/SpinnerIcon'
import HeartIcon from './assets/icons/HeartIcon'
import BoltIcon from './assets/icons/BoltIcon'
import TempIcon from './assets/icons/TempIcon'


interface UserProfile {
  name: string
  email: string
  picture?: string
}

interface DashboardProps {
  user: UserProfile
  onLogout: () => void
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  vitals: {
    heartRate: number
    bloodPressure: string
    temp: number
  }
  status: 'Stable' | 'Critical' | 'Recovering'
  time: string
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [searchQuery, setSearchQuery] = useState('')

  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        // finally always runs, ensuring loading state is turned off
        setLoading(false);

      }
    };

    fetchPatients();

    return () => controller.abort();
  }, []);

  // Filter patients based on search
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get initials for profile fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const renderPatientTable = () => {
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="pb-3 text-[12.5px] font-bold text-gray-400 uppercase tracking-wider">Patient ID / Name</th>
            <th className="pb-3 text-[12.5px] font-bold text-gray-400 uppercase tracking-wider">Condition</th>
            <th className="pb-3 text-[12.5px] font-bold text-gray-400 uppercase tracking-wider">Vitals</th>
            <th className="pb-3 text-[12.5px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
            <th className="pb-3 text-[12.5px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-[#1A7A8A] font-medium">
                <div className="flex items-center justify-center gap-2">
                  <SpinnerIcon className="animate-spin h-5 w-5 text-[#1A7A8A]" />
                  <span>Loading patient records...</span>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-red-500 font-medium">
                Error loading patients: {error}
              </td>
            </tr>
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <tr key={patient.id} className="group hover:bg-gray-50/50 transition-colors duration-150">
                {/* ID & Name */}
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#1B2D5E] group-hover:text-[#1A7A8A] transition-colors">
                      {patient.name}
                    </span>
                    <span className="text-[11.5px] text-gray-400 font-medium">
                      {patient.id} • {patient.age} yrs • {patient.gender}
                    </span>
                  </div>
                </td>

                {/* Condition */}
                <td className="py-4">
                  <span className="text-[13.5px] font-semibold text-gray-600">{patient.condition}</span>
                </td>

                {/* Vitals */}
                <td className="py-4">
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1">
                      <HeartIcon className={`w-3.5 h-3.5 ${patient.vitals.heartRate > 100 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                      {patient.vitals.heartRate} bpm
                    </span>
                    <span className="flex items-center gap-1">
                      <BoltIcon className="w-3.5 h-3.5 text-blue-500" />
                      {patient.vitals.bloodPressure}
                    </span>
                    <span className="flex items-center gap-1">
                      <TempIcon className={`w-3.5 h-3.5 ${patient.vitals.temp > 100 ? 'text-red-500' : 'text-orange-500'}`} />
                      {patient.vitals.temp}°F
                    </span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${patient.status === 'Stable'
                    ? 'bg-emerald-100 text-emerald-700'
                    : patient.status === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-[#EDF3F8] text-[#1A7A8A]'
                    }`}>
                    {patient.status === 'Critical' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1 animate-ping" />}
                    {patient.status}
                  </span>
                </td>

                {/* Action Button */}
                <td className="py-4 text-right">
                  <button className="px-3.5 py-1.5 rounded-lg border border-gray-200 hover:border-[#1A7A8A] hover:bg-[#1A7A8A]/5 text-[12.5px] font-bold text-gray-500 hover:text-[#1A7A8A] transition-all duration-150 cursor-pointer">
                    Record
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-gray-400 font-medium">
                No patients found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )
  }

  return (
    <div className="min-h-screen bg-[#EDF3F8] text-[#1B2D5E] flex font-['Inter',system-ui,sans-serif] w-full">
      {/* Sidebar */}
      <aside className="w-[72px] hover:w-64 bg-[#1B2D5E] text-white flex flex-col justify-between shrink-0 shadow-xl z-10 transition-all duration-300 ease-in-out group">
        <div>
          {/* Logo */}
          <div className="p-4 group-hover:p-6 border-b border-white/10 flex items-center gap-3 transition-all duration-300 overflow-hidden">
            <div className="w-10 h-10 bg-white/10 rounded-xl p-1.5 border border-white/15 backdrop-blur-md shrink-0 flex items-center justify-center">
              <DocStethoIcon />
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white/60 font-light">doc</span>stetho
              </span>
              <p className="text-[8px] tracking-[1.5px] text-[#4DBFBF] font-semibold uppercase leading-none mt-0.5">PLATFORM</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 group-hover:p-4 flex flex-col gap-1.5 transition-all duration-300">
            {[
              { name: 'Overview', icon: <GridIcon /> },
              { name: 'Patients', icon: <PatientsIcon /> },
              { name: 'Appointments', icon: <CalendarIcon /> },
              { name: 'Analytics', icon: <BarChartIcon /> },
              { name: 'Settings', icon: <SettingsIcon /> }
            ].map(item => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3.5 px-3 group-hover:px-4 py-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 cursor-pointer ${activeTab === item.name
                  ? 'bg-[#1A7A8A] text-white shadow-md shadow-[#1A7A8A]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover:w-auto">
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer / User Info */}
        <div className="p-3 group-hover:p-4 border-t border-white/10 transition-all duration-300">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-2 px-3 group-hover:px-4 py-3 rounded-xl text-[14.5px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 border border-red-500/15 cursor-pointer"
          >
            <div className="w-5 h-5 shrink-0 flex items-center justify-center">
              <SignOutIcon />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden w-0 group-hover:w-auto">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
        {/* Header */}
        <header className="h-[76px] bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Welcome Text */}
          <div className="flex flex-col">
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#1B2D5E]">
              Welcome, Dr. {user.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Search and Action Bar */}
          <div className="flex items-center gap-6">
            {/* Search Box */}
            <div className="relative flex items-center hidden sm:flex">
              <span className="absolute left-3.5 text-gray-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search patient, diagnosis..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64 h-[40px] pl-10 pr-4 rounded-xl border border-gray-200 bg-[#EDF3F8]/50 text-sm text-[#1B2D5E] placeholder-gray-400 focus:outline-none focus:border-[#4DBFBF] focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Notification Icon */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100/80 hover:bg-gray-100 transition-colors cursor-pointer text-gray-600">
              <BellIcon />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1A7A8A] to-[#4DBFBF] text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-sm shadow-[#1A7A8A]/20">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex flex-col hidden lg:flex">
                <span className="text-[14px] font-bold text-[#1B2D5E] leading-none mb-1">{user.name}</span>
                <span className="text-[11px] text-gray-400 font-medium leading-none">{user.email}</span>
              </div>
            </div>
          </div>
        </header>

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
                {/* Patients Monitoring Card (Left) */}
                <div className="xl:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[18px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Active Patient Monitoring</h3>
                      <p className="text-[13px] text-gray-400 font-medium">Real-time update of current patient health metrics</p>
                    </div>
                    {/* Mobile search fallback */}
                    <div className="relative sm:hidden">
                      <span className="absolute left-3 text-gray-400 top-1/2 -translate-y-1/2">
                        <SearchIcon />
                      </span>
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-[36px] pl-9 pr-3 rounded-lg border border-gray-200 text-sm"
                      />
                    </div>
                  </div>

                  {/* Patient Table */}
                  <div className="overflow-x-auto">
                    {renderPatientTable()}
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
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Patient Directory</h3>
                  <p className="text-[13px] text-gray-400 font-medium">Viewing all patient records in the database</p>
                </div>
                <div className="relative">
                  <span className="absolute left-3 text-gray-400 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Search patients by name, condition, or ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full sm:w-80 h-[38px] pl-9 pr-3 rounded-xl border border-gray-200 bg-[#EDF3F8]/30 text-sm text-[#1B2D5E] placeholder-gray-400 focus:outline-none focus:border-[#4DBFBF] focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Patient Table */}
              <div className="overflow-x-auto">
                {renderPatientTable()}
              </div>
            </div>
          )}

          {activeTab === 'Appointments' && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6">
              <div>
                <h3 className="text-[20px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Appointments Schedule</h3>
                <p className="text-[13px] text-gray-400 font-medium">Today's consultations and follow-up slots</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {patients.slice(0, 10).map((appointment, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl p-4 transition-all duration-200">
                    <div className="w-[80px] shrink-0 text-center border-r border-gray-200/80 pr-4">
                      <span className="text-[14px] font-bold text-[#1B2D5E]">{appointment.time}</span>
                      <p className="text-[9px] text-[#1A7A8A] font-extrabold uppercase mt-0.5">Room {100 + idx * 2}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14.5px] font-bold text-[#1B2D5E]">{appointment.name}</h4>
                      <p className="text-[12.5px] text-gray-500 font-medium mb-1">{appointment.condition}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${appointment.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
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
