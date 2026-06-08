import { useEffect, useRef } from 'react'
import { Activity, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react'

export default function BloodworkAI() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    ref.current.querySelectorAll('.sr,.sr-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="bloodwork" ref={ref} className="section" style={{ background: '#fff' }}>
      <div className="wrap">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center' }}>
          
          <div className="sr" style={{ textAlign: 'center' }}>
            <p className="eyebrow" style={{ marginBottom: '.75rem' }}>AI bloodwork analysis</p>
            <h2 className="h2" style={{ marginBottom: '1rem' }}>
              Your bloodwork,<br/>
              <span className="teal-text"> actually explained.</span>
            </h2>
            <p className="lead" style={{ maxWidth: 520, margin: '0 auto' }}>
              Upload your lab results. StackSense's AI flags what's out of range, summarizes key findings, and gives you questions to bring to your doctor — in plain language.
            </p>
          </div>

          <div className="sr d2" style={{
            width: '100%',
            maxWidth: 600,
            background: 'var(--bg)',
            borderRadius: 24,
            padding: '2rem',
            boxShadow: '0 12px 32px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.8)',
            border: '1px solid var(--border)'
          }}>
            {/* Uploaded File Item */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: 16, marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText color="var(--teal)" size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.15rem' }}>LabCorp_Comprehensive_Panel_Oct.pdf</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>1.2 MB • Uploaded Today</div>
              </div>
              <CheckCircle2 color="var(--teal)" size={22} />
            </div>

            {/* AI Summary Card */}
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ background: 'var(--teal-light)', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(26, 140, 135, 0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--teal)" />
                <span style={{ fontWeight: 600, color: 'var(--teal)', fontSize: '0.9rem' }}>AI Summary Generation</span>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <AlertTriangle size={16} color="#eab308" />
                  Key Findings to Review
                </h4>
                
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                    <div style={{ marginTop: '0.2rem' }}><ChevronRight size={14} color="var(--teal)" /></div>
                    <div><strong>Testosterone (Free)</strong> is slightly below optimal range at <strong>8.2 pg/mL</strong> (Optimal: 10-25 pg/mL).</div>
                  </li>
                  <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                    <div style={{ marginTop: '0.2rem' }}><ChevronRight size={14} color="var(--teal)" /></div>
                    <div><strong>Cortisol</strong> is elevated at <strong>22.4 mcg/dL</strong>. This may indicate acute stress or overtraining.</div>
                  </li>
                  <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                    <div style={{ marginTop: '0.2rem' }}><ChevronRight size={14} color="var(--teal)" /></div>
                    <div><strong>Estradiol</strong> is well managed at <strong>24 pg/mL</strong>, in the ideal range.</div>
                  </li>
                </ul>

                <div style={{ background: 'var(--bg)', padding: '1rem', borderRadius: 12 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
                    Questions for your doctor
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.4, fontStyle: 'italic' }}>
                    "Given the elevated cortisol and lower free testosterone, could my current training volume be impacting my recovery and hormone production?"
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
