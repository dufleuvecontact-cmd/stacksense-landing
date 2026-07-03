import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q:'I only take a few supplements — is this overkill for me?', a:'No — that\'s exactly who it\'s built for too. If you take 3 things a day, StackSense just tells you whether they\'re doing anything, in about 2 minutes a day. The cycle and protocol tools are there if you ever need them, and invisible if you don\'t.' },
  { q:'Who\'s behind this?', a:'I\'m Jad. I was spending real money on 8 supplements and couldn\'t tell you which one was doing anything. I built the tracker I couldn\'t find. StackSense is founder-built and currently onboarding beta testers.' },
  { q:'Is this medical advice?', a:'No. StackSense tracks and explains — it doesn\'t prescribe. It shows you your own data (doses, how you feel, bloodwork trends) so you can have better conversations with your doctor, not replace them.' },
  { q:'What happens to my email?', a:'Launch updates only. Unsubscribe anytime with one click. Your email is never sold or shared for advertising — details are in our Privacy Policy.' },
  { q:'What does the $1 founding membership actually buy?', a:'$9.99/mo locked for life — launch price will be $13.99–19.99. Founding members also get 6 months free at launch. The $1 is a deposit paid through Stripe, and the $9.99 lock disappears the day we launch.' },
  { q:'When do beta invites go out?', a:'In small batches while we\'re in beta. Everyone on the waitlist hears from us before the public launch — joining now puts you ahead of everyone who waits.' },
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
