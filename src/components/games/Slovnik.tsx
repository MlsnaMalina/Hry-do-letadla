import { useState, useEffect, useRef, useCallback } from 'react'
import { GameShell, RulesSheet } from '../shell/GameShell'
import { RoughFrame } from '../primitives/RoughFrame'
import type { GameDef, GameMode } from '../../data/games'

const ROUND_SECS = 90

// Czech nouns — normalized (uppercase, no diacritics)
const CZ_WORDS = new Set([
  // 2-letter
  'PO','LO','DO',
  // 3-letter
  'PES','LES','NOS','KOS','LOS','ROK','TOK','BOD','LED','MED','ROD','SAD',
  'DUB','LUK','MAK','RAK','LEV','BOL','KOL','VAL','KAL','BOR','BOK','KOP',
  'COP','SOK','PUK','TUK','SUK','BUK','DEN','SEN','SOL','VAZ','LEM','PAN',
  'TUR','BAL','VAN','HAD','SYN','NOC','HRA','NIT','LOV','MIR','VIR','DAR',
  'VUL','ZUB','OKO','MIC','VEZ','MUZ','KRK','LAK','PAR','ZAK','CAJ','VLK',
  'CAP','LOD','CAS','GOL','GEN','CIN','SUL','KUN','DUM','LOB','HRB','NUZ',
  'TES','PIS','TAL','MAS',
  'PAS','BOJ','TAH','VRH','ZIP','KRB','BRK','ZAL','VAR','TAP','KAP','TRN',
  'SUP','LUP','MOP','TOP','SUM','KAZ','RAZ','BAS','RYL','CUK','BEH','SEK',
  'TAK','NAL','HOK','REP','CUR','MAZ','ZAR','LAP','PAP','CUP','COK','ROH',
  'SOH','BEC','KEC','TEC','VEC','SEC','REC','LEC','NEC','BEC',
  'HRB','PEL','SON','TON','BON','MON','ZON','POL','MOL','DOL','ROL','FOL',
  // 4-letter
  'AUTO','KOLO','DRAK','HRAD','VLAK','MRAK','MOST','DUCH','HORA','NEBE',
  'POLE','MAPA','NOTA','PLAZ','LIST','KOST','HOST','PLES','SLON','BRAT',
  'VLAS','HLAS','DRES','RYBA','NOHA','RUKA','VODA','KOZA','BOTA','SKLO',
  'KREV','SLOH','PRAK','TRAK','VLNA','ROLE','NORA','KOTA','LATA','PLOT',
  'TVOR','LANO','PERO','PIVO','SENO','MENU','VINO','PRSA','TRON','DATA',
  'KRAL','STUL','LAMA','RANA','HLUK','TVAR','OBAL','BRAK','KLAN','PLAN',
  'KLUK','SOVA','OKNO','DVUR','KMEN','SLZA','ZADA','USTA','UCHO','KVET',
  'REKA','MORE','BROD','MASO','JARO','LETO','ZIMA','RANO','MLHA','ROSA',
  'MRAZ','SNEH','DEST','KAVA','CUKR','OLEJ','PTAK','OVCE','JELEN',
  'BOBR','OSEL','SOUD','PARK','GOLF','UHEL','PRST','PLOD','TETA','OTEC',
  'ZEME','KRAJ','CENA','PLAT','STAV','CHUT','DLAN',
  'JAMA','PATA','PENA','BLAT','SVET','TRAM','TAXI',
  'ZRAK','PUSA','KUNA','KOSA','MISA','OSUD','GRIL','STAN','DECH','VLEC',
  'VLEK','HROB','BLOK','KLAM','RUCH','TISK','TLAK','VRAH','ZISK','RISK',
  'DISK','FILM','KLUB','TEST','PRUH','SRUB','PUCH','KOST','RIAD',
  'STEH','SLEH','VEST','TROP','DRAP','OCKO','BLAN','VRCH','UZEL','VRAK',
  'KRAB','SMYK','VLAD','SKAM','STUD','KRES','BUSA','MLAD','SKLA','UZOL',
  'SLEP','KOPEC','NOBA','NATA','PEPA','JAMO','KOTA',
  'SKOK','TROK','TROS','STON','KLON','BLON','TLON','KROG','LNOG',
  'PERO','HORA','NOHA','RUKA','LANO','PLAT','VLAK',
  'CHOV','CHOD','CHOP','CHOM','CHOR',
  'OHON','OHEN','OCEL','OCET','OPAD',
  'UVAL','UZAS','URAZ','ULET','UTEK','UTOK',
  'VRBA','VRCH','VRAK','VRES','VLAK',
  'ZDAR','ZDIH','ZPEV','ZROD','ZVON','ZVOR',
  // 5-letter
  'KAMEN','HLAVA','KNIHA','SALON','BARON','BETON','OPERA','BANDA','LAMPA',
  'KAPSA','VLAST','STROM','PANDA','METAL','HOTEL','MOTOR','PILOT','BALON',
  'POKER','ROMAN','KORAL','PEDAL','TONER','RADAR','NAROD','NORMA','SKALA',
  'TENOR','TRAKT','TRUBA','VRBA','KRASA','BRADA','KABEL','KABAT','TALIR',
  'SOLAR','NYLON','PYLON','DEMON','BONUS','KOSAR','PLECH','TREST','POLKA',
  'SKOLA','MESTO','ULICE','BANKA','POSTA','SPORT','PISEN','TANEC','HUDBA',
  'SLOVO','DIVKA','STRYC','LEKAR','TRIDA','ZNAMKA','LOUKA',
  'ZELVA','MLEKO','JIDLO','KYTARA','BUBEN','PRAVO','ZAKON',
  'VLADA','VALKA','STRANA','VOJAK','VECER','TYDEN','HODINA','MINUTA',
  'CHVILE','PODZIM','SRDCE','MOZEK','KOLENO','RAMENO','FOTBAL','HOKEJ',
  'TENIS','JAZYK','BARVA','OBCHOD',
  'MATKA','HOLKA','DITE','VEJCE','CHLEB','VRANA',
  'HOLUB','OREL','PRASE','KRAVA','LISKA','ZAJIC','TYGR','KOCKA',
  'MYSKA','KOTEL','LAVOR','KOSIK','KUFR','TRASA','PASTA',
  'KLIMA','TABOR','BLATO','OKRAJ','DOPIS','OBLAK','OHLAS',
  'OSADA','KUPKA','POLKA','PALEC','SRDCE','PENCE',
  'BREZA','JASAN','TRAVA','JETEL','KAPKA','ISKRA','VLHKO',
  'OBLEK','KABAT','ZIMAK','SUKNE','PONOZ','RUKAV',
  'CESTA','SILNA','DOLNI','HORNI',
  'PISEK','PRACH','KAMAK','BAHNO','HLINA','ZEMNA',
  'VODKA','LIKUR','SIRUP','DZHEM','DROBY','KOKAL',
  'OPONA','MASKA','SOCHA','OLTARI','OBRAZ',
  'ZAMEK','BRANA','DVERE','SKLEP','KOMIN','STROP','PODLA',
  'LAVKA','MOSTA','KAMEN','SKALA','UDOLI',
  // 6-letter
  'BALKON','KOLONA','KLOKAN','KOSMOS','BANKET','KORUNA','KARTON',
  'JEZERO','KOCOUR','MEDVED','VEVERKA','JEZEK','SLEPICE','KACHNA',
  'ZAHRADA','LETISTE','NADRAZI','LEKARNA','VESNICE',
  'NOZDRA','STUDENT','POLEVKA','DOKTOR','SESTRA','UCITEL','ZNAMKA',
  'STRAKA','LASICE','TCHOUH','BOBCAT',
  'KABARET','LETADLO','KUFRIK',
  // 7+
  'NEMOCNICE','KABARET','SLEPICE','VEVERKA',
])

