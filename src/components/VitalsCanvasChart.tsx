import { useRef, useEffect, useState } from 'react'
import { type Patient } from '../types/types'

interface VitalsCanvasChartProps {
  patient: Patient
}

// ECG point generator (one heartbeat cardiac cycle)
function getECGPoint(phase: number): number {
  let val = 0

  // P wave: small bump around phase 0.15 to 0.35
  if (phase > 0.15 && phase < 0.35) {
    val += 0.12 * Math.sin((phase - 0.15) * (Math.PI / 0.2))
  }

  // QRS complex: sharp down-up-down spike around phase 0.55 to 0.70
  if (phase >= 0.55 && phase < 0.70) {
    const qrs = (phase - 0.55) / 0.15 // 0 to 1
    if (qrs < 0.15) {
      val -= (qrs / 0.15) * 0.18 // Q
    } else if (qrs < 0.5) {
      const t = (qrs - 0.15) / 0.35 // 0 to 1
      val = -0.18 + t * 1.38 // R spike
    } else if (qrs < 0.75) {
      const t = (qrs - 0.5) / 0.25
      val = 1.2 - t * 1.5 // S dip
    } else {
      const t = (qrs - 0.75) / 0.25
      val = -0.3 + t * 0.3 // return to baseline
    }
  }

  // T wave: medium bump around phase 0.85 to 1.15
  if (phase > 0.85 && phase < 1.15) {
    val += 0.22 * Math.sin((phase - 0.85) * (Math.PI / 0.3))
  }

  // Add a tiny bit of live raw sensor electrical noise
  val += (Math.random() - 0.5) * 0.015

  return val
}

// Arterial Blood Pressure point generator (aligned with contraction phase)
function getABPPoint(phase: number): number {
  let val = 0.25 // baseline diastolic

  // Systolic rise: phase 0.55 to 0.85
  if (phase >= 0.55 && phase < 0.85) {
    const t = (phase - 0.55) / 0.3
    val = 0.25 + 0.65 * Math.sin(t * Math.PI / 2)
  } else if (phase >= 0.85 && phase < 0.95) {
    // Notch dip
    const t = (phase - 0.85) / 0.1
    val = 0.9 - 0.15 * Math.sin(t * Math.PI)
  } else {
    // Runoff
    const start = 0.95
    const remaining = (phase >= start ? phase : phase + 2 * Math.PI) - start
    val = 0.55 * Math.exp(-remaining * 0.95) + 0.25
  }

  // Add small pressure fluctuation noise
  val += (Math.random() - 0.5) * 0.01

  return val
}

// CO2 Capnography point generator
function getCO2Point(phase: number): number {
  const cycle = phase / (2 * Math.PI)
  let val = 0

  if (cycle < 0.25) {
    val = 0.0 // inhalation/baseline
  } else if (cycle >= 0.25 && cycle < 0.33) {
    const t = (cycle - 0.25) / 0.08
    val = t * 0.75 // exhalation upstroke
  } else if (cycle >= 0.33 && cycle < 0.8) {
    const t = (cycle - 0.33) / 0.47
    val = 0.75 + 0.08 * t // alveolar plateau
  } else if (cycle >= 0.8 && cycle < 0.86) {
    const t = (cycle - 0.8) / 0.06
    val = 0.83 * (1 - t) // inhalation downstroke
  } else {
    val = 0.0
  }

  // Add small sensor noise
  val += (Math.random() - 0.5) * 0.008

  return Math.max(0, val)
}

