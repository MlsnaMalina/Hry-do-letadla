import { useState, useEffect, useRef, useCallback } from 'react'
import { GameShell, RulesSheet } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import type { GameDef, GameMode } from '../../data/games'
import { norm, canonCz, CZ_WORDS, EN_WORDS, addCustomWord, bannedWords, banWord, isInDict } from '../../data/dict'

const ROUND_SECS = 90

// Canonical key for a word in this language
function canonical(word: string, lang: 'cs' | 'en'): string {
  return lang === 'cs' ? canonCz(word) : norm(word)
}

// Can this word be formed from the letter pool?
// Czech: exact char match (Č ≠ C, Á ≠ A) — pool and word both use canonical uppercase
// English: same (no diacritics anyway)
function canForm(word: string, pool: string[]): boolean {
  const chars = [...word]  // spread handles multi-byte chars
  if (chars.length < 2) return false
  const avail = [...pool]
  for (const ch of chars) {
    const i = avail.indexOf(ch)
    if (i === -1) return false
    avail.splice(i, 1)
  }
  return true
}

// Generate 11 letters from a language-appropriate pool
function genLetters(lang: 'cs' | 'en'): string[] {
  // Czech: ~30 % diacritic letters so hands reliably contain Č, Á, Í, Ž, Ů…
  const CZ = 'AAÁÁBBCČČDDEEEĚĚÉFGHHIÍIÍJKKLMMNNNOOPRRŘSSSŠTTTUŮŮŮVVYZÝŽŽŽ'
  const EN = 'AAAAAABBCCDDDEEEEEEFFFGGHHIIIIIIJKKLLLLLMMNNNNOOOOOOOPPPRRRRSSSSTTTTTTUUUUVVWWYZ'
  const src = (lang === 'cs' ? CZ : EN).split('')
  const chosen: string[] = []
  while (chosen.length < 11 && src.length > 0) {
    const i = Math.floor(Math.random() * src.length)
    chosen.push(src.splice(i, 1)[0])
  }
  return chosen
}

// Find all dictionary words the AI can form from this pool
function findAiWords(pool: string[], lang: 'cs' | 'en'): string[] {
  const dict = lang === 'cs' ? CZ_WORDS : EN_WORDS
  const result: string[] = []
  for (const word of dict) {
    if (canForm(word, pool) && !bannedWords[lang].has(word)) result.push(word)
  }
  return result.sort(() => Math.random() - 0.5)
}

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }
type Phase = 'play' | 'handover' | 'results'

