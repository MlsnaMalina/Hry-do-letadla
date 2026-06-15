// Shared dictionary — used by Slovní fotbal and Osmisměrka

// Normalize: strip combining diacritics (U+0300–U+036F), uppercase, letters only
// Used for pool-matching (canForm) only — NOT for dictionary lookup
export function norm(s: string): string {
  return [...s.normalize('NFD')]
    .filter(c => { const cc = c.charCodeAt(0); return cc < 0x0300 || cc > 0x036f })
    .join('').toUpperCase().replace(/[^A-Z]/g, '')
}

// Canonical key for Czech: uppercase, keep diacritics
// "čas" → "ČAS", "Město" → "MĚSTO"
export function canonCz(s: string): string {
  return s.toUpperCase().normalize('NFC')
}

// Czech nouns — canonical uppercase WITH diacritics
export const CZ_WORDS = new Set([
  // 3-letter
  'PES','LES','NOS','KOS','LOS','ROK','TOK','BOD','LED','MED','ROD','SAD',
  'DUB','LUK','MAK','RAK','LEV','BOL','KOL','VAL','KAL','BOR','BOK','KOP',
  'COP','SOK','PUK','TUK','SUK','BUK','DEN','SEN','SOL','VAZ','LEM','PAN',
  'TUR','BAL','VAN','HAD','SYN','NOC','HRA','NIT','LOV','MÍR','VÍR','DAR',
  'VŮL','ZUB','OKO','MÍČ','VĚŽ','MUŽ','KRK','LAK','PÁR','ŽÁK','ČAJ','VLK',
  'ČÁP','LOĎ','ČAS','GÓL','GEN','ČIN','SŮL','KŮŇ','DŮM','LOB','HRB','NŮŽ',
  'PAS','BOJ','TAH','VRH','ZIP','KRB','BRK','ŽAL','VAR','KAZ','RÁZ',
  'BAS','TRN','SUP','LUP','MOP','TOP','ŠUM','ROH','BĚH','MOL','VĚC',
  // 4-letter
  'AUTO','KOLO','DRAK','HRAD','VLAK','MRAK','MOST','DUCH','HORA','NEBE',
  'POLE','MAPA','NOTA','PLAZ','LIST','KOST','HOST','PLES','SLON','BRAT',
  'VLAS','HLAS','DRES','RYBA','NOHA','RUKA','VODA','KOZA','BOTA','SKLO',
  'KREV','SLOH','PRAK','TRAK','VLNA','ROLE','NORA','KÓTA','LATA','PLOT',
  'TVOR','LANO','PERO','PIVO','SENO','MENU','VÍNO','PRSA','TRŮN','DATA',
  'KRÁL','STŮL','LAMA','RÁNA','HLUK','TVAR','OBAL','BRAK','KLAN','PLÁN',
  'KLUK','SOVA','OKNO','DVŮR','KMEN','SLZA','ZÁDA','ÚSTA','UCHO','KVĚT',
  'ŘEKA','MOŘE','BROD','MASO','JARO','LÉTO','ZIMA','RÁNO','MLHA','ROSA',
  'MRÁZ','SNÍH','DÉŠŤ','KÁVA','CUKR','OLEJ','PTÁK','OVCE','OREL','TYGR',
  'BOBR','OSEL','SOUD','PARK','GOLF','ÚHEL','PRST','PLOD','TETA','OTEC',
  'ZEMĚ','KRAJ','CENA','PLAT','STAV','CHUŤ','DLAŇ','JÁMA','PATA','PĚNA',
  'SVĚT','TRAM','TAXI','KUFR','DŽEM','DÍTĚ',
  'ZRAK','PUSA','KUNA','KOSA','MÍSA','OSUD','GRIL','STAN','DECH','VLEK',
  'HROB','BLOK','KLAM','RUCH','TISK','TLAK','VRAH','ZISK','DISK','FILM',
  'KLUB','TEST','PRUH','SRUB','PUCH','STEH','DRÁP','OČKO','VRCH','UZEL',
  'VRAK','KRAB','SMYK','STUD','SKOK','KLON','CHOV','CHOD','CHÓR',
  'OHEŇ','OCEL','OCET','OPAD','ÚŽAS','ÚRAZ','ÚTĚK','ÚTOK',
  'VRBA','VŘES','ZDAR','ZPĚV','ZROD','ZVON',
  // 5-letter
  'KÁMEN','HLAVA','KNIHA','SALON','BARON','BETON','OPERA','BANDA','LAMPA',
  'KAPSA','VLAST','STROM','PANDA','METAL','HOTEL','MOTOR','PILOT','BALÓN',
  'POKER','ROMÁN','KORÁL','PEDÁL','RADAR','NÁROD','NORMA','SKÁLA',
  'TENOR','TRAKT','KRÁSA','BRADA','KABEL','KABÁT','TALÍŘ',
  'NYLON','PYLÓN','DÉMON','BONUS','KOŠÁŘ','PLECH','TREST','POLKA',
  'ŠKOLA','MĚSTO','ULICE','BANKA','POŠTA','SPORT','PÍSEŇ','TANEC','HUDBA',
  'SLOVO','DÍVKA','STRÝC','LÉKAŘ','TŘÍDA','LOUKA','ŽELVA','MLÉKO','JÍDLO',
  'BUBEN','PRÁVO','ZÁKON','VLÁDA','VÁLKA','VOJÁK','VEČER','TÝDEN',
  'JAZYK','BARVA','MATKA','HOLKA','VEJCE','CHLÉB','VRÁNA',
  'HOLUB','PRASE','KRÁVA','LIŠKA','ZAJÍC','KOČKA','MYŠKA',
  'KOTEL','LAVOR','KOŠÍK','TRASA','PASTA','KLIMA','TÁBOR',
  'BLÁTO','OKRAJ','DOPIS','OBLAK','OHLAS','OSADA','KUPKA','PALEC',
  'BŘÍZA','JASAN','TRÁVA','JETEL','KAPKA','VLHKO','OBLEK','SUKNĚ','RUKÁV',
  'CESTA','PÍSEK','PRACH','BAHNO','HLÍNA','VODKA','SIRUP','LIKÉR',
  'OPONA','MASKA','SOCHA','OLTÁŘ','OBRAZ','ZÁMEK','BRÁNA','DVEŘE',
  'SKLEP','KOMÍN','STROP','LAVKA','ÚDOLÍ','JELEN','KOPEC','ZIMÁK',
  'MOZEK','SRDCE','HOKEJ','TENIS','JEŽEK','HRNEK','SKŘÍŇ','KOLÁČ','GULÁŠ',
  // 6-letter
  'BALKÓN','KOLONA','KLOKAN','KOSMOS','BANKET','KORUNA','KARTON',
  'JEZERO','KOCOUR','MEDVĚD','KACHNA','NOZDRA','DOKTOR','SESTRA',
  'UČITEL','ZNÁMKA','STRAKA','LASICE','KUFŘÍK','STRANA','OBCHOD',
  'FOTBAL','KOLENO','RAMENO','HODINA','MINUTA','PODZIM','KYTARA',
  // 7+
  'NEMOCNICE','ZAHRADA','LETIŠTĚ','NÁDRAŽÍ','LÉKÁRNA','VESNICE',
  'STUDENT','POLÉVKA','KABARET','LETADLO','SLEPICE','VEVERKA',
])

