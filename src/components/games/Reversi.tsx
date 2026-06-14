import { useState, useEffect } from 'react'
import { GameShell, ResultsModal, RulesSheet, type Player } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import type { GameDef, GameMode } from '../../data/games'

const N = 8, CELLS = N * N
const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as [number,number][]
const CORNERS = new Set([0, 7, 56, 63])
const BAD = new Set([1, 8, 9, 6, 14, 15, 48, 49, 57, 54, 55, 62])

function ci(r: number, c: number) { return r * N + c }

function flipsFor(board: (0|1|null)[], pos: number, p: 0|1): number[] {
  const r0 = Math.floor(pos / N), c0 = pos % N
  const out: number[] = []
  for (const [dr, dc] of DIRS) {
    const line: number[] = []
    let r = r0 + dr, c = c0 + dc
    while (r >= 0 && r < N && c >= 0 && c < N) {
      const i = ci(r, c)
      if (board[i] === (1 - p)) { line.push(i); r += dr; c += dc }
      else if (board[i] === p) { out.push(...line); break }
      else break
    }
  }
  return out
}

function legalMoves(board: (0|1|null)[], p: 0|1): number[] {
  const moves: number[] = []
  for (let i = 0; i < CELLS; i++)
    if (board[i] == null && flipsFor(board, i, p).length > 0) moves.push(i)
  return moves
}

function doMove(board: (0|1|null)[], pos: number, p: 0|1): (0|1|null)[] {
  const nb = board.slice() as (0|1|null)[]
  nb[pos] = p
  for (const f of flipsFor(nb, pos, p)) nb[f] = p
  return nb
}

function counts(board: (0|1|null)[]): [number, number] {
  let a = 0, b = 0
  for (const v of board) { if (v === 0) a++; else if (v === 1) b++ }
  return [a, b]
}

function mkBoard(): (0|1|null)[] {
  const b = Array(CELLS).fill(null) as (0|1|null)[]
  b[ci(3,3)] = 1; b[ci(3,4)] = 0
  b[ci(4,3)] = 0; b[ci(4,4)] = 1
  return b
}

