import { useState, useEffect, useRef } from 'react'
import { Mail, User, ArrowRight, Copy, Check, Share2, Trophy, Hash, Lock, ShieldCheck } from 'lucide-react'
import { supabase } from '../supabaseClient'

const FOUNDING_SPOTS = 600
const STRIPE_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK

function gen() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'SS-' + Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('')
}

export default function Waitlist() {
  const [step, setStep] = useState('form') // form | payment | success
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [refCode, setRefCode] = useState(() => new URLSearchParams(window.location.search).get('ref') || '')
  const [code, setCode] = useState('')
  const [spotsLeft, setSpotsLeft] = useState(null)
  const [copied, setCopied] = useState(false)
  const [refs, setRefs] = useState(0)
  const ref = useRef(null)

  // Auto-scroll to waitlist when ?ref= present, then clean URL
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

  // Fetch actual referral count when we have a code
  useEffect(() => {
    if (!code) return
    supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by', code)
      .then(({ count }) => setRefs(count || 0))
  }, [code])

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
    if (!email || !consent) return
    setStep('payment')
  }

  function handlePay() {
    const newCode = gen()
    localStorage.setItem('ss_wl_pending', JSON.stringify({ email, name, refCode, code: newCode }))

    if (STRIPE_LINK) {
      const url = new URL(STRIPE_LINK)
      url.searchParams.set('prefilled_email', email)
      window.location.href = url.toString()
    } else {
      // Dev fallback: skip Stripe and go straight to success
      setCode(newCode)
      supabase
        .from('waitlist')
        .insert([{ email, name: name || null, referred_by: refCode || null, referral_code: newCode }])
        .then(() => {
          localStorage.removeItem('ss_wl_pending')
          setSpotsLeft(s => s !== null ? Math.max(s - 1, 0) : null)
          setStep('success')
        })
    }
  }

  function copy() {
    navigator.clipboard.writeText(`https://stacksense.ca/?ref=${code}`).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const tiers = [
    { n: 1, label: 'Early Access',    reward: 'Priority queue position',              done: refs >= 1, color: '#1a8c87' },
    { n: 3, label: 'Power User',      reward: 'Free first month + priority requests', done: refs >= 3, color: '#0d6b67' },
    { n: 5, label: 'Founding Member', reward: 'Lifetime discount + beta status',      done: refs >= 5, color: '#25b5af' },
  ]

  const spotsFull = spotsLeft === 0
  const claimedPct = spotsLeft === null ? 0 : ((FOUNDING_SPOTS - spotsLeft) / FOUNDING_SPOTS) * 100
  const spotsLabel = spotsLeft === null ? '—' : spotsLeft === 0 ? 'Sold out' : `${spotsLeft.toLocaleString()} left`
  const lowStock = spotsLeft !== null && spotsLeft <= 60

  return (
    <section id="waitlist" ref={ref} className="section" style={{ background: 'rgba(26,140,135,.05)', borderTop: '1px solid rgba(26,140,135,.12)', borderBottom: '1px solid rgba(26,140,135,.12)' }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end', marginBottom: '2.5rem' }} id="waitlist-header">
          <div className="sr">
            <h2 className="display-md">
              Be first.
              <em className="teal-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}> Shape the product.</em>
            </h2>
          </div>
          <div className="sr d2">
            <p className="lead">Early access members help shape StackSense — and get rewarded for it.</p>
          </div>
        </div>

        {/* Founding spots banner */}
        <div className="sr" style={{ marginBottom: '2rem' }}>
          <div style={{
            background: lowStock ? 'rgba(229,62,62,.06)' : 'rgba(26,140,135,.08)',
            border: `1px solid ${lowStock ? 'rgba(229,62,62,.22)' : 'rgba(26,140,135,.2)'}`,
            borderRadius: 14,
            padding: '1rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
              <Lock size={15} color={lowStock ? '#e53e3e' : 'var(--teal)'} />
              <span style={{ fontSize: '.92rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>
                {FOUNDING_SPOTS} Founding Spots Only
              </span>
              <span className={`pill ${lowStock ? 'pill-amber' : 'pill-teal'}`}>{lowStock ? 'Almost gone' : 'Limited'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
              <div style={{ height: 7, width: 140, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${claimedPct}%`,
                  background: lowStock ? 'linear-gradient(90deg,#e53e3e,#f56565)' : 'linear-gradient(90deg,#1a8c87,#25b5af)',
                  borderRadius: 4,
                  transition: 'width .5s ease',
                }} />
              </div>
              <span style={{ fontSize: '.84rem', fontWeight: 700, color: lowStock ? '#e53e3e' : 'var(--teal)', whiteSpace: 'nowrap' }}>
                {spotsLabel}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }} id="waitlist-grid">

          {/* ── Form card ── */}
          <div className="card-flat sr-left" style={{ padding: '2rem' }}>

            {/* ── Step 1: Info ── */}
            {step === 'form' && (
              <>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '.4rem', color: 'var(--text)' }}>
                  Claim Your Founding Spot
                </h3>

                {/* $1 deal card */}
                <div style={{ background: 'rgba(26,140,135,.08)', border: '1px solid rgba(26,140,135,.2)', borderRadius: 12, padding: '.9rem 1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                  <div style={{ textAlign: 'center', minWidth: 54, flexShrink: 0 }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--teal)', lineHeight: 1 }}>$1</div>
                    <div style={{ fontSize: '.6rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '.07em', marginTop: 2 }}>today</div>
                  </div>
                  <div style={{ width: 1, height: 40, background: 'rgba(26,140,135,.22)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-sans)', lineHeight: 1.3 }}>6 months free at launch</div>
                    <div style={{ fontSize: '.73rem', color: 'var(--text-2)', marginTop: '.2rem' }}>Your $1 is credited — not lost</div>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.45rem', marginBottom: '1.75rem' }}>
                  {[
                    'First access when we launch',
                    'Priority onboarding support',
                    'Lock in $9.99/mo founding rate forever',
                    'Influence the roadmap directly',
                  ].map(p => (
                    <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                      <Check size={13} color="var(--teal)" strokeWidth={2.5} />
                      <span className="body">{p}</span>
                    </li>
                  ))}
                </ul>

                <form onSubmit={goToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
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
                    <label htmlFor="wl-email" style={{ display: 'block', fontSize: '.76rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                      Email <span style={{ color: '#e53e3e' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input id="wl-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                        required placeholder="you@example.com" className="input" style={{ paddingLeft: '2.1rem' }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="wl-ref" style={{ display: 'block', fontSize: '.76rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.3rem' }}>
                      Referral Code <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Hash size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input id="wl-ref" type="text" value={refCode} onChange={e => setRefCode(e.target.value)}
                        placeholder="Enter code if you have one" className="input" style={{ paddingLeft: '2.1rem' }} />
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
                  <button type="submit" className="btn btn-teal"
                    disabled={!email || !consent || spotsFull}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '.2rem', opacity: (!email || !consent || spotsFull) ? .5 : 1 }}>
                    {spotsFull ? 'Waitlist Full' : <>Continue to Payment <ArrowRight size={14} /></>}
                  </button>
                </form>
              </>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 'payment' && (
              <>
                <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '.78rem', fontFamily: 'var(--font-sans)', marginBottom: '1.2rem', padding: 0, display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  ← Back
                </button>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '.3rem', color: 'var(--text)' }}>
                  Reserve your spot
                </h3>
                <p className="small" style={{ marginBottom: '1.5rem' }}>
                  Securing spot for <strong style={{ color: 'var(--text)' }}>{email}</strong>
                </p>

                {/* Order summary */}
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.2rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem', paddingBottom: '.75rem', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '.88rem', fontWeight: 600, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>Founding Spot Reservation</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-sans)', color: 'var(--teal)' }}>$1.00</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.42rem' }}>
                    {[
                      ['6 months free access at launch', true],
                      ['$9.99/mo founding rate locked forever', true],
                      ['Priority onboarding + roadmap influence', true],
                    ].map(([label, green]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                        <Check size={12} color={green ? 'var(--teal)' : 'var(--text-3)'} />
                        <span className="small" style={{ color: 'var(--text-2)' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credit note */}
                <div style={{ background: 'rgba(26,140,135,.07)', border: '1px solid rgba(26,140,135,.16)', borderRadius: 10, padding: '.8rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '.55rem' }}>
                  <ShieldCheck size={14} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className="small" style={{ color: 'var(--text-2)', lineHeight: 1.55 }}>
                    Your $1 is <strong style={{ color: 'var(--text)' }}>credited to your account</strong>, not lost. It covers your first 6 months when StackSense launches — effectively paying $1 for $60 of access.
                  </p>
                </div>

                <button onClick={handlePay} className="btn btn-teal" style={{ width: '100%', justifyContent: 'center' }}>
                  Pay $1 &amp; Reserve Spot <ArrowRight size={14} />
                </button>
                <p className="small" style={{ textAlign: 'center', marginTop: '.6rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem' }}>
                  <ShieldCheck size={11} /> Secure payment via Stripe
                </p>
              </>
            )}

            {/* ── Step 3: Success ── */}
            {step === 'success' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                  <Check size={20} color="var(--teal)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '.5rem', color: 'var(--text)' }}>
                  Spot reserved!
                </h3>
                <p className="body" style={{ marginBottom: '.5rem' }}>
                  You're one of our founding members. We'll reach out before launch with everything you need.
                </p>
                <p className="small" style={{ marginBottom: '1.5rem', color: 'var(--teal)', fontWeight: 700 }}>
                  Your $1 = 6 months free when we launch
                </p>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '.7rem 1rem', display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
                  <span className="small" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    stacksense.ca/?ref={code}
                  </span>
                  <button onClick={copy} style={{ background: copied ? 'rgba(26,140,135,.1)' : 'rgba(26,140,135,.08)', border: `1px solid ${copied ? 'rgba(26,140,135,.25)' : 'rgba(26,140,135,.18)'}`, color: 'var(--teal)', borderRadius: 7, padding: '.28rem .65rem', cursor: 'pointer', fontSize: '.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-sans)', transition: 'all .2s' }}>
                    {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <button className="btn btn-outline" onClick={copy} style={{ width: '100%', justifyContent: 'center', fontSize: '.82rem' }}>
                  <Share2 size={13} /> Share your link
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Referral rewards ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card-flat sr-right d1" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.18)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trophy size={15} color="var(--teal)" />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '.93rem', fontWeight: 700, color: 'var(--text)' }}>Referral Rewards</h4>
                  <p className="small">Refer friends, move up the list</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {tiers.map(t => (
                  <div key={t.n} style={{ background: t.done ? `${t.color}0d` : 'var(--bg)', border: `1px solid ${t.done ? `${t.color}28` : 'var(--border)'}`, borderRadius: 10, padding: '.7rem .9rem', display: 'flex', alignItems: 'center', gap: '.7rem', transition: 'all .2s' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: t.done ? `${t.color}18` : 'var(--bg-card)', border: `1.5px solid ${t.done ? t.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.68rem', fontWeight: 700, color: t.done ? t.color : 'var(--text-3)', flexShrink: 0 }}>
                      {t.done ? <Check size={11} /> : t.n}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '.8rem', fontWeight: 600, color: t.done ? 'var(--text)' : 'var(--text-2)', fontFamily: 'var(--font-sans)' }}>{t.label}</div>
                      <div className="small">{t.reward}</div>
                    </div>
                    <span className={`pill ${t.done ? 'pill-teal' : 'pill-gray'}`}>{t.done ? 'Unlocked' : `${t.n} refs`}</span>
                  </div>
                ))}
              </div>
            </div>

            {step === 'success' && (
              <div className="card-flat sr-right d2" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.6rem' }}>
                  <span style={{ fontSize: '.8rem', fontWeight: 600, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>Your referrals</span>
                  <span className="small">{refs} / 3 to Power User</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden', marginBottom: '.7rem' }}>
                  <div style={{ height: '100%', width: `${Math.min(refs / 3 * 100, 100)}%`, background: 'linear-gradient(90deg,#1a8c87,#25b5af)', borderRadius: 3, transition: 'width .4s ease' }} />
                </div>
                <span className="small">{Math.max(3 - refs, 0)} more to next reward</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:760px){
          #waitlist-grid{grid-template-columns:1fr!important}
          #waitlist-header{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  )
}
