interface Props { name: string; size?: number; color?: string; filled?: boolean }

export function Doodle({ name, size = 28, color = 'var(--accent)', filled }: Props) {
  const c = {
    width: size, height: size, viewBox: '0 0 48 48',
    style: { fill: filled ? color : 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const },
  }
  switch (name) {
    case 'heart':
      return (<svg {...c}><path d="M24 40C10 31 6 23 9 16C11 11 18 10 24 16C30 10 37 11 39 16C42 23 38 31 24 40Z" /></svg>)
    case 'star':
      return (<svg {...c}><path d="M24 7L28 18L40 20L31 28L34 40L24 33L14 40L17 28L8 20L20 18Z" /></svg>)
    case 'spark':
      return (<svg {...c} style={{ ...c.style, fill: color, stroke: 'none' }}><path d="M24 6C25 16 32 23 42 24C32 25 25 32 24 42C23 32 16 25 6 24C16 23 23 16 24 6Z" /></svg>)
    case 'trophy':
      return (<svg {...c}><path d="M16 10H32V22C32 28 28 31 24 31C20 31 16 28 16 22V10Z" /><path d="M16 14C11 14 9 16 10 20C11 23 14 24 16 24M32 14C37 14 39 16 38 20C37 23 34 24 32 24" strokeWidth="2.4" /><path d="M24 31V37M18 40H30M20 40C20 37 22 37 24 37C26 37 28 37 28 40" /></svg>)
    default: return null
  }
}