function mkPlayers(mode: GameMode): Player[] {
  return mode === 'ai'
    ? [{ name: 'Vy', mark: '●', color: 'var(--p1)' }, { name: 'AI', mark: '●', color: 'var(--p2)' }]
    : [{ name: 'Hráč 1', mark: '●', color: 'var(--p1)' }, { name: 'Hráč 2', mark: '●', color: 'var(--p2)' }]
}

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Reversi({ game, mode, turnStyle, onBack, onBestUpdate }: Props) {
  const [board, setBoard] = useState<(0|1|null)[]>(mkBoard)
  const [active, setActive] = useState<0|1>(0)
  const [scores, setScores] = useState<[number,number]>([2, 2])
  const [skipped, setSkipped] = useState(false)
  const [winner, setWinner] = useState<0|1|'draw'|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const players = mkPlayers(mode)

  const moves = winner == null ? legalMoves(board, active) : []
  const moveSet = new Set(moves)

  const endGame = (p0: number, p1: number) => {
    if ('vibrate' in navigator) navigator.vibrate([14, 60, 14])
    const w: 0|1|'draw' = p0 === p1 ? 'draw' : p0 > p1 ? 0 : 1
    setWinner(w)
    onBestUpdate?.(`${Math.max(p0, p1)} kamenů`)
  }

  const place = (pos: number, by: 0|1 = active) => {
    if (board[pos] != null || paused || winner != null) return
    const fl = flipsFor(board, pos, by)
    if (fl.length === 0) return
    if ('vibrate' in navigator) navigator.vibrate(8)
    const nb = doMove(board, pos, by)
    const [p0, p1] = counts(nb)
    setBoard(nb); setScores([p0, p1])
    const next = (1 - by) as 0|1
    const nextMoves = legalMoves(nb, next)
    const myMoves = legalMoves(nb, by)
    if (p0 + p1 === CELLS || (nextMoves.length === 0 && myMoves.length === 0)) {
      endGame(p0, p1)
    } else if (nextMoves.length === 0) {
      setSkipped(true)
    } else {
      setSkipped(false); setActive(next)
    }
  }

  // AI
  useEffect(() => {
    if (mode === 'ai' && active === 1 && winner == null && !paused) {
      const t = setTimeout(() => {
        const ml = legalMoves(board, 1)
        if (!ml.length) return
        let best = ml[0], bestScore = -9999
        for (const m of ml) {
          const fl = flipsFor(board, m, 1).length
          let score = fl * 2
          if (CORNERS.has(m)) score += 80
          else if (BAD.has(m)) score -= 30
          // stability heuristic: prefer edges
          const r = Math.floor(m / N), c = m % N
          if (r === 0 || r === 7 || c === 0 || c === 7) score += 10
          if (score > bestScore) { bestScore = score; best = m }
        }
        place(best, 1)
      }, 540)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mode, winner, paused, board, skipped])

  useEffect(() => {
    if (winner != null) {
      const t = setTimeout(() => setShowModal(true), typeof winner === 'number' ? 2000 : 0)
      return () => clearTimeout(t)
    } else { setShowModal(false) }
  }, [winner])

  const restart = () => {
    setBoard(mkBoard()); setActive(0); setScores([2, 2])
    setSkipped(false); setWinner(null); setPaused(false)
  }

  const S = 36 // cell px
  const PIECE_D = S - 7

  // Piece visuals: player 0 = dark, player 1 = light
  const pieceStyle = (p: 0|1, isWin: boolean) => {
    const dark = p === 0
    const base = dark
      ? 'radial-gradient(circle at 36% 30%, #4b5563, #0f172a 80%)'
      : 'radial-gradient(circle at 36% 30%, #ffffff, #d1d5db 80%)'
    return {
      width: PIECE_D, height: PIECE_D, borderRadius: 999,
      background: base,
      boxShadow: isWin
        ? `0 0 0 2.5px var(--accent), 0 0 14px var(--accent), ${dark ? '0 2px 6px rgba(0,0,0,0.7)' : '0 2px 8px rgba(0,0,0,0.35)'}`
        : dark
          ? '0 2px 6px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12)'
          : '0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.9)',
      transition: 'box-shadow .2s',
    }
  }

  const winTitle = winner === 'draw' ? 'Remíza!'
    : winner === 0 ? (mode === 'ai' ? 'Vyhráváš!' : 'Vyhrává Hráč 1!')
    : (mode === 'ai' ? 'Vyhrává AI' : 'Vyhrává Hráč 2!')
  const winLine = winner === 'draw' ? `${scores[0]} : ${scores[1]} — stejně kamenů`
    : winner === 0 ? `${scores[0]} : ${scores[1]} kamenů`
    : `${scores[1]} : ${scores[0]} kamenů`

  return (
    <GameShell players={players} active={active} winner={typeof winner === 'number' ? winner : null}
      scores={[{ value: scores[0], color: players[0].color }, { value: scores[1], color: players[1].color }]}
      turnStyle={turnStyle} onBack={onBack} onRestart={restart}
      onPause={() => setPaused(p => !p)} paused={paused} onRules={() => setRules(true)}>

      {skipped && (
        <div style={{
          padding: '7px 14px', borderRadius: 10, background: 'var(--accent-tint-medium)',
          color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
          textAlign: 'center', marginBottom: 2,
        }}>
          {active === 0 ? 'AI nemá tah' : 'Hráč 2 nemá tah'} — hraje znovu {active === 0 ? 'Vy' : 'Hráč 1'}
        </div>
      )}

      <div style={{
        position: 'relative', padding: 8, borderRadius: 16,
        background: 'linear-gradient(160deg, color-mix(in srgb, #14532d 55%, var(--card-solid)), color-mix(in srgb, #052e16 55%, var(--card-solid)))',
        boxShadow: 'var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 6px rgba(0,0,0,0.4)',
      }}>
        <RoughFrame stroke="rgba(255,255,255,0.12)" strokeWidth={1} radius={16} />
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${N}, ${S}px)`,
          gridTemplateRows: `repeat(${N}, ${S}px)`,
          gap: 1, background: 'rgba(0,0,0,0.35)', borderRadius: 10,
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          {board.map((val, i) => {
            const isValid = moveSet.has(i)
            const isMoveCandidate = val == null && winner == null
            const isWin = winner != null && val === (winner === 'draw' ? -1 : winner)
            return (
              <div
                key={i}
                onClick={() => { if (isValid && !paused) place(i) }}
                style={{
                  width: S, height: S,
                  display: 'grid', placeItems: 'center',
                  background: isValid
                    ? 'rgba(99,102,241,0.18)'
                    : 'linear-gradient(160deg, rgba(21,128,61,0.28), rgba(5,46,22,0.22))',
                  cursor: isValid && isMoveCandidate ? 'pointer' : 'default',
                  transition: 'background .12s',
                  outline: '0.5px solid rgba(0,0,0,0.35)',
                }}
              >
                {val != null ? (
                  <div style={pieceStyle(val, !!isWin)} />
                ) : isValid ? (
                  <div style={{
                    width: 9, height: 9, borderRadius: 999,
                    background: 'var(--accent)', opacity: 0.55,
                    boxShadow: '0 0 6px var(--accent)',
                  }} />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>

      <ResultsModal open={showModal} sub={mode === 'ai' ? 'Hra proti AI' : 'Pass & play'}
        title={winTitle} line={winLine} onAgain={restart} onHub={onBack} />
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={() => setRules(false)} />
    </GameShell>
  )
}
