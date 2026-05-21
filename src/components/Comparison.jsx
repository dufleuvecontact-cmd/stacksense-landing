import { useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react'

const features = [
  { label: 'Peptide protocols', ss: 'Yes', mfp: 'No', sheet: 'Manual', crono: 'No' },
  { label: 'Bioavailability calc', ss: 'Yes', mfp: 'No', sheet: 'No', crono: 'No' },
  { label: 'Cycle tracking', ss: 'Yes', mfp: 'No', sheet: 'Manual', crono: 'No' },
  { label: '420+ compounds', ss: 'Yes', mfp: 'No', sheet: 'DIY', crono: 'Limited' },
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

  return (
    <section id="comparison" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }} id="compare-header">
          <div className="sr-left">
            <h2 className="display-md">
              Why spreadsheets{' '}
              <em className="teal-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>fail you.</em>
            </h2>
          </div>
          <div className="sr-right">
            <p className="lead">
              Generic calorie trackers don't understand peptide half-lives. Spreadsheets require endless manual maintenance. Here is how StackSense stacks up.
            </p>
          </div>
        </div>

        <div className="sr" style={{
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,.04)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-3)', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>Feature</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 800, color: '#fff', background: 'var(--teal-deep)', width: '22%', borderBottom: '1px solid var(--teal-deep)' }}>StackSense</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-2)', background: 'var(--bg)', width: '19%', borderBottom: '1px solid var(--border)' }}>MyFitnessPal</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-2)', background: 'var(--bg)', width: '19%', borderBottom: '1px solid var(--border)' }}>Spreadsheets</th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.85rem', fontWeight: 600, color: 'var(--text-2)', background: 'var(--bg)', width: '19%', borderBottom: '1px solid var(--border)' }}>Cronometer</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={f.label}>
                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600, fontFamily: 'var(--font-sans)', color: 'var(--text)', fontSize: '.9rem', borderBottom: i === features.length - 1 ? 'none' : '1px solid var(--border)', background: i % 2 === 1 ? 'rgba(0,0,0,.01)' : '#fff' }}>{f.label}</td>

                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 700, color: '#fff', background: i % 2 === 1 ? 'rgba(13,107,103,.92)' : 'var(--teal-deep)', borderBottom: i === features.length - 1 ? 'none' : '1px solid rgba(255,255,255,.12)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <CheckCircle2 size={16} color="rgba(255,255,255,.85)" strokeWidth={2.5}/>
                        <span style={{ fontSize: '.88rem' }}>{f.ss}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-3)', borderBottom: i === features.length - 1 ? 'none' : '1px solid var(--border)', background: i % 2 === 1 ? 'rgba(0,0,0,.01)' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <XCircle size={15} color="#ef4444" opacity={0.6}/>
                        <span style={{ fontSize: '.88rem' }}>{f.mfp}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1.1rem 1.5rem', color: f.sheet === 'No' ? 'var(--text-3)' : 'var(--text-2)', fontWeight: f.sheet !== 'No' ? 600 : 400, borderBottom: i === features.length - 1 ? 'none' : '1px solid var(--border)', background: i % 2 === 1 ? 'rgba(0,0,0,.01)' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        {f.sheet === 'No' ? <XCircle size={15} color="#ef4444" opacity={0.6}/> : <HelpCircle size={15} color="#f59e0b"/>}
                        <span style={{ fontSize: '.88rem' }}>{f.sheet}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1.1rem 1.5rem', color: f.crono === 'No' ? 'var(--text-3)' : 'var(--text-2)', fontWeight: f.crono !== 'No' ? 600 : 400, borderBottom: i === features.length - 1 ? 'none' : '1px solid var(--border)', background: i % 2 === 1 ? 'rgba(0,0,0,.01)' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        {f.crono === 'No' ? <XCircle size={15} color="#ef4444" opacity={0.6}/> : <HelpCircle size={15} color="#f59e0b"/>}
                        <span style={{ fontSize: '.88rem' }}>{f.crono}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:700px){#compare-header{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
