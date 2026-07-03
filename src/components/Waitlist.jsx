import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import WaitlistCapture from './WaitlistCapture'
import { FOUNDING_EVENT } from '../lib/waitlistShared'

export default function Waitlist() {
  const ref = useRef(null)
  const [foundingBusy, setFoundingBusy] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade,.sr-left,.sr-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // One CTA per column: this button is the only founding CTA pre-signup.
  // The form (right column) owns the email field and completes the flow.
  function founding() {
    if (foundingBusy) return
    setFoundingBusy(true)
    window.dispatchEvent(new CustomEvent(FOUNDING_EVENT))
    // If the form rejected (missing email/consent), re-enable after a beat.
    setTimeout(() => setFoundingBusy(false), 1500)
  }

  return (
    <section id="waitlist" ref={ref} className="section-band">
      <div className="wrap">
        <div className="wl-grid">
          {/* LEFT — price-lock pitch */}
          <div className="wl-pitch sr">
            <span className="pill pill-teal" style={{ marginBottom: '1.1rem' }}>Early access</span>
            <h2 className="h2" style={{ marginBottom: '1rem' }}>
              Join now, <span className="teal-text">pay less forever.</span>
            </h2>
            <p className="lead" style={{ marginBottom: '1.5rem' }}>
              StackSense launches at $13.99–19.99/mo. Everyone on the early-access list locks in $9.99/mo for life — even if you sign up for the app a year from now. It costs nothing to hold your spot, and you can ignore every email we send.
            </p>

            <div className="wl-offer">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '.55rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em', lineHeight: 1 }}>$9.99</span>
                <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>/mo — your price, locked for life</span>
              </div>
              <div style={{ textDecoration: 'line-through', color: 'var(--text-3)', fontSize: '.9rem', marginTop: '.35rem' }}>
                $13.99–19.99/mo — launch price for everyone else
              </div>
              <button onClick={founding} disabled={foundingBusy} className="btn btn-teal"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                {foundingBusy ? 'One moment…' : 'Lock in $9.99/mo — $1 today'}
              </button>
              <div style={{ fontSize: '.72rem', color: 'var(--text-3)', marginTop: '.5rem', textAlign: 'center' }}>
                The $9.99 lock disappears the day we launch.
              </div>
            </div>

            <ul className="wl-benefits">
              {[
                'Price locked before launch',
                'First in line when beta invites go out',
                'Share your link, earn up to 2 free months',
              ].map(b => (
                <li key={b}><Check size={15} color="var(--teal)" strokeWidth={2.5} style={{ flexShrink: 0 }} /><span className="body-text">{b}</span></li>
              ))}
            </ul>
          </div>

          {/* RIGHT — free join form (one CTA: free) */}
          <div className="wl-form-col sr">
            <div className="card-flat form-container" style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '.35rem', color: 'var(--text)' }}>
                Get early access
              </h3>
              <p className="body-text" style={{ marginBottom: '1.25rem', color: 'var(--teal-deep)', fontWeight: 500 }}>
                Free to join — beta testers are being onboarded right now.
              </p>
              <WaitlistCapture variant="form" source="waitlist" />
            </div>
            <p className="wl-reassure">Free to join. The founding upgrade is optional — one $1 checkout, nothing else.</p>
          </div>
        </div>
      </div>
      <style>{`
        .wl-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 3rem; align-items: center; }
        .wl-pitch { display: flex; flex-direction: column; align-items: flex-start; }
        .wl-offer { width: 100%; background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem 1.4rem; margin-bottom: 1.5rem; box-shadow: var(--shadow-md); }
        .wl-benefits { list-style: none; display: flex; flex-direction: column; gap: .6rem; width: 100%; }
        .wl-benefits li { display: flex; align-items: center; gap: .55rem; }
        .wl-reassure { text-align: center; font-size: .78rem; color: var(--text-3); margin-top: 1rem; }
        @media (max-width: 860px) {
          .wl-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          /* mobile: form first, pitch second */
          .wl-form-col { order: -1; }
          .wl-pitch { align-items: center; text-align: center; }
          .wl-offer { max-width: 420px; margin-left: auto; margin-right: auto; }
          .wl-benefits { max-width: 380px; margin-left: auto; margin-right: auto; }
        }
      `}</style>
    </section>
  )
}
