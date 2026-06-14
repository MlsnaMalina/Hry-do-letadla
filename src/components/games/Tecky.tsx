import { useState, useEffect } from 'react'
import { GameShell, ResultsModal, RulesSheet, type Player } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import type { GameDef, GameMode } from '../../data/games'

const C = 11, R = 12, GAP = 24, N = C * R

function idx(r: number, c: number) { return r * C + c }

function dotsCapture(dots: (number|null)[], cap: (number|null)[], P: number) {
  const isWall = (i: number) => dots[i] === P && cap[i] == null
  const nb4 = (i: number) => { const r = Math.floor(i/C), c = i%C, a: number[] = []; if(r>0)a.push(i-C); if(r<R-1)a.push(i+C); if(c>0)a.push(i-1); if(c<C-1)a.push(i+1); return a }
  const nb8 = (i: number) => { const r = Math.floor(i/C), c = i%C, a: number[] = []; for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){if(!dr&&!dc)continue; const nr=r+dr,nc=c+dc; if(nr>=0&&nr<R&&nc>=0&&nc<C)a.push(idx(nr,nc))} return a }
  const reach = new Array(N).fill(false); const st: number[] = []
  for(let r=0;r<R;r++) for(let c=0;c<C;c++) if(r===0||c===0||r===R-1||c===C-1){const i=idx(r,c); if(!isWall(i)&&!reach[i]){reach[i]=true; st.push(i)}}
  while(st.length){const i=st.pop()!; for(const j of nb4(i)) if(!reach[j]&&!isWall(j)){reach[j]=true; st.push(j)}}
  const seen = new Array(N).fill(false); const newCap = cap.slice(); const terrAdd: Record<number,number> = {}; const segs: [number,number,number][] = []; let gained = 0
  for(let s=0;s<N;s++){
    if(isWall(s)||reach[s]||seen[s]) continue
    const list: number[] = [], q=[s]; seen[s]=true
    while(q.length){const i=q.pop()!; list.push(i); for(const j of nb4(i)) if(!seen[j]&&!isWall(j)&&!reach[j]){seen[j]=true; q.push(j)}}
    const enemy = list.filter(i=>dots[i]===(1-P)&&cap[i]==null)
    if(!enemy.length) continue
    enemy.forEach(i=>{newCap[i]=P; gained++})
    list.forEach(i=>{if(dots[i]==null) terrAdd[i]=P})
    const bset = new Set<number>()
    list.forEach(i=>nb8(i).forEach(j=>{if(isWall(j))bset.add(j)}))
    const barr = [...bset]
    for(let a=0;a<barr.length;a++) for(let b=a+1;b<barr.length;b++){
      const ia=barr[a],ib=barr[b]
      if(Math.abs(Math.floor(ia/C)-Math.floor(ib/C))<=1&&Math.abs(ia%C-ib%C)<=1) segs.push([ia,ib,P])
    }
  }
  return { cap: newCap, terrAdd, gained, segs }
}

function mkPlayers(mode: GameMode): Player[] {
  return mode === 'ai'
    ? [{name:'Vy',mark:'●',color:'var(--p1)'},{name:'AI',mark:'●',color:'var(--p2)'}]
    : [{name:'Hráč 1',mark:'●',color:'var(--p1)'},{name:'Hráč 2',mark:'●',color:'var(--p2)'}]
}

interface Props { game: GameDef; mode: GameMode; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Tecky({ game, mode, turnStyle, onBack, onBestUpdate }: Props) {
  const [dots, setDots] = useState<(number|null)[]>(() => Array(N).fill(null))
  const [cap, setCap] = useState<(number|null)[]>(() => Array(N).fill(null))
  const [terr, setTerr] = useState<(number|null)[]>(() => Array(N).fill(null))
  const [segs, setSegs] = useState<[number,number,number][]>([])
  const [scores, setScores] = useState([0,0])
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const players = mkPlayers(mode)
  const placed = dots.reduce<number>((a,d) => a+(d!=null?1:0), 0)
  const done = placed >= N
  const winner = done ? (scores[0]===scores[1] ? 'draw' : (scores[0]>scores[1] ? 0 : 1)) : null

  const place = (i: number, by = active) => {
    if (dots[i]!=null||paused||done) return
    const nd = dots.slice(); nd[i]=by
    const res = dotsCapture(nd, cap, by)
    setDots(nd); setCap(res.cap)
    if (res.gained>0){
      const newScores = scores.slice(); newScores[by]+=res.gained
      setScores(newScores)
      onBestUpdate?.(`${Math.max(...newScores)}`)
      setTerr(t=>{const n=t.slice(); for(const k in res.terrAdd) n[+k]=res.terrAdd[+k]; return n})
      setSegs(g=>[...g,...res.segs])
    }
    setActive(a=>1-a)
  }

