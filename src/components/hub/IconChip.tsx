import { GameIcon } from '../icons/GameIcon'
import { hexA } from '../../lib/utils'

interface Props { icon: string; accent: string; size?: number; glyph?: number }

export function IconChip({ icon, accent, size = 52, glyph = 30 }: Props) {
  return (
    <div style={{
      position: 'relative', width: size, height: size, borderRadius: 15,
      display: 'grid', placeItems: 'center', flexShrink: 0, color: accent,
      background: hexA(accent, 0.14),
      boxShadow: `inset 0 0 0 1px ${hexA(accent, 0.4)}, 0 0 16px ${hexA(accent, 0.22)}`,
    }}>
      <GameIcon name={icon} size={glyph} />
    </div>
  )
}
