import { useRef, useEffect, useState } from 'react'
import { type Patient } from '../types/types'

interface PulseLiveChartProps {
  patient: Patient
}

// Photoplethysmogram (PLETH / SpO2 pulse wave) math function
function getPLETHPoint(phase: number): number {
  let val = 0.15

  // Steep upstroke rise
  if (phase >= 0.0 && phase < 0.25 * Math.PI) {
    const t = phase / (0.25 * Math.PI)
    val = 0.15 + 0.75 * Math.sin(t * Math.PI / 2)
  }
  // Dicrotic notch dip
  else if (phase >= 0.25 * Math.PI && phase < 0.4 * Math.PI) {
    const t = (phase - 0.25 * Math.PI) / (0.15 * Math.PI)
    val = 0.9 - 0.12 * Math.sin(t * Math.PI)
  }
  // Diastolic runoff runoff
  else {
    const start = 0.4 * Math.PI
    const remaining = phase - start
    val = 0.63 * Math.exp(-remaining * 0.95) + 0.15
  }

  // Add small sensor noise
  val += (Math.random() - 0.5) * 0.01

  return val
}

export default function PulseLiveChart({ patient }: PulseLiveChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Vitals State values that update live
  const [pulseData, setPulseData] = useState({
    pr: patient.vitals.heartRate,
    spo2: 97
  })

  // Set up live readouts update interval (every 1.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseData(prev => {
        const prOffset = Math.round((Math.random() - 0.5) * 3) // +/-1.5 bpm
        const nextPR = Math.max(50, Math.min(180, prev.pr + prOffset))
        const nextSpo2 = Math.max(95, Math.min(100, prev.spo2 + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0)))

        return {
          pr: nextPR,
          spo2: nextSpo2
        }
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [patient.vitals.heartRate])

  // Waveform Buffers & Phases
  const bufferLength = 600
  const plethBuffer = useRef<number[]>(new Array(bufferLength).fill(0.15))

  const sweepIndex = useRef<number>(0)
  const fractionalSteps = useRef<number>(0)

  const plethPhase = useRef<number>(0)
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
      const pr = pulseData.pr
      const dtStep = 6 / bufferLength // 6 seconds sweep time represented by 1 step
      const plethPhaseInc = ((2 * Math.PI) / (60 / pr)) * dtStep

      // Write steps to buffers
      const sweepSpeed = bufferLength / 5 // complete sweep in 5 seconds
      fractionalSteps.current += dt * sweepSpeed
      const stepsToDraw = Math.floor(fractionalSteps.current)
      fractionalSteps.current -= stepsToDraw

      for (let s = 0; s < stepsToDraw; s++) {
        plethPhase.current = (plethPhase.current + plethPhaseInc) % (2 * Math.PI)
        plethBuffer.current[sweepIndex.current] = getPLETHPoint(plethPhase.current)
        sweepIndex.current = (sweepIndex.current + 1) % bufferLength
      }

      // Draw Grid Matrix (oscilloscope graph paper)
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)'
      ctx.setLineDash([])

      // Vertical grid lines
      for (let i = 0; i < bufferLength; i += 40) {
        const xVal = i * (width / bufferLength)
        ctx.beginPath()
        ctx.moveTo(xVal, 0)
        ctx.lineTo(xVal, height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Waveform Draw Parameters
      const getX = (idx: number) => idx * (width / bufferLength)
      const gap = 24 // Erase-bar gap size in steps
      const strokeColor = '#00E5FF'

      ctx.beginPath()
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Neon Glow Phosphor effect
      ctx.shadowColor = strokeColor
      ctx.shadowBlur = 6

      // Math centering to avoid cropping
      const getYVal = (val: number) => height / 2 - (val - 0.525) * (height * 0.65)

      // Segment 1: New trace
      let first = true
      for (let i = 0; i < sweepIndex.current; i++) {
        const x = getX(i)
        const y = getYVal(plethBuffer.current[i])
        if (first) {
          ctx.moveTo(x, y)
          first = false
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Segment 2: Old trace
      ctx.beginPath()
      first = true
      for (let i = (sweepIndex.current + gap) % bufferLength; i < bufferLength; i++) {
        if (i < sweepIndex.current) continue
        const x = getX(i)
        const y = getYVal(plethBuffer.current[i])
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
      const leadY = getYVal(plethBuffer.current[leadingIdx])

      ctx.beginPath()
      ctx.arc(leadX, leadY, 3.5, 0, 2 * Math.PI)
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = strokeColor
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0

      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [pulseData.pr])

  return (
    <div ref={containerRef} className="h-full w-full bg-[#000000] border-2 border-[#1E293B] rounded-xl overflow-hidden grid grid-cols-12 h-[100px] select-none">
      {/* Waveform Canvas Panel */}
      <div className="col-span-9 relative bg-black flex flex-col justify-between p-1">
        {/* Waveform text overlay */}
        <div className="absolute top-2 left-3 text-[10px] font-extrabold text-[#00E5FF] tracking-wider font-mono">PLETH</div>
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Digital Vitals Readouts Panel */}
      <div className="col-span-3 flex flex-col h-full bg-[#000000] border-l border-[#1E293B] divide-y divide-[#1E293B]">
        {/* Pulse Rate Block */}
        <div className="h-[50%] p-2 flex flex-col justify-between">
          <span className="text-[8px] font-extrabold text-[#00E5FF] tracking-wider leading-none uppercase font-mono">pr bpm</span>
          <span className="text-2xl font-extrabold text-[#00E5FF] leading-none text-right font-mono tracking-tight animate-pulse">{pulseData.pr}</span>
        </div>

        {/* SpO2 Oxygen Oximeter Block */}
        <div className="h-[50%] p-2 flex flex-col justify-between">
          <span className="text-[8px] font-extrabold text-[#00E5FF] tracking-wider leading-none uppercase font-mono">SpO2 %</span>
          <span className="text-2xl font-extrabold text-[#00E5FF] leading-none text-right font-mono tracking-tight">{pulseData.spo2}</span>
        </div>
      </div>
    </div>
  )
}
