import { useRef, useEffect, useState } from 'react'
import { type Patient } from '../types'

interface ConditionsCanvasChartProps {
  patientsList: Patient[]
}

export default function ConditionsCanvasChart({ patientsList }: ConditionsCanvasChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const conditionCounts: Record<string, number> = {}
  patientsList.forEach(p => {
    conditionCounts[p.condition] = (conditionCounts[p.condition] || 0) + 1
  })
  const sortedConditions = Object.entries(conditionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const totalPatients = patientsList.length || 1
  const maxCount = sortedConditions.length > 0 ? sortedConditions[0][1] : 1

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

      if (sortedConditions.length === 0) {
        ctx.fillStyle = '#94A3B8'
        ctx.font = '500 13px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('No patient data available.', width / 2, height / 2)
        return
      }

      const padLeft = 15
      const padRight = 15
      const padTop = 10
      const padBottom = 10
      const usableHeight = height - padTop - padBottom
      const rowCount = sortedConditions.length
      const rowHeight = usableHeight / rowCount

      sortedConditions.forEach(([condition, count], idx) => {
        const percentage = ((count / totalPatients) * 100).toFixed(1)
        const barMaxWidth = width - padLeft - padRight
        const barWidth = (count / maxCount) * barMaxWidth
        const rowY = padTop + idx * rowHeight
        
        // Hover state background highlight
        if (hoverIndex === idx) {
          ctx.fillStyle = 'rgba(241, 245, 249, 0.6)'
          ctx.beginPath()
          const r = 8
          if (ctx.roundRect) {
            ctx.roundRect(padLeft - 5, rowY + 2, barMaxWidth + 10, rowHeight - 4, r)
          } else {
            ctx.rect(padLeft - 5, rowY + 2, barMaxWidth + 10, rowHeight - 4)
          }
          ctx.fill()
        }

        // Draw Text labels: Condition Name (top-left of row) & Count/Percentage (top-right of row)
        ctx.font = 'bold 12px sans-serif'
        ctx.fillStyle = '#1B2D5E'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        ctx.fillText(condition, padLeft, rowY + 6)

        ctx.font = '600 11px sans-serif'
        ctx.fillStyle = '#94A3B8'
        ctx.textAlign = 'right'
        ctx.fillText(`${count} patients (${percentage}%)`, width - padRight, rowY + 7)

        // Draw track bar background
        const barY = rowY + 24
        const barH = 10
        ctx.fillStyle = '#F1F5F9'
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(padLeft, barY, barMaxWidth, barH, 5)
        } else {
          ctx.rect(padLeft, barY, barMaxWidth, barH)
        }
        ctx.fill()

        // Draw active gradient bar
        const gradient = ctx.createLinearGradient(padLeft, 0, padLeft + barWidth, 0)
        gradient.addColorStop(0, '#1A7A8A')
        gradient.addColorStop(1, '#4DBFBF')
        ctx.fillStyle = gradient
        
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(padLeft, barY, barWidth, barH, 5)
        } else {
          ctx.rect(padLeft, barY, barWidth, barH)
        }
        ctx.fill()
      })
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
  }, [sortedConditions, hoverIndex, patientsList, totalPatients, maxCount])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const y = e.clientY - rect.top

    const padTop = 10
    const usableHeight = rect.height - 20
    const rowCount = sortedConditions.length
    if (rowCount === 0) return
    const rowHeight = usableHeight / rowCount

    const idx = Math.floor((y - padTop) / rowHeight)
    if (idx >= 0 && idx < rowCount) {
      if (idx !== hoverIndex) {
        setHoverIndex(idx)
      }
    } else {
      setHoverIndex(null)
    }
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  return (
    <div ref={containerRef} className="w-full h-[180px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}
