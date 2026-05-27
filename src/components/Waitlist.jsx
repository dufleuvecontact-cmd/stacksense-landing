import { useState, useEffect, useRef } from 'react'
import { Mail, User, ArrowRight, Copy, Check, Share2, Hash, Lock, ShieldCheck } from 'lucide-react'
import { supabase } from '../supabaseClient'

const FOUNDING_SPOTS = 600
const STRIPE_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK

function gen() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'SS-' + Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('')
}

export default function Waitlist() {
  const [step, setStep]       = useState('form')
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [touched, setTouched] = useState({ email: false, consent: false })
  const [consent, setConsent] = useState(false)
  const [refCode, setRefCode] = useState(() => new URLSearchParams(window.location.search).get('ref') || '')
  const [code, setCode]       = useState('')
  const [spotsLeft, setSpotsLeft] = useState(null)
  const [copied, setCopied]   = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  // Auto-scroll + clean URL when ?ref= present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('ref')) {
      setTimeout(() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }), 300)
      params.delete('ref')
      const newUrl = params.toString() ? `?${params}` : window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  useEffect(() => {
    supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setSpotsLeft(Math.max(FOUNDING_SPOTS - (count || 0), 0)))
  }, [])

  // Handle return from Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment_success') === '1') {
      const saved = JSON.parse(localStorage.getItem('ss_wl_pending') || 'null')
      if (saved) {
        setCode(saved.code)
        setEmail(saved.email)
        supabase
          .from('waitlist')
          .insert([{ email: saved.email, name: saved.name || null, referred_by: saved.refCode || null, referral_code: saved.code }])
          .then(() => {
            localStorage.removeItem('ss_wl_pending')
            window.history.replaceState({}, '', window.location.pathname)
            setSpotsLeft(s => s !== null ? Math.max(s - 1, 0) : null)
            setStep('success')
          })
      }
    }
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade,.sr-left,.sr-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  function goToPayment(e) {
    e.preventDefault()
    setTouched({ email: true, consent: true })
    if (!email || !consent) return
    setStep('payment')
  }

  function handlePay() {
    setLoading(true)
    const newCode = gen()
    localStorage.setItem('ss_wl_pending', JSON.stringify({ email, name, refCode, code: newCode }))

    if (STRIPE_LINK) {
      const url = new URL(STRIPE_LINK)
      url.searchParams.set('prefilled_email', email)
      window.location.href = url.toString()
    } else {
      setCode(newCode)
      supabase
        .from('waitlist')
        .insert([{ email, name: name || null, referred_by: refCode || null, referral_code: newCode }])
        .then(() => {
          localStorage.removeItem('ss_wl_pending')
          setSpotsLeft(s => s !== null ? Math.max(s - 1, 0) : null)
          setLoading(false)
          setStep('success')
        })
    }
  }

  function copy() {
    navigator.clipboard.writeText(`https://stacksense.ca/?ref=${code}`).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const spotsFull   = spotsLeft === 0
  const claimedPct  = spotsLeft === null ? 0 : ((FOUNDING_SPOTS - spotsLeft) / FOUNDING_SPOTS) * 100
  const spotsLabel  = spotsLeft === null ? '—' : spotsLeft === 0 ? 'Sold out' : `${spotsLeft.toLocaleString()} left`
  const lowStock    = spotsLeft !== null && spotsLeft <= 60

  return (
    <section id="waitlist" ref={ref} className="section" style={{ background: 'rgba(26,140,135,.04)', borderTop: '1px solid rgba(26,140,135,.1)', borderBottom: '1px solid rgba(26,140,135,.1)' }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end', marginBottom: '3rem' }} id="waitlist-header">
          <div className="sr">
            <h2 className="display-md">
              Be first.
              <em className="teal-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}> Shape the product.</em>
            </h2>
          </div>
          <div className="sr d2">
            <p className="lead">Early access members help shape StackSense. Your feedback goes directly into the product.</p>
          </div>
        </div>

        {/* Spots banner */}
        <div className="sr" style={{ marginBottom: '2.5rem' }}>
          <div style={{
            background: lowStock ? 'rgba(229,62,62,.05)' : 'rgba(26,140,135,.07)',
            border: `1px solid ${lowStock ? 'rgba(229,62,62,.2)' : 'rgba(26,140,135,.18)'}`,
            borderRadius: 12,
            padding: '1rem 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
              <Lock size={14} color={lowStock ? '#e53e3e' : 'var(--teal)'} />
              <span style={{ fontSize: '.9rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>
                {FOUNDING_SPOTS} Founding Spots
              </span>
              <span className={`pill ${lowStock ? 'pill-amber' : 'pill-teal'}`}>{lowStock ? 'Almost gone' : 'Limited'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div style={{ height: 6, width: 140, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${claimedPct}%`,
                  background: lowStock ? 'linear-gradient(90deg,#e53e3e,#f56565)' : 'linear-gradient(90deg,#1a8c87,#25b5af)',
                  borderRadius: 3, transition: 'width .5s ease',
                }} />
              </div>
              <span style={{ fontSize: '.84rem', fontWeight: 700, color: lowStock ? '#e53e3e' : 'var(--teal)', whiteSpace: 'nowrap' }}>
                {spotsLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} id="waitlist-main">

          {/* Left: value proposition — always visible */}
          <div className="sr-left">
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', letterSpacing: '-.02em' }}>
              Claim your founding spot
            </h3>

            {/* $1 offer */}
            <div style={{ background: 'rgba(26,140,135,.08)', border: '1px solid rgba(26,140,135,.18)', borderRadius: 12, padding: '1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center', minWidth: 56, flexShrink: 0 }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--teal)', lineHeight: 1 }}>$1</div>
                <div style={{ fontSize: '.6rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '.07em', marginTop: 3 }}>today</div>
              </div>
              <div style={{ width: 1, height: 48, background: 'rgba(26,140,135,.2)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-sans)', lineHeight: 1.3, marginBottom: '.25rem' }}>6 months free at launch</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-2)' }}>Your $1 is credited — not charged</div>
              </div>
            </div>

            {/* Benefits */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '2rem' }}>
              {[
                ['First access when we launch', 'Priority onboarding, no queue.'],
                ['Lock in $9.99/mo forever',    'Founding rate, never increases.'],
                ['Influence the roadmap',        'Your feedback shapes the product directly.'],
                ['Your $1 is credited',          'Applied to your first month at launch.'],
              ].map(([title, sub]) => (
                <li key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem' }}>
                  <Check size={14} color="var(--teal)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: '.9rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>{title}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--text-3)', marginTop: '.1rem' }}>{sub}</div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Security note */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem' }}>
              <ShieldCheck size={13} color="var(--text-3)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '.78rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
                Secure checkout via Stripe. We never store your card details. Your email is used only for waitlist communications —{' '}
                <a href="/privacy-policy.html" style={{ color: 'var(--teal)', textDecoration: 'none' }}>see Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Right: form steps */}
          <div className="card-flat sr-right" style={{ padding: '2rem' }}>

            {/* Step 1: Info form */}
            {step === 'form' && (
              <form onSubmit={goToPayment} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
                <div>
                  <label htmlFor="wl-name" style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                    Name <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input id="wl-name" type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name" className="input" style={{ paddingLeft: '2.2rem' }} />
                  </div>
                </div>

                <div>
                  <label htmlFor="wl-email" style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                    Email <span style={{ color: '#e53e3e' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input id="wl-email" type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onBlur={() => setTouched(t => ({ ...t, email: true }))}
                      required placeholder="you@example.com" className="input"
                      style={{ paddingLeft: '2.2rem', borderColor: touched.email && !email ? '#e53e3e' : undefined }} />
                  </div>
                  {touched.email && !email && (
                    <p style={{ fontSize: '.75rem', color: '#e53e3e', marginTop: '.3rem' }}>Email is required.</p>
                  )}
                </div>

                <div>
                  <label htmlFor="wl-ref" style={{ display: 'block', fontSize: '.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                    Referral Code <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Hash size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input id="wl-ref" type="text" value={refCode} onChange={e => setRefCode(e.target.value)}
                      placeholder="SS-XXXXXX" className="input" style={{ paddingLeft: '2.2rem', fontFamily: 'var(--font-sans)' }} />
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '.55rem', cursor: 'pointer', marginTop: '.25rem' }}>
                  <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setTouched(t => ({ ...t, consent: true })) }}
                    required style={{ marginTop: 3, accentColor: 'var(--teal)', width: 14, height: 14, flexShrink: 0 }} />
                  <span style={{ fontSize: '.8rem', color: 'var(--text-2)', lineHeight: 1.55 }}>
                    I agree to StackSense collecting my email for waitlist communications.{' '}
                    <a href="/privacy-policy.html" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Privacy Policy</a>
                  </span>
                </label>
                {touched.consent && !consent && (
                  <p style={{ fontSize: '.75rem', color: '#e53e3e', margin: '-.4rem 0 0' }}>You must agree to continue.</p>
                )}

                <button type="submit" className="btn btn-teal"
                  disabled={spotsFull}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '.25rem', opacity: spotsFull ? .5 : 1 }}>
                  {spotsFull ? 'Waitlist Full' : <>Continue to Payment <ArrowRight size={14} /></>}
                </button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <>
                <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '.78rem', fontFamily: 'var(--font-sans)', marginBottom: '1.25rem', padding: 0, display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  ← Back
                </button>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '.3rem', color: 'var(--text)' }}>
                  Reserve your spot
                </h3>
                <p className="small" style={{ marginBottom: '1.5rem' }}>
                  Securing spot for <strong style={{ color: 'var(--text)' }}>{email}</strong>
                </p>

                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem', paddingBottom: '.75rem', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '.9rem', fontWeight: 600, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>Founding Spot</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--teal)' }}>$1.00</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    {[
                      '6 months free access at launch',
                      '$9.99/mo founding rate locked forever',
                      'Priority onboarding + roadmap influence',
                    ].map(label => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                        <Check size={12} color="var(--teal)" />
                        <span className="small" style={{ color: 'var(--text-2)' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(26,140,135,.06)', border: '1px solid rgba(26,140,135,.15)', borderRadius: 10, padding: '.8rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '.55rem' }}>
                  <ShieldCheck size={14} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className="small" style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
                    Your $1 is <strong style={{ color: 'var(--text)' }}>credited to your account</strong> — not lost. It covers your first 6 months when StackSense launches.
                  </p>
                </div>

                <button onClick={handlePay} className="btn btn-teal"
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', opacity: loading ? .7 : 1 }}>
                  {loading ? 'Redirecting…' : <>Pay $1 &amp; Reserve Spot <ArrowRight size={14} /></>}
                </button>
                <p className="small" style={{ textAlign: 'center', marginTop: '.6rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem' }}>
                  <ShieldCheck size={11} /> Secure checkout via Stripe
                </p>
              </>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Check size={20} color="var(--teal)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '.5rem', color: 'var(--text)' }}>
                  Spot reserved
                </h3>
                <p className="body" style={{ marginBottom: '.5rem' }}>
                  You're one of our founding members. We'll be in touch before launch.
                </p>
                <p className="small" style={{ marginBottom: '1.75rem', color: 'var(--teal)', fontWeight: 700 }}>
                  Your $1 = 6 months free at launch
                </p>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
                  <span className="small" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-2)' }}>
                    stacksense.ca/?ref={code}
                  </span>
                  <button onClick={copy} style={{ background: copied ? 'rgba(26,140,135,.1)' : 'rgba(26,140,135,.07)', border: `1px solid ${copied ? 'rgba(26,140,135,.25)' : 'rgba(26,140,135,.15)'}`, color: 'var(--teal)', borderRadius: 8, padding: '.28rem .65rem', cursor: 'pointer', fontSize: '.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-sans)', transition: 'all .2s', flexShrink: 0 }}>
                    {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <button className="btn btn-outline" onClick={copy} style={{ width: '100%', justifyContent: 'center', fontSize: '.84rem' }}>
                  <Share2 size={13} /> Share your link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:760px){
          #waitlist-main   { grid-template-columns: 1fr !important; }
          #waitlist-header { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
