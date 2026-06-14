interface Props { theme: string; onToggle: () => void }

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button onClick={onToggle} aria-label="Přepnout motiv" style={{
      position: 'relative', width: 42, height: 42, minWidth: 42, borderRadius: 13,
      border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'grid', placeItems: 'center',
      background: 'var(--card-bg)', backdropFilter: 'blur(16px)', boxShadow: 'var(--glass-shadow)',
    }}>
      {theme === 'dark'
        ? <svg width="18" height="18" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><circle cx="12" cy="12" r="4.2" /><path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.6 5.6L7 7M17 17L18.4 18.4M18.4 5.6L17 7M7 17L5.6 18.4" /></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M20 14.5A8 8 0 119.5 4A6.3 6.3 0 0020 14.5Z" /></svg>
      }
    </button>
  )
}
