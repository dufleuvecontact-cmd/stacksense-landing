import { useEffect, useRef } from 'react'
import { CheckCircle2, Zap, Circle } from 'lucide-react'

const stages = [
  {
    stage:'Pre-Seed', period:'Dec 2025 – Apr 2026', status:'done', tag:'Complete',
    tagline:'Build and validate',
    items:['Problem validated with 40+ users','First prototype shipped','Core data model designed'],
  },
  {
    stage:'Seed', period:'Apr 2026 – Present', status:'active', tag:'Active',
    tagline:'Product ready. Market credible.',
    items:['Core features built','Beta interest growing','Preparing go-to-market'],
  },
  {
    stage:'Series A', period:'TBD', status:'upcoming', tag:'Upcoming',
    tagline:'Scale what works',
    items:['High-retention user base','Revenue generating','Team expansion'],
  },
  {
    stage:'Series B', period:'TBD', status:'upcoming', tag:'Upcoming',
    tagline:'Expand and lead',
    items:['Market leadership','Enterprise tiers launched','International expansion'],
  },
]

const statusColor = { done:'#1a8c87', active:'#1a8c87', upcoming:'#7a9490' }

export default function Timeline() {
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
    <section id="timeline" ref={ref} className="section" style={{ background:'var(--bg)' }}>
      <div className="wrap">
        <div className="sr" style={{ textAlign:'center', marginBottom:'4.5rem' }}>
          <p className="eyebrow" style={{ marginBottom:'.75rem' }}>Company journey</p>
          <h2 className="h2" style={{ marginBottom:'1rem' }}>
            Where we are &amp;<span className="teal-text"> where we're going</span>
          </h2>
          <p className="lead" style={{ maxWidth:500, margin:'0 auto' }}>
            A transparent view of StackSense's fundraising journey and milestones at each stage.
          </p>
        </div>

        <div className="timeline-container" style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
          {/* Horizontal Line */}
          <div className="timeline-line sr-fade" style={{ 
            position: 'absolute', top: 24, left: 0, right: 0, height: 2, 
            background: 'var(--border)', zIndex: 0 
          }} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            {stages.map((s, i) => (
              <div key={s.stage} className={`sr d${i+1}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: 50, height: 50, borderRadius: '50%', 
                    background: s.status === 'active' ? '#fff' : 'var(--bg)', 
                    border: `2px solid ${s.status === 'active' ? 'var(--teal)' : 'var(--border)'}`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: s.status === 'active' ? '0 0 0 4px rgba(26,140,135,.15)' : 'none'
                  }}>
                    {s.status==='done'?<CheckCircle2 size={24} color="#1a8c87"/>:s.status==='active'?<Zap size={22} color="#1a8c87"/>:<Circle size={22} color="#7a9490"/>}
                  </div>
                </div>
                
                <div style={{ 
                  background: s.status==='active' ? 'rgba(26,140,135,.04)' : '#fff',
                  border:`1px solid ${s.status==='active'?'rgba(26,140,135,.25)':'var(--border)'}`,
                  borderRadius:18, padding:'1.25rem', flex: 1, position: 'relative'
                }}>
                  {s.status==='active' && (
                    <div style={{ position:'absolute',top:-1,left:'50%',transform:'translateX(-50%)',background:'var(--teal)',color:'#fff',fontSize:'.6rem',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',padding:'.16rem .65rem',borderRadius:'0 0 8px 8px' }}>
                      Current Stage
                    </div>
                  )}
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.5rem',marginTop:s.status==='active' ? '1rem' : 0 }}>
                    <h3 className="h3" style={{ marginBottom:0 }}>{s.stage}</h3>
                    <span className={`pill ${s.status==='done'?'pill-green':s.status==='active'?'pill-teal':'pill-gray'}`}>{s.tag}</span>
                  </div>
                  <p style={{ fontSize:'.7rem',color:statusColor[s.status],fontWeight:600,fontFamily:'var(--font-sans)',marginBottom:'.25rem' }}>{s.period}</p>
                  <p style={{ fontSize:'.78rem',color:'var(--text-2)',fontStyle:'italic',fontFamily:'var(--font-sans)',marginBottom:'.6rem' }}>"{s.tagline}"</p>
                  <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:'.35rem' }}>
                    {s.items.map(m=>(
                      <li key={m} style={{ display:'flex',alignItems:'flex-start',gap:'.45rem' }}>
                        <div style={{ width:4,height:4,borderRadius:'50%',background:s.status==='upcoming'?'#7a9490':statusColor[s.status],marginTop:'.45rem',flexShrink:0 }}/>
                        <span className="small-text">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's next */}
        <div className="sr" style={{ marginTop:'4rem', background:'rgba(26,140,135,.05)', border:'1px solid rgba(26,140,135,.18)', borderRadius:16, padding:'1.5rem 2rem' }}>
          <div style={{ display:'flex',alignItems:'center',gap:'.65rem',marginBottom:'.7rem' }}>
            <Zap size={15} color="var(--teal)"/>
            <h3 className="h3">What's next</h3>
          </div>
          <p className="body-text" style={{ maxWidth:700 }}>
            Right now we're focused on closing the seed round, finalising the product for public launch, and growing our early adopter community. If you're an investor, operator, or early builder —{' '}
            <a href="#contact" style={{ color:'var(--teal)',textDecoration:'none',fontWeight:600 }}>let's talk</a>.
          </p>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .timeline-container > div:last-child {
            grid-template-columns: 1fr 1fr !important;
          }
          .timeline-line {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .timeline-container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

