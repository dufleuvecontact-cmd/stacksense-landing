import { useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, HelpCircle, MinusCircle } from 'lucide-react'

const features = [
  { label: 'Platform', ss: 'All devices (PWA)', peptiq: 'iOS / Android', peptrc: 'iOS only', smartpt: 'Android only' },
  { label: 'Compound library', ss: '420+', peptiq: '35+', peptrc: '~20', smartpt: '200+' },
  { label: 'Supplement tracking', ss: 'Yes', peptiq: 'No', peptrc: 'No', smartpt: 'No' },
  { label: 'Bioavailability calc', ss: 'Yes', peptiq: 'No', peptrc: 'No', smartpt: 'No' },
  { label: 'App Store required', ss: 'No', peptiq: 'Yes', peptrc: 'Yes', smartpt: 'Yes' },
  { label: 'Symptom analytics', ss: 'Yes', peptiq: 'No', peptrc: 'No', smartpt: 'No' },
]

export default function Comparison() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade,.sr-left,.sr-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const renderCell = (val, isSS = false) => {
    if (isSS) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          {val === 'Yes' ? <CheckCircle2 size={18} color="var(--teal)" strokeWidth={2.5}/> : <CheckCircle2 size={18} color="var(--teal)" strokeWidth={2.5}/>}
          <span>{val}</span>
        </div>
      )
    }

    let icon = null;
    let color = 'var(--text-2)';
    let fontWeight = 600;

    if (val === 'No' || val === 'Yes' && !isSS) {
      icon = val === 'No' ? <XCircle size={17} color="#ef4444" opacity={0.7}/> : <CheckCircle2 size={17} color="#28c840" opacity={0.7}/>
      color = val === 'No' ? 'var(--text-3)' : 'var(--text-2)'
      fontWeight = val === 'No' ? 400 : 600
    } else {
      icon = <MinusCircle size={17} color="var(--text-3)" opacity={0.5}/>
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color, fontWeight }}>
        {icon}
        <span>{val}</span>
      </div>
    )
  }

  return (
    <section id="comparison" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="sr" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>The 10X difference</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            How StackSense <span className="teal-text">compares.</span>
          </h2>
          <p className="lead" style={{ maxWidth: 620, margin: '0 auto' }}>
            Most tracking apps are built for one thing. StackSense tracks everything — supplements, peptides, bloodwork, mood, and body composition — so you can finally see the full picture.
          </p>
        </div>

        <div className="sr card-flat" style={{ overflow: 'hidden', padding: '1rem', background: '#fff' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.9rem', fontWeight: 700, color: 'var(--text)' }}>Feature</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--teal-deep)', background: 'var(--teal-muted)', borderRadius: '12px 12px 0 0', width: '22%' }}>StackSense</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.9rem', fontWeight: 700, color: 'var(--text-2)', width: '19%' }}>PeptIQ</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.9rem', fontWeight: 700, color: 'var(--text-2)', width: '19%' }}>Smart Peptide Tracker</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.9rem', fontWeight: 700, color: 'var(--text-2)', width: '19%' }}>PepTracker</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={f.label} style={{ borderBottom: i === features.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text)', fontSize: '.95rem' }}>{f.label}</td>
                    
                    {/* StackSense Column */}
                    <td style={{ padding: '1.25rem 1.5rem', background: 'var(--teal-muted)', fontWeight: 700, color: 'var(--teal-deep)', borderRadius: i === features.length - 1 ? '0 0 12px 12px' : '0' }}>
                      {renderCell(f.ss, true)}
                    </td>

                    <td style={{ padding: '1.25rem 1.5rem' }}>{renderCell(f.peptiq)}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>{renderCell(f.smartpt)}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>{renderCell(f.peptrc)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
