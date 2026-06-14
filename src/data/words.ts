export interface HangmanWord { w: string; h: string }

export const HANGMAN_WORDS: HangmanWord[] = [
  // travel
  { w: 'AIRPLANE', h: 'It flies you across the ocean' },
  { w: 'PASSPORT', h: 'You show it at the border' },
  { w: 'JOURNEY', h: 'A long trip' },
  { w: 'SUITCASE', h: 'You pack your clothes in it' },
  { w: 'TURBULENCE', h: 'Bumpy air on a flight' },
  { w: 'DESTINATION', h: 'Where you are going' },
  { w: 'DEPARTURE', h: 'The time your flight leaves' },
  { w: 'LUGGAGE', h: 'Your bags and cases' },
  { w: 'CAPTAIN', h: 'The pilot in command' },
  { w: 'STOPOVER', h: 'A short break between flights' },
  // animals
  { w: 'ELEPHANT', h: 'The largest land animal' },
  { w: 'PENGUIN', h: 'A flightless bird from the South Pole' },
  { w: 'BUTTERFLY', h: 'It starts life as a caterpillar' },
  { w: 'DOLPHIN', h: 'A smart ocean mammal' },
  { w: 'GIRAFFE', h: 'The tallest animal on land' },
  { w: 'SQUIRREL', h: 'It collects nuts for winter' },
  { w: 'CROCODILE', h: 'Ancient reptile with sharp teeth' },
  { w: 'FLAMINGO', h: 'A pink bird that stands on one leg' },
  { w: 'OCTOPUS', h: 'Eight-armed sea creature' },
  { w: 'HEDGEHOG', h: 'A prickly little animal' },
  // food & drink
  { w: 'CHOCOLATE', h: 'Made from cocoa beans' },
  { w: 'STRAWBERRY', h: 'A red summer fruit' },
  { w: 'PANCAKE', h: 'Flat breakfast cake' },
  { w: 'SANDWICH', h: 'Two slices of bread with filling' },
  { w: 'MUSHROOM', h: 'Grows in forests, used in cooking' },
  { w: 'PINEAPPLE', h: 'Tropical fruit with a crown' },
  { w: 'CINNAMON', h: 'A warm spice from tree bark' },
  { w: 'AVOCADO', h: 'A green creamy fruit' },
  // nature
  { w: 'THUNDER', h: 'The loud sound during a storm' },
  { w: 'VOLCANO', h: 'A mountain that can erupt' },
  { w: 'RAINBOW', h: 'Appears after rain and sun' },
  { w: 'SNOWFLAKE', h: 'Every one is unique' },
  { w: 'WATERFALL', h: 'Water falling off a cliff' },
  { w: 'DESERT', h: 'Very dry, often sandy landscape' },
  { w: 'GLACIER', h: 'A slow-moving river of ice' },
  { w: 'HORIZON', h: 'Where the sky meets the earth' },
  // everyday life
  { w: 'UMBRELLA', h: 'Keeps you dry in the rain' },
  { w: 'BLANKET', h: 'Keeps you warm in bed' },
  { w: 'CALENDAR', h: 'Shows all the days of the year' },
  { w: 'MIRROR', h: 'Shows your reflection' },
  { w: 'KEYBOARD', h: 'You type on it' },
  { w: 'LIBRARY', h: 'A building full of books' },
  { w: 'HOSPITAL', h: 'Where doctors treat patients' },
  { w: 'MIDNIGHT', h: 'Exactly 12 o\'clock at night' },
  { w: 'WEEKEND', h: 'Saturday and Sunday' },
  { w: 'BIRTHDAY', h: 'The anniversary of your birth' },
  // sports & hobbies
  { w: 'SWIMMING', h: 'Moving through water' },
  { w: 'CLIMBING', h: 'Going up a wall or mountain' },
  { w: 'ORCHESTRA', h: 'A large group of musicians' },
  { w: 'CHAMPION', h: 'The winner of a competition' },
  { w: 'SKATEBOARD', h: 'A board on four wheels' },
  // science & school
  { w: 'GRAVITY', h: 'What keeps you on the ground' },
  { w: 'TRIANGLE', h: 'A shape with three sides' },
  { w: 'SKELETON', h: 'The bones inside your body' },
  { w: 'PLANET', h: 'Earth is one, so is Mars' },
  { w: 'BATTERY', h: 'Stores electrical energy' },
  { w: 'EXPERIMENT', h: 'A scientific test' },
  { w: 'MICROSCOPE', h: 'Makes tiny things look big' },
  // places & things
  { w: 'MOUNTAIN', h: 'Very tall and rocky' },
  { w: 'MUSEUM', h: 'A place with art and history' },
  { w: 'STADIUM', h: 'Where sports matches are played' },
  { w: 'VILLAGE', h: 'A small settlement' },
  { w: 'ISLAND', h: 'Land surrounded by water' },
  { w: 'BRIDGE', h: 'Connects two sides over water' },
  { w: 'TOWER', h: 'A tall, narrow building' },
  { w: 'COMPASS', h: 'Points to the north' },
  { w: 'TREASURE', h: 'Hidden gold and jewels' },
  { w: 'SHADOW', h: 'Darkness behind you when light shines' },
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
