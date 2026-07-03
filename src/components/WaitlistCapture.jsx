import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Check, Copy, Star } from 'lucide-react'
import { track } from '@vercel/analytics'
import {
  store, markJoined, startCheckout, getUrlRef,
  JOINED_EVENT, FOUNDING_EVENT, EMAIL_RE,
} from '../lib/waitlistShared'

/**
 * variant: 'hero' (inline row capture), 'form' (waitlist-section card body),
 *          'sticky' (one-line bottom bar). All post the same payload.
 */
export default function WaitlistCapture({ variant = 'form', source = variant }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [refCode, setRefCode] = useState(() => getUrlRef())
  const [fromLink] = useState(() => !!getUrlRef())
  const [showRef, setShowRef] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [joined, setJoined] = useState(() => store.joined)
  const [code, setCode] = useState(() => store.code)
  const [isFounder, setIsFounder] = useState(() => store.founder)
  const [copied, setCopied] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const emailRef = useRef(null)

  useEffect(() => {
    const onJoined = e => {
      setJoined(true)
      if (e.detail?.code) setCode(e.detail.code)
      if (e.detail?.founder) setIsFounder(true)
    }
    window.addEventListener(JOINED_EVENT, onJoined)
    return () => window.removeEventListener(JOINED_EVENT, onJoined)
  }, [])

  async function postJoin() {
    const res = await fetch('/api/join-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: '', refCode: refCode.trim().toUpperCase() }),
    })
    const data = await res.json()
    return { res, data }
  }

  async function joinThenCheckout() {
    setUpgrading(true)
    setError('')
    try {
      const { res, data } = await postJoin()
      let joinedCode = ''
      if (res.ok) {
        joinedCode = data.code
        track('waitlist_join', { source: source + '-founding' })
        if (typeof window !== 'undefined' && window.rdt) window.rdt('track', 'SignUp')
        markJoined({ code: data.code, email })
      } else if (data.code === 'DUPLICATE') {
        // Already on the list — webhook links the payment by email.
        markJoined({ email })
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
        setUpgrading(false)
        return
      }
      track('founding_checkout')
      const redirected = await startCheckout(email, joinedCode)
      if (!redirected) setUpgrading(false)
    } catch (err) {
      console.error(err)
      setError('Network hiccup — please try again.')
      setUpgrading(false)
    }
  }

  // The founding button lives on the pitch card (one CTA per column). It fires
  // this event; the waitlist form owns the email field, so it completes the flow.
  useEffect(() => {
    if (variant !== 'form') return
    const onFounding = () => {
      if (store.joined && store.email) {
        setUpgrading(true)
        startCheckout(store.email, store.code).then(r => { if (!r) setUpgrading(false) }).catch(() => setUpgrading(false))
        return
      }
      if (!EMAIL_RE.test(email) || !consent) {
        setError('Enter your email and tick the box first — then the $1 checkout takes about 20 seconds.')
        emailRef.current?.focus()
        return
      }
      joinThenCheckout()
    }
    window.addEventListener(FOUNDING_EVENT, onFounding)
    return () => window.removeEventListener(FOUNDING_EVENT, onFounding)
    // joinThenCheckout is recreated per render; the listener is re-bound whenever
    // its inputs (email/consent/refCode) change, which is what matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, email, consent, refCode])

  function validate() {
    if (!EMAIL_RE.test(email)) {
      setError("That email doesn't look right — mind checking it?")
      emailRef.current?.focus()
      return false
    }
    if (!consent) {
      setError('Please tick the consent box so we can email you.')
      return false
    }
    setError('')
    return true
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)
    try {
      const { res, data } = await postJoin()
      if (!res.ok) {
        if (data.code === 'DUPLICATE') {
          // Row already exists — treat as joined so every surface settles.
          markJoined({ email })
          setError('')
        } else {
          setError(data.message || 'Something went wrong saving your spot. Please try again.')
        }
        setSubmitting(false)
        return
      }
      track('waitlist_join', { source })
      if (typeof window !== 'undefined' && window.rdt) window.rdt('track', 'SignUp')
      markJoined({ code: data.code, email })
    } catch (err) {
      console.error(err)
      setError('Network hiccup — please try again.')
    }
    setSubmitting(false)
  }

  async function upgrade() {
    setUpgrading(true)
    try {
      const redirected = await startCheckout(store.email || email, code)
      if (!redirected) setUpgrading(false)
    } catch (err) {
      console.error(err)
      setUpgrading(false)
    }
  }

  function copy() {
    navigator.clipboard.writeText(`https://stacksense.ca/?ref=${code}`).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  /* ---------- success card (shared by hero + form; sticky just disappears) ---------- */
  if (joined) {
    if (variant === 'sticky') return null
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ width: 44, height: 44, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto .9rem' }}>
          <Check size={18} color="var(--teal)" strokeWidth={3} />
        </div>
        <h3 className="h3" style={{ marginBottom: '.4rem' }}>
          {isFounder ? 'Thank you for your payment!' : "You're in."}
        </h3>
        <p className="body-text" style={{ marginBottom: '1.1rem', color: 'var(--text-2)' }}>
          {isFounder
            ? 'Your Founding Member spot and pricing are locked in.'
            : 'Your spot is saved — check your inbox for your referral link.'}
        </p>

        {code && (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: !isFounder ? '1rem' : 0, textAlign: 'left' }}>
            <p style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.55rem', fontFamily: 'var(--font-sans)' }}>
              Share your link — every friend who joins gets you closer to 2 free months.
            </p>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '.5rem .75rem', fontSize: '.73rem', color: 'var(--text-2)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', userSelect: 'all' }}>
                https://stacksense.ca/?ref={code}
              </div>
              <button onClick={copy} className="btn btn-teal" style={{ padding: '.5rem .75rem', minWidth: 85, justifyContent: 'center' }}>
                {copied ? <Check size={14} /> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
          </div>
        )}

        {!isFounder && (
          <div style={{ background: 'rgba(26,140,135,.04)', border: '1px solid rgba(26,140,135,.2)', borderRadius: 10, padding: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}>
              <Star size={14} color="var(--teal)" strokeWidth={2} />
              <span style={{ fontSize: '.83rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text)' }}>
                Want to lock $9.99/mo forever + 6 months free?
              </span>
            </div>
            <p className="small" style={{ marginBottom: '.8rem', lineHeight: 1.55 }}>
              $9.99/mo locked for life — launch price will be $13.99–19.99.
            </p>
            <button onClick={upgrade} disabled={upgrading} className="btn btn-teal" style={{ width: '100%', justifyContent: 'center' }}>
              {upgrading ? 'Redirecting to Stripe…' : 'Become a founding member for $1 →'}
            </button>
          </div>
        )}
      </div>
    )
  }

  /* ---------- capture form ---------- */
  const sticky = variant === 'sticky'
  const busy = submitting || upgrading

  return (
    <form onSubmit={submit} className={`wlc wlc-${variant}`} noValidate>
      {fromLink && !sticky && (
        <span className="pill pill-teal" style={{ marginBottom: '.55rem', alignSelf: 'flex-start' }}>Invited by a friend ✓</span>
      )}

      <div className="wlc-row">
        <label htmlFor={`wlc-email-${variant}`} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          Email address
        </label>
        <input
          id={`wlc-email-${variant}`}
          ref={emailRef}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          className="input"
          value={email}
          onChange={e => { setEmail(e.target.value); if (error) setError('') }}
          required
        />
        <button type="submit" className="btn btn-teal wlc-btn" disabled={!email || !consent || busy}
          style={{ opacity: (!email || !consent || busy) ? .55 : 1 }}>
          {submitting ? 'Joining…' : sticky ? 'Join free' : <>Get early access <ArrowRight size={14} /></>}
        </button>
      </div>

      {error && <div className="wlc-error" role="alert">{error}</div>}

      <label className="wlc-consent">
        <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); if (error) setError('') }} required
          style={{ marginTop: 2, accentColor: 'var(--teal)', width: 14, height: 14, flexShrink: 0 }} />
        <span className="small">
          I'm okay getting launch updates by email, per the{' '}
          <a href="/privacy-policy.html" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Privacy Policy</a>. Unsubscribe anytime.
        </span>
      </label>

      {!sticky && !fromLink && (
        showRef ? (
          <input
            type="text"
            value={refCode}
            onChange={e => setRefCode(e.target.value)}
            placeholder="Referral code"
            className="input"
            aria-label="Referral code"
            style={{ marginTop: '.55rem', textTransform: 'uppercase', maxWidth: 220 }}
          />
        ) : (
          <button type="button" onClick={() => setShowRef(true)} className="wlc-ref-toggle">
            Have a referral code?
          </button>
        )
      )}

      {!sticky && (
        <div className="wlc-micro">
          Free to join. No credit card. Takes 10 seconds.
        </div>
      )}

      <style>{`
        .wlc { display: flex; flex-direction: column; width: 100%; }
        .wlc-row { display: flex; gap: .55rem; width: 100%; }
        .wlc-row .input { flex: 1; min-width: 0; }
        .wlc-btn { justify-content: center; white-space: nowrap; flex-shrink: 0; }
        .wlc-consent { display: flex; align-items: flex-start; gap: .5rem; cursor: pointer; margin-top: .6rem; text-align: left; }
        .wlc-error { font-size: .78rem; color: #c53030; margin-top: .45rem; text-align: left; }
        .wlc-micro { font-size: .72rem; color: var(--text-3); margin-top: .55rem; font-weight: 500; text-align: left; }
        .wlc-ref-toggle { background: none; border: none; padding: .55rem 0; margin-top: .1rem; min-height: 40px; font-size: .75rem; color: var(--teal-deep); cursor: pointer; text-decoration: underline; align-self: flex-start; font-family: var(--font-sans); }
        .wlc-sticky .wlc-consent { margin-top: .35rem; }
        .wlc-sticky .wlc-consent .small { font-size: .68rem; line-height: 1.35; }
        @media (max-width: 560px) {
          .wlc-hero .wlc-row { flex-direction: column; }
          .wlc-hero .wlc-btn { width: 100%; }
        }
      `}</style>
    </form>
  )
}
