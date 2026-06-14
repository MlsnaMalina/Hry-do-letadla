import { GameIcon } from '../icons/GameIcon'

export function OfflinePill() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999,
      background: 'var(--card-bg)', backdropFilter: 'blur(16px)', boxShadow: 'var(--glass-shadow)',
    }}>
      <span className="turn-dot" style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
      <span style={{ display: 'grid', placeItems: 'center', color: 'var(--accent)' }}><GameIcon name="airplane" size={14} /></span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.04em', color: 'var(--text-muted)' }}>režim v letadle</span>
    </div>
  )
}
