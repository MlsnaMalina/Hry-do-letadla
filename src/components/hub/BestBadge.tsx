interface Props { bestLabel: string; bestValue: string; accent?: string; align?: 'left' | 'right' }

export function BestBadge({ bestLabel, bestValue, accent, align = 'left' }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : 'flex-start', gap: 1 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{bestLabel}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: accent || 'var(--accent)' }}>{bestValue}</span>
    </div>
  )
}
