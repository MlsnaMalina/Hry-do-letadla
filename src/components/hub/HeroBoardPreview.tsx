const N = 5, cell = 23
const X_CELLS = [0, 6, 12, 18]
const O_CELLS = [2, 3, 7, 16]
const WIN_CELLS = new Set([0, 6, 12, 18, 24])

function XMark({ lit }: { lit: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'var(--p1)', strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round', filter: `drop-shadow(0 0 ${lit ? 6 : 4}px var(--p1))` }}>
      <path d="M6 6L18 18M18 6L6 18" />
    </svg>
  )
}

function OMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'var(--p2)', strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round', filter: 'drop-shadow(0 0 4px var(--p2))' }}>
      <circle cx="12" cy="12" r="7" />
    </svg>
  )
}

export function HeroBoardPreview() {
  return (
    <div style={{
      position: 'relative', padding: 9, borderRadius: 14, flexShrink: 0,
      background: 'linear-gradient(165deg, color-mix(in srgb, var(--p1) 12%, var(--bg-elevated)), var(--bg-elevated))',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.30), inset 0 0 0 1px var(--border)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${N}, ${cell}px)`, gridTemplateRows: `repeat(${N}, ${cell}px)`,
        borderRadius: 7, overflow: 'hidden', boxShadow: 'inset 0 0 12px rgba(0,0,0,0.28)',
      }}>
        {Array.from({ length: N * N }, (_, i) => {
          const isX = X_CELLS.includes(i), isO = O_CELLS.includes(i), lit = WIN_CELLS.has(i) && isX
          return (
            <div key={i} style={{
              width: cell, height: cell, border: '0.5px solid var(--border)',
              display: 'grid', placeItems: 'center',
              background: WIN_CELLS.has(i) ? 'var(--accent-tint-strong)' : 'transparent',
            }}>
              {isX ? <XMark lit={lit} /> : isO ? <OMark /> : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
