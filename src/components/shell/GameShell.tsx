import type { ReactNode } from 'react'
import { RoughFrame } from '../primitives/RoughFrame'
import { RoughUnderline } from '../primitives/RoughUnderline'

export interface Player { name: string; mark: string; color: string }
export interface ScoreEntry { value: number | string; color: string }

// ── CtrlIcon ──────────────────────────────────────────────────────────────
function CtrlIcon({ name }: { name: string }) {
  const c = { width: 22, height: 22, viewBox: '0 0 24 24', style: { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 2 } }
  switch (name) {
    case 'back':    return <svg {...c}><path d="M15 5C11 8 8 11 6 12C8 13 11 16 15 19" /><path d="M6 12C11 11.6 16 12.3 19 12" /></svg>
    case 'restart': return <svg {...c}><path d="M19 7C17 4.5 13.5 3.6 10.5 4.6C6 6 4.3 11 6.2 15C8 19 13 20.5 17 18C19 16.7 20 14.7 20 12.5" /><path d="M19 4C19.2 5.6 19.2 6.6 19 7.5C18 7.4 16.8 7.4 15.5 7.2" /></svg>
    case 'pause':   return <svg {...c}><path d="M9 5C9.2 9 9.2 15 9 19" /><path d="M15 5C15.2 9 15.2 15 15 19" /></svg>
    case 'play':    return <svg {...c}><path d="M8 5C12 8 16 10 18 12C16 14 12 16 8 19C7.8 14 7.8 10 8 5Z" fill="currentColor" /></svg>
    case 'rules':   return <svg {...c}><path d="M9 9C9 6.5 11 5 13 5.6C16 6.5 16 10 13 12C11.5 13 11 14 11 16" /><circle cx="11" cy="19.5" r="0.4" /></svg>
    case 'close':   return <svg {...c}><path d="M6 6C9 9 14 14 18 18M18 6C14 10 9 15 6 18" /></svg>
    default: return null
  }
}

// ── PillBtn ───────────────────────────────────────────────────────────────
function PillBtn({ icon, label, onClick, active }: { icon: string; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      display: 'flex', alignItems: 'center', gap: 7, padding: '0 15px',
      height: 44, minWidth: 44, borderRadius: 999, border: 'none', cursor: 'pointer',
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? '#06120F' : 'var(--text)',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
      whiteSpace: 'nowrap', transition: 'background .15s, color .15s',
    }}>
      <CtrlIcon name={icon} />
      {label}
    </button>
  )
}

// ── TurnIndicator ─────────────────────────────────────────────────────────
function TurnIndicator({ players, active, style = 'pills', winner }: { players: Player[]; active: number; style?: string; winner?: number | null | 'draw' }) {
  if (style === 'versus') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {players.map((p, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i === 1 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>VS</span>}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: active === i || winner != null ? 1 : 0.45, transition: 'opacity .2s' }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: active === i ? p.color : 'var(--text)' }}>{p.name}</span>
              <div style={{ width: 26, height: 6 }}>{active === i && <RoughUnderline color={p.color} w={26} sw={3} />}</div>
            </div>
          </span>
        ))}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {players.map((p, i) => {
        const on = active === i
        return (
          <div key={i} style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 999,
            background: on ? 'var(--accent-tint-soft)' : 'transparent', transition: 'all .22s ease',
            boxShadow: on ? `0 0 0 1.5px ${p.color}, 0 0 16px -3px ${p.color}` : undefined, opacity: on ? 1 : 0.5,
          }}>
            <span style={{ width: 16, height: 16, borderRadius: 999, background: p.color, color: '#06120F', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800, fontFamily: 'var(--font-mono)', boxShadow: on ? `0 0 10px ${p.color}` : undefined }}>{p.mark}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{p.name}</span>
            {on && <span className="turn-dot" style={{ width: 6, height: 6, borderRadius: 999, background: p.color }} />}
          </div>
        )
      })}
    </div>
  )
}

