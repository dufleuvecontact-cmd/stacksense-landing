const words = ['Peptide Tracking','Dose Adherence','Cycle Management','Smart Reminders','Progress Insights','Bioavailability']

export default function MarqueeStrip({ dark = false }) {
  return (
    <div style={{
      borderTop: `1px solid ${dark ? 'rgba(255,255,255,.07)' : 'var(--border)'}`,
      borderBottom: `1px solid ${dark ? 'rgba(255,255,255,.07)' : 'var(--border)'}`,
      padding: '1.5rem 0',
      background: dark ? 'rgba(255,255,255,.02)' : 'var(--bg)',
    }}>
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex' }}>
        <div className="marquee-inner" style={{
          display: 'flex', alignItems: 'center', gap: '2rem', padding: '0 1rem'
        }}>
          {/* Double the words to create an infinite scroll effect */}
          {[...words, ...words, ...words].map((w, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '2rem',
              fontSize: '.85rem', fontWeight: 600, letterSpacing: '.04em',
              textTransform: 'uppercase',
              color: dark ? 'rgba(255,255,255,.45)' : 'var(--text-3)',
              fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
            }}>
              {w}
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: dark ? 'rgba(26,140,135,.5)' : 'var(--border)', display: 'inline-block' }}/>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
