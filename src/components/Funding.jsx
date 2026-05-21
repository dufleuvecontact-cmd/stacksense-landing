import { useEffect, useRef } from 'react'
import { TrendingUp, Target, Users, FileText, ArrowRight, Mail, CheckCircle2 } from 'lucide-react'
import { EMAILS } from '../lib/emails'

const highlights = [
  { icon: TrendingUp, label: 'Stage',    val: 'Seed',        sub: 'Active fundraising', color: '#25b5af' },
  { icon: Target,     label: 'Focus',    val: 'Health-tech', sub: 'Workflow & data',    color: '#25b5af' },
  { icon: Users,      label: 'Traction', val: 'Growing',     sub: 'Waitlist + beta',    color: '#25b5af' },
  { icon: FileText,   label: 'Product',  val: 'Live MVP',    sub: 'Core features done', color: '#25b5af' },
]

const reasons = [
  { title: 'Underserved market',   desc: 'The peptide space has grown substantially yet lacks serious purpose-built tracking infrastructure. We are building that foundation.' },
  { title: 'Working product',      desc: 'This is not a pitch deck — StackSense is a functional product in active development with real user feedback informing every iteration.' },
  { title: 'Defensible data moat', desc: 'As users log more data over time the platform becomes more valuable and harder to replicate. Structured longitudinal data is a significant advantage.' },
  { title: 'Clear growth path',    desc: 'From individual users to practitioners to enterprise — the platform scales across segments with minimal product variation.' },
]

export default function Funding() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.06 })
    ref.current.querySelectorAll('.sr,.sr-fade,.sr-left,.sr-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="funding" ref={ref} className="section" style={{ background: 'var(--bg-dark)' }}>
      <div className="wrap">
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'end', marginBottom: '3.5rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,.07)' }} id="funding-header">
          <div className="sr-left">
            <p style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', fontFamily: 'var(--font-sans)', marginBottom: '1rem' }}>For Investors</p>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 4.5vw, 4rem)',
              lineHeight: .96, letterSpacing: '-.025em', color: '#fff',
            }}>
              Seeking{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--teal-light)' }}>seed-round funding</em>
            </h2>
          </div>
          <div className="sr-right">
            <p style={{ fontSize: '1.1rem', lineHeight: 1.72, color: 'rgba(255,255,255,.5)', fontFamily: 'var(--font-sans)' }}>
              Working product, validated market interest, and a clear path to scale. We're looking for aligned investors who understand the opportunity.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="sr" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(255,255,255,.06)', borderRadius: 16, overflow: 'hidden', marginBottom: '3rem' }}>
          {highlights.map(h => (
            <div key={h.label} style={{ background: 'var(--bg-dark)', padding: '1.5rem 1.25rem' }}>
              <h.icon size={16} color="rgba(255,255,255,.3)" strokeWidth={1.8} style={{ marginBottom: '.75rem' }}/>
              <div style={{ fontSize: '.62rem', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--font-sans)', marginBottom: '.3rem' }}>{h.label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-.02em', fontFamily: 'var(--font-sans)', color: '#fff', marginBottom: '.15rem' }}>{h.val}</div>
              <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.38)', fontFamily: 'var(--font-sans)' }}>{h.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }} id="funding-grid">
          {/* Why invest */}
          <div className="sr-left" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>Why invest in StackSense</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reasons.map(r => (
                <div key={r.title} style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={13} color="var(--teal-light)" style={{ marginTop: 2, flexShrink: 0 }}/>
                  <div>
                    <div style={{ fontSize: '.85rem', fontWeight: 700, marginBottom: '.2rem', fontFamily: 'var(--font-sans)', color: '#fff' }}>{r.title}</div>
                    <p style={{ fontSize: '.85rem', lineHeight: 1.68, color: 'rgba(255,255,255,.42)', fontFamily: 'var(--font-sans)' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="sr-right" style={{ background: 'rgba(26,140,135,.12)', border: '1px solid rgba(26,140,135,.25)', borderRadius: 18, padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="pill pill-white" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>Open to Investment</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '-.025em', marginBottom: '.75rem', lineHeight: 1.2, color: '#fff' }}>
                Ready to discuss the opportunity?
              </h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.72, color: 'rgba(255,255,255,.5)', fontFamily: 'var(--font-sans)', marginBottom: '1.5rem' }}>
                Transparent, focused, and moving fast. If you're an investor with conviction in health-tech infrastructure, we'd love to connect.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.45rem', marginBottom: '2rem' }}>
                {['Investor deck available on request', 'Financials accessible under NDA', 'Founder call within 48 hours'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--teal-light)', flexShrink: 0 }}/>
                    <span style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.5)', fontFamily: 'var(--font-sans)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <a href={`mailto:${EMAILS.legal}`} className="btn btn-teal" style={{ flex: '1 1 auto', justifyContent: 'center', minWidth: 140 }}>
                <Mail size={14}/> Contact Us
              </a>
              <a href={`mailto:${EMAILS.legal}?subject=Investor Deck`} className="btn btn-outline-dark" style={{ flex: '1 1 auto', justifyContent: 'center', minWidth: 140 }}>
                Request Deck <ArrowRight size={13}/>
              </a>
            </div>
          </div>
        </div>

        {/* Founder note */}
        <div className="sr" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '1.75rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }} id="founder-note">
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(26,140,135,.2)', border: '1px solid rgba(26,140,135,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', fontWeight: 800, color: 'var(--teal-light)', flexShrink: 0 }}>SS</div>
          <div>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '.95rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.8, marginBottom: '.7rem' }}>
              "We're building StackSense because we were the users who couldn't find a tool that actually worked for this. The market is real, the pain is real, and the timing is right. We're disciplined builders doing this properly — not rushing it."
            </p>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '.82rem', fontWeight: 700, color: 'rgba(255,255,255,.7)' }}>The StackSense Team</div>
            <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.3)', fontFamily: 'var(--font-sans)' }}>Founders, StackSense</div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:700px){#funding-grid{grid-template-columns:1fr!important}#founder-note{flex-direction:column!important}#funding-header{grid-template-columns:1fr!important}}
        @media(max-width:600px){.sr[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important}}
      `}</style>
    </section>
  )
}
