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
    // Once the bar is permanently gone, stop listening entirely.
    if (joined || dismissed) return

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
    let focusOutTimer = null
    const onFocusOut = () => {
      clearTimeout(focusOutTimer)
      focusOutTimer = setTimeout(() => {
        const a = document.activeElement
        if (!isField(a) || (barRef.current && barRef.current.contains(a))) setForeignFocus(false)
      }, 50)
    }
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)

    return () => {
      window.removeEventListener(JOINED_EVENT, onJoined)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      clearTimeout(focusOutTimer)
    }
  }, [joined, dismissed])

  const visible = !joined && !dismissed && pastHero && !foreignFocus

  // Reserve real document space for the fixed bar so it never permanently
  // covers the footer's legal links or the tail of #contact.
  useEffect(() => {
    if (!visible || !barRef.current) return
    const setPad = () => {
      document.body.style.paddingBottom = (barRef.current?.offsetHeight || 0) + 'px'
    }
    setPad()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(setPad) : null
    ro?.observe(barRef.current)
    return () => {
      ro?.disconnect()
      document.body.style.paddingBottom = ''
    }
  }, [visible])

  // iOS Safari: fixed elements anchor to the layout viewport, which stays
  // behind the software keyboard — lift the bar with the visual viewport while
  // its own input has focus so users can see what they type.
  useEffect(() => {
    if (!visible || typeof window === 'undefined' || !window.visualViewport) return
    const vv = window.visualViewport
    const adjust = () => {
      const el = barRef.current
      if (!el) return
      const offset = window.innerHeight - vv.height - vv.offsetTop
      el.style.transform = offset > 0 ? `translateY(-${offset}px)` : ''
    }
    const detach = () => {
      vv.removeEventListener('resize', adjust)
      vv.removeEventListener('scroll', adjust)
      if (barRef.current) barRef.current.style.transform = ''
    }
    const onFocusIn = e => {
      if (barRef.current && barRef.current.contains(e.target)) {
        vv.addEventListener('resize', adjust)
        vv.addEventListener('scroll', adjust)
        adjust()
      }
    }
    const onFocusOut = e => {
      if (barRef.current && barRef.current.contains(e.target)) detach()
    }
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      detach()
    }
  }, [visible])

  function dismiss() {
    setDismissed(true)
    try { sessionStorage.setItem(DISMISS_KEY, '1') } catch { /* private mode */ }
  }

  if (!visible) return null

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
