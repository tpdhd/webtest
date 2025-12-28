import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-blue-500 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-200 bg-white text-gray-900'
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className || ''}`}
      {...props}
    />
  )
}

export { Badge }
