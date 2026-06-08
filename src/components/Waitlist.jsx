import { useState, useEffect, useRef } from 'react'
import { Mail, User, ArrowRight, Check, Shield, Zap, Clock, Users, Copy, Star } from 'lucide-react'
import { supabase } from '../supabaseClient'
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
      supabase
        .from('waitlist')
        .update({ payment_status: 'paid' })
        .eq('referral_code', codeParam)
        .then(() => {
          track('founding_upgrade')
          window.history.replaceState(null, '', window.location.pathname + '#waitlist')
          setTimeout(() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }), 100)
        })
        .catch(err => console.error(err))
    }

    if (p.get('payment') === 'cancel') {
      window.history.replaceState(null, '', window.location.pathname + '#waitlist')
      setTimeout(() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  function gen() { return Math.random().toString(36).substring(2, 8).toUpperCase() }

  async function submit(e) {
    e.preventDefault()
    if (!email || !consent) return

    if (name && !/^[A-Za-z\s-]{2,50}$/.test(name)) {
      alert('Please enter a valid name (letters, spaces, hyphens only).')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)

    if (refCode) {
      const { data, error } = await supabase.from('waitlist').select('referral_code').eq('referral_code', refCode).maybeSingle()
      if (error || !data) {
        alert('The referral code you entered is invalid. Please check it and try again, or leave it blank.')
        setIsSubmitting(false)
        return
      }
    }

    const newCode = gen()

    try {
      const { error } = await supabase.from('waitlist').insert([{
        email,
        name: name || null,
        referred_by: refCode || null,
        referral_code: newCode,
        payment_status: 'none',
      }])

      if (error) {
        console.error('Supabase insert error:', error)
        // Duplicate email is a unique constraint violation (code 23505)
        if (error.code === '23505') {
          alert("You're already on the waitlist! Check your email or contact support@stacksense.online.")
        } else {
          alert('Something went wrong saving your spot. Please try again.')
        }
        setIsSubmitting(false)
        return
      }

      // Lead saved — now safe to show success regardless of what happens next
      track('waitlist_join')
      setCode(newCode)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert('An error occurred. Check the console for details.')
    }

    setIsSubmitting(false)
  }

  async function upgrade() {
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (data.url && data.url.startsWith('https://checkout.stripe.com/')) {
        window.location.href = data.url
        return
      } else if (data.url) {
        console.error('Invalid redirect URL:', data.url)
        alert('Security error: received an invalid redirect URL from the server.')
      } else {
        console.error('Stripe error:', data)
        alert('Failed to initiate payment. Please try again or contact support@stacksense.online.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred. Please try again.')
    }
    setIsUpgrading(false)
  }

  function copy() {
    navigator.clipboard.writeText(`https://stacksense.online/?ref=${code}`).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="waitlist" ref={ref} className="section-band">
      <div className="wrap">
        <div className="sr" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>Early access</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            Be first.<span className="teal-text"> Shape the product.</span>
          </h2>
          <p className="lead" style={{ maxWidth: 480, margin: '0 auto' }}>
            Early access members help shape StackSense — and lock in special pricing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'start' }} id="waitlist-grid">
          {/* Form / Success */}
          <div className="card-flat sr-left form-container" style={{ padding: '2rem', flex: 1 }}>
            {!submitted ? (
              <>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '.4rem', color: 'var(--text)' }}>Join the Waitlist — Free</h3>
                <p className="body-text" style={{ marginBottom: '1.5rem', color: 'var(--teal-deep)', fontWeight: 500 }}>
                  Secure your spot. Lock in founding-member pricing when we launch.
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.45rem', marginBottom: '1.75rem' }}>
                  {['First access when we launch', 'Priority onboarding support', 'Lock in your founding-user rate', 'Influence the roadmap directly'].map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                      <Check size={13} color="var(--teal)" strokeWidth={2.5} />
                      <span className="body-text">{p}</span>
                    </li>
                  ))}
                </ul>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                  <div style={{ fontSize: '.7rem', color: 'var(--text-3)', marginBottom: '-.2rem', lineHeight: 1.2 }}>
                    Got a referral code from a friend? Enter it here — you'll both get priority access.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.7rem' }}>
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
                    58 people and counting on the waitlist
                  </div>
                  <button type="submit" className="btn btn-teal" disabled={!email || !consent || isSubmitting}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '.2rem', opacity: (!email || !consent || isSubmitting) ? .5 : 1 }}>
                    {isSubmitting ? 'Joining...' : <>Become a Founding Member — $1 <ArrowRight size={14} /></>}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
                <div style={{ width: 52, height: 52, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Check size={20} color="var(--teal)" strokeWidth={3} />
                </div>
                <h3 className="h3" style={{ marginBottom: '.5rem' }}>
                  {isFounder ? "You're a Founding Member!" : "You're on the list"}
                </h3>
                <p className="body-text" style={{ marginBottom: '1.5rem', color: 'var(--text-2)' }}>
                  {isFounder
                    ? "Your $9.99/mo rate and 6 free months are locked in. We'll reach out when the app launches."
                    : 'Your spot is saved. Share your link below to invite others.'}
                </p>

                {/* Referral link */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.4rem', fontFamily: 'var(--font-sans)' }}>Invite your friends</p>
                  <p style={{ fontSize: '.75rem', color: 'var(--text-3)', marginBottom: '1rem' }}>Share your unique link to help others discover StackSense.</p>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '.5rem .75rem', fontSize: '.75rem', color: 'var(--text-2)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'all' }}>
                      https://stacksense.online/?ref={code}
                    </div>
                    <button onClick={copy} className="btn btn-teal" style={{ padding: '.5rem .75rem', minWidth: 85, justifyContent: 'center' }}>
                      {copied ? <Check size={14} /> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                </div>

                {/* Founding member upsell — only shown to free-tier users */}
                {/* TODO: send automated follow-up email to free-tier users who didn't upgrade */}
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
                    <button onClick={upgrade} className="btn btn-teal" disabled={isUpgrading}
                      style={{ width: '100%', justifyContent: 'center', opacity: isUpgrading ? .6 : 1 }}>
                      {isUpgrading ? 'Redirecting to payment...' : <>Become a Founding Member — $1 <ArrowRight size={14} /></>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side — Pricing & what you get */}
          <div className="pricing-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div className="card-flat sr-right d1" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '.93rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>Founding Member Pricing</h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '.4rem', marginBottom: '.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--text)', letterSpacing: '-.03em' }}>$9.99</span>
                <span style={{ fontSize: '.82rem', color: 'var(--text-3)', fontFamily: 'var(--font-sans)' }}>/month forever</span>
              </div>
              <p className="small" style={{ color: 'var(--teal-deep)', fontWeight: 600, marginBottom: '.25rem' }}>+ 6 months free when we launch</p>
              <p className="small" style={{ color: 'var(--text-3)', marginBottom: '1.25rem', fontSize: '.75rem' }}>
                Founding rate locks in permanently. Launch price will be higher.
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {[
                  { icon: Shield, text: 'Unlimited protocols & substances' },
                  { icon: Zap, text: 'AI bloodwork analysis & research' },
                  { icon: Clock, text: 'Full dose history & adherence tracking' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(26,140,135,.08)', border: '1px solid rgba(26,140,135,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={13} color="var(--teal)" />
                    </div>
                    <span className="body-text">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-flat sr-right d2" style={{ padding: '1.25rem', background: 'rgba(26,140,135,.03)', borderColor: 'rgba(26,140,135,.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} />
                <span style={{ fontSize: '.78rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>Why $1?</span>
              </div>
              <p className="small" style={{ lineHeight: 1.65 }}>
                A small commitment to confirm serious interest. It reserves your spot, locks your rate, and ensures we're building for people who actually want this tool.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        #waitlist-grid { flex-direction: row-reverse; }
        .form-container, .pricing-container { min-width: 0; }
        @media(max-width:760px){
          #waitlist-grid { flex-direction: column-reverse !important; }
        }
        @media(max-width:500px){#wl-form-top{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  )
}
