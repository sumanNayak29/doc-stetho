import SpinnerIcon from '../assets/icons/SpinnerIcon'
import HeartIcon from '../assets/icons/HeartIcon'
import BoltIcon from '../assets/icons/BoltIcon'
import TempIcon from '../assets/icons/TempIcon'
import { type Patient } from '../types'
import StatusIndicator from './StatusIndicator'

interface PatientTableProps {
  loading: boolean
  error: string | null
  filteredPatients: Patient[]
  selectedPatientId?: string
  handlePatientClick: (patient: Patient) => void
  patientPictures: Record<string, string>
}

export default function PatientTable({
  loading,
  error,
  filteredPatients,
  selectedPatientId,
  handlePatientClick,
  patientPictures
}: PatientTableProps) {
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
            <tr
              key={patient.id}
              onClick={() => handlePatientClick(patient)}
              className={`group hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer ${
                selectedPatientId === patient.id ? 'bg-[#1A7A8A]/10 hover:bg-[#1A7A8A]/15' : ''
              }`}
            >
              {/* ID & Name with Avatar */}
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={patientPictures[patient.id] || `https://i.pravatar.cc/100?u=${patient.id}`}
                    alt={patient.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200/80 shadow-sm shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#1B2D5E] group-hover:text-[#1A7A8A] transition-colors">
                      {patient.name}
                    </span>
                    <span className="text-[11.5px] text-gray-400 font-medium">
                      {patient.id} • {patient.age} yrs • {patient.gender}
                    </span>
                  </div>
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
                    <HeartIcon
                      className={`w-3.5 h-3.5 ${
                        patient.vitals.heartRate > 100 ? 'text-red-500 animate-pulse' : 'text-emerald-500'
                      }`}
                    />
                    {patient.vitals.heartRate} bpm
                  </span>
                  <span className="flex items-center gap-1">
                    <BoltIcon className="w-3.5 h-3.5 text-blue-500" />
                    {patient.vitals.bloodPressure}
                  </span>
                  <span className="flex items-center gap-1">
                    <TempIcon
                      className={`w-3.5 h-3.5 ${patient.vitals.temp > 100 ? 'text-red-500' : 'text-orange-500'}`}
                    />
                    {patient.vitals.temp}°F
                  </span>
                </div>
              </td>

              {/* Status Badge */}
              <td className="py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    patient.status === 'Stable'
                      ? 'bg-emerald-100 text-emerald-700'
                      : patient.status === 'Critical'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-[#EDF3F8] text-[#1A7A8A]'
                  }`}
                >
                  {patient.status === 'Critical' && (
                    <StatusIndicator color="red" size="sm" pulse={true} className="mr-1" />
                  )}
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
