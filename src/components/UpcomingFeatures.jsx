import { useEffect, useRef } from 'react'
import { Zap, Plug, FolderKanban, Users } from 'lucide-react'

// Only things NOT built yet. Shipped features (profiles, search, exports, insights) live in the app.
const items = [
  { icon:Zap,          title:'Smarter reminders', desc:'Reminders that adjust to your schedule and where you are in a cycle.', badge:'In Development', bc:'pill-teal', color:'#1a8c87' },
  { icon:Plug,         title:'App & device sync', desc:'Connect your calendar, wearables, and other health apps.',            badge:'Planned',        bc:'pill-gray', color:'#0d6b67' },
  { icon:FolderKanban, title:'Easier organizing', desc:'Tags, folders, and a simple planner to keep your stack tidy.',         badge:'Planned',        bc:'pill-gray', color:'#25b5af' },
  { icon:Users,        title:'Share with a coach', desc:'Let a coach or doctor see your data. You choose what they see.',      badge:'Future',         bc:'pill-gray', color:'#0d6b67' },
]

export default function UpcomingFeatures() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="roadmap" ref={ref} className="section" style={{ background:'var(--bg)' }}>
      <div className="wrap">
        <div className="sr" style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom:'.75rem' }}>Roadmap</p>
          <h2 className="h2" style={{ marginBottom:'1rem' }}>
            What's<span className="teal-text"> coming next</span>
          </h2>
          <p className="lead" style={{ maxWidth:480, margin:'0 auto 1.25rem' }}>
            The core app is live. Here's what we're building next.
          </p>
          <div style={{ display:'flex',justifyContent:'center',gap:'.6rem',flexWrap:'wrap' }}>
            {[['In Development','pill-teal'],['Planned','pill-gray'],['Future','pill-gray']].map(([l,c])=>(
              <span key={l} className={`pill ${c}`}>{l}</span>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 245px), 1fr))', gap:'1rem' }}>
          {items.map((f, i) => (
            <div key={f.title} className={`card sr d${(i%8)+1}`} style={{ padding:'1.4rem', cursor:'default' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.85rem' }}>
                <div style={{ width:38,height:38,background:`${f.color}12`,border:`1px solid ${f.color}22`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <f.icon size={16} color={f.color} strokeWidth={1.8}/>
                </div>
                <span className={`pill ${f.bc}`}>{f.badge}</span>
              </div>
              <h3 className="h3" style={{ marginBottom:'.42rem', fontSize:'.95rem' }}>{f.title}</h3>
              <p className="small-text" style={{ lineHeight:1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="sr" style={{ marginTop:'2rem',textAlign:'center',background:'#fff',border:'1px solid var(--border)',borderRadius:14,padding:'1.5rem' }}>
          <p className="body-text" style={{ marginBottom:'1rem' }}>
            Want a say in what we build next? Waitlist members get to share feedback with us directly.
          </p>
          <a href="#waitlist" className="btn btn-teal"><Zap size={13}/> Join the Waitlist</a>
        </div>
      </div>
    </section>
  )
}
