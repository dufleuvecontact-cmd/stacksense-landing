import { useLanguage } from '../i18n/index.jsx'

export default function LanguageSwitcher({ size = 'normal', dark = false }) {
  const { locale, setLocale, t } = useLanguage()

  const isSmall = size === 'small'
  const inactiveColor = dark ? 'rgba(255,255,255,.45)' : 'var(--text-2)'
  const activeColor = dark ? 'var(--teal-light)' : 'var(--teal)'
  const dividerColor = dark ? 'rgba(255,255,255,.12)' : 'var(--border)'
  const borderColor = dark ? 'rgba(255,255,255,.12)' : 'var(--border)'

  const btn = (lang) => {
    const active = locale === lang
    const label = lang === 'fr' ? t('lang.switchToFr') : t('lang.switchToEn')
    return (
      <button
        key={lang}
        onClick={() => setLocale(lang)}
        aria-label={label}
        aria-pressed={active}
        style={{
          background: 'none',
          border: 'none',
          cursor: active ? 'default' : 'pointer',
          fontFamily: 'var(--font-sans)',
          fontSize: isSmall ? '.7rem' : '.78rem',
          fontWeight: active ? 700 : 500,
          color: active ? activeColor : inactiveColor,
          textDecoration: active ? 'underline' : 'none',
          textUnderlineOffset: '2px',
          padding: isSmall ? '.15rem .3rem' : '.2rem .35rem',
          borderRadius: 4,
          transition: 'color .15s',
          letterSpacing: '.04em',
          lineHeight: 1,
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = activeColor }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = inactiveColor }}
      >
        {lang.toUpperCase()}
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label="Language switcher"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        overflow: 'hidden',
        padding: isSmall ? '1px' : '2px',
      }}
    >
      {btn('en')}
      <span style={{ width: 1, height: isSmall ? 10 : 12, background: dividerColor, flexShrink: 0 }} aria-hidden="true"/>
      {btn('fr')}
    </div>
  )
}
