import { useState, useEffect } from 'react'
import { GameShell, ResultsModal, RulesSheet } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import { Doodle } from '../icons/Doodle'
import { HANGMAN_WORDS } from '../../data/words'
import type { GameDef } from '../../data/games'

const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

interface Props { game: GameDef; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Hangman({ game, turnStyle, onBack, onBestUpdate }: Props) {
  const pick = () => HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)]
  const [entry, setEntry] = useState(() => pick())
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set())
  const [solved, setSolved] = useState(0)
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const word = entry.w
  const wrong = [...guessed].filter(l => !word.includes(l))
  const lives = 5 - wrong.length
  const won = [...word].every(l => guessed.has(l))
  const lost = lives <= 0
  const over = won || lost
  const players = [{ name: 'Vy', mark: 'A', color: 'var(--accent)' }]

  const guess = (l: string) => {
    if (over || paused || guessed.has(l)) return
    const g = new Set(guessed); g.add(l); setGuessed(g)
  }

  useEffect(() => {
    if (won) {
      setSolved(s => {
        const n = s + 1; onBestUpdate?.(`${n}`); return n
      })
    }
  }, [won])

  const next = () => { setEntry(pick()); setGuessed(new Set()); setPaused(false) }
  const restart = () => { setEntry(pick()); setGuessed(new Set()); setSolved(0); setPaused(false) }

  return (
    <GameShell players={players} active={0}
      scores={[{ value: solved, color: 'var(--accent)' }]} turnStyle={turnStyle}
      onBack={onBack} onRestart={restart} onPause={() => setPaused(p => !p)} paused={paused} onRules={() => setRules(true)}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
        {/* lives */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.25, transition: 'opacity .25s', filter: i < lives ? 'drop-shadow(0 0 6px var(--accent))' : 'none' }}>
              <Doodle name="heart" size={22} color={i < lives ? 'var(--accent)' : 'var(--text-muted)'} filled={i < lives} />
            </span>
          ))}
        </div>
        {/* hint */}
        <div style={{ position: 'relative', padding: '8px 14px', borderRadius: 999, background: 'var(--accent-tint-soft)', maxWidth: 280, textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.04em' }}>// hint&nbsp;&nbsp;</span>
          <span style={{ fontSize: 13, color: 'var(--text)' }}>{entry.h}</span>
        </div>
        {/* word blanks */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 300 }}>
          {[...word].map((l, i) => (
            <div key={i} style={{ width: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span className={guessed.has(l) ? 'pop-in' : ''} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, lineHeight: 1, color: guessed.has(l) ? (over && !won ? 'var(--accent-hover)' : 'var(--text)') : 'transparent' }}>{l}</span>
              <div style={{ width: 24, height: 3, borderRadius: 999, background: 'var(--text-muted)' }} />
            </div>
          ))}
        </div>
        {/* keyboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320, marginTop: 2 }}>
          {QWERTY.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
              {[...row].map(l => {
                const used = guessed.has(l), miss = used && !word.includes(l)
                return (
                  <button key={l} onClick={() => guess(l)} disabled={used || over}
                    style={{
                      position: 'relative', flex: '1 1 0', minWidth: 0, height: 42, borderRadius: 9, border: 'none',
                      cursor: used || over ? 'default' : 'pointer',
                      background: used ? (miss ? 'transparent' : 'linear-gradient(160deg, var(--accent-hover), var(--accent))') : 'linear-gradient(160deg, color-mix(in srgb, var(--card-solid) 86%, #fff), var(--card-solid))',
                      boxShadow: used && !miss ? '0 0 12px var(--accent-tint-strong), inset 0 1px 0 rgba(255,255,255,0.4)' : (miss ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.3)'),
                      color: used ? (miss ? 'var(--text-muted)' : '#06120F') : 'var(--text)',
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14,
                      opacity: miss ? 0.4 : 1, transition: 'all .15s',
                    }}>
                    {!used && <RoughFrame stroke="var(--border)" strokeWidth={1} radius={9} />}
                    {miss && <RoughFrame stroke="var(--border)" strokeWidth={1} radius={9} dash />}
                    {l}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <ResultsModal open={over} sub="Practice English"
        title={won ? 'Uhádnuto!' : 'Došly pokusy'}
        line={won ? `„${word}" — výborně!` : `Slovo bylo „${word}".`}
        onAgain={next} onHub={onBack} />
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={() => setRules(false)} />
    </GameShell>
  )
}
