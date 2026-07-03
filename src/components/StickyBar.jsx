import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import WaitlistCapture from './WaitlistCapture'
import { store, JOINED_EVENT } from '../lib/waitlistShared'

const DISMISS_KEY = 'stacksense_sticky_dismissed'

export default function StickyBar() {
  const [pastHero, setPastHero] = useState(false)
  const [joined, setJoined] = useState(() => store.joined)
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === '1' } catch { return false }
  })
  const [foreignFocus, setForeignFocus] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const onJoined = () => setJoined(true)
    window.addEventListener(JOINED_EVENT, onJoined)

    const onScroll = () => {
      const hero = document.getElementById('hero')
      const out = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > window.innerHeight
      setPastHero(out)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Hide while an input elsewhere on the page has focus (mobile keyboard overlap)
    const isField = el => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')
    const onFocusIn = e => {
      if (isField(e.target) && barRef.current && !barRef.current.contains(e.target)) setForeignFocus(true)
    }
    const onFocusOut = () => setTimeout(() => {
      const a = document.activeElement
      if (!isField(a) || (barRef.current && barRef.current.contains(a))) setForeignFocus(false)
    }, 50)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

    return () => {
      window.removeEventListener(JOINED_EVENT, onJoined)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  function dismiss() {
    setDismissed(true)
    try { sessionStorage.setItem(DISMISS_KEY, '1') } catch { /* private mode */ }
  }

  if (joined || dismissed || !pastHero || foreignFocus) return null

  return (
    <div ref={barRef} className="sticky-bar" role="complementary" aria-label="Join the waitlist">
      <div className="sticky-bar-inner">
        <div className="sticky-bar-label">
          <strong>Get early access — free</strong>
          <span className="sticky-bar-sub">$9.99/mo locked for life — launch price will be $13.99–19.99.</span>
        </div>
        <div className="sticky-bar-form">
          <WaitlistCapture variant="sticky" source="sticky" />
        </div>
        <button onClick={dismiss} className="sticky-bar-x" aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
      <style>{`
        .sticky-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 180;
          background: #fff; border-top: 2px solid var(--teal);
          box-shadow: 0 -6px 24px rgba(12,26,24,.08);
          animation: sticky-in .3s ease;
        }
        @keyframes sticky-in { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .sticky-bar-inner {
          max-width: 1160px; margin: 0 auto;
          padding: .6rem 1.25rem;
          /* keep the bar clear of the iPhone home indicator */
          padding-bottom: calc(.6rem + env(safe-area-inset-bottom, 0px));
          display: flex; align-items: center; gap: 1.25rem;
        }
        .sticky-bar-label { display: flex; flex-direction: column; flex-shrink: 0; }
        .sticky-bar-label strong { font-family: var(--font-sans); font-size: .9rem; color: var(--text); }
        .sticky-bar-sub { font-size: .7rem; color: var(--text-3); }
        .sticky-bar-form { flex: 1; min-width: 0; }
        .sticky-bar-x {
          background: none; border: none; cursor: pointer; color: var(--text-3);
          min-width: 44px; min-height: 44px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        @media (max-width: 720px) {
          .sticky-bar-label { display: none; }
          .sticky-bar-inner {
            padding: .5rem .6rem .5rem .8rem;
            padding-bottom: calc(.5rem + env(safe-area-inset-bottom, 0px));
            gap: .25rem;
          }
          .sticky-bar .input { padding: .55rem .8rem; }
        }
      `}</style>
    </div>
  )
}
