import { useEffect, useRef } from 'react'
import { Key, LayoutGrid, Clock, Activity, Search, Users, CreditCard, Bell, Map, LayoutDashboard } from 'lucide-react'

const features = [
  { icon: Key,              title: 'Authentication',             desc: 'Email and password access via Supabase Auth with server-validated JWT sessions.', color: '#1a8c87' },
  { icon: LayoutGrid,       title: 'Protocol / Cycle Builder',   desc: 'Full CRUD for supplement and peptide protocols, handling multiple substances and schedule rules.', color: '#0d6b67' },
  { icon: Clock,            title: 'Dose Logging & Adherence',   desc: 'Log doses as taken, skipped, or snoozed. Tracks adherence from historical data.', color: '#25b5af' },
  { icon: Activity,         title: 'Bloodwork Analysis (AI)',    desc: 'Structured markers or raw text upload summarized by AI into key findings and doctor questions.', color: '#1a8c87' },
  { icon: Search,           title: 'AI Research Engine',         desc: 'Ask about any supplement for mechanism of action, dosing guidance, and safety profile.', color: '#0d6b67' },
  { icon: Users,            title: 'Referral System',            desc: 'Invite friends using random codes to earn premium days after they show consistent activity.', color: '#25b5af' },
  { icon: CreditCard,       title: 'Subscription & Premium',     desc: 'Free limits on substances and AI analyses. Premium unlocks unlimited tracking and smarter AI models.', color: '#1a8c87' },
  { icon: Bell,             title: 'Reminder System',            desc: 'Customizable time windows for daily dose reminders via Web Push notifications.', color: '#0d6b67' },
  { icon: Map,              title: 'Onboarding Wizard',          desc: 'Multi-step setup capturing experience level, interests, and basic health metrics.', color: '#25b5af' },
  { icon: LayoutDashboard,  title: 'Dashboard & Tab UI',         desc: 'Overview stats, adherence scores, active protocols, and recent dose activity in one place.', color: '#1a8c87' },
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

