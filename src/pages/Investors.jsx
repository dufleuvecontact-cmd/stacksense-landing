import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, ChevronDown,
  AlertTriangle, Lightbulb, TrendingUp, Smartphone,
  Users, UserCheck, Handshake, Mail, ArrowRight,
  Activity, Shield, Brain, BarChart3, Zap, Target,
  CheckCircle2, Globe, Heart, ExternalLink
} from 'lucide-react'

/* ─── Pitch Deck Slide Data ─────────────────────────────── */
const slides = [
  {
    id: 'title',
    eyebrow: 'INVESTOR DECK · 2026',
    title: 'StackSense',
    subtitle: 'The intelligent supplement & peptide tracking platform.',
    body: 'Finally know what your supplements are actually doing — with data, not guesswork.',
    gradient: '#fff',
    dark: false,
  },
  {
    id: 'problem',
    eyebrow: 'THE PROBLEM',
    title: 'Millions are supplementing blind.',
    points: [
      { icon: AlertTriangle, text: 'No way to know which supplement in a stack is actually working' },
      { icon: AlertTriangle, text: 'People combine compounds with no easy way to see what the research says' },
      { icon: AlertTriangle, text: 'Existing tools are just pill reminders — zero intelligence, zero insight' },
      { icon: AlertTriangle, text: 'Bloodwork results sit in PDFs with no correlation to protocols' },
    ],
    stat: { value: '$62B+', label: 'Global supplement market (2025), growing 9% YoY' },
  },
  {
    id: 'solution',
    eyebrow: 'THE SOLUTION',
    title: 'StackSense connects the dots.',
    points: [
      { icon: Activity, text: 'Track doses, cycles, and protocols with clinical-grade logging' },
      { icon: Shield, text: 'Educational interaction notes from published research across 420+ compounds' },
      { icon: Brain, text: 'AI-powered bloodwork analysis correlating results to protocols' },
      { icon: BarChart3, text: 'Longitudinal insights showing what\'s actually moving the needle' },
    ],
    footer: 'From "I think this is working" → "I know exactly what changed and why."',
  },
  {
    id: 'market',
    eyebrow: 'MARKET OPPORTUNITY',
    title: 'A massive, underserved market.',
    metrics: [
      { value: '$62B', label: 'Supplement Market', sub: 'Global, growing 9% YoY' },
      { value: '$4.7B', label: 'Peptide Therapeutics', sub: 'Projected by 2028' },
      { value: '77%', label: 'Adults Take Supplements', sub: 'US adults, CRN survey' },
      { value: '0', label: 'Real Competitors', sub: 'No intelligent tracking exists' },
    ],
    body: 'The peptide and advanced supplementation space has exploded — yet there\'s no purpose-built platform to track, analyze, and optimize these protocols. We\'re building that infrastructure.',
  },
  {
    id: 'product',
    eyebrow: 'PRODUCT',
    title: 'A live product, not a pitch deck.',
    features: [
      { icon: Smartphone, name: 'Protocol Tracking', desc: 'Log every dose, cycle, and compound with smart scheduling' },
      { icon: Brain, name: 'AI Blood Analysis', desc: 'Upload bloodwork, get AI-powered insights correlated to your stack' },
      { icon: Zap, name: 'Interaction Engine', desc: 'Educational interaction notes from published research across 420+ compounds' },
      { icon: BarChart3, name: 'Progress Dashboard', desc: 'Visualize trends, streaks, and health markers over time' },
      { icon: Target, name: 'Bioavailability Calc', desc: 'Optimize timing and delivery for maximum absorption' },
      { icon: Globe, name: 'Compound Library', desc: '420+ research-backed compounds with clinical dosing data' },
    ],
    cta: 'Try the live demo at stacksense.ca',
  },
  {
    id: 'traction',
    eyebrow: 'TRACTION & MILESTONES',
    title: 'Building with momentum.',
    milestones: [
      { phase: 'Done', items: ['Full MVP built & deployed', 'Core tracking engine live', '420+ compound library', 'AI bloodwork analysis', 'Waitlist open & growing'] },
      { phase: 'In Progress', items: ['Beta tester onboarding', 'Mobile optimization', 'Referral system', 'User feedback integration'] },
      { phase: 'Next', items: ['Practitioner portal', 'API for integrations', 'Enterprise tier', 'Community features'] },
    ],
  },
  {
    id: 'team',
    eyebrow: 'THE TEAM',
    title: 'Builder-led, user-first.',
    members: [
      {
        name: 'Jad Gouiza',
        role: 'Founder & CEO',
        bio: 'Built StackSense because he couldn\'t figure out which of his 8 supplements was actually working. Technical founder with deep domain expertise in health optimization and full-stack development.',
        linkedin: 'https://www.linkedin.com/in/jad-gouiza',
      },
    ],
    quote: '"We\'re building StackSense because we were the users who couldn\'t find a tool that actually worked for this. The market is real, the pain is real, and the timing is right."',
  },
  {
    id: 'ask',
    eyebrow: 'WHAT WE\'RE LOOKING FOR',
    title: 'Mentorship & strategic guidance.',
    body: 'We\'re not primarily seeking funding right now — we\'re looking for experienced advisors and mentors who can help us navigate the health-tech landscape, refine our go-to-market strategy, and connect us with the right people.',
    lookingFor: [
      { icon: Handshake, label: 'Strategic Mentorship', desc: 'Guidance from founders and operators who\'ve scaled health-tech platforms' },
      { icon: Users, label: 'Network Access', desc: 'Introductions to practitioners, researchers, and potential enterprise partners' },
      { icon: Lightbulb, label: 'Domain Expertise', desc: 'Advisors in regulatory, clinical data, and health-tech product design' },
      { icon: TrendingUp, label: 'Growth Strategy', desc: 'Help refining our go-to-market, pricing, and user acquisition playbook' },
    ],
    gradient: '#fff',
    dark: false,
  },
]

