import { useEffect, useRef } from 'react'
import { Activity, LayoutGrid, Shield, Users } from 'lucide-react'

const items = [
  { icon: Activity,   stat: 'Peer-reviewed', label: 'Clinical dosing data' },
  { icon: LayoutGrid, stat: '420+',          label: 'Compounds in library' },
  { icon: Shield,     stat: 'Private',        label: 'Encrypted · never sold' },
  { icon: Users,      stat: 'Founder-built',  label: 'Actively onboarding' },
]

export default function TrustBand() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.2 })
    ref.current.querySelectorAll('.sr').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="wrap" style={{ padding: '1.75rem 2rem' }}>
        <div className="trust-grid">
          {items.map((it, i) => (
            <div key={it.stat} className={`sr d${i + 1} trust-item`}>
              <it.icon size={22} color="var(--teal-deep)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem', lineHeight: 1.1, fontFamily: 'var(--font-sans)' }}>{it.stat}</div>
                <div className="small-text">{it.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: .7rem;
          justify-content: center;
        }
        .trust-item + .trust-item { border-left: 1px solid var(--border); }
        @media (max-width: 760px) {
          .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
          .trust-item { justify-content: flex-start; }
          .trust-item + .trust-item { border-left: none; }
        }
        @media (max-width: 420px) {
          .trust-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