export default function VitalsCanvasChart({ patient }: VitalsCanvasChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse baseline values
  const sysBase = parseInt(patient.vitals.bloodPressure.split('/')[0]) || 120
  const diaBase = parseInt(patient.vitals.bloodPressure.split('/')[1]) || 80
  const tempBaseC = parseFloat(((patient.vitals.temp - 32) * 5 / 9).toFixed(1)) || 36.8

  // Vitals State values that update live
  const [vitals, setVitals] = useState({
    hr: patient.vitals.heartRate,
    bpSystolic: sysBase,
    bpDiastolic: diaBase,
    bpMean: Math.round(diaBase + (sysBase - diaBase) / 3),
    spo2: 97,
    etco2: 28,
    rr: 16,
    temp: tempBaseC
  })

  // Set up live readouts update interval
  useEffect(() => {
    const timer = setInterval(() => {
      setVitals(prev => {
        const hrOffset = Math.round((Math.random() - 0.5) * 4) // +/-2 bpm
        const sysOffset = Math.round((Math.random() - 0.5) * 4) // +/-2 mmHg
        const diaOffset = Math.round((Math.random() - 0.5) * 3) // +/-1.5 mmHg

        const nextHR = Math.max(50, Math.min(180, prev.hr + hrOffset))
        const nextSys = Math.max(90, Math.min(190, prev.bpSystolic + sysOffset))
        const nextDia = Math.max(50, Math.min(110, prev.bpDiastolic + diaOffset))
        const nextMean = Math.round(nextDia + (nextSys - nextDia) / 3)

        const nextSpo2 = Math.max(95, Math.min(100, prev.spo2 + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
        const nextEtco2 = Math.max(24, Math.min(38, prev.etco2 + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
        const nextRR = Math.max(12, Math.min(22, prev.rr + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)))

        const tempOffset = parseFloat(((Math.random() - 0.5) * 0.1).toFixed(1))
        const nextTemp = parseFloat(Math.max(34.0, Math.min(41.0, prev.temp + tempOffset)).toFixed(1))

        return {
          hr: nextHR,
          bpSystolic: nextSys,
          bpDiastolic: nextDia,
          bpMean: nextMean,
          spo2: nextSpo2,
          etco2: nextEtco2,
          rr: nextRR,
          temp: nextTemp
        }
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [patient.vitals.heartRate, patient.vitals.bloodPressure, patient.vitals.temp])

  // Waveform Buffers & Phases
  const bufferLength = 600
  const ecgBuffer = useRef<number[]>(new Array(bufferLength).fill(0))
  const abpBuffer = useRef<number[]>(new Array(bufferLength).fill(0.25))
  const co2Buffer = useRef<number[]>(new Array(bufferLength).fill(0))

  const sweepIndex = useRef<number>(0)
  const fractionalSteps = useRef<number>(0)

  const ecgPhase = useRef<number>(0)
  const abpPhase = useRef<number>(0)
  const co2Phase = useRef<number>(0)
  const lastTime = useRef<number>(0)

  useEffect(() => {
    let animationId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = (time: number) => {
      if (lastTime.current === 0) lastTime.current = time
      const dt = (time - lastTime.current) / 1000 // elapsed seconds
      lastTime.current = time

      // Handle Canvas Sizing
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      const width = rect.width
      const height = rect.height

      // Waveform cycle calculation based on live values
      const hr = vitals.hr
      const rr = vitals.rr

      const dtStep = 6 / bufferLength // time represented by 1 step in a 6-second sweep
      const ecgPhaseInc = ((2 * Math.PI) / (60 / hr)) * dtStep
      const abpPhaseInc = ((2 * Math.PI) / (60 / hr)) * dtStep // ABP in sync with ECG
      const co2PhaseInc = ((2 * Math.PI) / (60 / rr)) * dtStep // CO2 in sync with Respiration Rate

      // Write steps to buffers
      const sweepSpeed = bufferLength / 5 // complete sweep in 5 seconds
      fractionalSteps.current += dt * sweepSpeed
      const stepsToDraw = Math.floor(fractionalSteps.current)
      fractionalSteps.current -= stepsToDraw

      for (let s = 0; s < stepsToDraw; s++) {
        ecgPhase.current = (ecgPhase.current + ecgPhaseInc) % (2 * Math.PI)
        abpPhase.current = (abpPhase.current + abpPhaseInc) % (2 * Math.PI)
        co2Phase.current = (co2Phase.current + co2PhaseInc) % (2 * Math.PI)

        ecgBuffer.current[sweepIndex.current] = getECGPoint(ecgPhase.current)
        abpBuffer.current[sweepIndex.current] = getABPPoint(abpPhase.current)
        co2Buffer.current[sweepIndex.current] = getCO2Point(co2Phase.current)

        sweepIndex.current = (sweepIndex.current + 1) % bufferLength
      }

      // Draw Section dividers
      ctx.strokeStyle = '#27272A'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height / 3)
      ctx.lineTo(width, height / 3)
      ctx.moveTo(0, (2 * height) / 3)
      ctx.lineTo(width, (2 * height) / 3)
      ctx.stroke()

      // Waveform Draw Parameters
      const getX = (idx: number) => idx * (width / bufferLength)
      const gap = 24 // Erase-bar gap size in steps

      const drawWaveform = (
        buffer: number[],
        startY: number,
        sectionHeight: number,
        color: string,
        scale: number,
        offset: number
      ) => {
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Neon Glow Phosphor effect
        ctx.shadowColor = color
        ctx.shadowBlur = 6

        const getYVal = (val: number) => startY + sectionHeight / 2 - val * scale + offset

        // Segment 1: New trace (from 0 to sweepIndex)
        let first = true
        for (let i = 0; i < sweepIndex.current; i++) {
          const x = getX(i)
          const y = getYVal(buffer[i])
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()

        // Segment 2: Old trace (from sweepIndex + gap to bufferLength)
        ctx.beginPath()
        first = true
        for (let i = (sweepIndex.current + gap) % bufferLength; i < bufferLength; i++) {
          // Prevent wrap overlap
          if (i < sweepIndex.current) continue
          const x = getX(i)
          const y = getYVal(buffer[i])
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()

        // Reset Glow
        ctx.shadowBlur = 0

        // Draw hot sweeping sweep indicator node
        const leadingIdx = Math.max(0, sweepIndex.current - 1)
        const leadX = getX(leadingIdx)
        const leadY = getYVal(buffer[leadingIdx])

        ctx.beginPath()
        ctx.arc(leadX, leadY, 3.5, 0, 2 * Math.PI)
        ctx.fillStyle = '#FFFFFF'
        ctx.shadowColor = color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      const secH = height / 3

      // Draw the three waveforms
      drawWaveform(ecgBuffer.current, 0, secH, '#00FF66', secH * 0.35, 10)     // ECG (Green)
      drawWaveform(abpBuffer.current, secH, secH, '#FF3B30', secH * 0.35, 10)    // ABP (Red)
      drawWaveform(co2Buffer.current, 2 * secH, secH, '#FFD60A', secH * 0.35, 10) // CO2 (Yellow)

      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [vitals.hr, vitals.rr])

  return (
    <div ref={containerRef} className="w-full bg-[#000000] border-2 border-[#1E293B] rounded-xl overflow-hidden grid grid-cols-12 select-none">
      {/* Waveform Canvas Panel */}
      <div className="col-span-9 relative bg-black flex flex-col justify-between p-1">
        {/* Waveform text overlays */}
        <div className="absolute top-2 left-3 text-[10px] font-extrabold text-[#00FF66] tracking-wider font-mono">ECGIII</div>
        <div className="absolute top-[36%] left-3 text-[10px] font-extrabold text-[#FF3B30] tracking-wider font-mono">ABP</div>
        <div className="absolute top-[69%] left-3 text-[10px] font-extrabold text-[#FFD60A] tracking-wider font-mono">CO2</div>

        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Digital Vitals Readouts Panel */}
      <div className="col-span-3 flex flex-col h-full bg-[#000000] border-l border-[#1E293B] divide-y divide-[#1E293B]">
        {/* Heart Rate Block */}
        <div className="h-[33.3%] p-2.5 flex flex-col justify-between">
          <span className="text-[9px] font-extrabold text-[#00FF66] tracking-wider leading-none uppercase font-mono">hr / min</span>
          <span className="text-4xl font-extrabold text-[#00FF66] leading-none text-right font-mono tracking-tight animate-pulse">{vitals.hr}</span>
        </div>

        {/* Arterial Blood Pressure Block */}
        <div className="h-[33.3%] p-2.5 flex flex-col justify-between">
          <span className="text-[9px] font-extrabold text-[#FF3B30] tracking-wider leading-none uppercase font-mono">mmHg</span>
          <div className="flex flex-col items-end leading-none">
            <span className="text-2xl font-extrabold text-[#FF3B30] font-mono tracking-tight">{vitals.bpSystolic}/{vitals.bpDiastolic}</span>
            <span className="text-xs font-bold text-[#FF3B30] mt-1 font-mono">({vitals.bpMean})</span>
          </div>
        </div>

        {/* Dynamic Splits Block */}
        <div className="h-[33.3%] divide-y divide-[#1E293B] flex flex-col justify-stretch">
          {/* SpO2 */}
          <div className="flex-1 px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-[#00E5FF] font-mono leading-none uppercase">SpO2 %</span>
            <span className="text-lg font-extrabold text-[#00E5FF] font-mono leading-none">{vitals.spo2}</span>
          </div>
          {/* etCO2 */}
          <div className="flex-1 px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-[#FFD60A] font-mono leading-none uppercase">etCO2</span>
            <span className="text-lg font-extrabold text-[#FFD60A] font-mono leading-none">{vitals.etco2}</span>
          </div>
          {/* awRR */}
          <div className="flex-1 px-2.5 py-1.5 flex items-center justify-between text-[#FFD60A]">
            <span className="text-[9px] font-extrabold font-mono leading-none uppercase">awRR</span>
            <span className="text-lg font-extrabold font-mono leading-none">{vitals.rr}</span>
          </div>
          {/* Temperature */}
          <div className="flex-1 px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-[9px] font-extrabold text-[#00FF66] font-mono leading-none uppercase">T °C</span>
            <span className="text-lg font-extrabold text-[#00FF66] font-mono leading-none">{vitals.temp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
