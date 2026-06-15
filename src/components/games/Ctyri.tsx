import { useState, useEffect } from 'react'
import { GameShell, ResultsModal, RulesSheet, type Player } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import type { GameDef, GameMode } from '../../data/games'

const COLS = 7, ROWS = 6

function mkPlayers(mode: GameMode): Player[] {
  return mode === 'ai'
    ? [{name:'Vy',mark:'●',color:'var(--p1)'},{name:'AI',mark:'●',color:'var(--p2)'}]
    : [{name:'Hráč 1',mark:'●',color:'var(--p1)'},{name:'Hráč 2',mark:'●',color:'var(--p2)'}]
}

function check(b: (number|null)[], idx: number, p: number): number[] | null {
  const x=idx%COLS, y=Math.floor(idx/COLS)
  for(const [dx,dy] of [[1,0],[0,1],[1,1],[1,-1]] as [number,number][]){
    const line=[idx]
    for(const s of [1,-1]){let cx=x+dx*s,cy=y+dy*s; while(cx>=0&&cx<COLS&&cy>=0&&cy<ROWS&&b[cy*COLS+cx]===p){line.push(cy*COLS+cx);cx+=dx*s;cy+=dy*s}}
    if(line.length>=4) return line
  }
  return null
}

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Ctyri({ game, mode, turnStyle, onBack, onBestUpdate }: Props) {
  const empty = () => Array<number|null>(COLS*ROWS).fill(null)
  const [board, setBoard] = useState(empty)
  const [active, setActive] = useState(0)
  const [scores, setScores] = useState([0,0])
  const [winner, setWinner] = useState<number|'draw'|null>(null)
  const [winCells, setWinCells] = useState<number[]>([])
  const [dropping, setDropping] = useState<number|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const players = mkPlayers(mode)

  const drop = (col: number, by = active) => {
    if(winner!=null||paused) return
    let row=-1; for(let r=ROWS-1;r>=0;r--) if(board[r*COLS+col]==null){row=r;break}
    if(row<0) return
    if('vibrate' in navigator) navigator.vibrate(8)
    const cellIdx=row*COLS+col; const b=board.slice(); b[cellIdx]=by
    setBoard(b); setDropping(cellIdx); setTimeout(()=>setDropping(null),280)
    const w=check(b,cellIdx,by)
    if(w){
      if('vibrate' in navigator) navigator.vibrate([14,60,14])
      setWinner(by); setWinCells(w)
      setScores(s=>{const n=s.slice();n[by]++;onBestUpdate?.(`${n[by]} výher`);return n})
    } else if(b.every(c=>c!=null)) setWinner('draw')
    else setActive(a=>1-a)
  }

  useEffect(()=>{
    if(mode==='ai'&&active===1&&winner==null&&!paused){
      const t=setTimeout(()=>{
        const validCols: number[]=[]
        for(let c=0;c<COLS;c++) if(board[c]==null) validCols.push(c)
        if(!validCols.length) return

        const landRow=(col:number)=>{for(let r=ROWS-1;r>=0;r--) if(board[r*COLS+col]==null) return r; return -1}

        // Win immediately
        for(const c of validCols){const r=landRow(c);if(r<0)continue;const b=board.slice();b[r*COLS+c]=1;if(check(b,r*COLS+c,1)){drop(c,1);return}}
        // Block player win
        for(const c of validCols){const r=landRow(c);if(r<0)continue;const b=board.slice();b[r*COLS+c]=0;if(check(b,r*COLS+c,0)){drop(c,1);return}}

        // Center-biased weighted random (prefer col 3, then 2&4, then 1&5, then 0&6)
        const w=[1,2,4,7,4,2,1]
        const total=validCols.reduce((s,c)=>s+w[c],0)
        let r=Math.random()*total, chosen=validCols[0]
        for(const c of validCols){r-=w[c];if(r<=0){chosen=c;break}}
        drop(chosen,1)
      },600)
      return ()=>clearTimeout(t)
    }
  },[active,mode,winner,paused,board])

  useEffect(()=>{
    if(winner!=null){
      const t=setTimeout(()=>setShowModal(true), typeof winner==='number'?2000:0)
      return ()=>clearTimeout(t)
    } else { setShowModal(false) }
  },[winner])

  const restart = ()=>{setBoard(empty());setActive(0);setWinner(null);setWinCells([]);setPaused(false)}

  return (
    <GameShell players={players} active={active} winner={typeof winner==='number'?winner:null}
      scores={[{value:scores[0],color:players[0].color},{value:scores[1],color:players[1].color}]}
      turnStyle={turnStyle} onBack={onBack} onRestart={restart} onPause={()=>setPaused(p=>!p)} paused={paused} onRules={()=>setRules(true)}>
      <div style={{position:'relative',padding:10,width:'min(calc(100vw - 32px), 380px)',background:'linear-gradient(165deg, color-mix(in srgb, var(--accent) 26%, var(--card-solid)), color-mix(in srgb, var(--accent) 8%, var(--card-solid)))',borderRadius:18,boxShadow:'var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -3px 8px rgba(0,0,0,0.28)'}}>
        <RoughFrame stroke="var(--accent)" strokeWidth={1.5} radius={18} glow="var(--accent-tint-strong)"/>
        <div style={{display:'grid',gridTemplateColumns:`repeat(${COLS}, 1fr)`,gridTemplateRows:`repeat(${ROWS}, 1fr)`,aspectRatio:`${COLS}/${ROWS}`}}>
          {board.map((val,i)=>{
            const c=i%COLS, isWin=winCells.includes(i)
            const col=val!=null?players[val].color:null
            return (
              <div key={i} onClick={()=>drop(c)} style={{aspectRatio:'1',display:'grid',placeItems:'center',cursor:winner==null?'pointer':'default'}}>
                <div style={{width:'82%',height:'82%',borderRadius:999,position:'relative',background:'radial-gradient(circle at 50% 38%, color-mix(in srgb, var(--bg) 82%, #000), var(--bg))',boxShadow:'inset 0 2px 5px rgba(0,0,0,0.55), inset 0 -1px 2px rgba(255,255,255,0.07), inset 0 0 0 1px var(--border)',overflow:'hidden'}}>
                  {val!=null&&(
                    <div className={dropping===i?'drop-in':(isWin?'pulse':'')} style={{position:'absolute',inset:'10%',borderRadius:999,background:`radial-gradient(circle at 36% 28%, color-mix(in srgb, ${col} 45%, #fff), ${col} 56%, color-mix(in srgb, ${col} 62%, #000) 100%)`,boxShadow:isWin?`inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.35), 0 0 0 2px var(--bg), 0 0 0 4px ${col}, 0 0 18px ${col}`:`inset 0 1.5px 2px rgba(255,255,255,0.5), inset 0 -2px 5px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.45), 0 0 9px ${col}`}}/>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <ResultsModal open={showModal} sub={mode==='ai'?'Hra proti AI':'Pass & play'}
        title={winner==='draw'?'Remíza!':winner===0?(mode==='ai'?'Vyhráváš!':'Vyhrává Hráč 1!'):(mode==='ai'?'Vyhrává AI':'Vyhrává protihráč!')}
        line={winner==='draw'?'Plná deska.':'Čtyři v řadě!'} onAgain={restart} onHub={onBack}/>
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={()=>setRules(false)}/>
    </GameShell>
  )
}
