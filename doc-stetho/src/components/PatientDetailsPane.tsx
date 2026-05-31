import { useRef } from 'react'
import { type Patient } from '../types'
import HeartIcon from '../assets/icons/HeartIcon'
import BoltIcon from '../assets/icons/BoltIcon'
import TempIcon from '../assets/icons/TempIcon'
import VitalsCanvasChart from './VitalsCanvasChart'

interface PatientDetailsPaneProps {
  patient: Patient
  onClose: () => void
  patientPictures: Record<string, string>
  onAvatarChange: (patientId: string, base64: string) => void
  chartType: 'heartRate' | 'temp'
  setChartType: (type: 'heartRate' | 'temp') => void
}

export default function PatientDetailsPane({
  patient,
  onClose,
  patientPictures,
  onAvatarChange,
  chartType,
  setChartType
}: PatientDetailsPaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onAvatarChange(patient.id, reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const avatarSrc = patientPictures[patient.id] || `https://i.pravatar.cc/150?u=${patient.id}`

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6 w-full animate-[cardIn_0.3s_ease_both]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5 relative">
        <div className="relative group/avatar cursor-pointer shrink-0" onClick={onAvatarClick}>
          <img
            src={avatarSrc}
            alt={patient.name}
            className="w-18 h-18 rounded-full object-cover border-2 border-[#1A7A8A] shadow-md transition-all duration-200 group-hover/avatar:brightness-[0.7]"
          />
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-[17px] font-extrabold text-[#1B2D5E] leading-snug truncate">{patient.name}</h4>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              patient.status === 'Stable'
                ? 'bg-emerald-100 text-emerald-700'
                : patient.status === 'Critical'
                  ? 'bg-red-100 text-red-700 animate-pulse'
                  : 'bg-[#EDF3F8] text-[#1A7A8A]'
            }`}>
              {patient.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 font-semibold">{patient.id} • {patient.gender} • {patient.age} years</p>
          <button
            onClick={onAvatarClick}
            className="text-[11.5px] font-bold text-[#1A7A8A] hover:text-[#4DBFBF] transition-colors mt-2 cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Change Photo
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Condition / Diagnosis</span>
          <p className="text-[13.5px] font-bold text-[#1B2D5E] mt-1 leading-snug">{patient.condition}</p>
        </div>
        <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Checked In At</span>
          <p className="text-[13.5px] font-bold text-[#1B2D5E] mt-1 leading-snug">{patient.time} today</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 bg-gray-50/30 border border-gray-100 rounded-xl p-3">
        <div className="flex flex-col items-center text-center p-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <HeartIcon className="w-3 h-3 text-red-500" /> Pulse
          </span>
          <span className="text-[14px] font-extrabold text-[#1B2D5E]">{patient.vitals.heartRate} <span className="text-[10px] font-semibold text-gray-400">bpm</span></span>
        </div>
        <div className="flex flex-col items-center text-center p-1 border-x border-gray-200/60">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <BoltIcon className="w-3 h-3 text-blue-500" /> Pressure
          </span>
          <span className="text-[14px] font-extrabold text-[#1B2D5E]">{patient.vitals.bloodPressure}</span>
        </div>
        <div className="flex flex-col items-center text-center p-1">
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <TempIcon className="w-3 h-3 text-orange-500" /> Temp
          </span>
          <span className="text-[14px] font-extrabold text-[#1B2D5E]">{patient.vitals.temp} <span className="text-[10px] font-semibold text-gray-400">°F</span></span>
        </div>
      </div>
      
      {/* Vitals Timeline Canvas Chart */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Metric Timeline (12h)</span>
          <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200/50">
            <button
              onClick={(e) => { e.stopPropagation(); setChartType('heartRate'); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                chartType === 'heartRate' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Heart Rate
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setChartType('temp'); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                chartType === 'temp' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Temperature
            </button>
          </div>
        </div>
        <div className="relative bg-gray-50/50 rounded-xl border border-gray-100 p-2.5">
          <VitalsCanvasChart patient={patient} chartType={chartType} />
        </div>
      </div>
    </div>
  )
}
