import { RoughUnderline } from '../primitives/RoughUnderline'

export function Brand() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--accent)' }}>Travel</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 33, lineHeight: 0.9, letterSpacing: '-0.02em', color: 'var(--text)' }}>Arcade</span>
      <RoughUnderline w={92} sw={3} />
    </div>
  )
}
