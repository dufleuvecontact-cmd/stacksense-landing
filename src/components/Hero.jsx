import { useEffect, useRef } from 'react'
import { ArrowRight, ChevronDown, CheckCircle2, Activity, Bell, LayoutGrid } from 'lucide-react'

function PhoneMockup() {
  return (
    <div style={{ position: 'relative', width: 260, margin: '0 auto' }}>
      {/* Phone shell */}
      <div style={{
        background: '#0c1a18', borderRadius: 40, padding: '10px',
        boxShadow: '0 40px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(26,140,135,.15)',
      }}>
        {/* Screen */}
        <div style={{
          background: '#f5f7f6', borderRadius: 32, overflow: 'hidden',
          position: 'relative', minHeight: 480,
        }}>
          {/* Notch */}
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            width: 90, height: 22, background: '#0c1a18', borderRadius: 11, zIndex: 10,
          }}/>

          {/* App header */}
          <div style={{ padding: '44px 16px 12px', background: '#fff', borderBottom: '1px solid #e8efee' }}>
            <div style={{ fontSize: '.75rem', color: '#7a9490', fontFamily: 'var(--font-sans)', marginBottom: 2 }}>
              Good morning
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: '#0c1a18', letterSpacing: '-.01em' }}>
              Progress
            </div>
          </div>

          {/* Stats card */}
          <div style={{ margin: '12px 12px 8px', background: '#fff', borderRadius: 14, padding: '14px', border: '1px solid #e8efee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: '.7rem', fontWeight: 600, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>
                Weight &amp; Body Composition
              </div>
              <span style={{
                fontSize: '.58rem', fontWeight: 700, color: '#1a8c87',
                background: 'rgba(26,140,135,.1)', padding: '2px 7px', borderRadius: 20,
                letterSpacing: '.04em', textTransform: 'uppercase',
              }}>Last 7 Days</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 8 }}>
              {[['STARTING','84.2 kg'],['CURRENT','81.7 kg'],['CHANGE','-2.5 kg']].map(([l,v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.5rem', color: '#7a9490', fontFamily: 'var(--font-sans)', letterSpacing: '.05em', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: '.8rem', fontWeight: 700, color: l === 'CHANGE' ? '#1a8c87' : '#0c1a18', fontFamily: 'var(--font-sans)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Adherence card */}
          <div style={{ margin: '0 12px 8px', background: '#fff', borderRadius: 14, padding: '14px', border: '1px solid #e8efee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
              <Activity size={12} color="#1a8c87"/>
              <span style={{ fontSize: '.7rem', fontWeight: 600, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>Dose Adherence</span>
            </div>
            <div style={{ display: 'flex', gap: 5, justifyContent: 'space-between', marginBottom: 7 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: i < 5 ? '#1a8c87' : '#e8efee',
                    opacity: i < 5 ? (i === 4 ? 1 : .75) : 1,
                  }}/>
                  <span style={{ fontSize: '.5rem', color: '#7a9490', fontFamily: 'var(--font-sans)' }}>{d}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '.62rem', color: '#1a8c87', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
              100% adherence today. <span style={{ fontStyle: 'italic' }}>On track.</span>
            </div>
          </div>

          {/* Bioavailability row */}
          <div style={{ margin: '0 12px 8px', background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid #e8efee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(26,140,135,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutGrid size={10} color="#1a8c87"/>
              </div>
              <span style={{ fontSize: '.7rem', fontWeight: 600, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>
                Bioavailability Calculator
              </span>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: '#fff', borderTop: '1px solid #e8efee',
            padding: '8px 0 10px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          }}>
            {[
              { label: 'TODAY', active: false },
              { label: 'STACK', active: false },
              { label: 'CYCLES', active: false },
              { label: 'INSIGHTS', active: true },
              { label: 'AI', active: false },
              { label: 'PROFILE', active: false },
            ].map(({ label, active }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{
                  width: 18, height: 3, borderRadius: 2,
                  background: active ? '#1a8c87' : '#dce8e5',
                  marginBottom: 1,
                }}/>
                <span style={{
                  fontSize: '.42rem', fontWeight: active ? 700 : 500,
                  color: active ? '#1a8c87' : '#7a9490',
                  fontFamily: 'var(--font-sans)', letterSpacing: '.04em',
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card – reminder */}
      <div style={{
        position: 'absolute', top: 60, right: -70,
        background: '#fff', border: '1px solid #dce8e5', borderRadius: 14,
        padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.1)',
        display: 'flex', alignItems: 'center', gap: 8, width: 175,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Bell size={12} color="#1a8c87"/>
        </div>
        <div>
          <div style={{ fontSize: '.65rem', fontWeight: 700, color: '#0c1a18', fontFamily: 'var(--font-sans)' }}>Reminder set</div>
          <div style={{ fontSize: '.58rem', color: '#7a9490', fontFamily: 'var(--font-sans)' }}>BPC-157 · 8:00 AM</div>
        </div>
      </div>

      {/* Floating card – streak */}
      <div style={{
        position: 'absolute', bottom: 80, left: -65,
        background: '#fff', border: '1px solid #dce8e5', borderRadius: 14,
        padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.1)',
        width: 148,
      }}>
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
    el.querySelectorAll('.sr, .sr-fade').forEach((node, i) => {
      setTimeout(() => node.classList.add('in'), 80 + i * 90)
    })
  }, [])

  return (
    <section ref={ref} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'var(--bg)',
      paddingTop: 80,
    }}>
      {/* Dot grid bg */}
      <div className="dot-grid" style={{
        position: 'absolute', inset: 0, opacity: .5, pointerEvents: 'none',
      }}/>

      <div className="wrap" style={{ position: 'relative', zIndex: 1, width: '100%', paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>
        <div id="hero-grid">

          {/* Left / Content */}
          <div className="hero-content">
            <div className="sr d1" style={{ marginBottom: '1.2rem' }}>
              <span className="pill pill-teal">
                Seed Stage · Open Waitlist
              </span>
            </div>

            <h1 className="sr d2 h1" style={{ marginBottom: '1.2rem' }}>
              Know exactly what your stack is doing —<br/>
              <span className="teal-text">every compound, every dose, every cycle.</span>
            </h1>

            <div className="sr d3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8efee', overflow: 'hidden' }}>
                {/* [Photo of Jad] */}
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a9490', fontSize: '10px' }}>Photo</div>
              </div>
              <div style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.3 }}>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Jad Gouiza</strong> · Founder<br/>
                Running peptide protocols since 2022
              </div>
            </div>

            <p className="sr d4 lead" style={{ maxWidth: 620, margin: '0 auto 1.8rem' }}>
              Track your entire protocol — peptides, supplements, bloodwork, and body composition — in one place. Built by a biohacker, for biohackers.
            </p>

            <div className="sr d4 hero-buttons-container">
              <div className="hero-buttons">
                <a href="#waitlist" className="btn btn-teal">
                  Join the Waitlist <ArrowRight size={15}/>
                </a>
              </div>
              <a href="#product" style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-2)', textDecoration: 'none', fontWeight: 500 }}>
                &rarr; Or explore the live demo first
              </a>
            </div>

            <div className="sr d5 hero-features">
              {[
                '420+ compounds in our protocol library',
                'Built on clinical dosing data from peer-reviewed sources',
                'Designed by someone who actually uses these protocols daily',
                'Currently onboarding beta testers',
              ].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <CheckCircle2 size={15} color="var(--teal)" strokeWidth={2.5} style={{ flexShrink: 0 }}/>
                  <span className="small" style={{ fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — phone */}
          <div className="sr-right d2 hero-phone-container" style={{ display: 'flex', justifyContent: 'center' }}>
            <PhoneMockup/>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="sr-fade d6" style={{ textAlign: 'center', marginTop: '3rem', opacity: 0 }}>
          <ChevronDown size={18} color="var(--text-3)" />
        </div>
      </div>



      <style>{`
        #hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 100%;
        }
        .hero-buttons-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
          width: 100%;
        }
        .hero-buttons {
          display: flex;
          gap: .75rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero-features {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }
        .hero-phone-container {
          padding-top: 0;
        }
        @media (max-width: 960px) {
          #hero-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            text-align: center;
          }
          .hero-content {
            align-items: center;
            text-align: center;
          }
          .hero-buttons-container {
            align-items: center;
          }
          .hero-buttons {
            justify-content: center;
          }
          .hero-features {
            align-items: center;
          }
          .hero-phone-container {
            padding-top: 1rem;
          }
        }
      `}</style>
    </section>
  )
}
