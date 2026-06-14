export type GameId = 'piskvorky' | 'tecky' | 'ctyri' | 'hangman' | 'wordchain' | 'osmismerka' | 'slovnik' | 'had'
export type GameMode = 'ai' | 'pvp'

export interface GameDef {
  id: GameId
  icon: string
  title: string
  accent: string
  tag: string
  en: boolean
  desc: string
  bestLabel: string
  defaultBest: string
  rules: string[]
  solo: boolean
}

export const GAMES: GameDef[] = [
  {
    id: 'piskvorky', icon: 'piskvorky', title: 'Piškvorky', accent: '#34E4C4',
    tag: '// pět v řadě', en: false, solo: false,
    desc: 'Klasická hra na mřížce. Kdo první spojí pět symbolů, vyhrává.',
    bestLabel: 'Nejdelší série', defaultBest: '—',
    rules: ['Hráči se střídají v pokládání svého symbolu (✕ / ○).', 'Cílem je spojit pět symbolů v řadě — vodorovně, svisle nebo šikmo.', 'Proti AI nebo ve dvou na jednom zařízení.'],
  },
  {
    id: 'tecky', icon: 'tecky', title: 'Tečkovaná', accent: '#A78BFA',
    tag: '// obklič a získej', en: false, solo: false,
    desc: 'Pokládej puntíky na průsečíky čar a uzavírej soupeřovy tečky do smyčky.',
    bestLabel: 'Nejvíc obklíčeno', defaultBest: '—',
    rules: ['Hráči se střídají v pokládání puntíků své barvy na průsečíky čar.', 'Spojuj vlastní puntíky a uzavři jimi soupeřovy do souvislé smyčky bez mezer.', 'Za každý obklíčený soupeřův puntík máš bod — vyhrává, kdo jich uzavře víc.'],
  },
  {
    id: 'ctyri', icon: 'ctyri', title: 'Čtyři v řadě', accent: '#FF2E6E',
    tag: '// padá to dolů', en: false, solo: false,
    desc: 'Pouštějte žetony do sloupců a spojte čtyři dřív než soupeř.',
    bestLabel: 'Výhry v řadě', defaultBest: '—',
    rules: ['Klepnutím na sloupec pustíte svůj žeton — spadne dolů.', 'Spojte čtyři žetony v řadě v jakémkoli směru.', 'První, kdo to dokáže, vyhrává.'],
  },
  {
    id: 'hangman', icon: 'hangman', title: 'Hangman', accent: '#38BDF8',
    tag: '// practice English', en: true, solo: false,
    desc: 'Uhádněte anglické slovo po písmenech. Pět chyb a je konec.',
    bestLabel: 'Slov uhádnuto', defaultBest: '0',
    rules: ['Hádejte písmena anglického slova.', 'Každé chybné písmeno ubere jeden pokus z pěti.', 'Uhádněte celé slovo dřív, než dojdou pokusy.'],
  },
  {
    id: 'wordchain', icon: 'wordchain', title: 'Word Chain', accent: '#F472B6',
    tag: '// rapid-fire English', en: true, solo: false,
    desc: 'Řetěz anglických slov proti času. Další slovo začíná posledním písmenem.',
    bestLabel: 'Nejdelší řetěz', defaultBest: '0 slov',
    rules: ['Napište anglické slovo začínající posledním písmenem předchozího.', 'Na každé slovo máte pár vteřin — odpočet je nemilosrdný.', 'Žádné opakování. Řetěz se nesmí přetrhnout.'],
  },
  {
    id: 'osmismerka', icon: 'osmismerka', title: 'Osmisměrka', accent: '#9BE45A',
    tag: '// practice English', en: true, solo: true,
    desc: 'Najdi schovaná anglická slovíčka ve všech osmi směrech — i pozpátku a šikmo.',
    bestLabel: 'Nejrychlejší čas', defaultBest: '—',
    rules: ['V mřížce se skrývají anglická cestovatelská slovíčka ze seznamu.', 'Slova jsou ve všech osmi směrech — vodorovně, svisle i šikmo, i pozpátku.', 'Táhni prstem od prvního k poslednímu písmenu slova a najdi je všechna.'],
  },
  {
    id: 'slovnik', icon: 'fotbal', title: 'Slovní fotbal', accent: '#3B82F6',
    tag: '// kdo najde víc?', en: false, solo: false,
    desc: 'Sestav co nejvíce slov z 11 náhodných písmen. Čeština nebo angličtina — 90 vteřin.',
    bestLabel: 'Nejvíc platných slov', defaultBest: '0',
    rules: [
      'Oba hráči dostanou 11 stejných písmen a 90 vteřin.',
      'Pište podstatná jména v prvním pádu (pes, auto, stůl…). Každé písmeno lze v jednom slově použít jen tolikrát, kolikrát se v zásobníku vyskytuje.',
      'Po uplynutí času se odstraní neplatná slova a duplicity (slova, která zadali oba). Vyhrává ten, kdo má víc unikátních platných slov.',
    ],
  },
  {
    id: 'had', icon: 'had', title: 'Had', accent: '#FF3EA5',
    tag: '// classic snake', en: false, solo: true,
    desc: 'Řiď hada, sbírej srdíčka a vyhýbej se sám sobě. Rychlost roste každých 5 sebraných.',
    bestLabel: 'Nejvyšší skóre', defaultBest: '0',
    rules: [
      'Šipkami nebo D-padem řiď hada — nesmíš narazit sám do sebe.',
      'Seber bílé srdíčko — had roste a získáš bod. Každých 5 srdíček se had pohybuje rychleji.',
      'Stěnami procházíš — vylezíš na druhé straně.',
    ],
  },
]

export const GAME_BY_ID = Object.fromEntries(GAMES.map(g => [g.id, g])) as Record<GameId, GameDef>
