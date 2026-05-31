import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

export default function ProductPreview() {
  const [iframeLoading, setIframeLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="product" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="sr" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>Interactive Demo</p>
          <h2 className="h2" style={{ marginBottom: '1rem' }}>
            Try the<span className="teal-text"> live app</span> now
          </h2>
          <p className="lead" style={{ maxWidth: 480, margin: '0 auto' }}>
            Explore active cycles, view half-life decay graphs, track your symptoms, and review AI bloodwork insights.
          </p>
        </div>

        <div className="sr d2" style={{
          background: '#fff', border: '1px solid var(--border)', borderRadius: 22, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,.08)', maxWidth: 860, margin: '0 auto',
          position: 'relative'
        }}>
          {/* Window chrome */}
          <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <div style={{ display: 'flex', gap: '.38rem' }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }}/>)}
            </div>
            <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '.18rem .8rem', fontSize: '.7rem', color: 'var(--text-3)', maxWidth: 260, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
              <Search size={9}/> stacksense.online
            </div>
          </div>

          {/* Live App Demo Iframe */}
          <div style={{ width: '100%', height: '700px', background: 'var(--bg)', position: 'relative' }}>
            {iframeLoading && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fafafa', zIndex: 10
              }}>
                <div style={{
                  width: 36, height: 36,
                  border: '3px solid #1a8c87',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            )}
            <iframe 
              src="https://stacksense.online/?demo=true" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="clipboard-write"
              title="StackSense Live Sandbox Demo"
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        </div>
        <p className="small-text sr-fade" style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          Interactive sandbox · Data is isolated and reset periodically
        </p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
