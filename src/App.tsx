import { useState } from 'react'
import { useLocal, hexA } from './lib/utils'
import { GAMES, GAME_BY_ID, type GameId, type GameMode, type GameDef } from './data/games'
import { Hub } from './components/hub/Hub'
import { Piskvorky } from './components/games/Piskvorky'
import { Tecky } from './components/games/Tecky'
import { Ctyri } from './components/games/Ctyri'
import { Hangman } from './components/games/Hangman'
import { WordChain } from './components/games/WordChain'
import { Osmismerka } from './components/games/Osmismerka'
import { Slovnik } from './components/games/Slovnik'
import { Had } from './components/games/Had'
import { Reversi } from './components/games/Reversi'

type Screen = GameId | null

function GameView({ id, mode, onBack, onBestUpdate }: { id: GameId; mode: GameMode; onBack: () => void; onBestUpdate: (v: string) => void }) {
  const game = GAME_BY_ID[id]
  const a = game.accent
  const vars = {
    height: '100%', display: 'flex', flexDirection: 'column' as const, minHeight: 0,
    '--accent': a,
    '--accent-hover': '#FF2E6E',
    '--accent-tint-soft': hexA(a, 0.10),
    '--accent-tint-medium': hexA(a, 0.18),
    '--accent-tint-strong': hexA(a, 0.30),
  }

  const props = { game, mode, onBack, onBestUpdate }
  return (
    <div style={vars as React.CSSProperties}>
      {id === 'piskvorky'  && <Piskvorky  {...props} />}
      {id === 'tecky'      && <Tecky      {...props} />}
      {id === 'ctyri'      && <Ctyri      {...props} />}
      {id === 'hangman'    && <Hangman    {...props} />}
      {id === 'wordchain'  && <WordChain  {...props} />}
      {id === 'osmismerka' && <Osmismerka {...props} />}
      {id === 'slovnik'    && <Slovnik    {...props} />}
      {id === 'had'        && <Had        {...props} />}
      {id === 'reversi'    && <Reversi    {...props} />}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useLocal<'dark' | 'light'>('ta-theme', 'dark')
  const [modes, setModes] = useLocal<Record<GameId, GameMode>>(
    'ta-modes',
    Object.fromEntries(GAMES.map(g => [g.id, 'ai'])) as Record<GameId, GameMode>
  )
  const [bestScores, setBestScores] = useLocal<Record<GameId, string>>(
    'ta-best',
    Object.fromEntries(GAMES.map(g => [g.id, g.defaultBest])) as Record<GameId, string>
  )
  const [screen, setScreen] = useState<Screen>(null)
  const [launchMode, setLaunchMode] = useState<GameMode>('ai')

  const play = (game: GameDef, mode: GameMode) => { setLaunchMode(mode); setScreen(game.id) }
  const back = () => setScreen(null)
  const setMode = (id: GameId, mode: GameMode) => setModes(m => ({ ...m, [id]: mode }))
  const updateBest = (id: GameId, v: string) => setBestScores(b => ({ ...b, [id]: v }))

  return (
    <div data-theme={theme} className="app-shell">
      {screen == null
        ? <Hub theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} modes={modes} setMode={setMode} onPlay={play} bestScores={bestScores} />
        : <GameView id={screen} mode={launchMode} onBack={back} onBestUpdate={v => updateBest(screen, v)} />
      }
    </div>
  )
}
