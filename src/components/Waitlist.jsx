import { useState, useEffect, useRef } from 'react'
import { Mail, User, ArrowRight, Check, Shield, Zap, Clock } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade,.sr-left,.sr-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  async function submit(e) {
    e.preventDefault()
    if (!email || !consent) return
    setIsSubmitting(true)
    try {
      await supabase.from('waitlist').insert([{ 
        email, 
        name: name || null
      }])
    } catch (err) {
      console.error(err)
    }
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <section id="waitlist" ref={ref} className="section-band">
      <div className="wrap">
        <div className="sr" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>Early Access</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            Be first.<span className="teal-text"> Shape the product.</span>
          </h2>
          <p className="lead" style={{ maxWidth: 480, margin: '0 auto' }}>
            Early access members help shape StackSense — and lock in special pricing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }} id="waitlist-grid">
          {/* Form */}
          <div className="card-flat sr-left" style={{ padding: '2rem' }}>
            {!submitted ? (
              <>
                <h3 style={{ fontFamily:'var(--font-sans)', fontSize:'1.1rem', fontWeight:700, marginBottom:'.4rem', color:'var(--text)' }}>Become a Founding Member</h3>
                <p className="body-text" style={{ marginBottom:'1.5rem', color:'var(--teal-deep)', fontWeight:500 }}>
                  Join now for a <strong>$1 waitlist fee</strong> to get the app locked at <strong>$9.99/mo forever</strong> plus <strong>6 months for free</strong>.
                </p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'.45rem', marginBottom:'1.75rem' }}>
                  {['First access when we launch','Priority onboarding support','Lock in your founding-user rate','Influence the roadmap directly'].map(p=>(
                    <li key={p} style={{ display:'flex', alignItems:'center', gap:'.45rem' }}>
                      <Check size={13} color="var(--teal)" strokeWidth={2.5}/>
                      <span className="body-text">{p}</span>
                    </li>
                  ))}
                </ul>
                <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
                  <div>
                    <label htmlFor="wl-name" style={{ display:'block', fontSize:'.76rem', fontWeight:600, color:'var(--text-2)', marginBottom:'.3rem' }}>
                      Name <span style={{ color:'var(--text-3)', fontWeight:400 }}>(optional)</span>
                    </label>
                    <div style={{ position:'relative' }}>
                      <User size={13} color="var(--text-3)" style={{ position:'absolute', left:'.8rem', top:'50%', transform:'translateY(-50%)' }}/>
                      <input id="wl-name" type="text" value={name} onChange={e=>setName(e.target.value)}
                        placeholder="Your name" className="input" style={{ paddingLeft:'2.1rem' }}/>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="wl-email" style={{ display:'block', fontSize:'.76rem', fontWeight:600, color:'var(--text-2)', marginBottom:'.3rem' }}>
                      Email <span style={{ color:'#e53e3e' }}>*</span>
                    </label>
                    <div style={{ position:'relative' }}>
                      <Mail size={13} color="var(--text-3)" style={{ position:'absolute', left:'.8rem', top:'50%', transform:'translateY(-50%)' }}/>
                      <input id="wl-email" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                        required placeholder="you@example.com" className="input" style={{ paddingLeft:'2.1rem' }}/>
                    </div>
                  </div>
                  <label style={{ display:'flex', alignItems:'flex-start', gap:'.55rem', cursor:'pointer', marginTop: '.4rem' }}>
                    <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required
                      style={{ marginTop:2, accentColor:'var(--teal)', width:14, height:14, flexShrink:0 }}/>
                    <span className="small">
                      I agree to StackSense collecting my email for waitlist purposes. See our{' '}
                      <a href="/privacy-policy.html" style={{ color:'var(--teal)', textDecoration:'none' }}>Privacy Policy</a>.
                    </span>
                  </label>
                  <button type="submit" className="btn btn-teal" disabled={!email||!consent||isSubmitting}
                    style={{ width:'100%', justifyContent:'center', marginTop:'.2rem', opacity:(!email||!consent||isSubmitting)?.5:1 }}>
                    {isSubmitting ? 'Joining...' : <>Join the Waitlist <ArrowRight size={14}/></>}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign:'center' }}>
                <div style={{ width:52,height:52,background:'rgba(26,140,135,.1)',border:'1px solid rgba(26,140,135,.2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.2rem' }}>
                  <Check size={20} color="var(--teal)"/>
                </div>
                <h3 className="h3" style={{ marginBottom:'.5rem' }}>You're on the list</h3>
                <p className="body-text">We'll be in touch as we approach launch with details on your $1 waitlist fee and next steps.</p>
              </div>
            )}
          </div>

          {/* Right side — Pricing & what you get */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="card-flat sr-right d1" style={{ padding:'1.5rem' }}>
              <h4 style={{ fontFamily:'var(--font-sans)',fontSize:'.93rem',fontWeight:700,color:'var(--text)',marginBottom:'1rem' }}>Founding Member Pricing</h4>
              <div style={{ display:'flex',alignItems:'baseline',gap:'.4rem',marginBottom:'.25rem' }}>
                <span style={{ fontSize:'2rem',fontWeight:800,fontFamily:'var(--font-sans)',color:'var(--text)',letterSpacing:'-.03em' }}>$9.99</span>
                <span style={{ fontSize:'.82rem',color:'var(--text-3)',fontFamily:'var(--font-sans)' }}>/month forever</span>
              </div>
              <p className="small" style={{ color:'var(--teal-deep)',fontWeight:600,marginBottom:'1.25rem' }}>+ 6 months free when we launch</p>
              <div style={{ borderTop:'1px solid var(--border)',paddingTop:'1rem',display:'flex',flexDirection:'column',gap:'.6rem' }}>
                {[
                  { icon: Shield, text: 'Unlimited protocols & substances' },
                  { icon: Zap, text: 'AI bloodwork analysis & research' },
                  { icon: Clock, text: 'Full dose history & adherence tracking' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display:'flex',alignItems:'center',gap:'.6rem' }}>
                    <div style={{ width:28,height:28,borderRadius:8,background:'rgba(26,140,135,.08)',border:'1px solid rgba(26,140,135,.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <Icon size={13} color="var(--teal)"/>
                    </div>
                    <span className="body-text">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-flat sr-right d2" style={{ padding:'1.25rem',background:'rgba(26,140,135,.03)',borderColor:'rgba(26,140,135,.15)' }}>
              <div style={{ display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.5rem' }}>
                <div style={{ width:6,height:6,borderRadius:'50%',background:'var(--teal)' }}/>
                <span style={{ fontSize:'.78rem',fontWeight:700,fontFamily:'var(--font-sans)',color:'var(--text)' }}>Why $1?</span>
              </div>
              <p className="small" style={{ lineHeight:1.65 }}>
                A small commitment to confirm serious interest. It reserves your spot, locks your rate, and ensures we're building for people who actually want this tool.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){#waitlist-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}

