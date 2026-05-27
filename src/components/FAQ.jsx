import { useState, useEffect, useRef } from 'react'
import { Plus, Minus } from 'lucide-react'
import { EMAILS } from '../lib/emails'

const faqs = [
  { q: 'What is StackSense and who is it for?',
    a: "StackSense is a structured tracking and workflow management platform for individuals and professionals working with peptide data. It's designed for anyone who wants clarity, consistency, and safety in how they manage their protocols." },
  { q: 'Is my data private and secure?',
    a: 'Yes. Privacy is foundational to how we build. Your data is encrypted, never sold, and never shared with third parties. You always retain full ownership and control. See our Privacy Policy for full details.' },
  { q: 'When will StackSense be available?',
    a: "We're in active development. Our target is a limited early-access launch for waitlist members first, followed by a broader public launch. Join the waitlist to be among the first notified." },
  { q: "I'm an investor. How can I learn more?",
    a: `We'd love to connect. StackSense is actively raising a seed round. Reach us at ${EMAILS.legal} or request our investor deck. We typically respond within 48 hours.` },
  { q: 'Will there be a mobile app?',
    a: 'The web app is fully responsive and works well on mobile. A dedicated native app is on our roadmap and a high priority for the post-seed phase.' },
  { q: 'Will StackSense be free?',
    a: "We're finalising our pricing model. Founding members who join through the waitlist will lock in preferential pricing permanently. We're committed to delivering compelling value at a fair price." },
]

function Item({ q, a, open, onClick }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={onClick} style={{
        width: '100%', background: 'none', border: 'none',
        padding: '1.35rem 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1.5rem', cursor: 'pointer', textAlign: 'left',
      }} aria-expanded={open}>
        <span style={{ fontSize: '.98rem', fontWeight: 600, lineHeight: 1.45, color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>{q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          border: `1px solid ${open ? 'var(--teal)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'var(--teal)' : 'transparent',
          transition: 'background .18s, border-color .18s',
        }}>
          {open
            ? <Minus size={13} color="#fff"/>
            : <Plus  size={13} color="var(--text-3)"/>
          }
        </div>
      </button>
      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows .22s ease',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ fontSize: '.97rem', lineHeight: 1.78, color: 'var(--text-2)', fontFamily: 'var(--font-sans)', paddingBottom: '1.35rem' }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState(new Set([0, 1]))
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ref.current.classList.add('in'); obs.disconnect() }
    }, { threshold: 0.08 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  function toggle(i) {
    setOpenItems(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <section id="faq" className="section" style={{ background: '#fff' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }} id="faq-grid">
          <div className="sr" ref={ref} style={{ position: 'sticky', top: '5.5rem' }}>
            <h2 className="display-sm" style={{ marginBottom: '.75rem' }}>Common questions</h2>
            <p className="body">Everything you need to know before joining.</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }}>
            {faqs.map((f, i) => (
              <Item key={i} q={f.q} a={f.a} open={openItems.has(i)} onClick={() => toggle(i)}/>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:700px){
          #faq-grid{grid-template-columns:1fr!important}
          #faq-grid>div:first-child{position:static!important}
        }
      `}</style>
    </section>
  )
}
