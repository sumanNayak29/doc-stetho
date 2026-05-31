import { useRef, useEffect, useState } from 'react'

export default function AdmissionsCanvasChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const admissionsData = [12, 19, 15, 22, 18, 9, 14]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxAdmission = 25
  const strokeColor = '#1A7A8A'

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

      const padLeft = 40
      const padRight = 20
      const padTop = 20
      const padBottom = 30
      const cWidth = width - padLeft - padRight
      const cHeight = height - padTop - padBottom

      const getX = (idx: number) => padLeft + idx * (cWidth / 6)
      const getY = (val: number) => height - padBottom - (val / maxAdmission) * cHeight

      // Draw grid lines
      ctx.lineWidth = 1
      ctx.strokeStyle = '#E2E8F0'
      ctx.setLineDash([4, 4])
      ctx.font = '600 10px sans-serif'
      ctx.fillStyle = '#94A3B8'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'

      const ratios = [0, 0.25, 0.5, 0.75, 1]
      ratios.forEach(ratio => {
        const yVal = height - padBottom - ratio * cHeight
        const displayVal = Math.round(ratio * maxAdmission)
        
        ctx.beginPath()
        ctx.moveTo(padLeft, yVal)
        ctx.lineTo(width - padRight, yVal)
        ctx.stroke()

        ctx.setLineDash([])
        ctx.fillText(displayVal.toString(), padLeft - 10, yVal)
        ctx.setLineDash([4, 4])
      })

      ctx.setLineDash([])

      // Draw X axis days
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      days.forEach((day, idx) => {
        const xVal = getX(idx)
        ctx.fillText(day, xVal, height - padBottom + 10)
      })

      // Draw filled area under curve
      if (admissionsData.length > 0) {
        const areaGrad = ctx.createLinearGradient(0, padTop, 0, height - padBottom)
        areaGrad.addColorStop(0, 'rgba(26, 122, 138, 0.25)')
        areaGrad.addColorStop(1, 'rgba(26, 122, 138, 0.00)')

        ctx.beginPath()
        ctx.moveTo(getX(0), getY(admissionsData[0]))
        for (let i = 1; i < admissionsData.length; i++) {
          ctx.lineTo(getX(i), getY(admissionsData[i]))
        }
        ctx.lineTo(getX(admissionsData.length - 1), height - padBottom)
        ctx.lineTo(getX(0), height - padBottom)
        ctx.closePath()
        ctx.fillStyle = areaGrad
        ctx.fill()

        // Draw line curve
        ctx.beginPath()
        ctx.moveTo(getX(0), getY(admissionsData[0]))
        for (let i = 1; i < admissionsData.length; i++) {
          ctx.lineTo(getX(i), getY(admissionsData[i]))
        }
        ctx.lineWidth = 3
        ctx.strokeStyle = strokeColor
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

        // Draw dots
        admissionsData.forEach((val, idx) => {
          const cx = getX(idx)
          const cy = getY(val)

          // Outer pulse glow if hovered
          if (hoverIndex === idx) {
            ctx.beginPath()
            ctx.arc(cx, cy, 8, 0, 2 * Math.PI)
            ctx.fillStyle = 'rgba(26, 122, 138, 0.15)'
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
          const cy = getY(admissionsData[hoverIndex])
          const text = `${days[hoverIndex]}: ${admissionsData[hoverIndex]} admissions`

          ctx.font = 'bold 11px sans-serif'
          const textWidth = ctx.measureText(text).width
          const tooltipWidth = textWidth + 16
          const tooltipHeight = 24
          const tooltipX = Math.max(padLeft, Math.min(width - padRight - tooltipWidth, cx - tooltipWidth / 2))
          const tooltipY = Math.max(padTop, cy - tooltipHeight - 10)

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
  }, [hoverIndex])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    const padLeft = 40
    const padRight = 20
    const cWidth = rect.width - padLeft - padRight
    const getX = (idx: number) => padLeft + idx * (cWidth / 6)

    let foundIdx: number | null = null
    for (let i = 0; i < admissionsData.length; i++) {
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
