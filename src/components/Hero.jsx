import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Bell } from 'lucide-react'
import WaitlistCapture from './WaitlistCapture'

// The interactive demo section sits directly below the hero; whenever the hero
// grid stacks to one column (<=960px) the static mockup would cost a full
// screen of scroll (and an iframe load) for a duplicate of it — so we skip
// rendering it entirely. Keep this in sync with the #hero-grid breakpoint.
function useIsSmallScreen() {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 960px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)')
    const fn = e => setSmall(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return small
}

function PhoneMockup() {
  return (
    <div style={{ position: 'relative', width: 260, margin: '0 auto' }}>
      {/* Phone shell */}
      <div style={{
        background: '#0c1a18', borderRadius: 40, padding: '10px',
        boxShadow: '0 40px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(45,106,79,.15)',
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
          background: 'rgba(45,106,79,.1)', border: '1px solid rgba(45,106,79,.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Bell size={12} color="var(--teal)"/>
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
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-sans)', lineHeight: 1 }}>21d</div>
        <div style={{ fontSize: '.58rem', color: '#7a9490', fontFamily: 'var(--font-sans)', marginTop: 2 }}>Personal best 🎯</div>
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const mockRef = useRef(null)
  const smallScreen = useIsSmallScreen()

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
  }, [smallScreen])

  return (
    <section id="hero" ref={ref} style={{
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
            <div className="sr d1" style={{ marginBottom: '1.1rem' }}>
              <span className="pill pill-teal">
                Built for coaches · Free for your clients
              </span>
            </div>

            <h1 className="sr d2 h1" style={{ marginBottom: '1rem' }}>
              Stop guessing what your clients{' '}
              <span className="teal-text">actually did.</span>
            </h1>

            <p className="sr d3 lead hero-lead">
              StackSense gives every client a free tracking app, and gives you a roster: assigned protocols, real dose adherence, and check-ins, without another status-update DM.
            </p>

            <div className="sr d3 hero-founder">
              Built by <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Jad Gouiza</strong>, who was coaching without any real idea whether clients were following the protocol.
            </div>

            <div className="sr d4 hero-capture">
              <WaitlistCapture variant="hero" source="hero" />
              <div className="hero-onboarding-note">Founding coaches are being onboarded right now.</div>
              <a href="#product" className="hero-demo-link">Poke around the live demo first ↓</a>
            </div>

            <div className="sr d5 hero-features">
              {[
                'Assign a protocol in one tap — it clones straight to their app',
                'See real dose adherence, not a text update',
                'Symptoms and bloodwork stay consent-gated until they share',
              ].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <CheckCircle2 size={15} color="var(--teal)" strokeWidth={2.5} style={{ flexShrink: 0 }}/>
                  <span className="small" style={{ fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — app mockup with scroll-tilt + glow (skipped on small phones) */}
          {!smallScreen && (
            <div className="sr-right d2 hero-phone-container">
              <div className="hero-glow" aria-hidden="true"/>
              <div ref={mockRef} style={{ transformOrigin: 'center top', willChange: 'transform', position: 'relative' }}>
                <PhoneMockup/>
              </div>
            </div>
          )}
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
          font-size: 0.88rem;
          color: var(--text-2);
          line-height: 1.5;
          margin-bottom: 1.4rem;
          max-width: 540px;
        }
        .hero-lead { max-width: 540px; margin: 0 0 1rem; }
        .hero-capture {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 1.6rem;
        }
        .hero-onboarding-note {
          font-size: .72rem;
          color: var(--text-3);
          margin-top: .35rem;
          font-weight: 500;
        }
        .hero-demo-link {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          margin-top: .35rem;
          font-size: .85rem;
          font-weight: 500;
          color: var(--teal-deep);
          text-decoration: none;
          font-family: var(--font-sans);
        }
        .hero-demo-link:hover { text-decoration: underline; }
        .hero-features {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
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
          .hero-capture { align-items: center; margin-left: auto; margin-right: auto; }
          .hero-capture .wlc-consent { text-align: left; }
          /* hero content is centered at this width — center the capture's helper
             lines too, instead of leaving them stuck to the left edge */
          .hero-capture .wlc-micro, .hero-capture .wlc-error { text-align: center; }
          .hero-capture .wlc-ref-toggle { align-self: center; }
          .hero-capture .wlc-hero > .pill { align-self: center; }
          .hero-features {
            justify-items: center;
            max-width: 420px;
            margin: 0 auto;
            align-items: flex-start;
          }
          .hero-features > div { width: 100%; max-width: 360px; text-align: left; }
        }
        @media (max-width: 520px) {
          /* Mobile fold budget: H1 + subhead + email + button + consent above the fold */
          #hero { padding-top: 84px !important; }
          #hero .h1 { font-size: 1.9rem; }
          #hero .hero-lead { font-size: 1.02rem; line-height: 1.6; }
          /* fold budget: capture comes before the founder line on small screens */
          .hero-founder { order: 5; margin-bottom: 0; margin-top: .2rem; }
          .hero-capture { margin-bottom: 1.1rem; }
          .hero-features { order: 6; margin-top: 1rem; }
          /* floating cards sit at right:-70 / left:-65 — they clip past the viewport edge here */
          .hero-float { display: none; }
        }
        @media (max-height: 480px) and (orientation: landscape) {
          /* Landscape phones: trim the fold budget by height, not width */
          #hero { padding-top: 76px !important; padding-bottom: 32px !important; }
          #hero .h1 { font-size: 1.9rem; }
          #hero .hero-lead { font-size: 1rem; line-height: 1.55; }
        }
      `}</style>
    </section>
  )
}
