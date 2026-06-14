import { useState, useRef, useMemo } from 'react'
import { GameShell, ResultsModal, RulesSheet } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import { OSMI_WORDS } from '../../data/words'
import type { GameDef } from '../../data/games'

const G = 10, CELL = 30, GAP = 3
const DIRS = [[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]] as [number,number][]
const FILL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const FOUND_COLORS = ['#34E4C4','#A78BFA','#38BDF8','#F472B6','#FF2E6E','#9BE45A','#5AD0FF','#C792FF','#FF8AE0','#6FF4DD']

function osmiGenerate(words: string[]) {
  const grid = Array.from({length:G},()=>Array(G).fill(null) as (string|null)[])
  const placements: {word:string; cells:[number,number][]}[] = []
  const sorted = [...words].sort((a,b)=>b.length-a.length)
  for(const w of sorted){
    let placed=false
    for(let t=0;t<240&&!placed;t++){
      const [dr,dc]=DIRS[Math.floor(Math.random()*DIRS.length)]
      const r0=Math.floor(Math.random()*G), c0=Math.floor(Math.random()*G)
      const rE=r0+dr*(w.length-1), cE=c0+dc*(w.length-1)
      if(rE<0||rE>=G||cE<0||cE>=G) continue
      let ok=true; const cells:[number,number][]=[]
      for(let k=0;k<w.length;k++){const r=r0+dr*k,c=c0+dc*k;const ex=grid[r][c];if(ex!=null&&ex!==w[k]){ok=false;break}cells.push([r,c])}
      if(!ok) continue
      cells.forEach(([r,c],k)=>grid[r][c]=w[k])
      placements.push({word:w,cells}); placed=true
    }
  }
  for(let r=0;r<G;r++) for(let c=0;c<G;c++) if(grid[r][c]==null) grid[r][c]=FILL[Math.floor(Math.random()*FILL.length)]
  return {grid:grid as string[][], placements}
}

interface FoundWord { word: string; cells: [number,number][]; color: string }

interface Props { game: GameDef; turnStyle?: string; onBack: () => void; onBestUpdate?: (v: string) => void }

