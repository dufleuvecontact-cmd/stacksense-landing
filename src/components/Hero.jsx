import { useEffect, useRef } from 'react'
import { ArrowRight, CheckCircle2, Activity, Bell, LayoutGrid } from 'lucide-react'

function PhoneMockup() {
  return (
    <div style={{ position: 'relative', width: 260, margin: '0 auto' }}>
      <div style={{
        background: '#152a26', borderRadius: 40, padding: '10px',
        boxShadow: '0 0 0 2px rgba(26,140,135,.5), 0 40px 80px rgba(0,0,0,.6)',
      }}>
        <div style={{
          background: '#f5f7f6', borderRadius: 32, overflow: 'hidden',
          position: 'relative', minHeight: 480,
        }}>
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            width: 90, height: 22, background: '#0c1a18', borderRadius: 11, zIndex: 10,
          }}/>
          <div style={{ padding: '44px 16px 12px', background: '#fff', borderBottom: '1px solid #e8efee' }}>
            <div style={{ fontSize: '.75rem', color: '#7a9490', fontFamily: 'var(--font-sans)', marginBottom: 2 }}>Good morning</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: '#0c1a18', letterSpacing: '-.01em' }}>Progress</div>
          </div>
          <div style={{ margin: '12px 12px 8px', background: '#fff', borderRadius: 14, padding: '14px', border: '1px solid #e8efee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: '.7rem', fontWeight: 600, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>Weight &amp; Body Composition</div>
              <span style={{ fontSize: '.58rem', fontWeight: 700, color: '#1a8c87', background: 'rgba(26,140,135,.1)', padding: '2px 7px', borderRadius: 20, letterSpacing: '.04em', textTransform: 'uppercase' }}>Last 7 Days</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 8 }}>
              {[['STARTING','0 kg'],['CURRENT','0 kg'],['CHANGE','0.0 kg']].map(([l,v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.5rem', color: '#7a9490', fontFamily: 'var(--font-sans)', letterSpacing: '.05em', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: '.8rem', fontWeight: 700, color: l === 'CHANGE' ? '#1a8c87' : '#0c1a18', fontFamily: 'var(--font-sans)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ margin: '0 12px 8px', background: '#fff', borderRadius: 14, padding: '14px', border: '1px solid #e8efee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
              <Activity size={12} color="#1a8c87"/>
              <span style={{ fontSize: '.7rem', fontWeight: 600, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>Dose Adherence</span>
            </div>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'space-between', marginBottom: 7 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: i < 6 ? '#1a8c87' : '#e8efee', opacity: i < 6 ? (i === 5 ? 1 : .75) : 1 }}/>
                  <span style={{ fontSize: '.5rem', color: '#7a9490', fontFamily: 'var(--font-sans)' }}>{d}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '.62rem', color: '#1a8c87', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
              100% adherence today. <span style={{ fontStyle: 'italic' }}>On track.</span>
            </div>
          </div>
          <div style={{ margin: '0 12px 8px', background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid #e8efee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(26,140,135,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutGrid size={10} color="#1a8c87"/>
              </div>
              <span style={{ fontSize: '.7rem', fontWeight: 600, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>Bioavailability Calculator</span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e8efee', padding: '8px 0 10px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {[{label:'TODAY',active:false},{label:'STACK',active:false},{label:'CYCLES',active:false},{label:'INSIGHTS',active:true},{label:'AI',active:false},{label:'PROFILE',active:false}].map(({ label, active }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 18, height: 3, borderRadius: 2, background: active ? '#1a8c87' : '#dce8e5', marginBottom: 1 }}/>
                <span style={{ fontSize: '.42rem', fontWeight: active ? 700 : 500, color: active ? '#1a8c87' : '#7a9490', fontFamily: 'var(--font-sans)', letterSpacing: '.04em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 60, right: -70, background: '#fff', border: '1px solid #dce8e5', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', display: 'flex', alignItems: 'center', gap: 8, width: 175 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={12} color="#1a8c87"/>
        </div>
        <div>
          <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>Reminder set</div>
          <div style={{ fontSize: '.58rem', color: '#7a9490', fontFamily: 'var(--font-sans)' }}>BPC-157 · 8:00 AM</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 80, left: -65, background: '#fff', border: '1px solid #dce8e5', borderRadius: 14, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.15)', width: 148 }}>
        <div style={{ fontSize: '.58rem', color: '#7a9490', fontFamily: 'var(--font-sans)', marginBottom: 3 }}>Current Streak</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a8c87', fontFamily: 'var(--font-sans)', lineHeight: 1 }}>21d</div>
        <div style={{ fontSize: '.58rem', color: '#7a9490', fontFamily: 'var(--font-sans)', marginTop: 2 }}>Personal best 🎯</div>
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.querySelectorAll('.sr, .sr-fade, .sr-right').forEach((node, i) => {
      setTimeout(() => node.classList.add('in'), 80 + i * 90)
    })
  }, [])

  return (
    <section ref={ref} style={{
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 80,
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Teal glows */}
      <div style={{ position: 'absolute', top: -180, right: -60, width: 720, height: 720, background: 'radial-gradient(circle, rgba(26,140,135,.16) 0%, transparent 65%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: -120, left: -80, width: 500, height: 500, background: 'radial-gradient(circle, rgba(26,140,135,.07) 0%, transparent 65%)', pointerEvents: 'none' }}/>

      <div className="wrap" style={{ position: 'relative', zIndex: 1, width: '100%', padding: '3rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '5rem', alignItems: 'center' }} id="hero-grid">

          {/* Left */}
          <div>
            <div className="sr d1" style={{ display: 'flex', alignItems: 'center', gap: '.65rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)' }} className="pulse-dot"/>
              <span style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', fontFamily: 'var(--font-sans)' }}>
                Seed Stage · Open Waitlist
              </span>
            </div>

            <h1 className="sr d2" style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3rem, 6.5vw, 6.2rem)',
              lineHeight: .92,
              letterSpacing: '-.025em',
              color: '#fff',
              marginBottom: '1.6rem',
            }}>
              Tired of tracking<br/>peptides in{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--teal-light)' }}>spreadsheets?</em>
            </h1>

            <p className="sr d3" style={{
              fontSize: '1.12rem',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,.5)',
              marginBottom: '2.5rem',
              maxWidth: 500,
              fontFamily: 'var(--font-sans)',
            }}>
              Built by a biohacker who got tired of tracking peptides in spreadsheets. 420+ compounds. One app.
            </p>

            <div className="sr d4" style={{ display: 'flex', gap: '.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <a href="#waitlist" className="btn btn-teal">
                Join the Waitlist <ArrowRight size={15}/>
              </a>
              <a href="#features" className="btn btn-outline-dark">
                See Features
              </a>
            </div>

            <div className="sr d5" style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {[
                '420+ compounds in our protocol library',
                'Built on clinical dosing data from peer-reviewed sources',
                'Designed by someone who actually uses these protocols daily',
                'Currently onboarding beta testers',
              ].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem' }}>
                  <CheckCircle2 size={13} color="var(--teal)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }}/>
                  <span style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.4)', fontFamily: 'var(--font-sans)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — phone */}
          <div className="sr-right d2 float" style={{ display: 'flex', justifyContent: 'center' }}>
            <PhoneMockup/>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sr-fade d6" style={{
          marginTop: '3.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,.07)',
          display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.28)', fontFamily: 'var(--font-sans)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            Founding member pricing
          </span>
          <span style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--teal-light)', fontFamily: 'var(--font-sans)' }}>
            $9.99/mo forever + 6 months free
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.07)' }}/>
          <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.28)', fontFamily: 'var(--font-sans)' }}>
            Currently reaching out for funding
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          #hero-grid > div:last-child { display: none !important; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  )
}