// ── ScoreTracker ──────────────────────────────────────────────────────────
function ScoreTracker({ scores }: { scores: ScoreEntry[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
      {scores.map((s, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>:</span>}
          <span style={{ fontSize: 17, color: s.color, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 10px ${s.color}` }}>{s.value}</span>
        </span>
      ))}
    </div>
  )
}

// ── ResultsModal ──────────────────────────────────────────────────────────
export function ResultsModal({ open, title, line, sub, onAgain, onHub }: { open: boolean; title: string; line: string; sub: string; onAgain: () => void; onHub: () => void }) {
  if (!open) return null
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'grid', placeItems: 'center', padding: 22, background: 'rgba(5,7,12,0.66)', backdropFilter: 'blur(6px)' }}>
      <div className="pop-in" style={{ position: 'relative', width: '100%', maxWidth: 290, background: 'var(--card-solid)', borderRadius: 22, padding: '28px 22px 22px', textAlign: 'center', boxShadow: '0 24px 70px rgba(0,0,0,0.55), 0 0 40px var(--accent-tint-strong)' }}>
        <RoughFrame stroke="var(--accent)" strokeWidth={1.5} radius={22} glow="var(--accent-tint-strong)" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--accent)', filter: 'drop-shadow(0 0 10px var(--accent))' }}>
          <svg width="18" height="18" viewBox="0 0 48 48" style={{ fill: 'var(--accent)', stroke: 'none' }}><path d="M24 6C25 16 32 23 42 24C32 25 25 32 24 42C23 32 16 25 6 24C16 23 23 16 24 6Z" /></svg>
          <svg width="36" height="36" viewBox="0 0 48 48" style={{ fill: 'none', stroke: 'var(--accent)', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M16 10H32V22C32 28 28 31 24 31C20 31 16 28 16 22V10Z" /><path d="M16 14C11 14 9 16 10 20C11 23 14 24 16 24M32 14C37 14 39 16 38 20C37 23 34 24 32 24" strokeWidth="2.4" /><path d="M24 31V37M18 40H30M20 40C20 37 22 37 24 37C26 37 28 37 28 40" /></svg>
          <svg width="18" height="18" viewBox="0 0 48 48" style={{ fill: 'var(--accent)', stroke: 'none' }}><path d="M24 6C25 16 32 23 42 24C32 25 25 32 24 42C23 32 16 25 6 24C16 23 23 16 24 6Z" /></svg>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{sub}</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, margin: '6px 0 4px', color: 'var(--text)', lineHeight: 1.05 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 22px' }}>{line}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onAgain} style={{ position: 'relative', padding: '14px', border: 'none', background: 'var(--accent)', color: '#06120F', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, cursor: 'pointer', borderRadius: 14, boxShadow: '0 0 22px var(--accent-tint-strong)' }}>Hrát znovu</button>
          <button onClick={onHub} style={{ position: 'relative', padding: '12px', border: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer', borderRadius: 14 }}>
            <RoughFrame stroke="var(--border-strong)" strokeWidth={1} radius={14} />Zpět do herny
          </button>
        </div>
      </div>
    </div>
  )
}

// ── RulesSheet ────────────────────────────────────────────────────────────
export function RulesSheet({ open, tag, rules, onClose }: { open: boolean; tag: string; rules: string[]; onClose: () => void }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 35, display: 'flex', alignItems: 'flex-end', background: 'rgba(5,7,12,0.5)', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} className="sheet-up" style={{ position: 'relative', width: '100%', background: 'var(--card-solid)', borderRadius: '24px 24px 0 0', padding: '14px 22px 26px', boxShadow: '0 -10px 40px rgba(0,0,0,0.4)' }}>
        <RoughFrame stroke="var(--border-strong)" strokeWidth={1} radius={24} style={{ borderBottom: 'none' }} />
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--text-muted)', opacity: 0.5, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: 0, color: 'var(--text)' }}>Pravidla</h3>
          <button onClick={onClose} aria-label="Zavřít" style={{ width: 36, height: 36, borderRadius: 10, background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'grid', placeItems: 'center', position: 'relative' }}>
            <RoughFrame stroke="var(--border)" strokeWidth={1} radius={10} /><CtrlIcon name="close" />
          </button>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 10 }}>{tag}</div>
        <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rules.map((r, i) => (
            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: 'var(--accent-tint-medium)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, display: 'grid', placeItems: 'center' }}>{i + 1}</span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>{r}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// ── CountdownTimer ────────────────────────────────────────────────────────
export function CountdownTimer({ value, total, style = 'ring', paused }: { value: number; total: number; style?: string; paused: boolean }) {
  const frac = Math.max(0, Math.min(1, value / total))
  const danger = value <= 3
  const col = danger ? 'var(--accent-hover)' : 'var(--accent)'
  if (style === 'digits') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <span className={danger && !paused ? 'pulse' : ''} style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 52, lineHeight: 1, color: col, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 22px ${col}`, transition: 'color .2s' }}>{value.toFixed(1)}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>sekund</span>
      </div>
    )
  }
  // ring (default)
  const R = 46, C = 2 * Math.PI * R
  return (
    <div style={{ position: 'relative', width: 124, height: 124, display: 'grid', placeItems: 'center' }}>
      <svg width="124" height="124" viewBox="0 0 124 124" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="62" cy="62" r={R} fill="none" stroke="var(--accent-tint-soft)" strokeWidth="9" />
        <circle cx="62" cy="62" r={R} fill="none" stroke={col} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - frac)}
          style={{ transition: paused ? 'none' : 'stroke-dashoffset .1s linear', filter: `drop-shadow(0 0 6px ${col})` }} />
      </svg>
      <div className={danger && !paused ? 'pulse' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 34, color: col, lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 14px ${col}` }}>{Math.ceil(value)}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>s</span>
      </div>
    </div>
  )
}

// ── GameShell ─────────────────────────────────────────────────────────────
interface ShellProps {
  players: Player[]
  active: number
  scores: ScoreEntry[]
  winner?: number | null | 'draw'
  turnStyle?: string
  onBack: () => void
  onRestart: () => void
  onPause: () => void
  paused: boolean
  onRules: () => void
  children: ReactNode
  banner?: ReactNode
}

export function GameShell({ players, active, scores, winner, turnStyle = 'pills', onBack, onRestart, onPause, paused, onRules, children, banner }: ShellProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* top bar */}
      <div style={{ flexShrink: 0, padding: '6px 12px 10px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} aria-label="Zpět do herny" style={{ position: 'relative', width: 40, height: 40, minWidth: 40, borderRadius: 12, background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
          <RoughFrame stroke="var(--text)" strokeWidth={1.6} radius={12} />
          <CtrlIcon name="back" />
        </button>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <TurnIndicator players={players} active={active} style={turnStyle} winner={winner} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>skóre</span>
          <ScoreTracker scores={scores} />
        </div>
      </div>

      {/* game zone */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 16px', overflow: 'hidden' }}>
        {banner}
        {children}
      </div>

      {/* bottom controls — floating pill bar */}
      <div style={{ flexShrink: 0, padding: '8px 16px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', padding: '4px', borderRadius: 999,
          background: 'color-mix(in srgb, var(--card-solid) 96%, #fff)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 28px rgba(0,0,0,0.35), 0 0 0 1px var(--border)',
        }}>
          <PillBtn icon="restart" label="Restart" onClick={onRestart} />
          <div style={{ width: 1, height: 22, background: 'var(--border)', flexShrink: 0, opacity: 0.7 }} />
          <PillBtn icon={paused ? 'play' : 'pause'} label={paused ? 'Hrát' : 'Pauza'} onClick={onPause} active={paused} />
          <div style={{ width: 1, height: 22, background: 'var(--border)', flexShrink: 0, opacity: 0.7 }} />
          <PillBtn icon="rules" label="Pravidla" onClick={onRules} />
        </div>
      </div>
    </div>
  )
}
