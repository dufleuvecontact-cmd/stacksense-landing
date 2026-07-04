import { track } from '@vercel/analytics'

// Shared join state — every capture surface (hero, sticky bar, waitlist form)
// reads and writes the same flags so success in one place flips them all.
const JOINED_KEY = 'stacksense_joined'
const CODE_KEY = 'stacksense_code'
const EMAIL_KEY = 'stacksense_email'
const FOUNDER_KEY = 'stacksense_founder'

export const JOINED_EVENT = 'stacksense:joined'
export const FOUNDING_EVENT = 'stacksense:founding'
export const FOUNDING_SETTLED_EVENT = 'stacksense:founding-settled'
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// In-memory mirror so joins still stick for the lifetime of the page when
// localStorage is unavailable (Safari private mode, storage-blocked contexts).
const mem = new Map()
function lsGet(key) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? v : (mem.get(key) ?? null)
  } catch { return mem.get(key) ?? null }
}
function lsSet(key, val) {
  mem.set(key, val)
  try { localStorage.setItem(key, val) } catch { /* private mode */ }
}

export const store = {
  get joined() { return lsGet(JOINED_KEY) === '1' },
  get code() { return lsGet(CODE_KEY) || '' },
  get email() { return lsGet(EMAIL_KEY) || '' },
  get founder() { return lsGet(FOUNDER_KEY) === '1' },
}

export function markJoined({ code, email, founder } = {}) {
  lsSet(JOINED_KEY, '1')
  if (code) lsSet(CODE_KEY, code)
  if (email) lsSet(EMAIL_KEY, email)
  if (founder) lsSet(FOUNDER_KEY, '1')
  window.dispatchEvent(new CustomEvent(JOINED_EVENT, { detail: { code, founder } }))
}

// Redirect to Stripe checkout. Returns false if it did NOT redirect (so caller can re-enable UI).
export async function startCheckout(checkoutEmail, checkoutCode) {
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
    alert('Failed to initiate payment. Please try again or contact contact@stacksense.ca.')
  }
  return false
}

// Parsed once at module load: ?ref= (safe to read during import evaluation).
let refFromUrl = ''
export function getUrlRef() { return refFromUrl }

if (typeof window !== 'undefined') {
  refFromUrl = (new URLSearchParams(window.location.search).get('ref') || '').toUpperCase()
}

// Stripe return params — consumed from App's mount effect (not at import time)
// so analytics inject() has run, JOINED_EVENT listeners are bound, and
// #waitlist exists in the DOM. The flag keeps this idempotent under
// StrictMode's dev double-invoke.
let consumed = false
export function consumeReturnParams() {
  if (consumed || typeof window === 'undefined') return
  consumed = true
  const p = new URLSearchParams(window.location.search)

  if (p.get('payment') === 'success') {
    // Payment status is updated server-side via Stripe webhook.
    // No code param on the DUPLICATE-join path — still mark founder.
    markJoined({ code: p.get('code') || undefined, founder: true })
    track('founding_upgrade')
    window.history.replaceState(null, '', window.location.pathname + '#waitlist')
    setTimeout(() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }
  if (p.get('payment') === 'cancel') {
    window.history.replaceState(null, '', window.location.pathname + '#waitlist')
    setTimeout(() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }
}
