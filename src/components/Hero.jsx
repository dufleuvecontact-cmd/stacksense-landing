import { useEffect, useRef } from 'react'
import { ArrowRight, CheckCircle2, Bell } from 'lucide-react'

function PhoneMockup() {
  return (
    <div style={{ position: 'relative', width: 260, margin: '0 auto' }}>
      {/* Phone shell */}
      <div style={{
        background: '#0c1a18', borderRadius: 40, padding: '10px',
        boxShadow: '0 40px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(26,140,135,.15)',
      }}>
        {/* Screen — live app preview, LOCKED (non-interactive); interactive demo lives in #product */}
        <div style={{
          background: '#f5f7f6', borderRadius: 32, overflow: 'hidden',
          position: 'relative', height: 500,
        }}>
          {/* Notch */}
          <div style={{
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            width: 90, height: 22, background: '#0c1a18', borderRadius: 11, zIndex: 10,
          }}/>

          {/* Real app — non-interactive: locked so it reads as a static live shot.
              embed=1 → app should hide its cookie/demo banners (no-op until app supports it).
              ponytail: until then, iframe is rendered taller than the 500px screen so the
              bottom-fixed privacy banner falls in the clipped overflow. Ceiling: assumes the
              banner is bottom-pinned — drop the extra height once embed=1 is honored. */}
          <iframe
            src="https://www.stacksense.online/?demo=true&embed=1"
            title="StackSense app preview"
            aria-hidden="true"
            tabIndex={-1}
            loading="lazy"
            style={{ width: '100%', height: 720, border: 'none', display: 'block', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* Floating card – reminder */}
      <div className="hero-float" style={{
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
      <div className="hero-float" style={{
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
  const mockRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.querySelectorAll('.sr, .sr-fade, .sr-right').forEach((node, i) => {
      setTimeout(() => node.classList.add('in'), 80 + i * 90)
    })
  }, [])

  // Scroll-driven tilt for the app mockup (container-scroll effect, no deps)
  useEffect(() => {
    const inner = mockRef.current
    if (!inner) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = inner.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight * 0.85)))
      const rotX = (1 - p) * 18      // 18deg → flat
      const scale = 0.94 + p * 0.06  // 0.94 → 1
      inner.style.transform = `perspective(1400px) rotateX(${rotX}deg) scale(${scale})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section ref={ref} style={{
      minHeight: 'auto', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'var(--bg)',
      paddingTop: 120,
      paddingBottom: 64,
    }}>
      {/* Dot grid bg */}
      <div className="dot-grid" style={{
        position: 'absolute', inset: 0, opacity: .5, pointerEvents: 'none',
      }}/>

      <div className="wrap" style={{ position: 'relative', zIndex: 1, width: '100%', paddingTop: '1.5rem', paddingBottom: '0' }}>
        <div id="hero-grid">

          {/* Left / Content */}
          <div className="hero-content">
            <div className="sr d1" style={{ marginBottom: '1.2rem' }}>
              <span className="pill pill-teal">
                Seed Stage · Open Waitlist
              </span>
            </div>

            <h1 className="sr d2 h1" style={{ marginBottom: '1.2rem' }}>
              Finally know what your{' '}
              <span className="teal-text">supplements are actually doing.</span>
            </h1>

            <div className="sr d3 hero-founder">
              <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Jad Gouiza</strong> · Founder. Built this because he couldn't figure out which of his 8 supplements was actually working.
            </div>

            <p className="sr d4 lead hero-lead">
              Track doses, cycles, bloodwork, and how you feel, all in one place. Whether you take 3 supplements or run a full protocol.
            </p>

            <div className="sr d4 hero-buttons-container">
              <div className="hero-buttons">
                <a href="#waitlist" className="btn btn-teal">
                  Join the Waitlist <ArrowRight size={15}/>
                </a>
                <a href="#product" className="btn btn-outline">
                  Explore the live demo
                </a>
              </div>
            </div>

            <div className="sr d5 hero-features">
              {[
                '420+ compounds in our protocol library',
                'Built on clinical dosing data from peer-reviewed sources',
                'Designed by someone tired of guessing what worked',
                'Currently onboarding beta testers',
              ].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <CheckCircle2 size={15} color="var(--teal)" strokeWidth={2.5} style={{ flexShrink: 0 }}/>
                  <span className="small" style={{ fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — app mockup with scroll-tilt + glow */}
          <div className="sr-right d2 hero-phone-container">
            <div className="hero-glow" aria-hidden="true"/>
            <div ref={mockRef} style={{ transformOrigin: 'center top', willChange: 'transform', position: 'relative' }}>
              <PhoneMockup/>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        #hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          max-width: 100%;
        }
        .hero-founder {
          font-size: 0.9rem;
          color: var(--text-2);
          line-height: 1.5;
          margin-bottom: 1.2rem;
          max-width: 540px;
        }
        .hero-lead { max-width: 540px; margin: 0 0 1.8rem; }
        .hero-buttons-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 1.8rem;
          width: 100%;
        }
        .hero-buttons {
          display: flex;
          gap: .75rem;
          flex-wrap: wrap;
          justify-content: flex-start;
        }
        .hero-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem 1.4rem;
          width: 100%;
          max-width: 560px;
        }
        .hero-phone-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 0;
        }
        .hero-glow {
          position: absolute;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--teal-glow) 0%, transparent 70%);
          filter: blur(20px);
          pointer-events: none;
          z-index: 0;
        }
        @media (max-width: 960px) {
          #hero-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .hero-content {
            align-items: center;
            text-align: center;
          }
          .hero-founder, .hero-lead { margin-left: auto; margin-right: auto; }
          .hero-buttons-container { align-items: center; }
          .hero-buttons { justify-content: center; }
          .hero-features {
            grid-template-columns: 1fr;
            justify-items: center;
            max-width: 420px;
            margin: 0 auto;
          }
          .hero-features > div { width: 100%; max-width: 360px; }
        }
        @media (max-width: 520px) {
          .hero-features { text-align: left; }
          /* floating cards sit at right:-70 / left:-65 — they clip past the viewport edge here */
          .hero-float { display: none; }
        }
      `}</style>
    </section>
  )
}
