import { useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react'

// Compare against how people actually track today — evergreen, not fragile niche apps
const cols = [
  { key: 'sheet',   label: 'Spreadsheets' },
  { key: 'notes',   label: 'Notes & reminders' },
  { key: 'generic', label: 'Generic health apps' },
]

const rows = [
  { label: 'Built for supplements & peptides', ss: 'Yes', sheet: 'Manual',  notes: 'Manual', generic: 'No' },
  { label: 'Dosing schedules & cycle phases',  ss: 'Yes', sheet: 'Manual',  notes: 'No',     generic: 'No' },
  { label: 'Smart dose reminders',             ss: 'Yes', sheet: 'No',      notes: 'Basic',  generic: 'No' },
  { label: 'Adherence tracking & analytics',   ss: 'Yes', sheet: 'Manual',  notes: 'No',     generic: 'No' },
  { label: 'AI compound research',             ss: 'Yes', sheet: 'No',      notes: 'No',     generic: 'No' },
  { label: 'AI bloodwork analysis',            ss: 'Yes', sheet: 'No',      notes: 'No',     generic: 'No' },
  { label: '420+ compound library',            ss: 'Yes', sheet: 'No',      notes: 'No',     generic: 'No' },
  { label: 'Everything in one place',          ss: 'Yes', sheet: 'No',      notes: 'No',     generic: 'Partial' },
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
          <CheckCircle2 size={18} color="var(--teal)" strokeWidth={2.5} />
          <span>{val}</span>
        </div>
      )
    }

    let icon, color = 'var(--text-2)', fontWeight = 600
    if (val === 'No') {
      icon = <XCircle size={17} color="#ef4444" opacity={0.7} />
      color = 'var(--text-3)'; fontWeight = 400
    } else if (val === 'Yes') {
      icon = <CheckCircle2 size={17} color="#28c840" opacity={0.7} />
    } else {
      // "Manual", "Basic", "Partial" — possible but not built for it
      icon = <MinusCircle size={17} color="var(--text-3)" opacity={0.5} />
      color = 'var(--text-3)'; fontWeight = 500
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
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>Why StackSense</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            How StackSense <span className="teal-text">compares.</span>
          </h2>
          <p className="lead" style={{ maxWidth: 640, margin: '0 auto' }}>
            Most people track supplements with a spreadsheet, the notes app, or a generic health tracker. None of them are built for doses, cycles, or seeing what's working.
          </p>
        </div>

        <p className="small-text show-mob" style={{ textAlign: 'center', marginBottom: '.75rem' }}>
          Swipe the table sideways to compare →
        </p>
        <div className="sr card-flat" style={{ overflow: 'hidden', padding: '1rem', background: '#fff' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.9rem', fontWeight: 700, color: 'var(--text)' }}></th>
                  <th style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--teal-deep)', background: 'var(--teal-muted)', borderRadius: '12px 12px 0 0', width: '22%' }}>StackSense</th>
                  {cols.map(c => (
                    <th key={c.key} style={{ padding: '1.25rem 1.5rem', fontFamily: 'var(--font-sans)', fontSize: '.9rem', fontWeight: 700, color: 'var(--text-2)', width: '19%' }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} style={{ borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--text)', fontSize: '.95rem' }}>{r.label}</td>

                    {/* StackSense — highlighted column */}
                    <td style={{ padding: '1.25rem 1.5rem', background: 'var(--teal-muted)', fontWeight: 700, color: 'var(--teal-deep)', borderRadius: i === rows.length - 1 ? '0 0 12px 12px' : '0' }}>
                      {renderCell(r.ss, true)}
                    </td>

                    {cols.map(c => (
                      <td key={c.key} style={{ padding: '1.25rem 1.5rem' }}>{renderCell(r[c.key])}</td>
                    ))}
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
