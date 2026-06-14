import { useState, useEffect, useRef, useCallback } from 'react'
import { GameShell, ResultsModal, RulesSheet } from '../shell/GameShell'
import type { GameDef, GameMode } from '../../data/games'

const COLS = 20, ROWS = 16
const CELL = Math.min(17, Math.max(14, Math.floor(((typeof window !== 'undefined' ? window.innerWidth : 375) - 32) / COLS)))

type Pos = [number, number]
type Dir = 'up' | 'down' | 'left' | 'right'
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }

function heart(cx: number, cy: number, r: number): string {
  const y0 = cy - 0.3 * r
  return [
    `M ${cx} ${y0}`,
    `C ${cx} ${cy - 0.9 * r} ${cx - r} ${cy - 0.9 * r} ${cx - r} ${y0}`,
    `C ${cx - r} ${cy + 0.25 * r} ${cx} ${cy + 0.75 * r} ${cx} ${cy + r}`,
    `C ${cx} ${cy + 0.75 * r} ${cx + r} ${cy + 0.25 * r} ${cx + r} ${y0}`,
    `C ${cx + r} ${cy - 0.9 * r} ${cx} ${cy - 0.9 * r} ${cx} ${y0}`,
    'Z',
  ].join(' ')
}

function randomFood(snake: Pos[]): Pos {
  const taken = new Set(snake.map(([r, c]) => r * 1000 + c))
  for (let attempt = 0; attempt < 500; attempt++) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!taken.has(r * 1000 + c)) return [r, c]
  }
  return [0, 0]
}

const initDir: Dir = 'right'
const initSnake: Pos[] = [[Math.floor(ROWS / 2), Math.floor(COLS / 2)]]