/* ─── Slide Components ──────────────────────────────────── */

function TitleSlide({ slide }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '3rem 2rem', minHeight: 420,
    }}>
      <p style={{
        fontSize: '.75rem', fontWeight: 600, letterSpacing: '.15em',
        color: 'var(--teal)', marginBottom: '1.5rem',
        textTransform: 'uppercase',
      }}>{slide.eyebrow}</p>
      <h2 style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em',
        lineHeight: 1.05, marginBottom: '.75rem',
      }}>{slide.title}</h2>
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
        color: 'var(--text-2)', maxWidth: 560, lineHeight: 1.6,
        marginBottom: '1rem',
      }}>{slide.subtitle}</p>
      <p style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: '.95rem', color: 'var(--text-3)', maxWidth: 480,
        lineHeight: 1.7,
      }}>{slide.body}</p>
      <div style={{
        marginTop: '2rem', width: 60, height: 3, borderRadius: 2,
        background: 'linear-gradient(90deg, transparent, rgba(26,140,135,.4), transparent)',
      }} />
    </div>
  )
}

function PointsSlide({ slide }) {
  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <p className="eyebrow" style={{ marginBottom: '.5rem', color: 'var(--teal)' }}>{slide.eyebrow}</p>
      <h3 style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em',
        marginBottom: '1.75rem', lineHeight: 1.2,
      }}>{slide.title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {slide.points.map((p, i) => (
          <div key={i} style={{
            display: 'flex', gap: '.75rem', alignItems: 'flex-start',
            padding: '.85rem 1rem', background: 'var(--bg-card-alt)',
            borderRadius: 10, border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: slide.id === 'problem' ? 'rgba(220,80,60,.08)' : 'rgba(26,140,135,.08)',
              border: `1px solid ${slide.id === 'problem' ? 'rgba(220,80,60,.15)' : 'rgba(26,140,135,.15)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <p.icon size={15} color={slide.id === 'problem' ? '#c0392b' : 'var(--teal)'} strokeWidth={1.8} />
            </div>
            <span style={{
              fontSize: '.9rem', color: 'var(--text-2)', lineHeight: 1.6,
              fontFamily: 'var(--font-sans)', paddingTop: '.2rem',
            }}>{p.text}</span>
          </div>
        ))}
      </div>
      {slide.stat && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(26,140,135,.06), rgba(26,140,135,.02))',
          border: '1px solid rgba(26,140,135,.15)', borderRadius: 12,
          padding: '1.25rem', textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem', fontWeight: 800, color: 'var(--teal)',
            fontFamily: 'var(--font-sans)', letterSpacing: '-.02em',
          }}>{slide.stat.value}</div>
          <div style={{
            fontSize: '.8rem', color: 'var(--text-3)',
            fontFamily: 'var(--font-sans)', marginTop: '.2rem',
          }}>{slide.stat.label}</div>
        </div>
      )}
      {slide.footer && (
        <p style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: '.88rem', color: 'var(--text-3)', marginTop: '1.25rem',
          lineHeight: 1.7, textAlign: 'center',
        }}>{slide.footer}</p>
      )}
    </div>
  )
}

function MetricsSlide({ slide }) {
  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <p className="eyebrow" style={{ marginBottom: '.5rem', color: 'var(--teal)' }}>{slide.eyebrow}</p>
      <h3 style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em',
        marginBottom: '1.75rem', lineHeight: 1.2,
      }}>{slide.title}</h3>
      <div id="metrics-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem',
        marginBottom: '1.5rem',
      }}>
        {slide.metrics.map((m, i) => (
          <div key={i} style={{
            padding: '1.2rem', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center',
          }}>
            <div style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800,
              color: 'var(--teal)', fontFamily: 'var(--font-sans)',
              letterSpacing: '-.02em', lineHeight: 1,
            }}>{m.value}</div>
            <div style={{
              fontSize: '.78rem', fontWeight: 700, color: 'var(--text)',
              fontFamily: 'var(--font-sans)', marginTop: '.4rem',
            }}>{m.label}</div>
            <div style={{
              fontSize: '.7rem', color: 'var(--text-3)',
              fontFamily: 'var(--font-sans)', marginTop: '.15rem',
            }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <p style={{
        fontSize: '.9rem', color: 'var(--text-2)', lineHeight: 1.7,
        fontFamily: 'var(--font-sans)',
      }}>{slide.body}</p>
    </div>
  )
}

function ProductSlide({ slide }) {
  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <p className="eyebrow" style={{ marginBottom: '.5rem', color: 'var(--teal)' }}>{slide.eyebrow}</p>
      <h3 style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em',
        marginBottom: '1.75rem', lineHeight: 1.2,
      }}>{slide.title}</h3>
      <div id="product-features-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem',
        marginBottom: '1.5rem',
      }}>
        {slide.features.map((f, i) => (
          <div key={i} style={{
            padding: '1rem', background: 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(26,140,135,.08)',
              border: '1px solid rgba(26,140,135,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '.6rem',
            }}>
              <f.icon size={15} color="var(--teal)" strokeWidth={1.8} />
            </div>
            <div style={{
              fontSize: '.82rem', fontWeight: 700, color: 'var(--text)',
              fontFamily: 'var(--font-sans)', marginBottom: '.2rem',
            }}>{f.name}</div>
            <div style={{
              fontSize: '.75rem', color: 'var(--text-3)',
              fontFamily: 'var(--font-sans)', lineHeight: 1.5,
            }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <a href="/#product" style={{
        display: 'block', textAlign: 'center', padding: '.75rem',
        background: 'rgba(26,140,135,.05)', borderRadius: 8,
        border: '1px solid rgba(26,140,135,.12)', textDecoration: 'none',
        transition: 'background .15s ease, border-color .15s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,140,135,.1)'; e.currentTarget.style.borderColor = 'rgba(26,140,135,.25)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26,140,135,.05)'; e.currentTarget.style.borderColor = 'rgba(26,140,135,.12)' }}
      >
        <span style={{
          fontSize: '.82rem', color: 'var(--text-2)',
          fontFamily: 'var(--font-sans)', fontWeight: 500,
        }}>Try the live demo at </span>
        <span style={{
          fontSize: '.82rem', color: 'var(--teal)',
          fontFamily: 'var(--font-sans)', fontWeight: 700,
        }}>stacksense.ca →</span>
      </a>
    </div>
  )
}

function TractionSlide({ slide }) {
  const phaseColors = {
    Done: { bg: 'rgba(16,185,129,.08)', border: 'rgba(16,185,129,.2)', dot: '#10b981', text: '#0a6647' },
    'In Progress': { bg: 'rgba(26,140,135,.08)', border: 'rgba(26,140,135,.2)', dot: '#1a8c87', text: '#0d6b67' },
    Next: { bg: 'rgba(120,150,145,.06)', border: 'var(--border)', dot: 'var(--text-3)', text: 'var(--text-3)' },
  }
  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <p className="eyebrow" style={{ marginBottom: '.5rem', color: 'var(--teal)' }}>{slide.eyebrow}</p>
      <h3 style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em',
        marginBottom: '1.75rem', lineHeight: 1.2,
      }}>{slide.title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {slide.milestones.map((m, i) => {
          const c = phaseColors[m.phase]
          return (
            <div key={i} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 12, padding: '1.25rem',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                marginBottom: '.75rem',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', background: c.dot,
                }} />
                <span style={{
                  fontSize: '.75rem', fontWeight: 700, color: c.text,
                  fontFamily: 'var(--font-sans)', textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}>{m.phase}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
                {m.items.map((item, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'center', gap: '.5rem',
                  }}>
                    {m.phase === 'Done' ? (
                      <CheckCircle2 size={13} color="#10b981" strokeWidth={2.2} style={{ flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: c.dot, flexShrink: 0, opacity: .6,
                      }} />
                    )}
                    <span style={{
                      fontSize: '.82rem', color: 'var(--text-2)',
                      fontFamily: 'var(--font-sans)', lineHeight: 1.5,
                    }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TeamSlide({ slide }) {
  return (
    <div style={{ padding: '2.5rem 2rem' }}>
      <p className="eyebrow" style={{ marginBottom: '.5rem', color: 'var(--teal)' }}>{slide.eyebrow}</p>
      <h3 style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em',
        marginBottom: '1.75rem', lineHeight: 1.2,
      }}>{slide.title}</h3>
      {slide.members.map((m, i) => (
        <div key={i} style={{
          display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
          padding: '1.5rem', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 14,
          marginBottom: '1.25rem',
        }} id="team-member-card">
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #1a8c87, #25b5af)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 800, color: '#fff',
          }}>JG</div>
          <div>
            <div style={{
              fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)',
              fontFamily: 'var(--font-sans)', marginBottom: '.15rem',
            }}>{m.name}</div>
            <div style={{
              fontSize: '.78rem', fontWeight: 600, color: 'var(--teal)',
              fontFamily: 'var(--font-sans)', marginBottom: '.6rem',
            }}>{m.role}</div>
            <p style={{
              fontSize: '.85rem', color: 'var(--text-2)',
              fontFamily: 'var(--font-sans)', lineHeight: 1.65,
              marginBottom: '.75rem',
            }}>{m.bio}</p>
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '.35rem',
              fontSize: '.78rem', color: 'var(--teal)', fontWeight: 600,
              textDecoration: 'none', fontFamily: 'var(--font-sans)',
            }}>
              LinkedIn <ExternalLink size={12} />
            </a>
          </div>
        </div>
      ))}
      <div style={{
        background: 'var(--bg-band)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '1.5rem',
      }}>
        <p style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: '.9rem', color: 'var(--text-2)', lineHeight: 1.75,
        }}>{slide.quote}</p>
      </div>
    </div>
  )
}

function AskSlide({ slide }) {
  return (
    <div style={{
      padding: '2.5rem 2rem', minHeight: 420,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <p className="eyebrow" style={{ marginBottom: '.5rem', color: 'var(--teal)' }}>{slide.eyebrow}</p>
      <h3 style={{
        fontFamily: 'var(--font-sans)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 700, color: 'var(--text)', letterSpacing: '-.02em',
        marginBottom: '1rem', lineHeight: 1.2,
      }}>{slide.title}</h3>
      <p style={{
        fontSize: '.9rem', color: 'var(--text-2)',
        fontFamily: 'var(--font-sans)', lineHeight: 1.7,
        marginBottom: '1.75rem', maxWidth: 520,
      }}>{slide.body}</p>
      <div id="ask-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem',
      }}>
        {slide.lookingFor.map((l, i) => (
          <div key={i} style={{
            padding: '1rem', background: 'var(--bg-card-alt)',
            border: '1px solid var(--border)', borderRadius: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(26,140,135,.08)',
              border: '1px solid rgba(26,140,135,.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '.6rem',
            }}>
              <l.icon size={15} color="var(--teal)" strokeWidth={1.8} />
            </div>
            <div style={{
              fontSize: '.82rem', fontWeight: 700, color: 'var(--text)',
              fontFamily: 'var(--font-sans)', marginBottom: '.2rem',
            }}>{l.label}</div>
            <div style={{
              fontSize: '.72rem', color: 'var(--text-3)',
              fontFamily: 'var(--font-sans)', lineHeight: 1.5,
            }}>{l.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Slide Renderer ────────────────────────────────────── */
function SlideContent({ slide }) {
  switch (slide.id) {
    case 'title': return <TitleSlide slide={slide} />
    case 'problem': return <PointsSlide slide={slide} />
    case 'solution': return <PointsSlide slide={slide} />
    case 'market': return <MetricsSlide slide={slide} />
    case 'product': return <ProductSlide slide={slide} />
    case 'traction': return <TractionSlide slide={slide} />
    case 'team': return <TeamSlide slide={slide} />
    case 'ask': return <AskSlide slide={slide} />
    default: return null
  }
}

/* ─── LinkedIn Icon ─────────────────────────────────────── */
const LinkedinIcon = ({ size = 24, color = '#0077B5' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

/* ─── Main Investors Page ───────────────────────────────── */
export default function Investors() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState(0) // -1 = prev, 1 = next
  const deckRef = useRef(null)
  const contactRef = useRef(null)
  const heroRef = useRef(null)

  const goTo = useCallback((index, dir) => {
    if (isAnimating || index === current) return
    setDirection(dir)
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
    }, 280)
  }, [current, isAnimating])

  const next = useCallback(() => {
    if (current < slides.length - 1) goTo(current + 1, 1)
  }, [current, goTo])

  const prev = useCallback(() => {
    if (current > 0) goTo(current - 1, -1)
  }, [current, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  // Scroll reveal for contact section
  useEffect(() => {
    const refs = [contactRef.current, heroRef.current]
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.sr,.sr-fade,.sr-left,.sr-right').forEach(el => el.classList.add('in'))
        }
      })
    }, { threshold: 0.08 })
    refs.forEach(r => { if (r) obs.observe(r) })
    return () => obs.disconnect()
  }, [])

  // Hero entrance animation
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.querySelectorAll('.sr,.sr-fade').forEach((node, i) => {
        setTimeout(() => node.classList.add('in'), 100 + i * 100)
      })
    }
  }, [])

  const slide = slides[current]
  const isDark = slide.dark
  const bg = slide.gradient || 'var(--bg-card)'

  return (
    <main style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Hero Banner ─────────────────────────────────── */}
      <section ref={heroRef} className="dot-grid" style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg)',
        padding: '5rem 0 4rem',
      }}>
        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="sr">
            <span className="pill pill-teal" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
              Investor Relations · Mentorship Focus
            </span>
          </div>
          <h1 className="sr" style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'var(--text)', letterSpacing: '-.03em',
            lineHeight: 1.1, marginBottom: '1rem',
          }}>
            Building the infrastructure for
            <br />
            <span style={{ color: 'var(--teal)' }}>intelligent supplementation.</span>
          </h1>
          <p className="sr" style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(.95rem, 1.5vw, 1.15rem)',
            color: 'var(--text-2)', maxWidth: 560, margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}>
            We're seeking experienced mentors and strategic advisors to help shape the future of health-tech tracking. Explore our deck below.
          </p>
          <div className="sr" style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#deck" className="btn btn-teal" style={{ fontSize: '.85rem' }}>
              View Pitch Deck <ChevronDown size={15} />
            </a>
            <a href="#investor-contact" className="btn btn-outline" style={{ fontSize: '.85rem' }}>
              Get in Touch <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Pitch Deck Section ──────────────────────────── */}
      <section id="deck" ref={deckRef} style={{
        padding: '4rem 0',
        background: '#fff',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="wrap">
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="eyebrow" style={{ marginBottom: '.5rem' }}>PITCH DECK</p>
            <h2 className="h2" style={{ marginBottom: '.5rem' }}>Our Story & Vision</h2>
            <p className="small-text">Navigate with arrows or keyboard. {slides.length} slides.</p>
          </div>

          {/* Slide viewer */}
          <div id="pitch-deck-viewer" style={{
            maxWidth: 680, margin: '0 auto', position: 'relative',
            display: 'flex', flexDirection: 'column', height: 'clamp(600px, 85vh, 760px)'
          }}>
            {/* Slide card */}
            <div style={{
              flex: 1,
              background: bg,
              border: isDark ? '1px solid rgba(255,255,255,.08)' : '1px solid var(--border)',
              borderRadius: 20, overflowY: 'auto', overflowX: 'hidden', position: 'relative',
              boxShadow: isDark
                ? '0 24px 48px rgba(0,0,0,.4), 0 0 0 1px rgba(26,140,135,.1)'
                : '0 12px 40px rgba(0,0,0,.06)',
              transition: 'background .4s ease, border-color .4s ease, box-shadow .4s ease',
            }}>
              {/* Slide number indicator */}
              <div style={{
                position: 'absolute', top: 16, right: 16, zIndex: 5,
                fontSize: '.65rem', fontWeight: 600,
                color: isDark ? 'rgba(255,255,255,.3)' : 'var(--text-3)',
                fontFamily: 'var(--font-sans)', letterSpacing: '.06em',
              }}>
                {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </div>

              {/* Slide content with animation */}
              <div style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating
                  ? `translateX(${direction * 30}px)`
                  : 'translateX(0)',
                transition: 'opacity .28s ease, transform .28s ease',
              }}>
                <SlideContent slide={slide} />
              </div>
            </div>

            {/* Navigation controls */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '1.25rem',
            }}>
              {/* Prev */}
              <button
                onClick={prev}
                disabled={current === 0}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: current === 0 ? 'not-allowed' : 'pointer',
                  opacity: current === 0 ? .35 : 1,
                  transition: 'all .15s ease',
                  color: 'var(--text)',
                }}
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dot indicators */}
              <div style={{
                display: 'flex', gap: '.4rem', alignItems: 'center',
              }}>
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i, i > current ? 1 : -1)}
                    style={{
                      width: i === current ? 24 : 8, height: 8,
                      borderRadius: 4, border: 'none', cursor: 'pointer',
                      background: i === current ? 'var(--teal)' : 'var(--border)',
                      transition: 'all .3s cubic-bezier(.22,1,.36,1)',
                      padding: 0,
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                onClick={next}
                disabled={current === slides.length - 1}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: current === slides.length - 1 ? 'var(--bg-card)' : 'var(--teal)',
                  border: current === slides.length - 1 ? '1px solid var(--border)' : '1px solid var(--teal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: current === slides.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: current === slides.length - 1 ? .35 : 1,
                  transition: 'all .15s ease',
                  color: current === slides.length - 1 ? 'var(--text)' : '#fff',
                }}
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Slide title strip */}
            <div style={{
              display: 'flex', gap: '.25rem', marginTop: '1rem',
              overflowX: 'auto', paddingBottom: '.5rem',
            }} id="slide-titles-strip">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  style={{
                    padding: '.35rem .7rem', borderRadius: 6,
                    border: i === current ? '1px solid var(--teal)' : '1px solid var(--border)',
                    background: i === current ? 'rgba(26,140,135,.06)' : 'var(--bg-card)',
                    color: i === current ? 'var(--teal)' : 'var(--text-3)',
                    fontSize: '.68rem', fontWeight: 600,
                    fontFamily: 'var(--font-sans)', cursor: 'pointer',
                    whiteSpace: 'nowrap', transition: 'all .15s ease',
                    letterSpacing: '.02em',
                  }}
                >
                  {s.eyebrow.replace('·', '').replace('2026', '').trim() || 'Cover'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Section ─────────────────────────────── */}
      <section id="investor-contact" ref={contactRef} style={{
        padding: '5rem 0', background: '#fff',
      }}>
        <div className="wrap" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="sr">
              <p className="eyebrow" style={{ marginBottom: '.75rem' }}>LET'S CONNECT</p>
              <h2 className="h2" style={{ marginBottom: '1rem' }}>
                Interested in mentoring or advising?
              </h2>
              <p className="lead" style={{ maxWidth: 540, margin: '0 auto' }}>
                We're looking for mentors, advisors, and strategic partners — not just capital. If you have experience in health-tech, we'd love to hear from you.
              </p>
            </div>
          </div>

          <div className="sr" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem', marginBottom: '2.5rem',
          }}>
            {/* Email */}
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(26,140,135,.08)', border: '1px solid rgba(26,140,135,.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <Mail size={20} color="var(--teal)" />
              </div>
              <h3 className="h3" style={{ marginBottom: '.35rem', fontSize: '1rem' }}>Email</h3>
              <p style={{
                fontSize: '.82rem', color: 'var(--text-3)',
                fontFamily: 'var(--font-sans)', marginBottom: '.75rem', lineHeight: 1.6,
              }}>Investor inquiries & mentorship</p>
              <a href="mailto:contact@stacksense.ca" style={{
                color: 'var(--teal)', fontWeight: 600, textDecoration: 'none',
                fontSize: '.88rem', fontFamily: 'var(--font-sans)',
              }}>contact@stacksense.ca</a>
            </div>

            {/* Company LinkedIn */}
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(0,119,181,.06)', border: '1px solid rgba(0,119,181,.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <LinkedinIcon size={20} color="#0077B5" />
              </div>
              <h3 className="h3" style={{ marginBottom: '.35rem', fontSize: '1rem' }}>Company</h3>
              <p style={{
                fontSize: '.82rem', color: 'var(--text-3)',
                fontFamily: 'var(--font-sans)', marginBottom: '.75rem', lineHeight: 1.6,
              }}>Follow us on LinkedIn</p>
              <a href="https://linkedin.com/company/stacksense-health" target="_blank" rel="noopener noreferrer" style={{
                color: 'var(--teal)', fontWeight: 600, textDecoration: 'none',
                fontSize: '.88rem', fontFamily: 'var(--font-sans)',
              }}>StackSense Health</a>
            </div>

            {/* Founder LinkedIn */}
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(0,119,181,.06)', border: '1px solid rgba(0,119,181,.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                <UserCheck size={20} color="#0077B5" />
              </div>
              <h3 className="h3" style={{ marginBottom: '.35rem', fontSize: '1rem' }}>Founder</h3>
              <p style={{
                fontSize: '.82rem', color: 'var(--text-3)',
                fontFamily: 'var(--font-sans)', marginBottom: '.75rem', lineHeight: 1.6,
              }}>Connect with Jad directly</p>
              <a href="https://www.linkedin.com/in/jad-gouiza" target="_blank" rel="noopener noreferrer" style={{
                color: 'var(--teal)', fontWeight: 600, textDecoration: 'none',
                fontSize: '.88rem', fontFamily: 'var(--font-sans)',
              }}>Jad Gouiza</a>
            </div>
          </div>

          {/* Closing note */}
          <div className="sr" style={{
            background: 'linear-gradient(135deg, rgba(26,140,135,.05), rgba(26,140,135,.02))',
            border: '1px solid rgba(26,140,135,.15)', borderRadius: 16,
            padding: '2rem', textAlign: 'center',
          }}>
            <Heart size={20} color="var(--teal)" style={{ marginBottom: '.75rem' }} />
            <h3 style={{
              fontFamily: 'var(--font-sans)', fontSize: '1.1rem',
              fontWeight: 700, color: 'var(--text)', marginBottom: '.5rem',
            }}>We value relationships over transactions.</h3>
            <p style={{
              fontSize: '.88rem', color: 'var(--text-2)',
              fontFamily: 'var(--font-sans)', lineHeight: 1.7,
              maxWidth: 480, margin: '0 auto',
            }}>
              Whether it's a quick coffee chat or ongoing advisory — if you believe in what we're building, we'd love to connect. No pressure, no pitch — just genuine conversation.
            </p>
          </div>
        </div>
      </section>

      {/* ── Responsive Styles ───────────────────────────── */}
      <style>{`
        #slide-titles-strip::-webkit-scrollbar { height: 3px; }
        #slide-titles-strip::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        @media (max-width: 600px) {
          #metrics-grid { grid-template-columns: 1fr !important; }
          #product-features-grid { grid-template-columns: 1fr !important; }
          #ask-grid { grid-template-columns: 1fr !important; }
          #team-member-card { flex-direction: column !important; }
        }
      `}</style>
    </main>
  )
}
