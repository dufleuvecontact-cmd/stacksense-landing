import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import ProductPreview from '../components/ProductPreview'
import Waitlist from '../components/Waitlist'
import StickyBar from '../components/StickyBar'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

// Single-line mid-page nudge — deliberately a link, not a third form.
function MidCta() {
  return (
    <div style={{ background: 'var(--bg-band)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.1rem 1.5rem', textAlign: 'center' }}>
      <a href="#waitlist" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '.95rem', color: 'var(--teal-deep)', textDecoration: 'none' }}>
        Sold already? Get early access — free ↓
      </a>
    </div>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductPreview />
      <HowItWorks />
      <MidCta />
      <Features />
      <Waitlist />
      <FAQ />
      <Contact />
      <StickyBar />
    </main>
  )
}
