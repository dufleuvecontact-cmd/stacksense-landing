const words = ['Peptide Tracking','Dose Adherence','Cycle Management','Smart Reminders','Progress Insights','Safety-First','Bioavailability','Clinical Clarity','Data Ownership','Full History Log']

export default function MarqueeStrip({ dark = false }) {
  const items = [...words, ...words]
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,.07)' : 'var(--border)'}`,
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,.07)' : 'var(--border)'}`,
      padding: '.85rem 0',
      background: dark ? 'rgba(255,255,255,.02)' : 'rgba(26,140,135,.04)',
    }}>
      <div className="marquee-inner">
        {items.map((w, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '1.25rem',
            padding: '0 1.75rem',
            fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: dark ? 'rgba(255,255,255,.3)' : 'var(--teal-deep)',
            fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
            opacity: dark ? 1 : .65,
          }}>
            {w}
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: dark ? 'rgba(26,140,135,.5)' : 'var(--teal)', display: 'inline-block' }}/>
          </span>
        ))}
      </div>
    </div>
  )
}
