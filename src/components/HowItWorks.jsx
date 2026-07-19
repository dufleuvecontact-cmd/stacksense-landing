import { useEffect, useRef } from 'react'
import { LayoutGrid, CheckCircle2, Activity } from 'lucide-react'

const steps = [
  { n: '1', icon: LayoutGrid,   title: 'Log what you take', desc: 'Add your supplements once — StackSense already knows 420+ compounds and their real clinical doses. Reminders handle the rest.' },
  { n: '2', icon: CheckCircle2, title: 'Rate how you feel in 5 seconds', desc: 'One quick check-in a day for energy, sleep, and mood. No journaling, no spreadsheets.' },
  { n: '3', icon: Activity,     title: "See what's actually working",  desc: 'Trends line up what you took with how you felt — so you know what to keep and what to stop buying.' },
]

// 8-week dose-adherence %, climbing — hand-rolled SVG, no chart dep
function TrendChart() {
  const data = [58, 64, 61, 72, 80, 84, 91, 95]
  const w = 320, h = 150, pad = 10
  const min = 50, max = 100
  const pts = data.map((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / (data.length - 1)
    const y = (h - pad) - ((v - min) / (max - min)) * (h - 2 * pad)
    return [x, y]
  })
  const line = pts.map(p => p.join(',')).join(' ')
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img"
      aria-label="Dose adherence climbing from 58% to 95% over eight weeks"
      style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="hiw-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#hiw-fill)" />
      <polyline points={line} fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 4 : 2.5}
          fill={i === pts.length - 1 ? 'var(--teal-deep)' : 'var(--teal)'} />
      ))}
    </svg>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    ref.current.querySelectorAll('.sr, .sr-left, .sr-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="how" ref={ref} className="section" style={{ background: '#fff' }}>
      <div className="wrap">
        <div className="sr" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>How it works</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            Up and running in{' '}
            <span className="teal-text">three steps</span>
          </h2>
          <p className="lead" style={{ maxWidth: 500, margin: '0 auto' }}>
            No spreadsheets, no guesswork. Build it once, log as you go, and let the data tell you what's working.
          </p>
        </div>

        <div className="hiw-grid">
          {/* Steps */}
          <ol className="hiw-steps">
            {steps.map((s, i) => (
              <li key={s.n} className={`sr-left d${i + 1} hiw-step`}>
                <div className="hiw-num">{s.n}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.3rem' }}>
                    <s.icon size={17} color="var(--teal-deep)" strokeWidth={2} />
                    <h3 className="h3" style={{ fontSize: '1.1rem' }}>{s.title}</h3>
                  </div>
                  <p className="body-text">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Result card with trend chart */}
          <div className="sr-right d2 card-flat hiw-result">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.25rem' }}>
              <span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-sans)' }}>Dose adherence</span>
              <span className="pill pill-teal" style={{ fontSize: '.68rem' }}>Last 8 weeks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em', lineHeight: 1, fontFamily: 'var(--font-sans)' }}>95%</span>
              <span style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--teal-deep)', fontFamily: 'var(--font-sans)' }}>↑ 37 pts</span>
            </div>
            <TrendChart />
            <p className="small-text" style={{ marginTop: '.9rem' }}>
              Consistency trends up once reminders and cycles are dialed in.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .hiw-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        .hiw-steps { list-style: none; display: flex; flex-direction: column; gap: 1.75rem; }
        .hiw-step { display: flex; gap: 1rem; align-items: flex-start; }
        .hiw-num {
          flex-shrink: 0;
          width: 34px; height: 34px; border-radius: 10px;
          background: var(--teal-muted); border: 1px solid rgba(45,106,79,.2);
          color: var(--teal-deep); font-weight: 700; font-size: .95rem;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-sans);
        }
        .hiw-result { padding: 1.75rem; }
        @media (max-width: 860px) {
          .hiw-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        }
      `}</style>
    </section>
  )
}
