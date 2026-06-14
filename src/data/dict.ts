// Shared dictionary — used by Slovní fotbal and Osmisměrka

// Normalize: strip combining diacritics (U+0300–U+036F), uppercase, letters only
export function norm(s: string): string {
  return [...s.normalize('NFD')]
    .filter(c => { const cc = c.charCodeAt(0); return cc < 0x0300 || cc > 0x036f })
    .join('').toUpperCase().replace(/[^A-Z]/g, '')
}

// Czech nouns — normalized (uppercase, no diacritics), verified first-case singular only
export const CZ_WORDS = new Set([
  // 3-letter
  'PES','LES','NOS','KOS','LOS','ROK','TOK','BOD','LED','MED','ROD','SAD',
  'DUB','LUK','MAK','RAK','LEV','BOL','KOL','VAL','KAL','BOR','BOK','KOP',
  'COP','SOK','PUK','TUK','SUK','BUK','DEN','SEN','SOL','VAZ','LEM','PAN',
  'TUR','BAL','VAN','HAD','SYN','NOC','HRA','NIT','LOV','MIR','VIR','DAR',
  'VUL','ZUB','OKO','MIC','VEZ','MUZ','KRK','LAK','PAR','ZAK','CAJ','VLK',
  'CAP','LOD','CAS','GOL','GEN','CIN','SUL','KUN','DUM','LOB','HRB','NUZ',
  'TES','PAS','BOJ','TAH','VRH','ZIP','KRB','BRK','ZAL','VAR','KAZ','RAZ',
  'BAS','TRN','SUP','LUP','MOP','TOP','SUM','ROH','BEH','SEK','MOL','VEC',
  // 4-letter
  'AUTO','KOLO','DRAK','HRAD','VLAK','MRAK','MOST','DUCH','HORA','NEBE',
  'POLE','MAPA','NOTA','PLAZ','LIST','KOST','HOST','PLES','SLON','BRAT',
  'VLAS','HLAS','DRES','RYBA','NOHA','RUKA','VODA','KOZA','BOTA','SKLO',
  'KREV','SLOH','PRAK','TRAK','VLNA','ROLE','NORA','KOTA','LATA','PLOT',
  'TVOR','LANO','PERO','PIVO','SENO','MENU','VINO','PRSA','TRON','DATA',
  'KRAL','STUL','LAMA','RANA','HLUK','TVAR','OBAL','BRAK','KLAN','PLAN',
  'KLUK','SOVA','OKNO','DVUR','KMEN','SLZA','ZADA','USTA','UCHO','KVET',
  'REKA','MORE','BROD','MASO','JARO','LETO','ZIMA','RANO','MLHA','ROSA',
  'MRAZ','SNEH','DEST','KAVA','CUKR','OLEJ','PTAK','OVCE','OREL','TYGR',
  'BOBR','OSEL','SOUD','PARK','GOLF','UHEL','PRST','PLOD','TETA','OTEC',
  'ZEME','KRAJ','CENA','PLAT','STAV','CHUT','DLAN','JAMA','PATA','PENA',
  'SVET','TRAM','TAXI','KUFR','VLEC','DZEM',
  'ZRAK','PUSA','KUNA','KOSA','MISA','OSUD','GRIL','STAN','DECH','VLEK',
  'HROB','BLOK','KLAM','RUCH','TISK','TLAK','VRAH','ZISK','DISK','FILM',
  'KLUB','TEST','PRUH','SRUB','PUCH','STEH','DRAP','OCKO','VRCH','UZEL',
  'VRAK','KRAB','SMYK','STUD','KRES','SKOK','KLON','CHOV','CHOD','CHOR',
  'OHEN','OCEL','OCET','OPAD','UZAS','URAZ','UTEK','UTOK',
  'VRBA','VRES','ZDAR','ZPEV','ZROD','ZVON','RISK',
  // 5-letter
  'KAMEN','HLAVA','KNIHA','SALON','BARON','BETON','OPERA','BANDA','LAMPA',
  'KAPSA','VLAST','STROM','PANDA','METAL','HOTEL','MOTOR','PILOT','BALON',
  'POKER','ROMAN','KORAL','PEDAL','RADAR','NAROD','NORMA','SKALA',
  'TENOR','TRAKT','TRUBA','KRASA','BRADA','KABEL','KABAT','TALIR',
  'SOLAR','NYLON','PYLON','DEMON','BONUS','KOSAR','PLECH','TREST','POLKA',
  'SKOLA','MESTO','ULICE','BANKA','POSTA','SPORT','PISEN','TANEC','HUDBA',
  'SLOVO','DIVKA','STRYC','LEKAR','TRIDA','LOUKA','ZELVA','MLEKO','JIDLO',
  'BUBEN','PRAVO','ZAKON','VLADA','VALKA','VOJAK','VECER','TYDEN',
  'JAZYK','BARVA','MATKA','HOLKA','DITE','VEJCE','CHLEB','VRANA',
  'HOLUB','PRASE','KRAVA','LISKA','ZAJIC','KOCKA','MYSKA',
  'KOTEL','LAVOR','KOSIK','TRASA','PASTA','KLIMA','TABOR',
  'BLATO','OKRAJ','DOPIS','OBLAK','OHLAS','OSADA','KUPKA','PALEC',
  'BREZA','JASAN','TRAVA','JETEL','KAPKA','VLHKO','OBLEK','SUKNE','RUKAV',
  'CESTA','PISEK','PRACH','BAHNO','HLINA','VODKA','SIRUP','DROBY','LIKER',
  'OPONA','MASKA','SOCHA','OLTAR','OBRAZ','ZAMEK','BRANA','DVERE',
  'SKLEP','KOMIN','STROP','LAVKA','UDOLI','JELEN','KOPEC','ZIMAK',
  'MOZEK','SRDCE','HOKEJ','TENIS','JEZEK','HRNEK','SKRIN','KOLAC','GULAS',
  // 6-letter
  'BALKON','KOLONA','KLOKAN','KOSMOS','BANKET','KORUNA','KARTON',
  'JEZERO','KOCOUR','MEDVED','KACHNA','NOZDRA','DOKTOR','SESTRA',
  'UCITEL','ZNAMKA','STRAKA','LASICE','KUFRIK','STRANA','OBCHOD',
  'FOTBAL','KOLENO','RAMENO','HODINA','MINUTA','PODZIM','KYTARA',
  // 7+
  'NEMOCNICE','ZAHRADA','LETISTE','NADRAZI','LEKARNA','VESNICE',
  'STUDENT','POLEVKA','KABARET','LETADLO','SLEPICE','VEVERKA',
])