// English nouns — common nouns for word-finding
const EN_WORDS = new Set([
  'ACE','AGE','AID','AIR','APE','ARC','ARM','ART','ASH',
  'BAR','BAT','BAY','BED','BEE','BOW','BOX','BUD','BUG','BUS',
  'CAP','CAR','CAT','COB','COG','COT','COW','CUB','CUP',
  'DAM','DEN','DEW','DOE','DOG','DOT','DYE',
  'EAR','EEL','EGG','ELK','EMU','ERA','EWE','EYE',
  'FAN','FAT','FIG','FIN','FOG','FOX','FUR',
  'GAP','GAS','GEL','GEM','GIN','GNU','GOD','GUM','GUN',
  'HAM','HAT','HAY','HEN','HUB','HUE',
  'ICE','INK','INN','ION','IVY',
  'JAR','JAW','JET','JOB','JUG',
  'KEG','KID','KIT',
  'LAD','LAP','LAW','LEG','LOG',
  'MAP','MAT','MOB','MUD','MUG',
  'NAP','NET','NUT',
  'OAK','OAR','OAT','OIL','ORB','ORE','OWL',
  'PAD','PAN','PAW','PEA','PEN','PET','PIE','PIG','PIN','POD','POT','PUB','PUP',
  'RAG','RAM','RAT','RAY','RIB','ROD','ROE','ROT','ROW','RUG','RUM','RUN',
  'SAP','SAW','SEA','SKI','SKY','SOB','SOD','SOW','SOY','SPA','SUN',
  'TAB','TAN','TAR','TAX','TOE','TON','TOP','TOW','TOY','TUB','TUG',
  'URN','VAN','VAT','VET','WAR','WAX','WEB','WIG','WIT','WOE','YAK','YAM','YEW','ZOO',
  // 4-letter nouns
  'ACID','ACRE','ARCH','AREA','ARMY','ATOM',
  'BALL','BAND','BANK','BARK','BARN','BASE','BATH','BEAD','BEAM','BEAN','BEAR','BEAT',
  'BEEF','BEER','BELL','BELT','BIRD','BOAT','BODY','BOMB','BOND','BONE','BOOK','BOOM',
  'BOOT','BOSS','BOWL','BUCK','BULL','BUMP','BUNK','BUST',
  'CAGE','CAKE','CALF','CAMP','CANE','CARD','CARP','CART','CASE','CASH','CAVE','CELL',
  'CENT','CLAY','CLUE','COAL','COAT','CODE','COIL','COIN','COLT','COMB','CONE',
  'CORD','CORE','CORK','CORN','COST','CRAB','CREW','CROP','CROW','CUBE','CURL',
  'DAME','DARE','DART','DASH','DATE','DAWN','DEAL','DEAN','DEBT','DECK','DEER','DENT',
  'DESK','DIAL','DIET','DIME','DIRT','DISK','DOCK','DOME','DOSE','DOVE','DOWN','DROP',
  'DRUM','DUCK','DUNE','DUST','DUTY',
  'EARL','EDGE',
  'FALL','FAME','FANG','FARM','FATE','FEAR','FEAT','FERN','FILE','FILM','FIRM','FISH',
  'FIST','FLAG','FLAT','FLAW','FLEA','FOAM','FOLD','FOLK','FOOD','FOOT','FORD','FORK',
  'FORM','FORT','FUEL','FUND','FURY','FUSE',
  'GALE','GAME','GANG','GATE','GEAR','GERM','GIFT','GIRL','GOAT','GOLD','GOLF','GOWN',
  'HAIL','HAIR','HALF','HALL','HALO','HAND','HARP','HEAP','HEAT','HELM','HEMP','HERB',
  'HERD','HERO','HOLE','HOME','HOOD','HOOK','HORN','HOSE','HULL','HUNT','HUSK',
  'ICON','IDEA','INCH',
  'JADE','JAIL','JEST','JOKE','JOLT','JUNK',
  'KALE','KELP','KING','KNOT',
  'LACE','LAKE','LAMB','LAMP','LAND','LANE','LARK','LASH','LAVA','LAWN','LEAD','LEAF',
  'LEAK','LEAP','LEEK','LIMB','LIME','LINE','LINK','LION','LIST','LOAF','LOCK','LOIN',
  'LORD','LOSS','LOVE','LUCK','LUNG',
  'MACE','MAID','MAIL','MANE','MARK','MAST','MATE','MAZE','MEAL','MEAT','MELT','MILK',
  'MIME','MIND','MINE','MINT','MIST','MOAT','MOLE','MONK','MOON','MULE','MUTT',
  'NAIL','NAME','NECK','NEED','NEST','NEWS','NODE','NOON','NORM','NOTE','NOUN',
  'ODDS','OMEN','OPUS','OVAL',
  'PACE','PACK','PAGE','PAIL','PAIR','PALM','PANE','PARK','PART','PAST','PAWN','PEAK',
  'PEEL','PEST','PILE','PINE','PIPE','PLAN','PLUM','POEM','POET','POLE','POND','PORE',
  'PORK','PORT','POSE','PREY','PROP','PUMP',
  'RACK','RAGE','RAID','RAIL','RAIN','RAKE','RAMP','RANK','RASH','RATE','REEF','REEL',
  'REIN','RENT','RING','ROAD','ROBE','ROCK','ROLE','ROOF','ROOM','ROOT','ROPE','ROSE',
  'RUIN','RULE','RUSE',
  'SACK','SAFE','SAGE','SAIL','SAKE','SALE','SALT','SAND','SEAL','SEAM','SEAT','SEED',
  'SHED','SHIN','SHIP','SHOE','SHOP','SHOT','SILK','SILT','SITE','SKIN','SLAB','SLAT',
  'SLED','SLOT','SLUG','SNAP','SNOW','SNUB','SOAK','SOAP','SOCK','SOIL','SOLE','SONG',
  'SOOT','SORT','SOUL','SOUP','SPAN','SPAR','SPOT','SPUR','STEM','STUB','SUIT',
  'TALE','TANK','TAPE','TEAM','TEAR','TENT','TERM','TEST','TIDE','TIER','TOAD','TOIL',
  'TOMB','TOME','TOOL','TOUR','TOWN','TRAP','TREE','TREK','TRIO','TRIP','TUFT','TUNE',
  'TURF','TUSK','TYPE',
  'VALE','VANE','VEIL','VEIN','VEST','VINE','VOLE','VOLT',
  'WADE','WAGE','WAIL','WAKE','WALK','WALL','WANE','WARD','WARE','WART','WAVE','WELL',
  'WELT','WICK','WIFE','WIND','WINE','WING','WIRE','WOLF','WOMB','WORD','WORM','WREN',
  'YARD','YEAR','YOLK','ZEAL','ZONE',
  // 5-letter nouns
  'ANGEL','ANKLE','APPLE','ARROW','ATLAS',
  'BRIDE','BROOK','BROTH',
  'CABLE','CAMEL','CANAL','CARGO','CEDAR','CHALK','CHEST','CHINA','CRANE','CREEK',
  'DANCE','DOUBT','DRAFT','DRAIN','DRAMA','DREAM','DRINK','DRONE',
  'EARTH','EMBER','EPOCH',
  'FAIRY','FAITH','FEAST','FENCE','FERRY','FIELD','FLAME','FLASK','FLESH','FLEET',
  'FLOCK','FLOOD','FLOOR','FLORA','FLOUR','FLUTE','FORCE','FORGE','FORUM','FRONT',
  'FROST','FRUIT',
  'GHOST','GLASS','GLOBE','GLOOM','GOLEM','GOOSE','GRACE','GRAIN','GRAPE','GROVE',
  'GUARD','GUILD',
  'HABIT','HAVEN','HEART','HEDGE','HONOR','HORSE','HOUSE','HUMOR',
  'IMAGE','INLET',
  'JEWEL','JOINT','JUDGE','JUICE',
  'KNAVE','KNIFE','KNOLL',
  'LANCE','LASER','LEMON','LEVEL','LIGHT','LOCAL','LODGE','LOTUS',
  'MANOR','MAPLE','MATCH','MEDAL','MODEL','MOOSE','MOUSE','MOUTH','MUSIC',
  'NERVE','NIGHT','NORTH','NOVEL','NURSE',
  'OCEAN','OLIVE','ORBIT','ORDER','ORGAN','OTTER','OXIDE',
  'PAINT','PANEL','PAPER','PATCH','PEACE','PEACH','PENNY','PERCH','PIANO','PLANK',
  'PLANT','PLAZA','PLUME','POINT','POKER','POPPY','PORCH','PRESS','PRICE','PRIDE',
  'PRIME','PRINT','PRISM','PROBE','PROSE','PULSE','PUPIL',
  'QUAIL','QUEST',
  'RADAR','RADIO','RANCH','RANGE','RAPID','RATIO','RAVEN','REALM','REBEL','RELIC',
  'RIDER','RIDGE','RIFLE','RIVET','ROBOT','ROUND','ROUTE','RULER',
  'SAINT','SAUCE','SCALE','SCENE','SCOUT','SEDAN','SENSE','SERUM','SHARK',
  'SHELF','SHELL','SIGHT','SIREN','SKILL','SKULL','SKUNK','SLEEP','SLICE','SLOPE',
  'SLOTH','SMELL','SMOKE','SNAKE','SOLAR','SPACE','SPADE','SPARK','SPEAR','SPELL',
  'SPIRE','SPORT','STAIR','STAMP','STAND','STEAK','STEAM','STEEL','STONE','STORE',
  'STORM','STRAW','STUDY','STYLE','SUITE','SWAMP','SWARM','SWEAT','SWEET','SWIFT','SWORD',
  'TABLE','TALON','TASTE','TEMPO','TENOR','THORN','TIGER','TOAST','TOKEN','TORCH',
  'TORSO','TOWER','TRACE','TRACK','TRADE','TRAIL','TRAIN','TRAIT','TRAWL','TREAT',
  'TRIAL','TRIBE','TRICK','TROOP','TROUT','TUTOR','TWINS',
  'VAULT','VIOLA','VIPER','VISOR','VOTER',
  'WAFER','WASTE','WATCH','WATER','WEDGE','WHEEL','WITCH','WORLD',
  'YACHT','YIELD',
])

