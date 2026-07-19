import { useEffect, useRef } from 'react'
import { LayoutGrid, Clock, Search, Activity } from 'lucide-react'

const features = [
  {
    icon: LayoutGrid, title: 'Protocol & Cycle Builder',
    desc: 'Build protocols for supplements, peptides, or any health routine, with custom dosing schedules and cycle phases.',
    color: 'var(--teal)', span: 3, featured: true,
    tags: ['Supplements', 'Peptides', 'Cycle phases'],
  },
  {
    icon: Search, title: 'AI Research Engine',
    desc: 'Ask about any compound for mechanism of action, dosing guidance, interactions, and safety profile, answered from clinical sources.',
    color: 'var(--teal-deep)', span: 3, featured: true,
    tags: ['Mechanism', 'Dosing', 'Interactions', 'Safety'],
  },
  {
    icon: Clock, title: 'Dose Logging & Smart Reminders',
    desc: 'Log every dose as taken, skipped, or snoozed — with configurable reminders across morning, midday, evening, and bedtime windows.',
    color: 'var(--teal)', span: 3,
  },
  {
    icon: Activity, title: 'Bloodwork, Explained',
    desc: 'Upload a blood test, get it explained in plain English — and see how your markers move as your stack changes.',
    color: 'var(--teal-light)', span: 3,
  },
]

export default function Features() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    ref.current.querySelectorAll('.sr,.sr-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="features" ref={ref} className="section" style={{ background: '#fff', borderTop: '1px solid var(--border)' }}>
      <div className="wrap">
        <div className="sr" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>Core features</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            Everything you need to{' '}
            <span className="teal-text">stay in control</span>
          </h2>
          <p className="lead" style={{ maxWidth: 500, margin: '0 auto' }}>
            Track your stack, log your doses, and see what's working, all in one place.
          </p>
        </div>

        <div className="bento">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card sr d${(i % 8) + 1} bento-card bento-${f.span}${f.featured ? ' featured' : ''}`}
              style={{
                padding: f.featured ? '2rem' : '1.5rem',
                cursor: 'default',
                background: f.featured
                  ? `linear-gradient(135deg, #fff 0%, ${f.color}0a 100%)`
                  : '#fff',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{
                width: f.featured ? 48 : 40, height: f.featured ? 48 : 40, borderRadius: f.featured ? 13 : 11,
                background: `${f.color}14`, border: `1px solid ${f.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
              }}>
                <f.icon size={f.featured ? 22 : 18} color={f.color} strokeWidth={1.8}/>
              </div>
              <h3 className="h3" style={{ marginBottom: '.5rem', fontSize: f.featured ? '1.3rem' : '1.1rem' }}>
                {f.title}
              </h3>
              <p className="body-text" style={{ marginBottom: f.tags ? '1.25rem' : 0 }}>{f.desc}</p>

              {f.tags && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginTop: 'auto' }}>
                  {f.tags.map(t => (
                    <span key={t} className="pill pill-teal" style={{ fontSize: '.7rem' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .bento {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }
        .bento-3 { grid-column: span 3; }
        .bento-2 { grid-column: span 2; }
        @media (max-width: 900px) {
          .bento { grid-template-columns: repeat(2, 1fr); }
          .bento-3, .bento-2 { grid-column: span 1; }
          .bento-3.featured { grid-column: span 2; }
        }
        @media (max-width: 560px) {
          .bento { grid-template-columns: 1fr; }
          .bento-3, .bento-2, .bento-3.featured { grid-column: span 1; }
        }
      `}</style>
    </section>
  )
}
