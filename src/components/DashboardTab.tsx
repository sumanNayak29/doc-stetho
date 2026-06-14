import UsersGroupIcon from '../assets/icons/UsersGroupIcon'
import AlertTriangleIcon from '../assets/icons/AlertTriangleIcon'
import ShieldCheckIcon from '../assets/icons/ShieldCheckIcon'
import { type Patient } from '../types/types'
import AdmissionsCanvasChart from './AdmissionsCanvasChart'
import PriorityWatchlist from './PriorityWatchlist'
import DiseaseDoughnutChart from './DiseaseDoughnutChart'

interface DashboardTabProps {
  loading: boolean
  error: string | null
  patients: Patient[]
  attendedCount: number
  rejectedCount: number
  pendingCount: number
  todayCount: number
  appointmentStatuses: Record<string, string>
  patientPictures: Record<string, string>
  setActiveTab: (tab: string) => void
  setSelectedApptId: (id: string | null) => void
  handlePatientClick: (patient: Patient) => void
}

export default function DashboardTab({
  loading,
  error,
  patients,
  attendedCount,
  rejectedCount,
  pendingCount,
  todayCount,
  appointmentStatuses,
  patientPictures,
  setActiveTab,
  setSelectedApptId,
  handlePatientClick
}: DashboardTabProps) {
  return (
    <>
      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Patients',
            value: loading ? '...' : patients.length.toLocaleString(),
            change: loading ? '...' : 'Live database count',
            isPos: true,
            icon: <UsersGroupIcon className="w-6 h-6 text-[#1A7A8A]" />,
            color: 'from-[#1A7A8A]/10 to-[#1A7A8A]/5',
            onClick: () => setActiveTab('Patients')
          },
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
          {
            title: 'Critical Cases',
            value: loading ? '...' : patients.filter(p => p.status === 'Critical').length.toString(),
            change: loading ? '...' : 'Urgent attention',
            isPos: false,
            icon: <AlertTriangleIcon className="w-6 h-6 text-red-500 animate-pulse" />,
            color: 'from-red-500/10 to-red-500/5'
          },
          {
            title: 'System Status',
            value: '99.9%',
            change: 'All nodes healthy',
            isPos: true,
            icon: <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />,
            color: 'from-emerald-500/10 to-emerald-500/5'
          }
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
  )
}