export function Osmismerka({ game, turnStyle, onBack, onBestUpdate }: Props) {
  const [seed, setSeed] = useState(0)
  const {grid, placements} = useMemo(()=>osmiGenerate(OSMI_WORDS), [seed])
  const [found, setFound] = useState<FoundWord[]>([])
  const [sel, setSel] = useState<{r:number;c:number}[]>([])
  const [startTime] = useState(()=>Date.now())
  const [paused, setPaused] = useState(false)
  const [rules, setRules] = useState(false)
  const startRef = useRef<{r:number;c:number}|null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const players = [{name:'Vy',mark:'A',color:'var(--accent)'}]
  const done = found.length >= placements.length && placements.length > 0
  const pitch = CELL + GAP

  const cellAt = (e: React.PointerEvent) => {
    const rect = gridRef.current!.getBoundingClientRect()
    let c = Math.floor((e.clientX - rect.left - 10) / pitch)
    let r = Math.floor((e.clientY - rect.top - 10) / pitch)
    r = Math.max(0, Math.min(G-1, r)); c = Math.max(0, Math.min(G-1, c))
    return {r, c}
  }

  const lineCells = (a: {r:number;c:number}, b: {r:number;c:number}) => {
    const dr=b.r-a.r, dc=b.c-a.c
    if(!(dr===0||dc===0||Math.abs(dr)===Math.abs(dc))) return null
    const n=Math.max(Math.abs(dr),Math.abs(dc))
    const sr=Math.sign(dr), sc=Math.sign(dc); const out=[]
    for(let k=0;k<=n;k++) out.push({r:a.r+sr*k, c:a.c+sc*k})
    return out
  }

  const down = (e: React.PointerEvent) => {
    if(paused||done) return; e.preventDefault()
    const cell=cellAt(e); startRef.current=cell; setSel([cell])
    try{gridRef.current!.setPointerCapture(e.pointerId)}catch{}
  }
  const move = (e: React.PointerEvent) => {
    if(!startRef.current||paused||done) return
    const cells=lineCells(startRef.current, cellAt(e))
    if(cells) setSel(cells)
  }
  const up = () => {
    if(!startRef.current) return
    const cells=sel; startRef.current=null; setSel([])
    if(cells.length<2) return
    const key=cells.map(c=>c.r+','+c.c).join('|')
    for(const p of placements){
      if(found.some(f=>f.word===p.word)) continue
      const pk=p.cells.map(c=>c[0]+','+c[1]).join('|')
      const pkr=[...p.cells].reverse().map(c=>c[0]+','+c[1]).join('|')
      if(key===pk||key===pkr){
        setFound(f=>{
          const nf=[...f,{word:p.word,cells:p.cells,color:FOUND_COLORS[f.length%FOUND_COLORS.length]}]
          if(nf.length>=placements.length){
            const elapsed=Math.round((Date.now()-startTime)/1000)
            const m=Math.floor(elapsed/60), s=elapsed%60
            onBestUpdate?.(`${m}:${s.toString().padStart(2,'0')}`)
          }
          return nf
        }); return
      }
    }
  }

  const restart = () => { setFound([]); setSel([]); setPaused(false); setSeed(s=>s+1) }

  const cellColor = (r:number, c:number) => found.find(x=>x.cells.some(([fr,fc])=>fr===r&&fc===c))?.color ?? null
  const inSel = (r:number, c:number) => sel.some(s=>s.r===r&&s.c===c)

  return (
    <GameShell players={players} active={0}
      scores={[{value:found.length,color:'var(--accent)'}]} turnStyle={turnStyle}
      onBack={onBack} onRestart={restart} onPause={()=>setPaused(p=>!p)} paused={paused} onRules={()=>setRules(true)}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,width:'100%'}}>
        <div ref={gridRef}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          style={{position:'relative',display:'grid',gridTemplateColumns:`repeat(${G}, ${CELL}px)`,gap:GAP,padding:10,borderRadius:16,touchAction:'none',background:'linear-gradient(165deg, color-mix(in srgb, var(--accent) 10%, var(--card-solid)), var(--card-solid))',boxShadow:'var(--glass-shadow), inset 0 1px 0 rgba(255,255,255,0.12)'}}>
          <RoughFrame stroke="var(--border-strong)" strokeWidth={1} radius={16}/>
          {grid.map((row,r)=>row.map((ch,c)=>{
            const fc=cellColor(r,c), selected=inSel(r,c)
            return (
              <div key={r+'-'+c} style={{
                width:CELL,height:CELL,display:'grid',placeItems:'center',borderRadius:7,
                fontFamily:'var(--font-mono)',fontWeight:700,fontSize:15,userSelect:'none',
                color:fc?'#06120F':'var(--text)',
                background:fc?`linear-gradient(160deg, color-mix(in srgb, ${fc} 52%, #fff), ${fc})`:(selected?'var(--accent-tint-strong)':'linear-gradient(160deg, color-mix(in srgb, var(--card-solid) 88%, #fff), var(--card-solid))'),
                boxShadow:fc?`inset 0 1px 0 rgba(255,255,255,0.45), 0 0 9px ${fc}`:(selected?'inset 0 0 0 1.5px var(--accent)':'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -2px 3px rgba(0,0,0,0.18)'),
                transition:'background .1s, box-shadow .1s',
              }}>{ch}</div>
            )
          }))}
        </div>
        {/* word list */}
        <div style={{display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center',maxWidth:330}}>
          {placements.map(p=>{
            const f=found.find(x=>x.word===p.word)
            return (
              <span key={p.word} style={{position:'relative',fontFamily:'var(--font-mono)',fontWeight:700,fontSize:11.5,letterSpacing:'0.03em',padding:'5px 11px',borderRadius:999,color:f?'#06120F':'var(--text-muted)',textDecoration:f?'line-through':'none',background:f?`linear-gradient(160deg, color-mix(in srgb, ${f.color} 52%, #fff), ${f.color})`:'var(--accent-tint-soft)',boxShadow:f?`0 0 10px ${f.color}`:undefined,opacity:f?1:0.85}}>{p.word}</span>
            )
          })}
        </div>
        <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>nalezeno {found.length} / {placements.length}</div>
      </div>
      <ResultsModal open={done} sub="Osmisměrka" title="Vyřešeno!"
        line={`Našla jsi všech ${placements.length} slov.`} onAgain={restart} onHub={onBack}/>
      <RulesSheet open={rules} tag={game.tag} rules={game.rules} onClose={()=>setRules(false)}/>
    </GameShell>
  )
}
