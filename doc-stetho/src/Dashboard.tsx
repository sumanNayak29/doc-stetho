import { useState, useEffect } from 'react'
import DocStethoIcon from './assets/icons/DocStethoIcon'

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
    fetch('/mockdatabase/patient_data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch patient data')
        }
        return response.json()
      })
      .then(data => {
        setPatients(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching patient data:', err)
        setError(err.message || 'Something went wrong')
        setLoading(false)
      })
  }, [])

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

  return (
    <div className="min-h-screen bg-[#EDF3F8] text-[#1B2D5E] flex font-['Inter',system-ui,sans-serif] w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B2D5E] text-white flex flex-col justify-between shrink-0 shadow-xl z-10">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl p-1.5 border border-white/15 backdrop-blur-md">
              <DocStethoIcon />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-white/60 font-light">doc</span>stetho
              </span>
              <p className="text-[8px] tracking-[1.5px] text-[#4DBFBF] font-semibold uppercase leading-none mt-0.5">PLATFORM</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {[
              { name: 'Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg> },
              { name: 'Patients', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
              { name: 'Appointments', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
              { name: 'Analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
              { name: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
            ].map(item => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14.5px] font-semibold transition-all duration-200 cursor-pointer ${activeTab === item.name
                  ? 'bg-[#1A7A8A] text-white shadow-md shadow-[#1A7A8A]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer / User Info */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[14.5px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 border border-red-500/15 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
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
          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Patients', value: loading ? '...' : patients.length.toLocaleString(), change: loading ? '...' : 'Live database count', isPos: true, icon: <svg className="w-6 h-6 text-[#1A7A8A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, color: 'from-[#1A7A8A]/10 to-[#1A7A8A]/5' },
              { title: 'Today Appointments', value: loading ? '...' : Math.min(18, patients.length).toString(), change: loading ? '...' : 'Derived from schedule', isPos: true, icon: <svg className="w-6 h-6 text-[#4DBFBF]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'from-[#4DBFBF]/10 to-[#4DBFBF]/5' },
              { title: 'Critical Cases', value: loading ? '...' : patients.filter(p => p.status === 'Critical').length.toString(), change: loading ? '...' : 'Urgent attention', isPos: false, icon: <svg className="w-6 h-6 text-red-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, color: 'from-red-500/10 to-red-500/5' },
              { title: 'System Status', value: '99.9%', change: 'All nodes healthy', isPos: true, icon: <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, color: 'from-emerald-500/10 to-emerald-500/5' }
            ].map(stat => (
              <div key={stat.title} className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 flex items-center justify-between shadow-[0_4px_24px_rgba(27,45,94,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(27,45,94,0.06)] hover:border-[#4DBFBF]/30">
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                            <svg className="animate-spin h-5 w-5 text-[#1A7A8A]" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
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
                                <svg className={`w-3.5 h-3.5 ${patient.vitals.heartRate > 100 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                {patient.vitals.heartRate} bpm
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                {patient.vitals.bloodPressure}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className={`w-3.5 h-3.5 ${patient.vitals.temp > 100 ? 'text-red-500' : 'text-orange-500'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
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
        </main>
      </div>
    </div>
  )
}

export default Dashboard