interface GS { snake: Pos[]; food: Pos; score: number; dead: boolean }
function mkInit(): GS { return { snake: initSnake, food: randomFood(initSnake), score: 0, dead: false } }

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Had({ game, onBack, onBestUpdate }: Props) {
  const [gs, setGs] = useState<GS>(mkInit)
  const [speed, setSpeed] = useState(250)
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const dirRef = useRef<Dir>(initDir)
  const highRef = useRef(0)
  const W = COLS * CELL, H = ROWS * CELL

  // Track session high score
  useEffect(() => {
    if (gs.score > highRef.current) {
      highRef.current = gs.score
      onBestUpdate?.(`${gs.score}`)
    }
  }, [gs.score, onBestUpdate])

  // Speed up every 5 pickups
  const prevScore = useRef(0)
  useEffect(() => {
    if (gs.score > prevScore.current && gs.score % 5 === 0 && gs.score > 0) {
      setSpeed(s => Math.max(100, s - 20))
    }
    prevScore.current = gs.score
  }, [gs.score])

  const tick = useCallback(() => {
    setGs(prev => {
      if (prev.dead) return prev
      const dir = dirRef.current
      const [hr, hc] = prev.snake[0]
      let nr = hr, nc = hc
      if (dir === 'up') nr--
      else if (dir === 'down') nr++
      else if (dir === 'left') nc--
      else nc++
      nr = ((nr % ROWS) + ROWS) % ROWS
      nc = ((nc % COLS) + COLS) % COLS

      const snakeBody = prev.snake.slice(0, -1)
      if (snakeBody.some(([r, c]) => r === nr && c === nc)) {
        if ('vibrate' in navigator) navigator.vibrate([30, 40, 30])
        return { ...prev, dead: true }
      }

      const ateFood = nr === prev.food[0] && nc === prev.food[1]
      const head: Pos = [nr, nc]
      const newSnake = ateFood ? [head, ...prev.snake] : [head, ...prev.snake.slice(0, -1)]
      if (ateFood && 'vibrate' in navigator) navigator.vibrate(8)
      return {
        snake: newSnake,
        food: ateFood ? randomFood(newSnake) : prev.food,
        score: ateFood ? prev.score + 1 : prev.score,
        dead: false,
      }
    })
  }, [])

  useEffect(() => {
    if (gs.dead || paused) return
    const id = setInterval(tick, speed)
    return () => clearInterval(id)
  }, [gs.dead, paused, speed, tick])

  const changeDir = useCallback((d: Dir) => {
    if (OPPOSITE[d] !== dirRef.current) dirRef.current = d
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
      const d = map[e.key]
      if (d) { e.preventDefault(); changeDir(d) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [changeDir])

  const touchStart = useRef<[number, number] | null>(null)

  const restart = () => {
    dirRef.current = initDir
    setGs(mkInit())
    setSpeed(250)
    prevScore.current = 0
    setPaused(false)
  }

  const DBtn = ({ dir, label }: { dir: Dir; label: string }) => (
    <button
      onPointerDown={e => { e.preventDefault(); changeDir(dir) }}
      style={{
        width: CELL * 3, height: CELL * 3, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: 'var(--card-solid)', color: 'var(--text)', fontSize: CELL * 1.1,
        display: 'grid', placeItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
        WebkitUserSelect: 'none', userSelect: 'none', touchAction: 'none',
      }}
    >{label}</button>
  )

  return (
    <GameShell
      players={[{ name: 'Skóre', mark: '♥', color: 'var(--accent)' }]}
      active={0}
      scores={[{ value: gs.score, color: 'var(--accent)' }]}
      turnStyle="solo"
      onBack={onBack} onRestart={restart}
      onPause={() => setPaused(p => !p)} paused={paused}
      onRules={() => setRules(true)}
    >
      {/* Grid */}
      <svg
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          display: 'block', borderRadius: 14,
          background: 'color-mix(in srgb, var(--card-solid) 97%, #000)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
          touchAction: 'none',
        }}
        onTouchStart={e => { touchStart.current = [e.touches[0].clientX, e.touches[0].clientY] }}
        onTouchEnd={e => {
          if (!touchStart.current) return
          const dx = e.changedTouches[0].clientX - touchStart.current[0]
          const dy = e.changedTouches[0].clientY - touchStart.current[1]
          touchStart.current = null
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return
          changeDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'))
        }}
      >
        <defs>
          <filter id="hglow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid dots */}
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => (
            <circle key={`g${r}${c}`}
              cx={c * CELL + CELL / 2} cy={r * CELL + CELL / 2}
              r="0.7" fill="var(--border)" opacity="0.3"
            />
          ))
        )}

        {/* Food */}
        <path
          d={heart(gs.food[1] * CELL + CELL / 2, gs.food[0] * CELL + CELL / 2, CELL * 0.4)}
          fill="var(--text)" opacity={0.85}
        />

        {/* Snake — render tail first so head is on top */}
        {[...gs.snake].reverse().map(([r, c], revIdx) => {
          const segIdx = gs.snake.length - 1 - revIdx
          const isHead = segIdx === 0
          const cx = c * CELL + CELL / 2, cy = r * CELL + CELL / 2
          return (
            <path
              key={`s${r}${c}${segIdx}`}
              d={heart(cx, cy, isHead ? CELL * 0.44 : CELL * 0.36)}
              fill={isHead ? '#FF3EA5' : '#FF79C6'}
              opacity={isHead ? 1 : Math.max(0.5, 0.85 - segIdx * 0.012)}
              filter={isHead ? 'url(#hglow)' : undefined}
            />
          )
        })}
      </svg>

      {/* D-pad */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 10 }}>
        <DBtn dir="up" label="↑" />
        <div style={{ display: 'flex', gap: 4 }}>
          <DBtn dir="left" label="←" />
          <div style={{ width: CELL * 3, height: CELL * 3, borderRadius: 12, background: 'var(--card-bg)', display: 'grid', placeItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, color: 'var(--text-muted)' }}>{gs.score}</span>
          </div>
          <DBtn dir="right" label="→" />
        </div>
        <DBtn dir="down" label="↓" />
      </div>

      <ResultsModal
        open={gs.dead}
        title="Konec!"
        line={`Skóre: ${gs.score}`}
        sub={gs.score >= 20 ? 'Výborně!' : gs.score >= 10 ? 'Dobrá práce!' : 'Zkus to znovu!'}
        onAgain={restart}
        onHub={onBack}
      />
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={() => setRules(false)} />
    </GameShell>
  )
}
