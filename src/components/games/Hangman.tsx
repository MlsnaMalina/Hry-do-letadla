import { useState, useEffect } from 'react'
import { GameShell, ResultsModal, RulesSheet } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import { Doodle } from '../icons/Doodle'
import { HANGMAN_WORDS } from '../../data/words'
import type { GameDef, GameMode } from '../../data/games'

const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Hangman({ game, mode, turnStyle, onBack, onBestUpdate }: Props) {
  const pickRandom = () => HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)]

  const [phase, setPhase] = useState<'setup' | 'play'>(() => mode === 'pvp' ? 'setup' : 'play')
  const [entry, setEntry] = useState(pickRandom)
  const [setupWord, setSetupWord] = useState('')
  const [setupHint, setSetupHint] = useState('')
  const [showPvpWord, setShowPvpWord] = useState(false)
  const [setupErr, setSetupErr] = useState('')
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

  const guess = (l: string) => {
    if (over || paused || guessed.has(l)) return
    const g = new Set(guessed); g.add(l); setGuessed(g)
  }

  useEffect(() => {
    if (won && mode !== 'pvp') {
      setSolved(s => { const n = s + 1; onBestUpdate?.(`${n}`); return n })
    }
  }, [won])

  const startPvp = () => {
    const w = setupWord.trim().toUpperCase().replace(/[^A-Z]/g, '')
    if (w.length < 2) { setSetupErr('Slovo musí mít aspoň 2 písmena (A–Z)'); return }
    setSetupErr('')
    setEntry({ w, h: setupHint.trim() || '' })
    setGuessed(new Set())
    setPhase('play')
  }

  const selectPreset = (preset: { w: string; h: string }) => {
    setSetupWord(preset.w)
    setSetupHint(preset.h)
    setSetupErr('')
  }

  const next = () => {
    if (mode === 'pvp') { setSetupWord(''); setSetupHint(''); setSetupErr(''); setPhase('setup') }
    else setEntry(pickRandom())
    setGuessed(new Set()); setPaused(false)
  }

  const restart = () => {
    if (mode === 'pvp') { setSetupWord(''); setSetupHint(''); setSetupErr(''); setPhase('setup') }
    else { setEntry(pickRandom()); setSolved(0) }
    setGuessed(new Set()); setPaused(false)
  }

  // PvP setup screen
  if (phase === 'setup') {
    const cleanWord = setupWord.trim().toUpperCase().replace(/[^A-Z]/g, '')
    const valid = cleanWord.length >= 2

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', flexShrink: 0 }}>
          <button onClick={onBack} style={{ background: 'var(--card-bg)', border: 'none', color: 'var(--text)', borderRadius: 10, padding: '8px 14px', fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer' }}>← Zpět</button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>Hangman — Hráč 1</span>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* instruction */}
          <div style={{ position: 'relative', padding: '12px 16px', borderRadius: 14, background: 'var(--accent-tint-soft)' }}>
            <RoughFrame stroke="var(--accent)" strokeWidth={1} radius={14} />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--accent)' }}>Hráč 1</strong> — zadej tajné slovo. Pak předej telefon hráči 2, ať háde.
            </p>
          </div>

          {/* word input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>TAJNÉ SLOVO (jen A–Z)</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 0 }}>
              <input
                type={showPvpWord ? 'text' : 'password'}
                value={setupWord}
                onChange={e => { setSetupWord(e.target.value); setSetupErr('') }}
                placeholder="např. ADVENTURE"
                autoComplete="off"
                autoCapitalize="characters"
                style={{ flex: 1, padding: '13px 44px 13px 15px', borderRadius: 12, border: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', outline: 'none', boxSizing: 'border-box' }}
              />
              <RoughFrame stroke={setupErr ? 'var(--accent-hover)' : 'var(--border-strong)'} strokeWidth={1.5} radius={12} />
              <button onClick={() => setShowPvpWord(v => !v)}
                style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, padding: 4, lineHeight: 1 }}>
                {showPvpWord ? '🙈' : '👁'}
              </button>
            </div>
            {setupErr && <span style={{ fontSize: 12, color: 'var(--accent-hover)', fontWeight: 600 }}>{setupErr}</span>}
          </div>

          {/* hint input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>NÁPOVĚDA PRO HRÁČE 2 (nepovinné)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={setupHint}
                onChange={e => setSetupHint(e.target.value)}
                placeholder="např. druh dopravy, zvíře…"
                style={{ width: '100%', boxSizing: 'border-box', padding: '11px 15px', borderRadius: 12, border: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }}
              />
              <RoughFrame stroke="var(--border)" strokeWidth={1} radius={12} />
            </div>
          </div>

          {/* preset words */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>NEBO VYBER ZE SLOVNÍKU</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {HANGMAN_WORDS.map(w => (
                <button key={w.w} onClick={() => selectPreset(w)}
                  style={{ padding: '6px 12px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', background: setupWord.toUpperCase() === w.w ? 'var(--accent)' : 'var(--accent-tint-soft)', color: setupWord.toUpperCase() === w.w ? '#06120F' : 'var(--text)', transition: 'all .15s' }}>
                  {w.w}
                </button>
              ))}
            </div>
          </div>

          {/* submit */}
          <button onClick={startPvp} disabled={!valid}
            style={{ position: 'relative', padding: '15px', border: 'none', borderRadius: 14, background: valid ? 'var(--accent)' : 'var(--accent-tint-soft)', color: valid ? '#06120F' : 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, cursor: valid ? 'pointer' : 'not-allowed', boxShadow: valid ? '0 0 22px var(--accent-tint-strong)' : 'none', transition: 'all .2s', marginTop: 4 }}>
            Předat hráči 2 →
          </button>
        </div>
      </div>
    )
  }

  // Game screen
  const players = mode === 'pvp'
    ? [{ name: 'Hráč 1', mark: 'A', color: 'var(--accent)' }, { name: 'Hráč 2', mark: 'B', color: 'var(--p2)' }]
    : [{ name: 'Vy', mark: 'A', color: 'var(--accent)' }]

  const winTitle = mode === 'pvp'
    ? (won ? 'Uhádnuto! Vyhrává hráč 2' : 'Vyhrává Hráč 1!')
    : (won ? 'Uhádnuto!' : 'Došly pokusy')

  return (
    <GameShell players={players} active={mode === 'pvp' ? 1 : 0}
      scores={mode === 'pvp' ? [] : [{ value: solved, color: 'var(--accent)' }]} turnStyle={turnStyle}
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
        {entry.h && (
          <div style={{ position: 'relative', padding: '8px 14px', borderRadius: 999, background: 'var(--accent-tint-soft)', maxWidth: 280, textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.04em' }}>// hint&nbsp;&nbsp;</span>
            <span style={{ fontSize: 13, color: 'var(--text)' }}>{entry.h}</span>
          </div>
        )}
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
      <ResultsModal open={over} sub={mode === 'pvp' ? 'Pass & play' : 'Practice English'}
        title={winTitle}
        line={won ? `„${word}" — výborně!` : `Slovo bylo „${word}".`}
        onAgain={next} onHub={onBack} />
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={() => setRules(false)} />
    </GameShell>
  )
}
