import type { CSSProperties } from 'react'

interface Props {
  stroke?: string
  strokeWidth?: number
  radius?: number
  glow?: string
  dash?: boolean
  style?: CSSProperties
}

export function RoughFrame({ stroke = 'var(--border)', strokeWidth = 1, radius = 14, glow, dash, style }: Props) {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none',
      border: `${strokeWidth}px ${dash ? 'dashed' : 'solid'} ${stroke}`,
      boxShadow: glow ? `0 0 18px ${glow}, inset 0 0 12px ${glow}` : undefined,
      boxSizing: 'border-box',
      ...style,
    }} />
  )
}
