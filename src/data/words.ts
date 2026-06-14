export interface HangmanWord { w: string; h: string }

export const HANGMAN_WORDS: HangmanWord[] = [
  { w: 'AIRPLANE', h: 'It flies you across the ocean' },
  { w: 'PASSPORT', h: 'You show it at the border' },
  { w: 'WINDOW', h: 'Ask for the … seat' },
  { w: 'JOURNEY', h: 'A long trip' },
  { w: 'SUITCASE', h: 'You pack your clothes in it' },
  { w: 'BOARDING', h: '… pass' },
  { w: 'RUNWAY', h: 'Where planes take off' },
  { w: 'TURBULENCE', h: 'Bumpy air' },
  { w: 'DESTINATION', h: 'Where you are going' },
  { w: 'CUSTOMS', h: 'Border control checks your bags here' },
  { w: 'DEPARTURE', h: 'The time your flight leaves' },
  { w: 'ARRIVAL', h: 'Landing at your destination' },
  { w: 'LUGGAGE', h: 'Your bags and cases' },
  { w: 'TERMINAL', h: 'The building at the airport' },
  { w: 'CAPTAIN', h: 'The pilot in command' },
  { w: 'STEWARD', h: 'Flight crew member' },
  { w: 'OVERHEAD', h: '… bin above your seat' },
  { w: 'STOPOVER', h: 'A short break between flights' },
  { w: 'LAYOVER', h: 'Waiting at an airport between flights' },
  { w: 'COCKPIT', h: 'Where the pilot sits' },
]

export const OSMI_WORDS = [
  'AIRPLANE', 'SUITCASE', 'JOURNEY', 'TICKET', 'TRAIN',
  'BEACH', 'OCEAN', 'HOTEL', 'CITY', 'PILOT',
]

// Extended offline dictionary for Word Chain
export const WORDCHAIN_OK = new Set([
  // A
  'able','about','above','across','act','add','after','again','age','ago','agree','ahead','air','all','allow','almost','alone',
  'along','also','always','among','and','animal','answer','any','apple','area','arm','army','art','ask','aunt',
  // B
  'back','ball','band','bank','base','bath','bear','beat','bed','best','bird','black','blade','blank','blow','blue',
  'board','boat','body','bone','book','born','both','box','boy','brave','break','bridge','bring','broad','brown','build',
  // C
  'call','calm','came','camp','card','care','carry','case','catch','cause','cave','cell','change','chase','check','choose',
  'city','claim','class','clean','clear','climb','close','cloud','coat','code','cold','come','cool','copy','corn','cost',
  'count','cover','cross','crown','cut',
  // D
  'dark','data','date','dawn','dead','deal','dean','deep','desk','dirt','door','down','draw','dream','drive','drop',
  'dust','duty',
  // E
  'each','earn','east','easy','edge','else','end','enemy','energy','enter','even','ever','every','evil','exam','exit',
  'eye','eagle','earth','echo','echo','elephant','engine',
  // F
  'face','fact','fail','fall','fame','farm','fast','feel','field','find','fire','first','fish','flag','flat','flow',
  'foam','fold','food','foot','form','free','from','fuel','full','fun','fund',
  // G
  'game','gate','gave','gift','give','glad','glass','goal','gold','good','grab','gray','great','green','grow','gulf',
  // H
  'hand','hang','hard','have','head','hear','heart','heat','help','here','hero','high','hill','hint','hold','hole','home',
  'hope','horn','horse','host','hour','house','huge','hunt',
  // I
  'idea','into','iron','island',
  // J
  'join','jump','just','jungle','journey',
  // K
  'keep','kind','king','know','knife','kite',
  // L
  'lake','land','lane','large','last','late','lead','leaf','lean','left','less','life','lift','light','like','line',
  'lion','list','live','lock','long','look','lose','love','low','luck',
  // M
  'main','make','male','many','mark','mass','mean','meet','melt','mind','mine','miss','mode','moon','more','most',
  'move','much','must',
  // N
  'name','near','neck','need','news','next','nice','nine','none','norm','nose','note','now','nest',
  // O
  'once','only','open','over','ocean','orange',
  // P
  'pace','pain','pair','palm','park','part','pass','past','path','peak','pick','pink','plan','play','plot','plus',
  'poem','point','pool','poor','port','post','pour','power','pray','pull','push','put','plane',
  // Q
  'quit','quiz','queen','quick',
  // R
  'race','rain','raise','range','rank','rate','read','real','rest','rice','rich','ride','ring','rise','road','rock',
  'role','root','rope','rose','rule','run','robot',
  // S
  'safe','sail','sale','same','sand','save','seal','seat','seem','self','sell','send','ship','shop','show','sign',
  'size','skip','slip','slow','snow','soft','soil','sold','some','song','soon','soul','speak','spin','spot','star',
  'stay','step','stop','storm','story','such','suit','sure','swim','sun','seed','sea',
  // T
  'tail','talk','tall','task','tell','test','than','that','them','then','they','think','this','time','tire','told',
  'tone','tool','town','tree','trip','true','turn','type','train','table','tiger','travel',
  // U
  'unit','upon','used','user',
  // V
  'vast','very','view','vine','vote','voice','value',
  // W
  'wait','wake','walk','wall','warm','warn','wave','weak','wear','week','well','wide','wild','will','wind','wise',
  'wish','wood','word','work','worm','wrap','write','water','window',
  // X/Y/Z
  'yard','year','yes','your','yellow','zone','zero',
].map(w => w.toLowerCase()))
