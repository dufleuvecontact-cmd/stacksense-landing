import { useEffect, useRef } from 'react'
import { BarChart3, Zap, Plug, FileDown, UserCircle, FolderKanban, SearchCode, Users } from 'lucide-react'

const items = [
  { icon: BarChart3,    title: 'Smart Insights & Analytics',   desc: 'Pattern recognition across your logs — trends, anomalies, and cycle summaries surfaced automatically.',        badge: 'In Development', bc: 'pill-teal',   color: '#1a8c87' },
  { icon: Zap,          title: 'Advanced Reminder Workflows',  desc: 'Context-aware reminders that adapt to your schedule, cycle phase, and past behaviour.',                         badge: 'In Development', bc: 'pill-teal',   color: '#0d6b67' },
  { icon: FileDown,     title: 'Exportable Records',           desc: 'Clean exports in PDF, CSV, or JSON — ready for personal use or professional review.',                             badge: 'Soon',           bc: 'pill-amber',  color: '#d97706' },
  { icon: Plug,         title: 'Platform Integrations',        desc: 'Connect StackSense with calendar apps, wearables, and health data platforms.',                                    badge: 'Planned',        bc: 'pill-gray',   color: '#25b5af' },
  { icon: UserCircle,   title: 'User Profiles',                desc: 'Personalised profiles with notification prefs, unit settings, and saved protocols.',                              badge: 'Soon',           bc: 'pill-amber',  color: '#d97706' },
  { icon: FolderKanban, title: 'Enhanced Organisation',        desc: 'Tag-based organisation, nested folders for compounds, and a visual cycle planner.',                              badge: 'Planned',        bc: 'pill-gray',   color: '#1a8c87' },
  { icon: SearchCode,   title: 'Faster Search',                desc: 'Full-text semantic search across your entire history — any entry in milliseconds.',                               badge: 'In Development', bc: 'pill-teal',   color: '#0d6b67' },
  { icon: Users,        title: 'Team & Shared Access',         desc: 'Controlled access for practitioners, coaches, or collaborators. Safety and privacy by default.',                  badge: 'Future',         bc: 'pill-gray',   color: '#1a8c87' },
]

export default function UpcomingFeatures() {
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
    <section id="roadmap" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'end', marginBottom: '3rem' }} id="roadmap-header">
          <div className="sr">
            <h2 className="display-md">
              What's
              <em className="teal-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}> coming next</em>
            </h2>
          </div>
          <div className="sr d2">
            <p className="lead" style={{ marginBottom: '1rem' }}>
              We ship with intention. Here's what's actively in development and what we're planning next.
            </p>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {[['In Development','pill-teal'],['Soon','pill-amber'],['Planned','pill-gray'],['Future','pill-purple']].map(([l,c]) => (
                <span key={l} className={`pill ${c}`}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div className="sr" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {items.map((f, i) => (
            <div key={f.title} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 3fr',
              gap: '1.5rem', alignItems: 'center',
              padding: '1.25rem 1.75rem',
              borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--border)',
              background: i % 2 === 1 ? 'rgba(0,0,0,.015)' : '#fff',
            }} id="roadmap-row">
              {/* Icon + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                <f.icon size={16} color={f.color} strokeWidth={1.8} style={{ flexShrink: 0 }}/>
                <span style={{ fontSize: '.93rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-sans)', letterSpacing: '-.01em' }}>{f.title}</span>
              </div>
              {/* Badge */}
              <div>
                <span className={`pill ${f.bc}`}>{f.badge}</span>
              </div>
              {/* Description */}
              <p style={{ fontSize: '.85rem', lineHeight: 1.65, color: 'var(--text-2)', fontFamily: 'var(--font-sans)' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="sr" style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem 1.75rem' }}>
          <p className="body">Want to influence what gets built? Early waitlist members get direct access to share feedback.</p>
          <a href="#waitlist" className="btn btn-teal" style={{ flexShrink: 0 }}><Zap size={13}/> Join the Waitlist</a>
        </div>
      </div>
      <style>{`
        @media(max-width:700px){#roadmap-header{grid-template-columns:1fr!important}#roadmap-row{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
