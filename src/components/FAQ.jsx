import { useState, useEffect, useRef } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  { q: 'What is StackSense and who is it for?',       a: "StackSense is a structured tracking and workflow management platform for individuals and professionals working with peptide data. It's designed for anyone who wants clarity, consistency, and safety in how they manage their protocols." },
  { q: 'When will StackSense be available?',           a: "We're currently in active development. Our target is a limited early access launch for waitlist members first, followed by a broader public launch. Join the waitlist to be among the first notified." },
  { q: 'Is my data private and secure?',               a: 'Yes. Privacy is foundational to how we build. Your data is encrypted, never sold, and never shared with third parties. You always retain full ownership and control. See our Privacy Policy for full details.' },
  { q: 'How does the waitlist referral system work?',  a: "When you sign up you'll receive a unique referral link. Each person who joins via your link moves you up the priority queue and unlocks tier rewards — including early access, a free first month, and founding member status." },
  { q: "I'm an investor. How can I learn more?",       a: "We'd love to connect. StackSense is actively raising a seed round. Reach us at invest@stacksense.io or request our investor deck. We typically respond within 48 hours." },
  { q: 'Will there be a mobile app?',                  a: 'The web app is fully responsive and works well on mobile. A dedicated mobile app is on our roadmap and a high priority for the post-seed phase.' },
  { q: 'Will StackSense be free?',                     a: "We're finalising our pricing model. Founding members who join through the waitlist will receive preferential pricing. We're committed to offering compelling value at a fair price." },
]

function Item({ q, a, open, onClick }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={onClick} style={{
        width: '100%', background: 'none', border: 'none',
        padding: '1.4rem 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1.5rem', cursor: 'pointer', textAlign: 'left',
      }} aria-expanded={open}>
        <span style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.45, color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>{q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'var(--teal)' : 'transparent',
          transition: 'background .18s, border-color .18s',
        }}>
          {open
            ? <Minus size={13} color="#fff"/>
            : <Plus size={13} color="var(--text-3)"/>
          }
        </div>
      </button>
      {open && (
        <div style={{ paddingBottom: '1.4rem' }}>
          <p style={{ fontSize: '1rem', lineHeight: 1.78, color: 'var(--text-2)', fontFamily: 'var(--font-sans)' }}>{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { ref.current.classList.add('in'); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="faq" className="section" style={{ background: '#fff' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }} id="faq-grid">
          {/* Left: heading */}
          <div className="sr" ref={ref} style={{ position: 'sticky', top: '5.5rem' }}>
            <h2 className="display-sm" style={{ marginBottom: '.75rem' }}>Common questions</h2>
            <p className="body">Everything you need to know before joining.</p>
          </div>

          {/* Right: accordion */}
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {faqs.map((f, i) => (
              <Item key={i} q={f.q} a={f.a} open={open === i} onClick={() => setOpen(open === i ? null : i)}/>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:700px){#faq-grid{grid-template-columns:1fr!important}#faq-grid>div:first-child{position:static!important}}`}</style>
    </section>
  )
}
