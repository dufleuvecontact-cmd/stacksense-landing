import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q:'What is StackSense and who is it for?', a:'StackSense is a health tracking app for people who take supplements, run peptide protocols, or want to understand how their stack affects their body. If you\'ve ever wondered whether your supplements are actually working, this is built for you.' },
  { q:'When will StackSense be available?', a:'We\'re currently in active development. Our target is a limited early access launch for waitlist members first, followed by a broader public launch. Join the waitlist to be among the first notified.' },
  { q:'Is my data private and secure?', a:'Yes. Privacy is foundational to how we build. Your data is encrypted, never sold, and never shared with third parties. You always retain full ownership and control. See our Privacy Policy for full details.' },
  { q:'How does the waitlist referral system work?', a:'When you sign up you\'ll receive a unique referral link. Each person who joins via your link moves you up the priority queue and unlocks tier rewards, including early access, a free first month, and founding member status.' },
  { q:'I\'m an investor. How can I learn more?', a:'We\'d love to connect. StackSense is actively raising a seed round. Reach us at contact@stacksense.ca or request our investor deck. We typically respond within 48 hours.' },
  { q:'Will there be a mobile app?', a:'The web app is fully responsive and works well on mobile. A dedicated mobile app is on our roadmap and a high priority for the post-seed phase.' },
  { q:'Will StackSense be free?', a:'We\'re finalising our pricing model. Founding members who join through the waitlist lock in $9.99/month forever. The current price at release is expected to be between $13.99 and $19.99/month and is still to be decided.' },
]

function Item({ q, a, open, onClick }) {
  return (
    <div style={{ border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', background: open?'#fff':'var(--bg)', transition:'background .2s' }}>
      <button onClick={onClick} style={{ width:'100%',background:'none',border:'none',padding:'1.05rem 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',cursor:'pointer',textAlign:'left',color:'var(--text)',fontFamily:'var(--font-sans)' }} aria-expanded={open}>
        <span style={{ fontSize:'.9rem',fontWeight:600,lineHeight:1.4 }}>{q}</span>
        <ChevronDown size={15} color="var(--text-3)" style={{ flexShrink:0,transform:open?'rotate(180deg)':'none',transition:'transform .22s ease' }}/>
      </button>
      {open && (
        <div style={{ padding:'0 1.25rem 1.05rem',borderTop:'1px solid var(--border)',paddingTop:'.7rem' }}>
          <p className="body-text">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { ref.current.classList.add('in'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="faq" className="section" style={{ background:'var(--bg)' }}>
      <div className="wrap-sm">
        <div className="sr" style={{ textAlign:'center', marginBottom:'2.5rem' }} ref={ref}>
          <p className="eyebrow" style={{ marginBottom:'.75rem' }}>FAQ</p>
          <h2 className="h2">Common questions</h2>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:'.55rem' }}>
          {faqs.map((f,i) => <Item key={i} q={f.q} a={f.a} open={open===i} onClick={()=>setOpen(open===i?null:i)}/>)}
        </div>
      </div>
    </section>
  )
}
