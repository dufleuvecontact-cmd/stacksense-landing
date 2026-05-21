import { useEffect, useRef } from 'react'
import { CheckCircle2, Zap, Circle } from 'lucide-react'

const stages = [
  {
    stage: 'Pre-Seed', period: 'December 2025 – April 2026', status: 'done', tag: 'Complete',
    tagline: 'Build and validate',
    desc: 'Zero product, zero users — just a problem worth solving. We spent this period validating the need, building the first prototype, and confirming real demand existed.',
    items: ['Problem validated with 40+ potential users', 'First working prototype shipped', 'Core data model designed', 'Brand identity established'],
  },
  {
    stage: 'Seed', period: 'April 2026 – Present', status: 'active', tag: 'Active',
    tagline: 'Product ready. Market credible.',
    desc: "StackSense has a working product, active development cycles, and growing beta interest. We're collecting feedback, iterating quickly, and building operational foundations to scale.",
    items: ['Core features complete and in active development', 'Beta interest from early adopters', 'Feedback loops with initial users', 'Preparing go-to-market and hiring strategy'],
  },
  {
    stage: 'Series A', period: '?', status: 'upcoming', tag: 'Upcoming',
    tagline: 'Scale what works',
    desc: 'With proven traction, Series A marks the shift from product-finding to growth-building. Investment goes directly into team expansion, product acceleration, and market leadership.',
    items: ['Strong user base with high retention', 'Revenue-generating with clear monetisation', 'Expanded product and engineering team', 'Partnerships with health-tech platforms'],
  },
  {
    stage: 'Series B', period: '?', status: 'upcoming', tag: 'Upcoming',
    tagline: 'Expand and lead',
    desc: 'Category expansion and market dominance. Platform extensions into adjacent use cases, new markets, and enterprise-grade infrastructure. StackSense becomes the definitive platform.',
    items: ['Market leadership in core segment', 'Enterprise and professional tiers launched', 'International expansion underway', 'Third-party integration ecosystem'],
  },
]

const statusColor = { done: '#1a8c87', active: '#1a8c87', upcoming: '#7a9490' }

export default function Timeline() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.06 })
    ref.current.querySelectorAll('.sr,.sr-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="timeline" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'center', marginBottom: '4rem' }} id="timeline-header">
          <div className="sr">
            <h2 className="display-md">
              Where we are &amp;
              <em className="teal-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}> where we're going</em>
            </h2>
          </div>
          <div className="sr d2">
            <p className="lead">
              A transparent view of StackSense's fundraising journey and milestones at each stage.
            </p>
          </div>
        </div>

        {/* Vertical timeline */}
        <div style={{ position: 'relative', paddingLeft: '3rem' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', left: 11, top: 12, bottom: 12,
            width: 2, background: 'linear-gradient(180deg, var(--teal) 0%, var(--teal) 40%, var(--border) 40%, var(--border) 100%)',
            borderRadius: 2,
          }}/>

          {stages.map((s, i) => (
            <div key={s.stage} className={`sr d${i + 1}`} style={{
              position: 'relative',
              paddingBottom: i === stages.length - 1 ? 0 : '3rem',
            }}>
              {/* Marker */}
              <div style={{
                position: 'absolute', left: -40, top: 4,
                width: 24, height: 24, borderRadius: '50%',
                background: s.status === 'upcoming' ? 'var(--bg)' : 'var(--teal)',
                border: `2px solid ${statusColor[s.status]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}>
                {s.status === 'done'
                  ? <CheckCircle2 size={12} color="#fff" strokeWidth={2.5}/>
                  : s.status === 'active'
                    ? <Zap size={11} color="#fff"/>
                    : <Circle size={10} color="var(--text-3)"/>
                }
              </div>

              <div style={{
                background: s.status === 'active' ? '#fff' : 'transparent',
                border: s.status === 'active' ? '1px solid rgba(26,140,135,.2)' : '1px solid transparent',
                borderRadius: 16, padding: s.status === 'active' ? '1.75rem' : '0 0 0 .25rem',
                position: 'relative',
              }}>
                {s.status === 'active' && (
                  <div style={{
                    position: 'absolute', top: -1, left: 24,
                    background: 'var(--teal)', color: '#fff',
                    fontSize: '.58rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                    padding: '.12rem .6rem', borderRadius: '0 0 7px 7px', fontFamily: 'var(--font-sans)',
                  }}>
                    Current Stage
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem', marginTop: s.status === 'active' ? '.4rem' : 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', letterSpacing: '-.02em', color: 'var(--text)' }}>{s.stage}</h3>
                  <span className={`pill ${s.status === 'done' ? 'pill-green' : s.status === 'active' ? 'pill-teal' : 'pill-gray'}`}>{s.tag}</span>
                </div>

                <p style={{ fontSize: '.72rem', color: statusColor[s.status], fontWeight: 600, fontFamily: 'var(--font-sans)', marginBottom: '.3rem' }}>{s.period}</p>
                <p style={{ fontSize: '.82rem', color: 'var(--text-2)', fontStyle: 'italic', fontFamily: 'var(--font-sans)', marginBottom: '.85rem' }}>"{s.tagline}"</p>
                <p className="small" style={{ marginBottom: '1rem', maxWidth: 640, lineHeight: 1.7 }}>{s.desc}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                  {s.items.map(m => (
                    <span key={m} style={{
                      fontSize: '.72rem', fontFamily: 'var(--font-sans)', fontWeight: 500,
                      color: s.status === 'upcoming' ? 'var(--text-3)' : 'var(--teal-deep)',
                      background: s.status === 'upcoming' ? 'var(--bg)' : 'rgba(26,140,135,.07)',
                      border: `1px solid ${s.status === 'upcoming' ? 'var(--border)' : 'rgba(26,140,135,.15)'}`,
                      padding: '.22rem .65rem', borderRadius: 100,
                    }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What's next */}
        <div className="sr" style={{ marginTop: '3rem', background: 'rgba(26,140,135,.06)', border: '1px solid rgba(26,140,135,.18)', borderRadius: 16, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <Zap size={16} color="var(--teal)" style={{ flexShrink: 0 }}/>
          <p className="body" style={{ flex: 1 }}>
            Right now we're focused on closing the seed round, finalising the product for public launch, and growing our early adopter community. If you're an investor, operator, or early builder —{' '}
            <a href="#funding" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>let's talk</a>.
          </p>
        </div>
      </div>
      <style>{`@media(max-width:700px){#timeline-header{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
