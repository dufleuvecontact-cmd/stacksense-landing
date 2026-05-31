import { useEffect, useRef, useState } from 'react'

export default function ProductPreview() {
  const [iframeLoading, setIframeLoading] = useState(true)
  const [scale, setScale] = useState(1)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } })
    }, { threshold: 0.08 })
    ref.current.querySelectorAll('.sr,.sr-fade').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      // Target device total width is 454px (430px screen + 24px bezel)
      if (width < 520) {
        setScale((width - 40) / 454)
      } else {
        setScale(1)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section id="product" ref={ref} className="section" style={{ background: 'var(--bg)', overflow: 'hidden' }}>
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

        {/* iPhone 14 Pro Max Container */}
        <div className="sr d2" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: `${956 * scale}px`,
          margin: '0 auto',
          position: 'relative',
          overflow: 'visible'
        }}>
          {/* Scale wrapper */}
          <div style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            position: 'absolute',
            width: '454px',
            height: '956px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* iPhone Device Frame */}
            <div className="iphone-device">
              {/* Silent Button */}
              <div className="iphone-btn silent" />
              {/* Volume Up Button */}
              <div className="iphone-btn vol-up" />
              {/* Volume Down Button */}
              <div className="iphone-btn vol-down" />
              {/* Power Button */}
              <div className="iphone-btn power" />

              {/* iPhone Screen Wrapper */}
              <div className="iphone-screen">
                {/* Dynamic Island */}
                <div className="iphone-dynamic-island">
                  <div className="camera-lens" />
                  <div className="sensor" />
                </div>

                {/* iOS Status Bar Overlay */}
                <div className="iphone-status-bar">
                  <span className="time">9:41</span>
                  <div className="status-icons">
                    <span className="network">📶</span>
                    <span className="wifi">📶</span>
                    <span className="battery">🔋</span>
                  </div>
                </div>

                {/* Iframe content */}
                <div className="iphone-content-area">
                  {iframeLoading && (
                    <div className="iphone-loader">
                      <div className="spinner" />
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

                {/* Home Indicator */}
                <div className="iphone-home-indicator" />
              </div>
            </div>
          </div>
        </div>

        <p className="small-text sr-fade" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          Interactive sandbox · Data is isolated and reset periodically
        </p>
      </div>
      <style>{`
        .iphone-device {
          position: relative;
          width: 430px;
          height: 932px;
          background: #000000;
          border-radius: 56px;
          box-shadow: 
            0 0 0 4px #2c2b2f,
            0 0 0 12px #0f0f11,
            0 25px 60px rgba(0,0,0,0.35);
          box-sizing: content-box;
        }

        .iphone-btn {
          position: absolute;
          background: #1c1b1f;
          border-radius: 2px;
        }
        .iphone-btn.silent {
          left: -14px;
          top: 140px;
          width: 2px;
          height: 32px;
        }
        .iphone-btn.vol-up {
          left: -14px;
          top: 200px;
          width: 2px;
          height: 60px;
        }
        .iphone-btn.vol-down {
          left: -14px;
          top: 280px;
          width: 2px;
          height: 60px;
        }
        .iphone-btn.power {
          right: -14px;
          top: 240px;
          width: 2px;
          height: 90px;
        }

        .iphone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 44px;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .iphone-dynamic-island {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 30px;
          background: #000000;
          border-radius: 20px;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          box-sizing: border-box;
          pointer-events: none;
        }
        .camera-lens {
          width: 8px;
          height: 8px;
          background: #050515;
          border-radius: 50%;
          box-shadow: inset 0 0 2px rgba(255, 255, 255, 0.4);
        }
        .sensor {
          width: 8px;
          height: 8px;
          background: #020205;
          border-radius: 50%;
        }

        .iphone-status-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 48px;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #000000;
          z-index: 90;
          pointer-events: none;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .status-icons {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .iphone-content-area {
          flex: 1;
          margin-top: 48px; /* Below status bar */
          position: relative;
          background: #fafafa;
          overflow: hidden;
        }

        .iphone-loader {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
          z-index: 10;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #1a8c87;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .iphone-home-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 5px;
          background: #000000;
          border-radius: 10px;
          z-index: 100;
          pointer-events: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}

