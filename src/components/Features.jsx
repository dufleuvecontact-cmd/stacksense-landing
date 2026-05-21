import { useState, useEffect, useRef } from 'react'
import { LayoutGrid, Clock, Bell, BarChart2, ShieldCheck, Search, Download, Smartphone } from 'lucide-react'

const features = [
  { icon: LayoutGrid,   title: 'Organised Tracking',     desc: 'Every compound, dose, and cycle in one clean workspace. No spreadsheets. No guesswork.', color: '#1a8c87' },
  { icon: Clock,        title: 'Full Activity History',  desc: 'A tamper-proof log you can revisit any time — with dates, notes, and dosage details intact.', color: '#0d6b67' },
  { icon: Bell,         title: 'Smart Reminders',        desc: 'Customisable alerts that fit your schedule. Never miss a window, never double-dose.', color: '#25b5af' },
  { icon: BarChart2,    title: 'Clean Data Views',       desc: 'Charts and summaries that turn raw entries into insight. Understand your data at a glance.', color: '#1a8c87' },
  { icon: ShieldCheck,  title: 'Safety-First Workflows', desc: 'Built-in safeguards, cycle limits, and flagging help you stay within safe parameters.', color: '#0d6b67' },
  { icon: Search,       title: 'Fast Search & Filter',   desc: 'Full-text search across your entire log history. Find any entry in seconds.', color: '#25b5af' },
  { icon: Download,     title: 'Export & Records Access',desc: 'Generate clean exports in PDF or CSV for personal records or professional review.', color: '#1a8c87' },
  { icon: Smartphone,   title: 'Mobile-Ready',           desc: 'Log on your phone, review on your desktop. Everything synced, everything in reach.', color: '#0d6b67' },
]

export default function Features() {
  const [active, setActive] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
    ref.current.querySelectorAll('.sr,.sr-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const f = features[active]

  return (
    <section id="features" ref={ref} className="section" style={{ background: '#fff' }}>
      <div className="wrap">
        <div className="sr" style={{ marginBottom: '3rem' }}>
          <h2 className="display-md">
            Everything you need to
            <em className="teal-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}> stay in control</em>
          </h2>
          <p className="lead" style={{ maxWidth: 480, marginTop: '.85rem' }}>
            A focused toolkit built around clarity, safety, and consistency.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', gap: '3rem', alignItems: 'start' }} id="features-grid">

          {/* Left: numbered list */}
          <div className="sr">
            {features.map((feat, i) => (
              <button
                key={feat.title}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1.25rem',
                  padding: '1.1rem 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: i === features.length - 1 ? '1px solid var(--border)' : 'none',
                  background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <span style={{
                  fontSize: '.65rem', fontWeight: 700, letterSpacing: '.08em',
                  fontFamily: 'var(--font-sans)', minWidth: 24,
                  color: active === i ? 'var(--teal)' : 'var(--text-3)',
                  transition: 'color .15s',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  fontSize: '.98rem', fontFamily: 'var(--font-sans)', flex: 1,
                  fontWeight: active === i ? 700 : 500,
                  color: active === i ? 'var(--text)' : 'var(--text-2)',
                  transition: 'all .15s',
                }}>
                  {feat.title}
                </span>
                {active === i && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }}/>
                )}
              </button>
            ))}
          </div>

          {/* Right: active panel */}
          <div className="sr d2" style={{ position: 'sticky', top: '5.5rem' }}>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '2rem',
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13,
                background: `${f.color}14`, border: `1px solid ${f.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <f.icon size={20} color={f.color} strokeWidth={1.8}/>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.1rem',
                marginBottom: '.65rem', color: 'var(--text)', letterSpacing: '-.01em',
              }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.78, color: 'var(--text-2)' }}>{f.desc}</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          #features-grid{grid-template-columns:1fr!important}
          #features-grid>div:last-child{position:static!important}
        }
      `}</style>
    </section>
  )
}
