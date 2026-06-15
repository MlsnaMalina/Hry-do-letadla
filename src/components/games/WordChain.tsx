import { useState, useEffect, useRef } from 'react'
import { GameShell, ResultsModal, RulesSheet, CountdownTimer } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import { WORDCHAIN_OK } from '../../data/words'
import { isInDict } from '../../data/dict'
import type { GameDef, GameMode } from '../../data/games'

const START = 7

// English starters — balanced last-letter distribution so each game starts on a different letter
const EN_STARTERS = [
  'BRAVE','CRANE','DANCE','MUSIC',
  'CLEAN','STERN','CABIN','LEMON',
  'SPORT','LIGHT','CRAFT','SCOUT',
  'BLOOM','DREAM','STORM','CREAM',
  'CLOUD','BLEND','BREAD','PROUD',
  'WATER','TOWER','TIGER','NORTH',
  'TRACK','BLACK','BLANK','CHALK',
  'NOVEL','METAL','FLASH','GLASS',
]

// Czech starters — diverse endings, all verified present in CZ_WORDS
const CS_STARTERS = [
  'ŠKOLA','KRÁVA','BRÁNA','HORA','MAPA',
  'MOŘE','DVEŘE',
  'KOLO','AUTO','LÉTO','RÁNO','OKNO',
  'MOST','HOST',
  'HRAD',
  'DRAK','PTÁK','VLAK',
  'DŮM',
  'SLON','BALÓN',
  'MÍČ','MUŽ',
  'PLES','HLAS',
]

const pickStarter = (lang: 'cs' | 'en') => {
  const list = lang === 'cs' ? CS_STARTERS : EN_STARTERS
  return list[Math.floor(Math.random() * list.length)]
}

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function WordChain({ game, mode, turnStyle, onBack, onBestUpdate }: Props) {
  const [lang, setLang] = useState<'cs' | 'en'>('en')
  const [chain, setChain] = useState<string[]>(() => [pickStarter('en')])
  const [time, setTime] = useState(START)
  const [active, setActive] = useState(0)
  const [over, setOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const players = mode === 'ai'
    ? [{ name: 'Vy', mark: '1', color: 'var(--accent)' }]
    : [{ name: 'Hráč 1', mark: '1', color: 'var(--accent)' }, { name: 'Hráč 2', mark: '2', color: 'var(--text)' }]
  const last = chain[chain.length - 1]
  const needLetter = [...last].at(-1)!
  const used = new Set(chain)

  useEffect(() => {
    if (over || paused || rules) return
    const id = setInterval(() => {
      setTime(t => {
        const n = +(t - 0.1).toFixed(1)
        if (n <= 0) { clearInterval(id); setOver(true); return 0 }
        return n
      })
    }, 100)
    return () => clearInterval(id)
  }, [over, paused, rules, active, chain.length])

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const w = val.trim().toUpperCase().normalize('NFC')
    if (!w) return
    if ([...w][0] !== needLetter) { flash(`Musí začínat na „${needLetter}"`); return }
    if (used.has(w)) { flash('Slovo už bylo použito'); return }
    const valid = lang === 'cs'
      ? isInDict(w, 'cs') || w.length >= 4
      : WORDCHAIN_OK.has(w.toLowerCase()) || w.length >= 4
    if (!valid) { flash('Neznámé slovo'); return }
    const newChain = [...chain, w]
    setChain(newChain); setVal(''); setErr('')
    onBestUpdate?.(`${newChain.length - 1} slov`)
    setTime(START)
    if (mode !== 'ai') setActive(a => 1 - a)
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  const flash = (m: string) => { setErr(m); setTimeout(() => setErr(''), 1200) }

  const restart = (newLang = lang) => {
    setChain([pickStarter(newLang)]); setTime(START); setActive(0)
    setOver(false); setPaused(false); setVal(''); setErr('')
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  const changeLang = (l: 'cs' | 'en') => { setLang(l); restart(l) }

  return (
    <GameShell players={players} active={active} winner={undefined}
      scores={[{ value: chain.length - 1, color: 'var(--accent)' }]} turnStyle={turnStyle}
      onBack={onBack} onRestart={() => restart()} onPause={() => setPaused(p => !p)} paused={paused} onRules={() => setRules(true)}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
        {/* language selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['cs', 'en'] as const).map(l => (
            <button key={l} onClick={() => changeLang(l)} style={{
              padding: '5px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: lang === l ? 'var(--accent)' : 'var(--card-bg)',
              color: lang === l ? '#06120F' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11,
              transition: 'background .15s, color .15s',
            }}>{l === 'cs' ? 'čeština' : 'english'}</button>
          ))}
        </div>
        <CountdownTimer value={time} total={START} style="ring" paused={paused} />
        {/* required letter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>další slovo na</span>
          <span style={{ position: 'relative', width: 40, height: 40, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--accent)', textShadow: '0 0 12px var(--accent)' }}>
            <RoughFrame stroke="var(--accent)" strokeWidth={1.5} radius={12} glow="var(--accent-tint-strong)" />{needLetter}
          </span>
        </div>
        {/* chain history */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 300, minHeight: 28 }}>
          {chain.slice(-5).map((w, i, a) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, padding: '4px 9px', borderRadius: 999, background: i === a.length - 1 ? 'var(--accent)' : 'var(--accent-tint-soft)', color: i === a.length - 1 ? '#06120F' : 'var(--text)', boxShadow: i === a.length - 1 ? '0 0 12px var(--accent-tint-strong)' : undefined }}>{w}</span>
          ))}
        </div>
        {/* input */}
        <form onSubmit={submit} style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%' }} className={err ? 'shake' : ''}>
            <input ref={inputRef} value={val} onChange={e => setVal(e.target.value)} disabled={over || paused}
              placeholder={`slovo na ${needLetter}…`} autoComplete="off" autoCapitalize="characters"
              style={{ width: '100%', boxSizing: 'border-box', padding: '13px 15px', borderRadius: 12, border: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16, textTransform: 'uppercase', outline: 'none' }} />
            <RoughFrame stroke={err ? 'var(--accent-hover)' : 'var(--border-strong)'} strokeWidth={1.5} radius={12} />
          </div>
          <div style={{ height: 16, fontSize: 12, color: 'var(--accent-hover)', fontWeight: 600 }}>{err}</div>
          <button type="submit" disabled={over || paused} style={{ position: 'relative', width: '100%', padding: '14px', border: 'none', background: 'var(--accent)', color: '#06120F', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, cursor: 'pointer', borderRadius: 14, boxShadow: '0 0 22px var(--accent-tint-strong)' }}>Potvrdit ↵</button>
        </form>
      </div>
      <ResultsModal open={over} sub={lang === 'cs' ? 'Řetěz slov — čeština' : 'Řetěz slov — angličtina'}
        title={mode !== 'ai' ? (1 - active === 0 ? 'Vyhrává Hráč 1!' : 'Vyhrává protihráč!') : 'Čas vypršel'}
        line={`Řetěz: ${chain.length - 1} slov`}
        onAgain={() => restart()} onHub={onBack} />
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={() => setRules(false)} />
    </GameShell>
  )
}
