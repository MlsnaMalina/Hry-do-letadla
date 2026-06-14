import { useState, useEffect } from 'react'
import { GameShell, ResultsModal, RulesSheet, type Player } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import type { GameDef, GameMode } from '../../data/games'

const N = 9, WIN = 5

function mkPlayers(mode: GameMode): Player[] {
  return mode === 'ai'
    ? [{ name: 'Vy', mark: '✕', color: 'var(--p1)' }, { name: 'AI', mark: '○', color: 'var(--p2)' }]
    : [{ name: 'Hráč 1', mark: '✕', color: 'var(--p1)' }, { name: 'Hráč 2', mark: '○', color: 'var(--p2)' }]
}

function Mark({ kind, color, win }: { kind: number; color: string; win: boolean }) {
  const s = { fill: 'none', stroke: color, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, filter: `drop-shadow(0 0 5px ${color})` }
  if (kind === 0) return <svg width="22" height="22" viewBox="0 0 24 24" style={s} className={win ? 'pop-in' : ''}><path strokeWidth="3.4" d="M6 6L18 18M18 6L6 18" /></svg>
  return <svg width="22" height="22" viewBox="0 0 24 24" style={s} className={win ? 'pop-in' : ''}><circle strokeWidth="3.4" cx="12" cy="12" r="7" /></svg>
}

function check(b: (number | null)[], idx: number, p: number): number[] | null {
  const x = idx % N, y = Math.floor(idx / N)
  const dirs: [number, number][] = [[1,0],[0,1],[1,1],[1,-1]]
  for (const [dx, dy] of dirs) {
    const line = [idx]
    for (const s of [1, -1]) {
      let cx = x + dx * s, cy = y + dy * s
      while (cx >= 0 && cx < N && cy >= 0 && cy < N && b[cy * N + cx] === p) {
        line.push(cy * N + cx); cx += dx * s; cy += dy * s
      }
    }
    if (line.length >= WIN) return line
  }
  return null
}

