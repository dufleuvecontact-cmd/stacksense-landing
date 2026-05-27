import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Features',  href: '#features' },
  { label: 'Product',   href: '#product' },
  { label: 'Timeline',  href: '#timeline' },
  { label: 'Waitlist',  href: '#waitlist' },
  { label: 'Investors', href: '#funding' },
]

export default function Nav() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const linkColor = scrolled ? 'var(--text-2)' : 'rgba(255,255,255,.65)'
  const logoColor = scrolled ? 'var(--text)'   : '#fff'

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        transition: 'background .3s ease, border-color .3s ease, box-shadow .3s ease',
        background: scrolled ? 'rgba(255,255,255,.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,.06)' : 'none',
      }}>
        <nav style={{
          maxWidth: 1160, margin: '0 auto', padding: '0 1.5rem',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', textDecoration: 'none' }}>
            <img src="/logo.png" width="26" height="26" alt="StackSense" style={{ borderRadius: 6, objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '.95rem', letterSpacing: '-.02em', color: logoColor, transition: 'color .3s' }}>
              StackSense
            </span>
          </a>

          <ul id="nav-links" style={{ display: 'flex', gap: '.1rem', listStyle: 'none', alignItems: 'center' }}>
            {links.map(({ label, href }) => (
              <li key={href}>
                <a href={href} style={{
                  fontFamily: 'var(--font-sans)', fontSize: '.875rem', fontWeight: 500,
                  color: linkColor, textDecoration: 'none', padding: '.4rem .75rem',
                  borderRadius: 8, transition: 'color .15s', display: 'block',
                }}
                onMouseEnter={e => e.currentTarget.style.color = scrolled ? 'var(--teal)' : '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = linkColor}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div id="nav-cta">
            <a href="#waitlist" className="btn btn-teal" style={{ fontSize: '.82rem', padding: '.5rem 1.2rem' }}>
              Join Waitlist
            </a>
          </div>

          <button onClick={() => setOpen(o => !o)} id="nav-toggle" style={{
            background: 'none',
            border: `1.5px solid ${scrolled ? 'var(--border)' : 'rgba(255,255,255,.25)'}`,
            color: scrolled ? 'var(--text-2)' : 'rgba(255,255,255,.7)',
            borderRadius: 8, padding: '.35rem', cursor: 'pointer',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color .3s, color .3s',
          }} aria-label="Toggle menu">
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </nav>

        {open && (
          <div style={{
            background: 'rgba(245,247,246,.98)', borderBottom: '1px solid var(--border)',
            padding: '1rem 1.5rem 1.5rem',
          }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.1rem', marginBottom: '1rem' }}>
              {links.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} onClick={() => setOpen(false)} style={{
                    display: 'block', padding: '.65rem .5rem', fontSize: '.9rem',
                    color: 'var(--text-2)', textDecoration: 'none', fontWeight: 500,
                  }}>{label}</a>
                </li>
              ))}
            </ul>
            <a href="#waitlist" className="btn btn-teal" onClick={() => setOpen(false)}
              style={{ width: '100%', justifyContent: 'center' }}>
              Join Waitlist
            </a>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          #nav-links, #nav-cta { display: none !important; }
          #nav-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}