// English nouns — common nouns for word-finding (stored uppercase, no diacritics)
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

// User-added words — stored in canonical form (Czech: uppercase with diacritics, English: uppercase)
const loadCustom = (lang: 'cs' | 'en'): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(`ta-custom-${lang}`) ?? '[]')) } catch { return new Set() }
}
export const customWords = { cs: loadCustom('cs'), en: loadCustom('en') }

export function addCustomWord(word: string, lang: 'cs' | 'en') {
  const key = lang === 'cs' ? canonCz(word) : norm(word)
  customWords[lang].add(key)
  try { localStorage.setItem(`ta-custom-${lang}`, JSON.stringify([...customWords[lang]])) } catch {}
}

// Banned words — stored in canonical form
const loadBanned = (lang: 'cs' | 'en'): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(`ta-banned-${lang}`) ?? '[]')) } catch { return new Set() }
}
export const bannedWords = { cs: loadBanned('cs'), en: loadBanned('en') }

export function banWord(word: string, lang: 'cs' | 'en') {
  const key = lang === 'cs' ? canonCz(word) : norm(word)
  bannedWords[lang].add(key)
  customWords[lang].delete(key)
  try {
    localStorage.setItem(`ta-banned-${lang}`, JSON.stringify([...bannedWords[lang]]))
    localStorage.setItem(`ta-custom-${lang}`, JSON.stringify([...customWords[lang]]))
  } catch {}
}

// Dictionary lookup
// Czech: requires exact canonical form — "čas" → "ČAS" in set; "cas" → "CAS" NOT in set
// English: case-insensitive, no diacritics (norm)
export function isInDict(word: string, lang: 'cs' | 'en'): boolean {
  if (lang === 'cs') {
    const key = canonCz(word)
    if (bannedWords.cs.has(key)) return false
    return CZ_WORDS.has(key) || customWords.cs.has(key)
  } else {
    const key = norm(word)
    if (bannedWords.en.has(key)) return false
    return EN_WORDS.has(key) || customWords.en.has(key)
  }
}

// Words for Czech Osmisměrka: 3–8 chars, with diacritics, excluding banned
export function pickOsmiWords(n: number): string[] {
  const pool: string[] = []
  for (const w of CZ_WORDS) if (w.length >= 3 && w.length <= 8 && !bannedWords.cs.has(w)) pool.push(w)
  for (const w of customWords.cs) if (w.length >= 3 && w.length <= 8 && !bannedWords.cs.has(w)) pool.push(w)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}

// Words for English Osmisměrka: 4–7 chars, excluding banned
export function pickEnWords(n: number): string[] {
  const pool: string[] = []
  for (const w of EN_WORDS) if (w.length >= 4 && w.length <= 7 && !bannedWords.en.has(w)) pool.push(w)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}
