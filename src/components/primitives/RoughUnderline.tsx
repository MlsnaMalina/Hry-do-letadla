interface Props { color?: string; w?: number; sw?: number }

export function RoughUnderline({ color = 'var(--accent)', w = 120, sw = 3 }: Props) {
  return (
    <div style={{ width: w, height: sw, borderRadius: 999, background: color, boxShadow: `0 0 10px ${color}` }} />
  )
}
