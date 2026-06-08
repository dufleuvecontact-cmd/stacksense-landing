


const navCols = {
  Product:  [['Features','#features'],['Product Preview','#product'],['Roadmap','#roadmap'],['Join Waitlist','#waitlist']],
  Company:  [['Investors','/investors'],['Contact','#contact']],
  Legal:    [['Privacy Policy','/privacy-policy.html'],['Terms of Use','/terms-of-service.html'],['Data Retention','/data-retention-policy.html'],['Data Requests','mailto:legal@stacksense.online']],
}


export default function Footer() {
  return (
    <footer style={{ background:'var(--bg-dark)', color:'var(--text-inv)' }}>
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
            {[['Privacy Policy','/privacy-policy.html'],['Terms of Use','/terms-of-service.html'],['Data Retention','/data-retention-policy.html'],['Contact','#contact']].map(([l,h]) => (
              <a key={l} href={h} style={{ color:'rgba(255,255,255,.3)',textDecoration:'none',fontSize:'.75rem',fontFamily:'var(--font-sans)',transition:'color .15s' }}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,.6)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.3)'}>{l}</a>
            ))}
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

