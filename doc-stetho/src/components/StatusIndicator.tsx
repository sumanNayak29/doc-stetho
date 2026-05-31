interface StatusIndicatorProps {
  color?: 'emerald' | 'red' | 'amber' | 'blue' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  className?: string
  title?: string
}

export default function StatusIndicator({
  color = 'emerald',
  size = 'md',
  pulse = true,
  className = '',
  title
}: StatusIndicatorProps) {
  const dotColors = {
    emerald: 'bg-emerald-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500'
  }

  const pingColors = {
    emerald: 'bg-emerald-400',
    red: 'bg-red-400',
    amber: 'bg-amber-400',
    blue: 'bg-blue-400',
    indigo: 'bg-indigo-400'
  }

  const sizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5'
  }

  const dotClass = dotColors[color]
  const pingClass = pingColors[color]
  const sizeClass = sizes[size]

  return (
    <span className={`relative flex ${sizeClass} shrink-0 ${className}`} title={title}>
      {pulse && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingClass}`} />
      )}
      <span className={`relative inline-flex rounded-full h-full w-full ${dotClass}`} />
    </span>
  )
}
