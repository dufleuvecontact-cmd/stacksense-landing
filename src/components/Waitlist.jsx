import { useState, useEffect, useRef } from 'react'
import { Mail, User, ArrowRight, Check, Shield, Users, Copy, Star } from 'lucide-react'
// supabase import removed — payment status is now updated via server-side Stripe webhook
import { track } from '@vercel/analytics'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [refCode, setRefCode] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [code, setCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [isFounder, setIsFounder] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade,.sr-left,.sr-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.has('ref')) setRefCode(p.get('ref'))

    if (p.get('payment') === 'success' && p.has('code')) {
      const codeParam = p.get('code')
      setCode(codeParam)
      setSubmitted(true)
      setIsFounder(true)
      // Payment status is updated server-side via Stripe webhook
      track('founding_upgrade')
      window.history.replaceState(null, '', window.location.pathname + '#waitlist')
      setTimeout(() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }

    if (p.get('payment') === 'cancel') {
      window.history.replaceState(null, '', window.location.pathname + '#waitlist')
      setTimeout(() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])



  function validate() {
    if (!email || !consent) return false
    if (name && !/^[A-Za-z\s-]{2,50}$/.test(name)) {
      alert('Please enter a valid name (letters, spaces, hyphens only).')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.')
      return false
    }
    return true
  }

  // Free path: create the waitlist row and show the success state.
  async function submit(e) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, refCode })
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.code === 'DUPLICATE') {
          alert(data.message)
        } else if (data.code === 'INVALID_REF') {
          alert(data.message)
        } else {
          alert('Something went wrong saving your spot. Please try again.')
        }
        setIsSubmitting(false)
        return
      }

      // Lead saved — now safe to show success
      track('waitlist_join')
      if (typeof window !== 'undefined' && window.rdt) {
        window.rdt('track', 'SignUp');
      }
      setCode(data.code)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert('An error occurred. Check the console for details.')
    }

    setIsSubmitting(false)
  }

  // Redirect to Stripe checkout. Returns false if it did NOT redirect (so caller can re-enable UI).
  async function startCheckout(checkoutEmail, checkoutCode) {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: checkoutEmail, code: checkoutCode || '' }),
    })
    const data = await res.json()
    const safeUrl = data.url && (() => { try { return new URL(data.url).hostname === 'checkout.stripe.com' } catch { return false } })()
    if (safeUrl) {
      window.location.href = data.url
      return true
    }
    if (data.url) {
      console.error('Invalid redirect URL:', data.url)
      alert('Security error: received an invalid redirect URL from the server.')
    } else {
      console.error('Stripe error:', data)
      alert('Failed to initiate payment. Please try again or contact support@stacksense.ca.')
    }
    return false
  }

  // Founding path: ensure a waitlist row exists (webhook links payment by email), then checkout.
  async function joinFounding() {
    if (!validate()) return
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/join-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, refCode })
      })
      const data = await res.json()
      let joinedCode = ''
      if (res.ok) {
        joinedCode = data.code
        track('waitlist_join')
        if (typeof window !== 'undefined' && window.rdt) window.rdt('track', 'SignUp')
      } else if (data.code === 'DUPLICATE') {
        // Already on the list — row exists, webhook matches by email. Proceed to checkout.
        joinedCode = ''
      } else if (data.code === 'INVALID_REF') {
        alert(data.message); setIsUpgrading(false); return
      } else {
        alert('Something went wrong. Please try again.'); setIsUpgrading(false); return
      }
      track('founding_checkout')
      const redirected = await startCheckout(email, joinedCode)
      if (!redirected) setIsUpgrading(false)
    } catch (err) {
      console.error(err)
      alert('An error occurred. Please try again.')
      setIsUpgrading(false)
    }
  }

  // Post-join upsell button (success state) — code already known.
  async function upgrade() {
    setIsUpgrading(true)
    try {
      const redirected = await startCheckout(email, code)
      if (!redirected) setIsUpgrading(false)
    } catch (err) {
      console.error(err)
      alert('An error occurred. Please try again.')
      setIsUpgrading(false)
    }
  }

  function copy() {
    navigator.clipboard.writeText(`https://stacksense.ca/?ref=${code}`).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="waitlist" ref={ref} className="section-band">
      <div className="wrap">
        <div className="wl-grid">
          {/* LEFT — pitch */}
          <div className="wl-pitch sr">
            <span className="pill pill-teal" style={{ marginBottom: '1.1rem' }}>Founding members · First 100 only</span>
            <h2 className="h2" style={{ marginBottom: '1rem' }}>
              Lock in <span className="teal-text">$9.99/mo</span>, for life.
            </h2>
            <p className="lead" style={{ marginBottom: '1.5rem' }}>
              Founding members lock in $9.99/mo for life and get 6 months free, all for a $1 deposit. Or join the waitlist for free to get early access.
            </p>

            <div className="wl-offer">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '.55rem', marginBottom: '.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em', lineHeight: 1 }}>$9.99</span>
                <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>/mo, forever</span>
                <span style={{ marginLeft: 'auto', textDecoration: 'line-through', color: 'var(--text-3)', fontSize: '.9rem' }}>$13.99–19.99</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                <span className="pill pill-teal">+ 6 months free</span>
                <span className="pill pill-teal">$1 deposit · refundable</span>
              </div>
            </div>

            <ul className="wl-benefits">
              {['First access the day we launch', 'Founding price locked for life', 'Priority onboarding support', 'Direct line to shape the roadmap'].map(b => (
                <li key={b}><Check size={15} color="var(--teal)" strokeWidth={2.5} style={{ flexShrink: 0 }} /><span className="body-text">{b}</span></li>
              ))}
            </ul>

            <div className="wl-trust">
              <span><Shield size={13} color="var(--teal-deep)" /> 100% refundable</span>
              <span><Check size={13} color="var(--teal-deep)" /> No spam, ever</span>
              <span><Check size={13} color="var(--teal-deep)" /> Cancel anytime</span>
            </div>
          </div>

          {/* RIGHT — form (logic unchanged) */}
          <div className="wl-form-col sr">
          {/* Form / Success */}
          <div className="card-flat form-container" style={{ padding: '2rem' }}>
            {!submitted ? (
              <>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '.4rem', color: 'var(--text)' }}>Claim your spot</h3>
                <p className="body-text" style={{ marginBottom: '1.5rem', color: 'var(--teal-deep)', fontWeight: 500 }}>
                  Join the waitlist for free, or become a founding member for $1.
                </p>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                  <div style={{ fontSize: '.7rem', color: 'var(--text-3)', marginBottom: '-.2rem', lineHeight: 1.2 }}>
                    Got a referral code from a friend? Enter it here and you'll both get priority access.
                  </div>
                  <div id="wl-form-top" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem' }}>
                    <div>
                      <label htmlFor="wl-name" style={{ display: 'block', fontSize: '.76rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                        Name <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input id="wl-name" type="text" value={name} onChange={e => setName(e.target.value)}
                          placeholder="Your name" className="input" style={{ paddingLeft: '2.1rem' }} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="wl-ref" style={{ display: 'block', fontSize: '.76rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                        Referral Code <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Users size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input id="wl-ref" type="text" value={refCode} onChange={e => setRefCode(e.target.value)}
                          placeholder="Code" className="input" style={{ paddingLeft: '2.1rem', textTransform: 'uppercase' }} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="wl-email" style={{ display: 'block', fontSize: '.76rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                      Email <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input id="wl-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                        required placeholder="you@example.com" className="input" style={{ paddingLeft: '2.1rem' }} />
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '.55rem', cursor: 'pointer', marginTop: '.4rem' }}>
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required
                      style={{ marginTop: 2, accentColor: 'var(--teal)', width: 14, height: 14, flexShrink: 0 }} />
                    <span className="small">
                      I agree to StackSense collecting my email for waitlist purposes. See our{' '}
                      <a href="/privacy-policy.html" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Privacy Policy</a>.
                    </span>
                  </label>
                  <div style={{ textAlign: 'center', marginTop: '0.5rem', marginBottom: '0.2rem', fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>
                    Founding spots limited to the first 100
                  </div>

                  {/* Primary — join free (also handles Enter via form submit) */}
                  <button type="submit" className="btn btn-teal"
                    disabled={!email || !consent || isSubmitting || isUpgrading}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '.2rem', opacity: (!email || !consent || isSubmitting || isUpgrading) ? .5 : 1 }}>
                    {isSubmitting ? 'Joining…' : <>Join the waitlist for free <ArrowRight size={14} /></>}
                  </button>

                  {/* Secondary — become a founding member for $1 */}
                  <button type="button" onClick={joinFounding} className="btn btn-outline"
                    disabled={!email || !consent || isSubmitting || isUpgrading}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '.7rem', opacity: (!email || !consent || isSubmitting || isUpgrading) ? .5 : 1 }}>
                    {isUpgrading ? 'Redirecting to Stripe…' : 'Or become a founding member for $1'}
                  </button>
                  <div style={{ textAlign: 'center', fontSize: '.7rem', color: 'var(--text-3)', marginTop: '.4rem' }}>
                    $1 deposit, 100% refundable. Locks in $9.99/mo for life.
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                <div style={{ width: 52, height: 52, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Check size={20} color="var(--teal)" strokeWidth={3} />
                </div>
                <h3 className="h3" style={{ marginBottom: '.5rem' }}>
                  {isFounder ? 'Thank you for your payment!' : "You're on the list"}
                </h3>
                <p className="body-text" style={{ marginBottom: '1.5rem', color: 'var(--text-2)' }}>
                  {isFounder
                    ? "Your Founding Member spot and pricing are locked in."
                    : "Your spot is saved. Share your link below to invite others."}
                </p>

                {/* Referral link */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', marginBottom: !isFounder ? '1.25rem' : '0' }}>
                  <p style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.4rem', fontFamily: 'var(--font-sans)' }}>
                    Earn 2 months free
                  </p>
                  <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    Share your unique link below. <strong>If just 1 person joins</strong>, you'll automatically get 2 additional months of StackSense for free when we launch.
                  </p>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '.5rem .75rem', fontSize: '.75rem', color: 'var(--text-2)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'all' }}>
                      https://stacksense.ca/?ref={code}
                    </div>
                    <button onClick={copy} className="btn btn-teal" style={{ padding: '.5rem .75rem', minWidth: 85, justifyContent: 'center' }}>
                      {copied ? <Check size={14} /> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                </div>

                {/* Founding member upsell */}
                {!isFounder && (
                  <div style={{ background: 'rgba(26,140,135,.04)', border: '1px solid rgba(26,140,135,.2)', borderRadius: 10, padding: '1.25rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                      <Star size={14} color="var(--teal)" strokeWidth={2} />
                      <span style={{ fontSize: '.85rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>Upgrade to Founding Member</span>
                      <span style={{ fontSize: '.7rem', background: 'var(--teal)', color: '#fff', borderRadius: 4, padding: '.1rem .4rem', fontWeight: 700, fontFamily: 'var(--font-sans)', marginLeft: 'auto' }}>First 100 only</span>
                    </div>
                    <p className="small" style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                      Lock in <strong>$9.99/mo forever</strong> + <strong>6 months free</strong> at launch with a $1 deposit. Release price will be $13.99–$19.99/mo.
                    </p>
                    <button onClick={upgrade} disabled={isUpgrading} className="btn btn-teal" style={{ width: '100%', justifyContent: 'center' }}>
                      {isUpgrading ? 'Redirecting to Stripe...' : 'Upgrade Now for $1'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="wl-reassure">Free to join. The founding upgrade is optional and fully refundable.</p>
          </div>
        </div>
      </div>
      <style>{`
        .wl-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 3rem; align-items: center; }
        .wl-pitch { display: flex; flex-direction: column; align-items: flex-start; }
        .wl-offer { width: 100%; background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 1.1rem 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 4px 16px rgba(0,0,0,.03); }
        .wl-benefits { list-style: none; display: flex; flex-direction: column; gap: .6rem; margin-bottom: 1.5rem; width: 100%; }
        .wl-benefits li { display: flex; align-items: center; gap: .55rem; }
        .wl-trust { display: flex; flex-wrap: wrap; gap: 1rem 1.25rem; }
        .wl-trust span { display: inline-flex; align-items: center; gap: .35rem; font-size: .8rem; color: var(--text-2); font-weight: 500; }
        .wl-reassure { text-align: center; font-size: .78rem; color: var(--text-3); margin-top: 1rem; }
        @media (max-width: 860px) {
          .wl-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .wl-pitch { align-items: center; text-align: center; }
          .wl-offer { max-width: 420px; margin-left: auto; margin-right: auto; }
          .wl-benefits { max-width: 380px; margin-left: auto; margin-right: auto; }
          .wl-trust { justify-content: center; }
        }
        @media(max-width:500px){#wl-form-top{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