  useEffect(()=>{
    if(mode==='ai'&&active===1&&!done&&!paused){
      const t=setTimeout(()=>{
        const empties: number[] = []; for(let i=0;i<N;i++) if(dots[i]==null) empties.push(i)
        if(!empties.length) return
        let best: number|null=null, bestG=0
        for(const i of empties){const nd=dots.slice();nd[i]=1;const r=dotsCapture(nd,cap,1);if(r.gained>bestG){bestG=r.gained;best=i}}
        place(best!=null?best:empties[Math.floor(Math.random()*empties.length)], 1)
      }, 480)
      return ()=>clearTimeout(t)
    }
  },[active,mode,done,paused,dots,cap])

  const restart = ()=>{setDots(Array(N).fill(null));setCap(Array(N).fill(null));setTerr(Array(N).fill(null));setSegs([]);setScores([0,0]);setActive(0);setPaused(false)}

  const W=(C-1)*GAP, H=(R-1)*GAP
  const X=(c:number)=>c*GAP, Y=(r:number)=>r*GAP
  const pcol=(p:number)=>p===0?'var(--p1)':'var(--p2)'

  return (
    <GameShell players={players} active={active} winner={typeof winner==='number'?winner:null}
      scores={[{value:scores[0],color:players[0].color},{value:scores[1],color:players[1].color}]}
      turnStyle={turnStyle} onBack={onBack} onRestart={restart} onPause={()=>setPaused(p=>!p)} paused={paused} onRules={()=>setRules(true)}>
      <div style={{position:'relative',padding:14,borderRadius:18,background:'var(--card-bg)',backdropFilter:'blur(12px)',boxShadow:'var(--glass-shadow)',overflow:'auto',maxWidth:'100%'}}>
        <RoughFrame stroke="var(--border-strong)" strokeWidth={1} radius={18} />
        <svg width={W+22} height={H+22} viewBox={`-11 -11 ${W+22} ${H+22}`} style={{display:'block',overflow:'visible'}}>
          {Array.from({length:C},(_,c)=><line key={'vl'+c} x1={X(c)} y1={0} x2={X(c)} y2={H} stroke="var(--border)" strokeWidth="1"/>)}
          {Array.from({length:R},(_,r)=><line key={'hl'+r} x1={0} y1={Y(r)} x2={W} y2={Y(r)} stroke="var(--border)" strokeWidth="1"/>)}
          {dots.map((_,i)=>{const own=terr[i]!=null?terr[i]:cap[i]; if(own==null) return null; const r=Math.floor(i/C),c=i%C; return <rect key={'tt'+i} x={X(c)-GAP/2} y={Y(r)-GAP/2} width={GAP} height={GAP} fill={pcol(own)} fillOpacity="0.18"/>})}
          {Array.from({length:R},(_,r)=>Array.from({length:C},(_,c)=><circle key={'bp'+r+c} cx={X(c)} cy={Y(r)} r="1.6" fill="var(--text)" fillOpacity="0.2"/>))}
          {segs.map(([a,b,o],k)=><line key={'sg'+k} x1={X(a%C)} y1={Y(Math.floor(a/C))} x2={X(b%C)} y2={Y(Math.floor(b/C))} stroke={pcol(o)} strokeWidth="2.6" strokeLinecap="round" style={{filter:`drop-shadow(0 0 3px ${pcol(o)})`}}/>)}
          {dots.map((v,i)=>{if(v==null) return null; const r=Math.floor(i/C),c=i%C,col=pcol(v),captured=cap[i]!=null; return (
            <g key={'d'+i} opacity={captured?0.5:1} style={{filter:`drop-shadow(0 0 4px ${col})`}}>
              <circle cx={X(c)} cy={Y(r)} r="6.4" fill={col}/>
              <circle cx={X(c)-1.7} cy={Y(r)-1.9} r="2.1" fill="#fff" fillOpacity="0.6"/>
              {captured&&<circle cx={X(c)} cy={Y(r)} r="9.2" fill="none" stroke={pcol(cap[i] as number)} strokeWidth="1.6"/>}
            </g>
          )})}
          {dots.map((v,i)=>{const r=Math.floor(i/C),c=i%C; return <circle key={'h'+i} cx={X(c)} cy={Y(r)} r={GAP/2-1} fill="transparent" style={{cursor:v==null&&!done?'pointer':'default'}} onClick={()=>place(i)}/>})}
        </svg>
      </div>
      <ResultsModal open={done} sub={mode==='ai'?'Hra proti AI':'Pass & play'}
        title={winner==='draw'?'Remíza!':`${players[winner??0].name} vyhrává!`}
        line={`Obklíčeno ${scores[0]} : ${scores[1]}`} onAgain={restart} onHub={onBack}/>
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={()=>setRules(false)}/>
    </GameShell>
  )
}
