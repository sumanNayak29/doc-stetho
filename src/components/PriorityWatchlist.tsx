import { usePatientsStore } from '../store'
import { type Patient } from '../types/types'
import HeartIcon from '../assets/icons/HeartIcon'
import BoltIcon from '../assets/icons/BoltIcon'
import TempIcon from '../assets/icons/TempIcon'
import StarIcon from '../assets/icons/StarIcon'
import StatusIndicator from './StatusIndicator'

interface PriorityWatchlistProps {
  patientsList: Patient[]
  onPatientClick: (patient: Patient) => void
  patientPictures?: Record<string, string>
}

export default function PriorityWatchlist({
  patientsList,
  onPatientClick,
  patientPictures = {}
}: PriorityWatchlistProps) {
  const { priorityPatients, togglePriority } = usePatientsStore()

  const watchlistedPatients = patientsList.filter(p => priorityPatients[p.id])

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-5 animate-[cardIn_0.3s_ease_both]">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-[18px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">Priority Watchlist</h3>
          <p className="text-[13px] text-gray-400 font-medium">Tracking live conditions for watchlisted patients</p>
        </div>
        <span className="bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-xl">
          {watchlistedPatients.length} Active
        </span>
      </div>

      {watchlistedPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-[16px] px-4 text-center border-2 border-dashed border-gray-200/85 rounded-2xl bg-gray-50/30">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-[8px]">
            <StarIcon className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[13.5px] font-bold text-[#1B2D5E] mb-1">Watchlist Empty</span>
          <p className="text-[12px] text-gray-400 max-w-[240px] font-medium leading-relaxed">
            Mark patients with a star in the directory or disease breakdown lists to track their vitals here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto pr-1.5 custom-scrollbar">
          {watchlistedPatients.map(patient => {
            const statusColors = {
              Stable: 'bg-emerald-100 text-emerald-700 border-emerald-200/50',
              Critical: 'bg-red-100 text-red-700 border-red-200/50',
              Recovering: 'bg-[#EDF3F8] text-[#1A7A8A] border-[#1A7A8A]/10'
            }
            const statusColorClass = statusColors[patient.status] || 'bg-gray-100 text-gray-700'

            return (
              <div
                key={patient.id}
                onClick={() => onPatientClick(patient)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-[#1A7A8A]/30 rounded-2xl cursor-pointer hover:shadow-sm transition-all duration-200 gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={patientPictures[patient.id] || `https://i.pravatar.cc/100?u=${patient.id}`}
                    alt={patient.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200/80 shadow-sm shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[14.5px] font-black text-[#1B2D5E] group-hover:text-[#1A7A8A] transition-colors leading-none truncate">
                        {patient.name}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColorClass}`}>
                        {patient.status === 'Critical' && (
                          <StatusIndicator color="red" size="sm" pulse={true} className="mr-0.5" />
                        )}
                        {patient.status}
                      </span>
                    </div>
                    <span className="text-[12px] text-gray-500 font-medium">
                      {patient.condition}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  {/* Live Vitals Tracker */}
                  <div className="flex items-center gap-3 text-[11.5px] font-bold text-gray-500 bg-white border border-gray-100 px-3 py-1.5 rounded-xl shadow-inner">
                    <span className="flex items-center gap-1.5">
                      <HeartIcon className={`w-3.5 h-3.5 ${patient.vitals.heartRate > 100 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                      {patient.vitals.heartRate} bpm
                    </span>
                    <span className="text-gray-200">|</span>
                    <span className="flex items-center gap-1.5">
                      <BoltIcon className="w-3.5 h-3.5 text-blue-500" />
                      {patient.vitals.bloodPressure}
                    </span>
                    <span className="text-gray-200">|</span>
                    <span className="flex items-center gap-1.5">
                      <TempIcon className={`w-3.5 h-3.5 ${patient.vitals.temp > 100 ? 'text-red-500' : 'text-orange-500'}`} />
                      {patient.vitals.temp}°F
                    </span>
                  </div>

                  {/* Priority Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePriority(patient.id)
                    }}
                    className="p-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-500 rounded-xl transition-all duration-150 cursor-pointer shadow-sm"
                    title="Remove from Priority Watchlist"
                  >
                    <StarIcon filled={true} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