// English nouns — common nouns for word-finding
export const EN_WORDS = new Set([
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

// User-added words persisted in localStorage
const loadCustom = (lang: 'cs' | 'en'): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(`ta-custom-${lang}`) ?? '[]')) } catch { return new Set() }
}
export const customWords = { cs: loadCustom('cs'), en: loadCustom('en') }

export function addCustomWord(word: string, lang: 'cs' | 'en') {
  customWords[lang].add(word)
  try { localStorage.setItem(`ta-custom-${lang}`, JSON.stringify([...customWords[lang]])) } catch {}
}

// Banned words — permanently removed from the effective dictionary
const loadBanned = (lang: 'cs' | 'en'): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(`ta-banned-${lang}`) ?? '[]')) } catch { return new Set() }
}
export const bannedWords = { cs: loadBanned('cs'), en: loadBanned('en') }

export function banWord(word: string, lang: 'cs' | 'en') {
  bannedWords[lang].add(word)
  customWords[lang].delete(word)
  try {
    localStorage.setItem(`ta-banned-${lang}`, JSON.stringify([...bannedWords[lang]]))
    localStorage.setItem(`ta-custom-${lang}`, JSON.stringify([...customWords[lang]]))
  } catch {}
}

export function isInDict(word: string, lang: 'cs' | 'en'): boolean {
  const n = norm(word)
  if (bannedWords[lang].has(n)) return false
  return (lang === 'cs' ? CZ_WORDS : EN_WORDS).has(n) || customWords[lang].has(n)
}

// Build a word pool for Osmisměrka: CZ words length 3–8, + custom, – banned
export function osmiWordPool(): string[] {
  const pool: string[] = []
  for (const w of CZ_WORDS) if (w.length >= 3 && w.length <= 8) pool.push(w)
  for (const w of customWords.cs) {
    const n = norm(w)
    if (n.length >= 3 && n.length <= 8 && !bannedWords.cs.has(n)) pool.push(n)
  }
  return pool
}

// Pick n random words from the pool (no duplicates)
export function pickOsmiWords(n: number): string[] {
  const pool = osmiWordPool()
  const result: string[] = []
  const used = new Set<string>()
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  for (const w of pool) {
    if (!used.has(w) && !bannedWords.cs.has(w)) { used.add(w); result.push(w) }
    if (result.length >= n) break
  }
  return result
}