// Normalize: strip combining diacritics (U+0300–U+036F), uppercase, letters only
function norm(s: string): string {
  return [...s.normalize('NFD')]
    .filter(c => { const cc = c.charCodeAt(0); return cc < 0x0300 || cc > 0x036f })
    .join('').toUpperCase().replace(/[^A-Z]/g, '')
}

// Can this word be formed from the letter pool?
function canForm(word: string, pool: string[]): boolean {
  const n = norm(word)
  if (n.length < 2) return false
  const avail = [...pool]
  for (const ch of n) {
    const i = avail.indexOf(ch)
    if (i === -1) return false
    avail.splice(i, 1)
  }
  return true
}

function isInDict(word: string, lang: 'cs' | 'en'): boolean {
  return (lang === 'cs' ? CZ_WORDS : EN_WORDS).has(norm(word))
}

// Generate 11 letters with ~4 vowels
function genLetters(lang: 'cs' | 'en'): string[] {
  const CZ = 'AAAABBCCDDDEEEEEFFGGHHIIIIJKKKLLLMMNNNNNOOOOPPPRRRSSSTTTTTUUUUVVZZ'
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
  for (const word of dict) if (canForm(word, pool)) result.push(word)
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

  // Compute which letter tiles are consumed by current input
  const normInput = norm(input)
  const inputLetterCounts: Record<string, number> = {}
  for (const ch of normInput) inputLetterCounts[ch] = (inputLetterCounts[ch] || 0) + 1
  const tileConsumed = (() => {
    const counts: Record<string, number> = {}
    return letters.map(l => {
      counts[l] = (counts[l] || 0) + 1
      return counts[l] - 1 < (inputLetterCounts[l] || 0)
    })
  })()

  const submit = () => {
    const raw = input.trim()
    const n = norm(raw)
    if (n.length < 2) return
    if (!canForm(raw, letters)) {
      setInputError(true)
      setTimeout(() => setInputError(false), 500)
      if ('vibrate' in navigator) navigator.vibrate([20, 30, 20])
      return
    }
    const currentWords = pvpTurn === 0 ? p0Words : p1Words
    if (currentWords.includes(n)) { setInput(''); return }
    if ('vibrate' in navigator) navigator.vibrate(8)
    if (pvpTurn === 0) setP0Words(w => [...w, n])
    else setP1Words(w => [...w, n])
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

  const WordChip = ({ word, status }: { word: string; status: 'uniq' | 'shared' | 'invalid' }) => (
    <span style={{
      padding: '4px 10px', borderRadius: 999,
      background: status === 'uniq' ? 'var(--accent-tint-medium)' : status === 'shared' ? 'var(--card-bg)' : 'rgba(255,80,80,0.12)',
      color: status === 'uniq' ? 'var(--accent)' : status === 'shared' ? 'var(--text-muted)' : '#ff6b6b',
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
      textDecoration: status === 'invalid' ? 'line-through' : 'none',
    }}>{word}</span>
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
          onChange={e => setInput(norm(e.target.value))}
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
                  {valid.map(w => <WordChip key={w} word={w} status={shared.includes(w) ? 'shared' : 'uniq'} />)}
                  {all.filter(w => !valid.includes(w)).map(w => <WordChip key={w} word={w} status="invalid" />)}
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
