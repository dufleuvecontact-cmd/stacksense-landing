import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'stacksense_cookie_consent'

function getConsentStatus() {
  try {
    return localStorage.getItem(STORAGE_KEY) // "accepted" | "declined" | null
  } catch {
    return null
  }
}

function initAnalytics() {
  // Gate: only called after explicit acceptance.
  // Wire PostHog/Plausible here when added.
  // e.g. posthog.init('YOUR_KEY', { api_host: 'https://app.posthog.com' })
}

function removeAnalytics() {
  // Called on decline or revocation.
  // e.g. posthog.opt_out_capturing()
}

export default function CookieBanner() {
  // Consent is known synchronously — lazy init avoids a post-mount state flip
  const [visible, setVisible] = useState(() => !getConsentStatus())
  const acceptRef = useRef(null)
  const bannerRef = useRef(null)

  useEffect(() => {
    if (getConsentStatus() === 'accepted') initAnalytics()
    // declined → nothing loads
  }, [])

  // Trap focus inside banner while visible
  useEffect(() => {
    if (!visible) return
    const el = bannerRef.current
    if (!el) return

    const focusable = el.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    function onKeyDown(e) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }

    el.addEventListener('keydown', onKeyDown)
    acceptRef.current?.focus()
    return () => el.removeEventListener('keydown', onKeyDown)
  }, [visible])

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch { /* private mode */ }
    initAnalytics()
    setVisible(false)
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, 'declined') } catch { /* private mode */ }
    removeAnalytics()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(10,18,24,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      <div style={{ flex: '1 1 320px', minWidth: 0 }}>
        <p id="cookie-banner-title" style={{ fontSize: '.83rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
          <span style={{ display: 'block' }}>
            We use essential cookies to keep you logged in, and optional analytics cookies to improve the product. No advertising cookies, ever.
          </span>
          <span style={{ display: 'block', marginTop: '.35rem', color: 'rgba(255,255,255,0.45)', fontSize: '.78rem' }}>
            Nous utilisons des cookies essentiels pour maintenir votre session, et des cookies d&apos;analyse optionnels pour améliorer le produit. Aucun cookie publicitaire, jamais.
          </span>
        </p>
      </div>

      <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', flex: '1 1 auto', minWidth: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: '.5rem 1rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            color: 'rgba(255,255,255,0.65)',
            fontSize: '.8rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all .15s',
            flex: '1 1 auto',
            textAlign: 'center',
            minWidth: '140px',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
        >
          Essential only / Essentiel seulement
        </button>
        <button
          ref={acceptRef}
          onClick={accept}
          style={{
            padding: '.5rem 1.1rem',
            background: 'var(--teal-light, #25b5af)',
            border: '1px solid transparent',
            borderRadius: 8,
            color: '#fff',
            fontSize: '.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'opacity .15s',
            flex: '1 1 auto',
            textAlign: 'center',
            minWidth: '140px',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          Accept all / Tout accepter
        </button>
      </div>
    </div>
  )
}
