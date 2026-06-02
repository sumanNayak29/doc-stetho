import { useState } from 'react'
import { type Patient } from '../types/types'
import StatusIndicator from './StatusIndicator'
import { usePatientsStore } from '../store'
import StarIcon from '../assets/icons/StarIcon'

interface DiseaseDoughnutChartProps {
  patientsList: Patient[]
  onPatientClick: (patient: Patient) => void
  patientPictures?: Record<string, string>
}

export default function DiseaseDoughnutChart({
  patientsList,
  onPatientClick,
  patientPictures = {}
}: DiseaseDoughnutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const { priorityPatients, togglePriority } = usePatientsStore()

  // 1. Group patients by condition
  const conditionGroups = patientsList.reduce((acc, patient) => {
    const cond = patient.condition || 'Unknown'
    if (!acc[cond]) {
      acc[cond] = []
    }
    acc[cond].push(patient)
    return acc;
  }, {} as Record<string, Patient[]>)

  // 2. Sort conditions by count descending
  const sortedConditions = Object.entries(conditionGroups)
    .map(([name, patients]) => ({ name, patients, count: patients.length }))
    .sort((a, b) => b.count - a.count)

  const totalPatients = patientsList.length

  if (totalPatients === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col items-center justify-center min-h-[280px]">
        <span className="text-gray-400 font-semibold text-sm">No patient data available.</span>
      </div>
    )
  }

  // 3. Keep top 5 conditions, group the rest into "Other Conditions"
  const topCount = 5
  let chartData: Array<{ name: string; patients: Patient[]; count: number; color: string }> = []

  const colors = [
    '#1A7A8A', // Teal
    '#4F46E5', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#F43F5E', // Rose
    '#8B5CF6'  // Purple
  ]

  if (sortedConditions.length <= topCount + 1) {
    chartData = sortedConditions.map((item, idx) => ({
      ...item,
      color: colors[idx % colors.length]
    }))
  } else {
    const top = sortedConditions.slice(0, topCount)
    const rest = sortedConditions.slice(topCount)
    const restPatients = rest.flatMap(item => item.patients)

    chartData = [
      ...top.map((item, idx) => ({ ...item, color: colors[idx] })),
      {
        name: 'Other Conditions',
        patients: restPatients,
        count: restPatients.length,
        color: '#64748B' // Slate for "Other"
      }
    ]
  }

  // Ensure index boundary safety
  const safeSelectedIndex = selectedIndex >= chartData.length ? 0 : selectedIndex
  const selectedData = chartData[safeSelectedIndex] || chartData[0]

  // 4. Calculate angles and path coordinates for SVG doughnut chart
  const cx = 110
  const cy = 110
  const radius = 72
  const strokeWidth = 22

  const getCoordinatesForPercent = (percent: number, r: number) => {
    // Offset by -0.25 to start drawing from 12 o'clock
    const angle = 2 * Math.PI * (percent - 0.25)
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    return [x, y]
  }

  const runningPercents: { start: number; percent: number }[] = []
  let currentAccumulator = 0
  for (const item of chartData) {
    const percent = item.count / totalPatients
    runningPercents.push({ start: currentAccumulator, percent })
    currentAccumulator += percent
  }

  // Prepare slices data
  const slices = chartData.map((item, idx) => {
    const { start: startPercent, percent } = runningPercents[idx]
    const endPercent = startPercent + percent

    const isHovered = hoveredIndex === idx
    const isSelected = safeSelectedIndex === idx

    // Slices visual popout factor when hovered or selected
    const activeRadius = isHovered ? radius + 5 : isSelected ? radius + 2 : radius
    const activeStroke = isHovered ? strokeWidth + 4 : isSelected ? strokeWidth + 1 : strokeWidth

    // Compute Translate offset coordinates to explode the slice outwards
    const midPercent = startPercent + percent / 2
    const midAngle = 2 * Math.PI * (midPercent - 0.25)
    const explodeDistance = isHovered ? 6 : isSelected ? 3 : 0
    const translateX = Math.cos(midAngle) * explodeDistance
    const translateY = Math.sin(midAngle) * explodeDistance

    return {
      name: item.name,
      count: item.count,
      percent,
      color: item.color,
      startPercent,
      endPercent,
      activeRadius,
      activeStroke,
      translateX,
      translateY,
      isHovered,
      isSelected
    }
  })

  // Center display content
  const activeHoverSlice = hoveredIndex !== null ? slices[hoveredIndex] : null
  const displayLabel = activeHoverSlice ? activeHoverSlice.name : 'Total Patients'
  const displayValue = activeHoverSlice ? activeHoverSlice.count : totalPatients
  const displaySubtext = activeHoverSlice
    ? `${(activeHoverSlice.percent * 100).toFixed(1)}% of cases`
    : 'Across all diagnoses'

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,45,94,0.02)] flex flex-col gap-6 animate-[cardIn_0.35s_ease_both]">
      <div>
        <h3 className="text-[18px] font-extrabold text-[#1B2D5E] tracking-tight mb-1">
          Disease Distribution & Records
        </h3>
        <p className="text-[13px] text-gray-400 font-medium">
          Aggregated medical conditions breakdown. Click a slice or row to view patient directory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: SVG Doughnut + Legend */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-6 border-r border-gray-100/80 pr-0 lg:pr-8">
          {/* SVG Container */}
          <div className="relative w-[270px] h-[270px] shrink-0">
            {/* Center Info Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none select-none z-10">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1 truncate max-w-[130px]">
                {displayLabel}
              </span>
              <span className="text-[32px] font-black text-[#1B2D5E] leading-none mb-1 tracking-tight">
                {displayValue}
              </span>
              <span className="text-[10.5px] text-[#1A7A8A] font-bold">
                {displaySubtext}
              </span>
            </div>

            {/* SVG Arc rendering */}
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              className="w-full h-full block"
            >
              {slices.map((slice, idx) => {
                // If it is 100% of the cases (only 1 slice), render a simple circle
                if (slice.percent >= 0.999) {
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r={slice.activeRadius}
                      fill="none"
                      stroke={slice.color}
                      strokeWidth={slice.activeStroke}
                      className="cursor-pointer transition-all duration-300 ease-out"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => setSelectedIndex(idx)}
                    />
                  )
                }

                const [startX, startY] = getCoordinatesForPercent(slice.startPercent, slice.activeRadius)
                const [endX, endY] = getCoordinatesForPercent(slice.endPercent, slice.activeRadius)
                const largeArcFlag = slice.percent > 0.5 ? 1 : 0

                // Arc path drawing
                const d = `M ${startX} ${startY} A ${slice.activeRadius} ${slice.activeRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`

                return (
                  <path
                    key={idx}
                    d={d}
                    fill="none"
                    stroke={slice.color}
                    strokeWidth={slice.activeStroke}
                    strokeLinecap={slice.percent > 0.03 ? 'round' : 'butt'}
                    style={{
                      transform: `translate(${slice.translateX}px, ${slice.translateY}px)`,
                      transformOrigin: `${cx}px ${cy}px`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    className="cursor-pointer drop-shadow-sm hover:drop-shadow-md"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setSelectedIndex(idx)}
                  />
                )
              })}
            </svg>
          </div>

          {/* Interactive Legend List */}
          <div className="flex-1 flex flex-col gap-2 w-full">
            {chartData.map((item, idx) => {
              const isSelected = safeSelectedIndex === idx
              const percentage = ((item.count / totalPatients) * 100).toFixed(1)
              return (
                <div
                  key={item.name}
                  onClick={() => setSelectedIndex(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 border ${isSelected
                    ? 'bg-gray-50 border-gray-200 shadow-sm scale-[1.02]'
                    : 'border-transparent hover:bg-gray-50/50'
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 transition-transform duration-300"
                      style={{
                        backgroundColor: item.color,
                        transform: hoveredIndex === idx || isSelected ? 'scale(1.2)' : 'scale(1)'
                      }}
                    />
                    <span className="text-[12.5px] font-bold text-[#1B2D5E] truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[11.5px] font-extrabold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {item.count}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold w-9 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Scrollable Patient list under the selected Condition */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="text-[14.5px] font-extrabold text-[#1B2D5E] flex items-center gap-2">
              Patients Diagnosed with:{' '}
              <span className="text-[#1A7A8A] font-black">{selectedData.name}</span>
            </h4>
            <span className="text-[11.5px] font-bold text-gray-400">
              Showing {selectedData.patients.length} records
            </span>
          </div>

          {/* Patient Scroll Area */}
          <div className="max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar flex flex-col gap-2.5">
            {selectedData.patients.map((patient, index) => {
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
                  className="group flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-[#1A7A8A]/30 rounded-xl cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Patient Image / Avatar */}
                    <img
                      src={patientPictures[patient.id] || `https://i.pravatar.cc/100?u=${patient.id}`}
                      alt={patient.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200/80 shadow-sm shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13.5px] font-black text-[#1B2D5E] group-hover:text-[#1A7A8A] transition-colors leading-tight mb-0.5 truncate">
                        {patient.name}
                      </span>
                      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                        {patient.id} · {patient.age} Yrs · {patient.gender}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Room details */}
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                      Room {100 + index * 3}
                    </span>

                    {/* Vitals Summary indicator */}
                    <span className="text-[11.5px] font-extrabold text-gray-500 hidden sm:inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      {patient.vitals.heartRate} bpm
                    </span>

                    {/* Patient Status Indicator Badge */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColorClass}`}>
                      {patient.status === 'Critical' && (
                        <StatusIndicator color="red" size="sm" pulse={true} className="mr-1" />
                      )}
                      {patient.status}
                    </span>

                    {/* Priority Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePriority(patient.id)
                      }}
                      className={`p-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${priorityPatients[patient.id]
                        ? 'bg-amber-50 border-amber-200 text-amber-500 hover:scale-105'
                        : 'border-gray-200 text-gray-300 hover:text-gray-400 hover:bg-gray-50'
                        }`}
                      title={priorityPatients[patient.id] ? "Remove from Priority" : "Mark as Priority"}
                    >
                      <StarIcon filled={priorityPatients[patient.id]} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
