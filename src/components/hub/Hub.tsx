import { hexA } from '../../lib/utils'
import { GAMES, type GameDef, type GameId, type GameMode } from '../../data/games'
import { Brand } from './Brand'
import { ThemeToggle } from './ThemeToggle'
import { OfflinePill } from './OfflinePill'
import { HeroBoardPreview } from './HeroBoardPreview'
import { ModeToggle } from './ModeToggle'
import { BestBadge } from './BestBadge'
import { IconChip } from './IconChip'
import { RoughFrame } from '../primitives/RoughFrame'

interface Props {
  theme: string
  onToggleTheme: () => void
  modes: Record<GameId, GameMode>
  setMode: (id: GameId, mode: GameMode) => void
  onPlay: (game: GameDef, mode: GameMode) => void
  bestScores: Record<GameId, string>
}

const glass = {
  background: 'var(--card-bg)',
  backdropFilter: 'blur(16px) saturate(140%)',
  WebkitBackdropFilter: 'blur(16px) saturate(140%)',
  boxShadow: 'var(--glass-shadow)',
}

export function Hub({ theme, onToggleTheme, modes, setMode, onPlay, bestScores }: Props) {
  const [hero, ...rest] = GAMES

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 20px 10px', flexShrink: 0 }}>
        <Brand />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      {/* Status row */}
      <div style={{ padding: '0 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <OfflinePill />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>6 her · 0 MB</span>
      </div>

      {/* Scroll area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Hero card — Piškvorky */}
        <div
          role="button" tabIndex={0}
          onClick={() => onPlay(hero, modes[hero.id])}
          onKeyDown={e => e.key === 'Enter' && onPlay(hero, modes[hero.id])}
          className="lift"
          style={{
            position: 'relative', flexShrink: 0, cursor: 'pointer', borderRadius: 24, padding: 18,
            overflow: 'hidden',
            background: `linear-gradient(150deg, ${hexA(hero.accent, 0.24)}, var(--card-solid) 80%)`,
            boxShadow: `0 14px 40px ${hexA(hero.accent, 0.22)}, var(--glass-shadow)`,
          }}
        >
          <RoughFrame stroke={hexA(hero.accent, 0.4)} strokeWidth={1} radius={24} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: hero.accent, textTransform: 'uppercase' }}>naposledy hrané</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 25, lineHeight: 0.95, color: 'var(--text)', marginTop: 7, letterSpacing: '-0.01em' }}>{hero.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: hero.accent, marginTop: 5 }}>{hero.tag}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.45 }}>{hero.desc}</div>
            </div>
            <HeroBoardPreview />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 16 }}>
            <ModeToggle value={modes[hero.id]} onChange={k => setMode(hero.id, k)} accent={hero.accent} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999,
              background: hero.accent, color: '#06120F',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
              boxShadow: `0 0 20px ${hexA(hero.accent, 0.55)}`,
            }}>Hrát <span style={{ fontSize: 16 }}>▶</span></span>
          </div>
        </div>

        {/* 2-column grid */}
        <div style={{ display: 'grid', flexShrink: 0, gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 13 }}>
          {rest.map(g => (
            <div
              key={g.id}
              role="button" tabIndex={0}
              onClick={() => onPlay(g, modes[g.id])}
              onKeyDown={e => e.key === 'Enter' && onPlay(g, modes[g.id])}
              className="lift card-hover"
              style={{ position: 'relative', cursor: 'pointer', borderRadius: 20, padding: 15, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 11, ...glass }}
            >
              <RoughFrame stroke="var(--border)" strokeWidth={1} radius={20} />
              <IconChip icon={g.icon} accent={g.accent} size={48} glyph={28} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16.5, color: 'var(--text)', lineHeight: 1.05 }}>{g.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: g.accent, marginTop: 3 }}>{g.tag}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 9, marginTop: 'auto', flexShrink: 0 }}>
                <BestBadge bestLabel={g.bestLabel} bestValue={bestScores[g.id] ?? g.defaultBest} accent={g.accent} />
                {!g.solo && <ModeToggle value={modes[g.id]} onChange={k => setMode(g.id, k)} accent={g.accent} mini />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
