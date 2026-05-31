import { useRef, useEffect, useState } from 'react'
import { type Patient } from '../types'

interface VitalsCanvasChartProps {
  patient: Patient
  chartType: 'heartRate' | 'temp'
}

export default function VitalsCanvasChart({ patient, chartType }: VitalsCanvasChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const getVitalsHistory = (p: Patient, type: 'heartRate' | 'temp') => {
    const currentVal = type === 'heartRate' ? p.vitals.heartRate : p.vitals.temp
    const seed = p.id.charCodeAt(3) || 10
    if (type === 'heartRate') {
      return [
        currentVal - 4 - (seed % 3),
        currentVal + 2 + (seed % 4),
        currentVal - 2 + (seed % 2),
        currentVal + 5 - (seed % 5),
        currentVal - 1 + (seed % 3),
        currentVal
      ]
    } else {
      return [
        currentVal - 0.4 - ((seed % 3) / 10),
        currentVal + 0.2 + ((seed % 4) / 10),
        currentVal - 0.2 + ((seed % 2) / 10),
        currentVal + 0.5 - ((seed % 5) / 10),
        currentVal - 0.1 + ((seed % 3) / 10),
        currentVal
      ]
    }
  }

  const history = getVitalsHistory(patient, chartType)
  const minVal = Math.min(...history) - (chartType === 'heartRate' ? 5 : 0.5)
  const maxVal = Math.max(...history) + (chartType === 'heartRate' ? 5 : 0.5)
  const strokeColor = chartType === 'heartRate' ? '#E11D48' : '#D97706'
  const labels = ['12h ago', '9h ago', '6h ago', '3h ago', '1h ago', 'Current']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const render = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      const width = rect.width
      const height = rect.height

      const paddingLeft = 40
      const paddingRight = 20
      const paddingTop = 20
      const paddingBottom = 30
      const chartWidth = width - paddingLeft - paddingRight
      const chartHeight = height - paddingTop - paddingBottom

      const getX = (idx: number) => paddingLeft + idx * (chartWidth / 5)
      const getY = (val: number) => {
        const ratio = (val - minVal) / (maxVal - minVal)
        return height - paddingBottom - ratio * chartHeight
      }

      // Draw grid lines
      ctx.lineWidth = 1
      ctx.strokeStyle = '#E2E8F0'
      ctx.setLineDash([4, 4])
      ctx.font = '600 10px sans-serif'
      ctx.fillStyle = '#94A3B8'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'

      const ratios = [0, 0.5, 1]
      ratios.forEach(ratio => {
        const yVal = height - paddingBottom - ratio * chartHeight
        const displayVal = minVal + ratio * (maxVal - minVal)

        ctx.beginPath()
        ctx.moveTo(paddingLeft, yVal)
        ctx.lineTo(width - paddingRight, yVal)
        ctx.stroke()

        ctx.setLineDash([])
        const labelText = chartType === 'heartRate' ? Math.round(displayVal).toString() : displayVal.toFixed(1)
        ctx.fillText(labelText, paddingLeft - 10, yVal)
        ctx.setLineDash([4, 4])
      })

      ctx.setLineDash([])

      // Draw X axis labels
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      labels.forEach((label, idx) => {
        const xVal = getX(idx)
        ctx.fillText(label, xVal, height - paddingBottom + 10)
      })

      // Draw filled area under curve
      if (history.length > 0) {
        const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom)
        if (chartType === 'heartRate') {
          areaGrad.addColorStop(0, 'rgba(225, 29, 72, 0.25)')
          areaGrad.addColorStop(1, 'rgba(225, 29, 72, 0.00)')
        } else {
          areaGrad.addColorStop(0, 'rgba(217, 119, 6, 0.25)')
          areaGrad.addColorStop(1, 'rgba(217, 119, 6, 0.00)')
        }

        ctx.beginPath()
        ctx.moveTo(getX(0), getY(history[0]))
        for (let i = 1; i < history.length; i++) {
          ctx.lineTo(getX(i), getY(history[i]))
        }
        ctx.lineTo(getX(history.length - 1), height - paddingBottom)
        ctx.lineTo(getX(0), height - paddingBottom)
        ctx.closePath()
        ctx.fillStyle = areaGrad
        ctx.fill()

        // Draw line curve
        ctx.beginPath()
        ctx.moveTo(getX(0), getY(history[0]))
        for (let i = 1; i < history.length; i++) {
          ctx.lineTo(getX(i), getY(history[i]))
        }
        ctx.lineWidth = 2.5
        ctx.strokeStyle = strokeColor
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

        // Draw dots
        history.forEach((val, idx) => {
          const cx = getX(idx)
          const cy = getY(idx === 5 ? (chartType === 'heartRate' ? patient.vitals.heartRate : patient.vitals.temp) : val)

          // Outer pulse glow if hovered
          if (hoverIndex === idx) {
            ctx.beginPath()
            ctx.arc(cx, cy, 8, 0, 2 * Math.PI)
            ctx.fillStyle = chartType === 'heartRate' ? 'rgba(225, 29, 72, 0.15)' : 'rgba(217, 119, 6, 0.15)'
            ctx.fill()
          }

          ctx.beginPath()
          ctx.arc(cx, cy, 4, 0, 2 * Math.PI)
          ctx.fillStyle = strokeColor
          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 1.5
          ctx.fill()
          ctx.stroke()
        })

        // Draw tooltip if hovered
        if (hoverIndex !== null) {
          const cx = getX(hoverIndex)
          const cy = getY(hoverIndex === 5 ? (chartType === 'heartRate' ? patient.vitals.heartRate : patient.vitals.temp) : history[hoverIndex])
          const valueVal = hoverIndex === 5 ? (chartType === 'heartRate' ? patient.vitals.heartRate : patient.vitals.temp) : history[hoverIndex]
          const unit = chartType === 'heartRate' ? ' bpm' : '°F'
          const text = `${labels[hoverIndex]}: ${chartType === 'heartRate' ? Math.round(valueVal) : valueVal.toFixed(1)}${unit}`

          ctx.font = 'bold 11px sans-serif'
          const textWidth = ctx.measureText(text).width
          const tooltipWidth = textWidth + 16
          const tooltipHeight = 24
          const tooltipX = Math.max(paddingLeft, Math.min(width - paddingRight - tooltipWidth, cx - tooltipWidth / 2))
          const tooltipY = Math.max(paddingTop, cy - tooltipHeight - 10)

          ctx.fillStyle = 'rgba(27, 45, 94, 0.95)'
          ctx.beginPath()
          const radius = 6
          if (ctx.roundRect) {
            ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, radius)
          } else {
            ctx.rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)
          }
          ctx.fill()

          ctx.fillStyle = '#FFFFFF'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(text, tooltipX + 8, tooltipY + tooltipHeight / 2)
        }
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      animationId = requestAnimationFrame(render)
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    render()

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationId)
    }
  }, [hoverIndex, patient, chartType, history, minVal, maxVal, strokeColor])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    const paddingLeft = 40
    const paddingRight = 20
    const chartWidth = rect.width - paddingLeft - paddingRight
    const getX = (idx: number) => paddingLeft + idx * (chartWidth / 5)

    let foundIdx: number | null = null
    for (let i = 0; i < history.length; i++) {
      const cx = getX(i)
      const dist = Math.abs(x - cx)
      if (dist < 20) {
        foundIdx = i
        break
      }
    }

    if (foundIdx !== hoverIndex) {
      setHoverIndex(foundIdx)
    }
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  return (
    <div ref={containerRef} className="w-full relative h-[180px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}
