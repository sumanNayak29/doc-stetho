import { type Patient } from '../types/types'
import AdmissionsCanvasChart from './AdmissionsCanvasChart'
import ConditionsCanvasChart from './ConditionsCanvasChart'
import DiseaseDoughnutChart from './DiseaseDoughnutChart'

interface AnalyticsTabProps {
  loading: boolean
  patients: Patient[]
  handlePatientClick: (patient: Patient) => void
  patientPictures: Record<string, string>
}

export default function AnalyticsTab({
  loading,
  patients,
  handlePatientClick,
  patientPictures
}: AnalyticsTabProps) {
  return (
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
  )
}
