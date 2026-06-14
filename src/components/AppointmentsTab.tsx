import Button from '@mui/material/Button'
import { type Patient } from '../types/types'
import StatusIndicator from './StatusIndicator'

interface AppointmentsTabProps {
  loading: boolean
  patients: Patient[]
  todayCount: number
  attendedCount: number
  rejectedCount: number
  pendingCount: number
  appointmentStatuses: Record<string, string>
  selectedApptId: string | null
  setSelectedApptId: (id: string | null) => void
  setAppointmentStatus: (patientId: string, status: 'attended' | 'rejected') => void
}

export default function AppointmentsTab({
  loading,
  patients,
  todayCount,
  attendedCount,
  rejectedCount,
  pendingCount,
  appointmentStatuses,
  selectedApptId,
  setSelectedApptId,
  setAppointmentStatus
}: AppointmentsTabProps) {
  return (
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
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setAppointmentStatus(appointment.id, 'attended')
                        setSelectedApptId(null)
                      }}
                      className="!px-3.5 !py-1.5 !bg-emerald-600 hover:!bg-emerald-700 !text-white !rounded-xl !text-xs !font-bold !normal-case transition-all cursor-pointer !shadow-sm hover:!shadow !min-w-0"
                    >
                      Attend
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setAppointmentStatus(appointment.id, 'rejected')
                        setSelectedApptId(null)
                      }}
                      className="!px-3.5 !py-1.5 !bg-red-600 hover:!bg-red-700 !text-white !rounded-xl !text-xs !font-bold !normal-case transition-all cursor-pointer !shadow-sm hover:!shadow !min-w-0"
                    >
                      Reject
                    </Button>
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
  )
}
