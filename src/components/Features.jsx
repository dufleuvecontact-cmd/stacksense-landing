import { useEffect, useRef } from 'react'
import { LayoutGrid, Clock, Activity, Search, Bell, LayoutDashboard } from 'lucide-react'

const features = [
  { icon: LayoutGrid,       title: 'Protocol & Cycle Builder',   desc: 'Create and manage supplement and peptide protocols with multiple substances, dosing schedules, and cycle phases.', color: '#1a8c87' },
  { icon: Clock,            title: 'Dose Logging & Adherence',   desc: 'Log every dose as taken, skipped, or snoozed. Track your adherence over time with clear visual feedback.', color: '#0d6b67' },
  { icon: Activity,         title: 'Bloodwork Analysis',         desc: 'Upload bloodwork markers and get AI-powered summaries with key findings and questions for your doctor.', color: '#25b5af' },
  { icon: Search,           title: 'AI Research Engine',         desc: 'Ask about any compound for mechanism of action, dosing guidance, interactions, and safety profile.', color: '#1a8c87' },
  { icon: Bell,             title: 'Smart Reminders',            desc: 'Configurable daily dose reminders across morning, midday, evening, and bedtime windows.', color: '#0d6b67' },
  { icon: LayoutDashboard,  title: 'Dashboard & Insights',       desc: 'Overview stats, adherence scores, active protocols, and recent activity — all in one place.', color: '#25b5af' },
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
    <section id="features" ref={ref} className="section" style={{ background: '#fff' }}>
      <div className="wrap">
        <div className="sr" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>Core Features</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            Everything you need to<br/>
            <span className="teal-text"> stay in control</span>
          </h2>
          <p className="lead" style={{ maxWidth: 500, margin: '0 auto' }}>
            A focused toolkit built around clarity, safety, and consistency.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1rem' }}>
          {features.map((f, i) => (
            <div key={f.title} className={`card sr d${(i % 8) + 1}`} style={{ padding: '1.5rem', cursor: 'default' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: `${f.color}14`, border: `1px solid ${f.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
              }}>
                <f.icon size={18} color={f.color} strokeWidth={1.8}/>
              </div>
              <h3 className="h3" style={{ marginBottom: '.5rem', fontSize: '1.1rem' }}>
                {f.title}
              </h3>
              <p className="body-text">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

