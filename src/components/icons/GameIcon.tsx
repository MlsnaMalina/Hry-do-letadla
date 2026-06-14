interface Props { name: string; size?: number }

export function GameIcon({ name, size = 44 }: Props) {
  const c = {
    width: size, height: size, viewBox: '0 0 64 64',
    style: { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const },
  }
  switch (name) {
    case 'piskvorky':
      return (<svg {...c}><path d="M24 9V55M40 9V55M9 24H55M9 40H55" opacity="0.55" /><path d="M12 12L20 20M20 12L12 20" /><circle cx="48" cy="48" r="6" /></svg>)
    case 'tecky':
      return (<svg {...c}>
        {([14,32,50] as number[]).map((y,i) => ([14,32,50] as number[]).map((x,j) => <circle key={`${i}${j}`} cx={x} cy={y} r="2.5" fill="currentColor" stroke="none" />))}
        <path d="M14 14H32M14 14V32M14 32H32M32 14V32" />
        <rect x="36" y="36" width="14" height="14" rx="3" fill="currentColor" stroke="none" opacity="0.45" />
      </svg>)
    case 'ctyri':
      return (<svg {...c}><rect x="10" y="13" width="44" height="40" rx="7" />
        <circle cx="21" cy="44" r="4.6" fill="currentColor" stroke="none" /><circle cx="32" cy="44" r="4.6" fill="currentColor" stroke="none" /><circle cx="32" cy="31" r="4.6" fill="currentColor" stroke="none" />
        <circle cx="43" cy="44" r="4.6" /><circle cx="21" cy="31" r="4.6" /><circle cx="43" cy="31" r="4.6" /><circle cx="32" cy="20" r="4.6" /></svg>)
    case 'hangman':
      return (<svg {...c}><path d="M32 17C25 13 17 12 11 14V49C17 47 25 48 32 52" /><path d="M32 17C39 13 47 12 53 14V49C47 47 39 48 32 52" /><path d="M32 17V52" opacity="0.5" /><path d="M16 25H26M38 25H48M16 34H26" strokeWidth="2.4" opacity="0.7" /></svg>)
    case 'wordchain':
      return (<svg {...c}><rect x="9" y="26" width="26" height="15" rx="7.5" transform="rotate(-18 22 33)" /><rect x="30" y="24" width="26" height="15" rx="7.5" transform="rotate(-18 43 31)" /><path d="M48 9L45 16M55 13L50 18M56 22L50 23" strokeWidth="2.4" /></svg>)
    case 'osmismerka':
      return (<svg {...c}><rect x="10" y="10" width="44" height="44" rx="7" /><path d="M24 10V54M40 10V54M10 24H54M10 40H54" strokeWidth="2.2" opacity="0.5" /><path d="M15 15L49 49" strokeWidth="3.6" /><circle cx="15" cy="15" r="3" fill="currentColor" stroke="none" /><circle cx="49" cy="49" r="3" fill="currentColor" stroke="none" /></svg>)
    case 'fotbal':
      return (<svg {...c}>
        {/* Soccer ball — circle with pentagon pattern */}
        <circle cx="32" cy="32" r="22" />
        {/* Central pentagon */}
        <path d="M32 16 L38 24 L35 33 L29 33 L26 24 Z" />
        {/* Side patches */}
        <path d="M10 28 L18 24 L22 31 L17 38 L9 37 Z" opacity="0.7" />
        <path d="M54 28 L46 24 L42 31 L47 38 L55 37 Z" opacity="0.7" />
        <path d="M20 46 L22 37 L30 36 L33 44 L26 50 Z" opacity="0.7" />
        <path d="M44 46 L42 37 L34 36 L31 44 L38 50 Z" opacity="0.7" />
      </svg>)
    case 'had':
      return (<svg {...c}>
        {/* Snake body — curving S-shape */}
        <path d="M12 44 C12 38 20 38 20 32 C20 26 12 26 12 20 C12 14 22 11 30 14" strokeWidth="7" strokeLinecap="round" fill="none" />
        {/* Head */}
        <circle cx="36" cy="12" r="9" fill="currentColor" stroke="none" />
        {/* Heart on head */}
        <path d="M36 11 C36 9 33 9 33 11 C33 13 36 15 36 15 C36 15 39 13 39 11 C39 9 36 9 36 11 Z" fill="var(--bg,#06120F)" stroke="none" />
      </svg>)
    case 'airplane':
      return (<svg {...c}><path d="M30 8C33 8 34 13 34 20L56 34V40L34 35V49L41 53V57L31 54L21 57V53L28 49V35L6 40V34L28 20C28 13 27 8 30 8Z" /></svg>)
    default: return null
  }
}
