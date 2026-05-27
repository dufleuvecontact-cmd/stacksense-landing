import { useCallback, useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { EMAILS } from '../lib/emails'
import { supabase } from '../supabaseClient'

const STORAGE_KEY = 'stacksense_cookie_consent'


const navCols = {
  Product:  [['Features','#features'],['Product Preview','#product'],['Roadmap','#roadmap'],['Join Waitlist','#waitlist']],
  Company:  [['Our Journey','#timeline'],['Investors','#funding'],['FAQ','#faq'],['Contact',`mailto:${EMAILS.contact}`]],
  Legal:    [['Privacy Policy','/privacy-policy.html'],['Terms of Use','/terms-of-service.html'],['Data Retention','/data-retention-policy.html'],['Data Requests',`mailto:${EMAILS.privacy}`]],
}

const socials = [
  { Icon: Mail, href: `mailto:${EMAILS.contact}` },
]

function UnsubscribeModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | notfound | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    const { data, error } = await supabase
      .from('waitlist')
      .delete()
      .eq('email', email.trim().toLowerCase())
      .select('id')
    if (error) { setStatus('error'); return }
    setStatus(data && data.length > 0 ? 'done' : 'notfound')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 24px 60px rgba(0,0,0,.18)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 4 }}>
          <X size={16} />
        </button>

        {status === 'done' ? (
          <div style={{ textAlign: 'center', paddingTop: '.5rem' }}>
            <div style={{ width: 48, height: 48, background: 'rgba(26,140,135,.1)', border: '1px solid rgba(26,140,135,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Check size={18} color="var(--teal)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.4rem' }}>You've been removed</h3>
            <p className="small" style={{ marginBottom: '1.25rem' }}>Your email has been deleted from the StackSense waitlist.</p>
            <button onClick={onClose} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '.88rem' }}>Close</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '.3rem' }}>Unsubscribe from waitlist</h3>
            <p className="small" style={{ marginBottom: '1.5rem' }}>Enter your email to remove yourself from the StackSense waitlist. This cannot be undone.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={13} color="var(--text-3)" style={{ position: 'absolute', left: '.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com" className="input" style={{ paddingLeft: '2.1rem' }} />
              </div>
              {status === 'notfound' && (
                <p style={{ fontSize: '.78rem', color: '#e53e3e', margin: 0 }}>No waitlist entry found for that email.</p>
              )}
              {status === 'error' && (
                <p style={{ fontSize: '.78rem', color: '#e53e3e', margin: 0 }}>Something went wrong. Please try again.</p>
              )}
              <button type="submit" className="btn btn-teal" disabled={!email || status === 'loading'}
                style={{ width: '100%', justifyContent: 'center', opacity: (!email || status === 'loading') ? .6 : 1 }}>
                {status === 'loading' ? 'Removing…' : 'Remove me from waitlist'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function Footer() {
  const [resetKey, setResetKey] = useState(0)
  const [showUnsub, setShowUnsub] = useState(false)

  const openCookieSettings = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
    // Force CookieBanner to re-render by triggering a storage event
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: null }))
    // Fallback: reload so banner re-appears
    window.location.reload()
  }, [])

  return (
    <footer style={{ background:'var(--bg-dark)', color:'var(--text-inv)' }}>
      {showUnsub && <UnsubscribeModal onClose={() => setShowUnsub(false)} />}
      {/* Privacy Policy */}
      <section id="privacy" style={{ maxWidth:940,margin:'0 auto',padding:'4.5rem 1.5rem 0' }}>
        <div style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:'2rem',marginBottom:'3.5rem' }}>
          <h3 style={{ fontFamily:'var(--font-sans)',fontSize:'1rem',fontWeight:700,marginBottom:'1.25rem',color:'var(--text-inv)' }}>Privacy Policy</h3>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:'1.25rem',fontSize:'.82rem',color:'rgba(255,255,255,.5)',lineHeight:1.72 }}>
            {[
              ['What we collect','When you join the waitlist, we collect your email address and optionally your name. If you use the referral system, we also collect referral activity data. We use standard analytics tools to understand how visitors use the site.'],
              ['How we use it','Your email is used solely to communicate about StackSense — launch updates, early access invitations, and product news. We do not sell or share your personal data with third parties. Referral data is used only to manage waitlist queue position.'],
              ['Cookies & tracking','We use standard cookies for session management and analytics to measure site usage. You can opt out or disable cookies in your browser settings at any time.'],
              ['Data storage & security','All data is stored securely using industry-standard encryption at rest and in transit. We retain waitlist data until launch or until you request deletion.'],
              ['Your rights',`You can request access to, correction of, or deletion of your data at any time. Contact us at ${EMAILS.privacy} and we will respond within 5 business days.`],
              ['Consent','By submitting the waitlist form, you explicitly consent to us storing your email for waitlist communications. You can withdraw consent at any time by emailing us.'],
            ].map(([title, body]) => (
              <div key={title}>
                <p style={{ fontWeight:600,color:'rgba(255,255,255,.78)',marginBottom:'.3rem' }}>{title}</p>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop:'1.25rem',fontSize:'.73rem',color:'rgba(255,255,255,.3)',borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:'.75rem' }}>
            Last updated: April 2026. Questions? <a href={`mailto:${EMAILS.privacy}`} style={{ color:'var(--teal-light)',textDecoration:'none' }}>{EMAILS.privacy}</a>
          </p>
        </div>
      </section>

      {/* Main footer */}
      <div style={{ maxWidth:1160,margin:'0 auto',padding:'3rem 1.5rem 0' }}>
        {/* Regulatory disclaimer */}
        <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:14, padding:'1.5rem', marginBottom:'3rem' }}>
          <h4 style={{ fontSize:'.75rem', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,.6)', marginBottom:'.4rem', fontFamily:'var(--font-sans)' }}>Regulatory Disclaimer</h4>
          <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.45)', lineHeight:1.65, fontFamily:'var(--font-sans)' }}>
            StackSense is a personal tracking and logging tool. We do not sell, recommend, or prescribe any compounds. Always consult a healthcare provider.
          </p>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'2.5rem',marginBottom:'3rem' }} id="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:'.55rem',marginBottom:'1rem' }}>
              <img src="/logo.png" width="26" height="26" alt="StackSense Logo" style={{ borderRadius: 6, objectFit: 'contain' }} />
              <span style={{ fontFamily:'var(--font-sans)',fontWeight:700,fontSize:'.95rem',letterSpacing:'-.02em' }}>StackSense</span>
            </div>
            <p style={{ fontSize:'.82rem',color:'rgba(255,255,255,.45)',lineHeight:1.7,maxWidth:265,marginBottom:'1.25rem' }}>
              A structured platform for tracking, managing, and analysing peptide workflows. Built for precision. Designed for clarity.
            </p>
            <div style={{ display:'flex',gap:'.45rem' }}>
              {socials.map(({ Icon, href }, i) => (
                <a key={i} href={href} style={{ width:32,height:32,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.45)',transition:'all .2s',textDecoration:'none' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(26,140,135,.5)'; e.currentTarget.style.color='#25b5af'; e.currentTarget.style.background='rgba(26,140,135,.1)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.08)'; e.currentTarget.style.color='rgba(255,255,255,.45)'; e.currentTarget.style.background='rgba(255,255,255,.06)' }}>
                  <Icon size={14}/>
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(navCols).map(([cat, links]) => (
            <div key={cat}>
              <h4 style={{ fontSize:'.68rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:'.9rem',fontFamily:'var(--font-sans)' }}>{cat}</h4>
              <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:'.5rem' }}>
                {links.map(([label,href]) => (
                  <li key={label}>
                    <a href={href} style={{ color:'rgba(255,255,255,.5)',textDecoration:'none',fontSize:'.83rem',transition:'color .15s',fontFamily:'var(--font-sans)' }}
                      onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.85)'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.5)'}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,.07)',padding:'1.5rem 0',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'.75rem' }}>
          <p style={{ fontSize:'.76rem',color:'rgba(255,255,255,.3)',fontFamily:'var(--font-sans)' }}>© 2026 StackSense Inc. All rights reserved.</p>
          <div style={{ display:'flex',gap:'1.25rem',flexWrap:'wrap' }}>
            {[['Privacy Policy','/privacy-policy.html'],['Terms of Use','/terms-of-service.html'],['Data Retention','/data-retention-policy.html'],['Security',`mailto:${EMAILS.security}`],['Contact',`mailto:${EMAILS.contact}`]].map(([l,h]) => (
              <a key={l} href={h} style={{ color:'rgba(255,255,255,.3)',textDecoration:'none',fontSize:'.75rem',fontFamily:'var(--font-sans)',transition:'color .15s' }}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.6)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}>{l}</a>
            ))}
            <button
              onClick={openCookieSettings}
              style={{ background:'none',border:'none',padding:0,cursor:'pointer',color:'rgba(255,255,255,.3)',fontSize:'.75rem',fontFamily:'var(--font-sans)',transition:'color .15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.6)'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}
            >Cookie Settings</button>
            <button
              onClick={() => setShowUnsub(true)}
              style={{ background:'none',border:'none',padding:0,cursor:'pointer',color:'rgba(255,255,255,.3)',fontSize:'.75rem',fontFamily:'var(--font-sans)',transition:'color .15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.6)'}
              onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}
            >Unsubscribe</button>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:700px){ #footer-grid{grid-template-columns:1fr 1fr!important} }
        @media(max-width:440px){ #footer-grid{grid-template-columns:1fr!important} }
      `}</style>
    </footer>
  )
}
