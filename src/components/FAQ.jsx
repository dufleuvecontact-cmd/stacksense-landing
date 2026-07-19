import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q:'I only coach a couple of clients — is this overkill?', a:'No — whether you run 3 clients or 300, roster and adherence tracking work the same. The protocol library and AI research tools are there when you need them, and invisible when you don\'t.' },
  { q:'Who\'s behind this?', a:'I\'m Jad. I started tracking my own supplements because I couldn\'t tell what was working, then kept hearing the same problem from coaches: clients say they\'re compliant, and there\'s no way to check. StackSense is founder-built and currently onboarding founding coaches.' },
  { q:'Is this medical advice?', a:'No. StackSense tracks and explains — it doesn\'t prescribe or replace your clinical judgment. It gives you your client\'s own data (adherence, how they feel, bloodwork trends, once shared) so you can make better calls, not a diagnosis engine.' },
  { q:'What can I actually see about a client?', a:'Dose adherence by default, once they\'ve accepted your invite. Symptoms and bloodwork only if they\'ve explicitly consented to share that scope — they control it from their own app at any time.' },
  { q:'What does the $1 founding membership actually buy?', a:'$9.99/mo locked for life — launch price will be $13.99–19.99. Founding coaches also get 6 months free at launch. The $1 is a deposit paid through Stripe, and the $9.99 lock disappears the day we launch. The deposit is fully refundable any time before launch — just reply to any of our emails.' },
  { q:'When do beta invites go out?', a:'In small batches while we\'re in beta. Everyone on the waitlist hears from us before the public launch — joining now puts you ahead of everyone who waits.' },
]

function Item({ q, a, open, onClick, i }) {
  return (
    <div style={{ border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', background: open?'#fff':'var(--bg)', transition:'background .2s' }}>
      <h3 style={{ margin:0 }}>
        <button onClick={onClick} className="faq-q" id={`faq-q-${i}`} aria-controls={`faq-a-${i}`} style={{ width:'100%',background:'none',border:'none',padding:'1.05rem 1.25rem',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',cursor:'pointer',textAlign:'left',color:'var(--text)',fontFamily:'var(--font-sans)' }} aria-expanded={open}>
          <span style={{ fontSize:'.9rem',fontWeight:600,lineHeight:1.4 }}>{q}</span>
          <ChevronDown size={15} color="var(--text-3)" style={{ flexShrink:0,transform:open?'rotate(180deg)':'none',transition:'transform .22s ease' }}/>
        </button>
      </h3>
      {open && (
        <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} style={{ padding:'0 1.25rem 1.05rem',borderTop:'1px solid var(--border)',paddingTop:'.7rem' }}>
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
          {faqs.map((f,i) => <Item key={i} i={i} q={f.q} a={f.a} open={open===i} onClick={()=>setOpen(open===i?null:i)}/>)}
        </div>
      </div>
    </section>
  )
}
