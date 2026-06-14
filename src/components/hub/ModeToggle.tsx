import { hexA } from '../../lib/utils'
import type { GameMode } from '../../data/games'

interface Props {
  value: GameMode
  onChange: (v: GameMode) => void
  accent?: string
  mini?: boolean
  onDark?: boolean
}

export function ModeToggle({ value, onChange, accent = 'var(--accent)', mini, onDark }: Props) {
  const opts: { k: GameMode; label: string }[] = [
    { k: 'ai', label: 'vs AI' },
    { k: 'pvp', label: '2 hráči' },
  ]
  const accentRgba = accent.startsWith('#') ? hexA(accent, 0.5) : undefined
  return (
    <div onClick={e => e.stopPropagation()} style={{
      position: 'relative', display: 'inline-flex', padding: 3, borderRadius: 999,
      background: onDark ? 'rgba(255,255,255,0.16)' : 'var(--accent-tint-soft)',
      border: onDark ? 'none' : '1px solid var(--border)',
    }}>
      {opts.map(o => {
        const on = value === o.k
        return (
          <span key={o.k} role="button" tabIndex={0}
            onClick={() => onChange(o.k)}
            onKeyDown={e => e.key === 'Enter' && onChange(o.k)}
            style={{
              position: 'relative', cursor: 'pointer', borderRadius: 999,
              padding: mini ? '5px 10px' : '7px 13px',
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              fontSize: mini ? 10 : 11, letterSpacing: '0.02em', whiteSpace: 'nowrap',
              transition: 'all .2s var(--ease-out)',
              background: on ? (onDark ? '#fff' : accent) : 'transparent',
              color: on ? (onDark ? '#0D1422' : '#06120F') : 'var(--text-muted)',
              boxShadow: on && !onDark && accentRgba ? `0 0 12px ${accentRgba}` : undefined,
            }}>{o.label}</span>
        )
      })}
    </div>
  )
}