function evaluateCell(b: (number | null)[], idx: number, player: number): number {
  const x = idx % N, y = Math.floor(idx / N)
  let score = 0
  const dirs: [number, number][] = [[1,0],[0,1],[1,1],[1,-1]]
  for (const [dx, dy] of dirs) {
    let count = 1, open = 0
    for (const s of [1, -1] as const) {
      let nx = x + dx * s, ny = y + dy * s
      while (nx >= 0 && nx < N && ny >= 0 && ny < N && b[ny * N + nx] === player) {
        count++; nx += dx * s; ny += dy * s
      }
      if (nx >= 0 && nx < N && ny >= 0 && ny < N && b[ny * N + nx] == null) open++
    }
    if (count >= WIN) score += 1_000_000
    else if (count === WIN - 1) score += open >= 2 ? 50_000 : open === 1 ? 10_000 : 0
    else if (count === WIN - 2) score += open >= 2 ? 500 : open === 1 ? 100 : 0
    else if (count >= 2) score += open * count * 5
    else score += open
  }
  return score
}

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Piskvorky({ game, mode, turnStyle, onBack, onBestUpdate }: Props) {
  const empty = () => Array<number | null>(N * N).fill(null)
  const [board, setBoard] = useState(empty)
  const [active, setActive] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [winner, setWinner] = useState<number | null>(null)
  const [winCells, setWinCells] = useState<number[]>([])
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const players = mkPlayers(mode)

  const place = (idx: number) => {
    if (board[idx] != null || winner != null || paused) return
    const b = board.slice(); b[idx] = active
    const w = check(b, idx, active)
    setBoard(b)
    if (w) {
      setWinner(active); setWinCells(w)
      setScores(s => { const n = s.slice(); n[active]++; onBestUpdate?.(`${n[0]} výher`); return n })
    } else setActive(a => 1 - a)
  }

  useEffect(() => {
    if (mode === 'ai' && active === 1 && winner == null && !paused) {
      const t = setTimeout(() => {
        const empties: number[] = []
        board.forEach((v, i) => { if (v == null) empties.push(i) })
        if (!empties.length) return

        const doPlace = (i: number) => {
          const b = board.slice(); b[i] = 1
          const w = check(b, i, 1)
          setBoard(b)
          if (w) { setWinner(1); setWinCells(w); setScores(s => { const n = s.slice(); n[1]++; return n }) }
          else setActive(0)
        }

        // 1. Win immediately
        for (const i of empties) {
          const b = board.slice(); b[i] = 1
          if (check(b, i, 1)) { doPlace(i); return }
        }
        // 2. Block player win
        for (const i of empties) {
          const b = board.slice(); b[i] = 0
          if (check(b, i, 0)) { doPlace(i); return }
        }
        // 3. 30% of the time play a reasonable random move (keeps AI beatable)
        if (Math.random() < 0.30) {
          const occ = board.map((v, i) => v != null ? i : -1).filter(i => i >= 0)
          if (occ.length > 0) {
            const adj = new Set<number>()
            occ.forEach(oi => {
              const x = oi % N, y = Math.floor(oi / N)
              for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
                const nx = x + dx, ny = y + dy
                if (nx >= 0 && nx < N && ny >= 0 && ny < N && board[ny * N + nx] == null) adj.add(ny * N + nx)
              }
            })
            const adjArr = [...adj]
            if (adjArr.length > 0) { doPlace(adjArr[Math.floor(Math.random() * adjArr.length)]); return }
          }
        }
        // 4. Strategic best move
        let best = empties[0], bestScore = -1
        for (const i of empties) {
          const score = evaluateCell(board, i, 1) + evaluateCell(board, i, 0) * 0.9
          if (score > bestScore) { bestScore = score; best = i }
        }
        doPlace(best)
      }, 500)
      return () => clearTimeout(t)
    }
  }, [active, mode, winner, paused, board])

  const restart = () => { setBoard(empty()); setActive(0); setWinner(null); setWinCells([]); setPaused(false) }

  const winTitle = winner === 0
    ? (mode === 'ai' ? 'Vyhráváš!' : 'Vyhrává Hráč 1!')
    : (mode === 'ai' ? 'Vyhrává AI' : 'Vyhrává protihráč!')

  return (
    <GameShell players={players} active={active} winner={winner}
      scores={[{ value: scores[0], color: players[0].color }, { value: scores[1], color: players[1].color }]}
      turnStyle={turnStyle} onBack={onBack} onRestart={restart} onPause={() => setPaused(p => !p)} paused={paused} onRules={() => setRules(true)}>
      <div style={{ position: 'relative', padding: 10, borderRadius: 16, background: 'linear-gradient(165deg, color-mix(in srgb, var(--accent) 10%, var(--card-solid)), var(--card-solid))', boxShadow: 'var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.12)' }}>
        <RoughFrame stroke="var(--border-strong)" strokeWidth={1} radius={16} />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${N}, 30px)`, gridTemplateRows: `repeat(${N}, 30px)`, borderRadius: 8, overflow: 'hidden', boxShadow: 'inset 0 0 14px rgba(0,0,0,0.2)' }}>
          {board.map((v, i) => {
            const isWin = winCells.includes(i), isEmpty = v == null && winner == null
            return (
              <button key={i} onClick={() => place(i)} className={isEmpty ? 'ttt-cell' : ''}
                style={{ width: 30, height: 30, border: '0.5px solid var(--border)', background: isWin ? 'var(--accent-tint-strong)' : 'transparent', display: 'grid', placeItems: 'center', cursor: isEmpty ? 'pointer' : 'default', padding: 0, transition: 'background .15s' }}>
                {v != null && <Mark kind={v} color={players[v].color} win={isWin} />}
              </button>
            )
          })}
        </div>
      </div>
      <ResultsModal open={winner != null} sub={mode === 'ai' ? 'Hra proti AI' : 'Pass & play'}
        title={winTitle}
        line="Pět v řadě — krásná série." onAgain={restart} onHub={onBack} />
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={() => setRules(false)} />
    </GameShell>
  )
}