export function Slovnik({ game, mode, turnStyle, onBack, onBestUpdate }: Props) {
  const [lang, setLang] = useState<'cs' | 'en'>('cs')
  const [letters, setLetters] = useState<string[]>(() => genLetters('cs'))
  const [input, setInput] = useState('')
  const [p0Words, setP0Words] = useState<string[]>([])
  const [p1Words, setP1Words] = useState<string[]>([])
  const [pvpTurn, setPvpTurn] = useState<0 | 1>(0)
  const [time, setTime] = useState(ROUND_SECS)
  const [phase, setPhase] = useState<Phase>('play')
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const [scores, setScores] = useState([0, 0])
  const [inputError, setInputError] = useState(false)
  const [dictVersion, setDictVersion] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const p0Ref = useRef<string[]>([])
  const p1Ref = useRef<string[]>([])
  p0Ref.current = p0Words
  p1Ref.current = p1Words

  const players = mode === 'ai'
    ? [{ name: 'Vy', mark: '✎', color: 'var(--p1)' }, { name: 'AI', mark: '●', color: 'var(--p2)' }]
    : [{ name: 'Hráč 1', mark: '1', color: 'var(--p1)' }, { name: 'Hráč 2', mark: '2', color: 'var(--p2)' }]

  const evaluate = useCallback((hw: string[], ow: string[]) => {
    const hValid = hw.filter(w => isInDict(w, lang))
    const oValid = ow.filter(w => isInDict(w, lang))
    const oSet = new Set(oValid)
    const hSet = new Set(hValid)
    const hUniq = hValid.filter(w => !oSet.has(w))
    const oUniq = oValid.filter(w => !hSet.has(w))
    const shared = hValid.filter(w => oSet.has(w))
    return { hUniq, oUniq, hValid, oValid, shared }
  }, [lang])

  const endRound = useCallback(() => {
    const { hUniq, oUniq } = evaluate(p0Ref.current, p1Ref.current)
    const s0 = hUniq.length, s1 = oUniq.length
    setScores([s0, s1])
    setPhase('results')
    onBestUpdate?.(`${Math.max(s0, s1)} slov`)
  }, [evaluate, onBestUpdate])

  // Countdown
  useEffect(() => {
    if (phase !== 'play' || paused) return
    if (time <= 0) {
      if (mode === 'pvp' && pvpTurn === 0) setPhase('handover')
      else endRound()
      return
    }
    const id = setInterval(() => setTime(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [phase, paused, time, mode, pvpTurn, endRound])

  // AI plays in background
  useEffect(() => {
    if (mode !== 'ai' || phase !== 'play') return
    const possible = findAiWords(letters, lang)
    const target = 4 + Math.floor(Math.random() * 6)
    const toSubmit = possible.slice(0, target)
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let delay = 5000 + Math.random() * 8000
    for (const word of toSubmit) {
      const d = delay
      timeouts.push(setTimeout(() => {
        setP1Words(w => w.includes(word) ? w : [...w, word])
      }, d))
      delay += 7000 + Math.random() * 12000
    }
    return () => timeouts.forEach(clearTimeout)
  }, [letters, lang, mode])

  // Compute which letter tiles are consumed by current input (exact char match)
  const inputCounts: Record<string, number> = {}
  for (const ch of [...input]) inputCounts[ch] = (inputCounts[ch] || 0) + 1
  const tileConsumed = (() => {
    const counts: Record<string, number> = {}
    return letters.map(l => {
      counts[l] = (counts[l] || 0) + 1
      return counts[l] - 1 < (inputCounts[l] || 0)
    })
  })()

  const submit = () => {
    const raw = input.trim()
    if (raw.length < 2) return
    if (!canForm(raw, letters)) {
      setInputError(true)
      setTimeout(() => setInputError(false), 500)
      if ('vibrate' in navigator) navigator.vibrate([20, 30, 20])
      return
    }
    const key = canonical(raw, lang)
    const currentWords = pvpTurn === 0 ? p0Words : p1Words
    if (currentWords.includes(key)) { setInput(''); return }
    if ('vibrate' in navigator) navigator.vibrate(8)
    if (pvpTurn === 0) setP0Words(w => [...w, key])
    else setP1Words(w => [...w, key])
    setInput('')
    inputRef.current?.focus()
  }

  const restart = (newLang = lang) => {
    const nl = genLetters(newLang)
    setLetters(nl)
    setP0Words([]); setP1Words([])
    setTime(ROUND_SECS); setPhase('play')
    setPvpTurn(0); setPaused(false); setInput(''); setScores([0, 0])
  }

  const changeLang = (l: 'cs' | 'en') => { setLang(l); restart(l) }
  const timerColor = time <= 10 ? 'var(--accent-hover)' : 'var(--accent)'
  const currentWords = pvpTurn === 0 ? p0Words : p1Words
  const { hUniq, oUniq, shared, hValid, oValid } = phase === 'results'
    ? evaluate(p0Words, p1Words)
    : { hUniq: [] as string[], oUniq: [] as string[], shared: [] as string[], hValid: [] as string[], oValid: [] as string[] }
  const winnerIdx = hUniq.length > oUniq.length ? 0 : hUniq.length < oUniq.length ? 1 : -1

  // PvP handover screen
  if (phase === 'handover') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', gap: 24, padding: 32, background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: 'var(--text)' }}>Hráč 1 hotov!</div>
          <div style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 14 }}>
            Zadal {p0Words.length} slov. Předejte zařízení Hráči 2 — jeho slova budou skrytá.
          </div>
        </div>
        <button onClick={() => { setTime(ROUND_SECS); setPhase('play'); setPvpTurn(1) }} style={{
          padding: '16px 32px', borderRadius: 999, border: 'none',
          background: 'var(--accent)', color: '#06120F',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, cursor: 'pointer',
          boxShadow: '0 0 24px var(--accent-tint-strong)',
        }}>
          Hráč 2 je připraven →
        </button>
      </div>
    )
  }

  const WordChip = ({ word, status, onAdd, onRemove }: { word: string; status: 'uniq' | 'shared' | 'invalid'; onAdd?: () => void; onRemove?: () => void }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: (status === 'invalid' && onAdd) || onRemove ? '4px 5px 4px 10px' : '4px 10px', borderRadius: 999,
      background: status === 'uniq' ? 'var(--accent-tint-medium)' : status === 'shared' ? 'var(--card-bg)' : 'rgba(255,80,80,0.12)',
      color: status === 'uniq' ? 'var(--accent)' : status === 'shared' ? 'var(--text-muted)' : '#ff6b6b',
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
      textDecoration: status === 'invalid' ? 'line-through' : 'none',
    }}>
      {word}
      {status === 'invalid' && onAdd && (
        <button onClick={onAdd} title="Přidat do slovníku" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 18, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.15)', color: '#ff6b6b', fontSize: 12, fontWeight: 800,
          lineHeight: 1, padding: 0, flexShrink: 0,
        }}>+</button>
      )}
      {status !== 'invalid' && onRemove && (
        <button onClick={onRemove} title="Odebrat ze slovníku" style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 18, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.12)', color: 'var(--text-muted)', fontSize: 14, fontWeight: 800,
          lineHeight: 1, padding: 0, flexShrink: 0,
        }}>−</button>
      )}
    </span>
  )

  return (
    <GameShell players={players} active={mode === 'pvp' ? pvpTurn : 0}
      winner={phase === 'results' ? (winnerIdx >= 0 ? winnerIdx : null) : null}
      scores={[{ value: scores[0], color: players[0].color }, { value: scores[1], color: players[1].color }]}
      turnStyle={turnStyle ?? 'pills'} onBack={onBack} onRestart={() => restart()}
      onPause={() => setPaused(p => !p)} paused={paused} onRules={() => setRules(true)}>

      {/* Language + timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 10 }}>
        {(['cs', 'en'] as const).map(l => (
          <button key={l} onClick={() => changeLang(l)} style={{
            padding: '5px 13px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: lang === l ? 'var(--accent)' : 'var(--card-bg)',
            color: lang === l ? '#06120F' : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11,
          }}>{l === 'cs' ? 'čeština' : 'english'}</button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 28, lineHeight: 1,
            color: timerColor, fontVariantNumeric: 'tabular-nums',
            textShadow: `0 0 12px ${timerColor}`, transition: 'color .3s',
            animation: time <= 10 && !paused ? 'pulse .7s ease-in-out infinite' : 'none',
          }}>{time}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>s</span>
        </div>
      </div>

      {/* Letter tiles */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 8, width: '100%' }}>
        {letters.map((l, i) => {
          const consumed = tileConsumed[i]
          return (
            <button key={i} onClick={() => { if (!consumed) setInput(inp => inp + l) }} style={{
              width: 38, height: 42, borderRadius: 10, border: 'none',
              cursor: consumed ? 'default' : 'pointer',
              background: consumed ? 'var(--card-bg)' : 'var(--card-solid)',
              color: consumed ? 'var(--text-muted)' : 'var(--text)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19,
              boxShadow: consumed ? 'none' : 'var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.14)',
              opacity: consumed ? 0.35 : 1,
              transition: 'opacity .12s, background .12s',
              flexShrink: 0,
            }}>{l}</button>
          )
        })}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 6, width: '100%', marginBottom: 10 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase().normalize('NFC'))}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={lang === 'cs' ? 'Napiš podstatné jméno…' : 'Type a noun…'}
          autoCapitalize="characters"
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 12,
            border: `1.5px solid ${inputError ? '#ff6b6b' : 'var(--border)'}`,
            background: 'var(--card-bg)', color: 'var(--text)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            outline: 'none', transition: 'border-color .15s',
          }}
        />
        <button onClick={() => setInput(i => i.slice(0, -1))} style={{
          width: 44, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'var(--card-solid)', color: 'var(--text)', fontSize: 18,
          boxShadow: 'var(--glass-shadow)',
        }}>⌫</button>
        <button onClick={submit} style={{
          padding: '0 18px', height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'var(--accent)', color: '#06120F',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
          boxShadow: '0 0 14px var(--accent-tint-strong)',
        }}>OK</button>
      </div>

      {/* Word chips */}
      <div style={{ flex: 1, overflowY: 'auto', width: '100%', minHeight: 0 }}>
        {currentWords.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '8px 0' }}>
            {lang === 'cs' ? 'Zadej podstatná jména složená z písmen výše' : 'Enter nouns using the letters above'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {currentWords.map((w, i) => (
              <span key={i} style={{
                padding: '6px 13px', borderRadius: 999,
                background: 'var(--accent-tint-soft)',
                border: '1px solid var(--accent-tint-medium)',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14,
              }}>{w}</span>
            ))}
          </div>
        )}
      </div>

      {/* Results panel */}
      {phase === 'results' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(5,7,12,0.72)', backdropFilter: 'blur(8px)' }}>
          <div className="pop-in" style={{ position: 'relative', width: '100%', maxWidth: 340, background: 'var(--card-solid)', borderRadius: 22, padding: '22px 18px 18px', boxShadow: '0 24px 70px rgba(0,0,0,0.55)', maxHeight: '88vh', overflowY: 'auto' }}>
            <RoughFrame stroke="var(--accent)" strokeWidth={1.5} radius={22} glow="var(--accent-tint-strong)" />
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>výsledek</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, margin: '0 0 2px', color: 'var(--text)' }}>
                {winnerIdx === 0 ? (mode === 'ai' ? 'Vyhráváš!' : 'Vyhrává Hráč 1!') : winnerIdx === 1 ? (mode === 'ai' ? 'Vyhrává AI' : 'Vyhrává Hráč 2!') : 'Remíza!'}
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>
                {hUniq.length} : {oUniq.length} unikátních slov
              </div>
            </div>
            {[{ label: players[0].name, color: players[0].color, valid: hValid, all: p0Words, uniq: hUniq }, { label: players[1].name, color: players[1].color, valid: oValid, all: p1Words, uniq: oUniq }].map(({ label, color, valid, all, uniq }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color, marginBottom: 6, textTransform: 'uppercase' }}>
                  {label} — {uniq.length} unik.
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {valid.map(w => <WordChip key={w + dictVersion} word={w} status={shared.includes(w) ? 'shared' : 'uniq'} onRemove={() => {
                    banWord(w, lang)
                    setDictVersion(v => v + 1)
                  }} />)}
                  {all.filter(w => !valid.includes(w)).map(w => (
                    <WordChip key={w + dictVersion} word={w} status="invalid" onAdd={() => {
                      addCustomWord(w, lang)
                      setDictVersion(v => v + 1)
                    }} />
                  ))}
                  {all.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>žádná slova</span>}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
              <button onClick={() => restart()} style={{ padding: '14px', border: 'none', background: 'var(--accent)', color: '#06120F', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, cursor: 'pointer', borderRadius: 14, boxShadow: '0 0 22px var(--accent-tint-strong)' }}>Hrát znovu</button>
              <button onClick={onBack} style={{ position: 'relative', padding: '12px', border: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer', borderRadius: 14 }}>
                <RoughFrame stroke="var(--border-strong)" strokeWidth={1} radius={14} />Zpět do herny
              </button>
            </div>
          </div>
        </div>
      )}

      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={() => setRules(false)} />
    </GameShell>
  )
}
