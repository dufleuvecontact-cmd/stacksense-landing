import Hero from '../components/Hero'
import TrustBand from '../components/TrustBand'
import HowItWorks from '../components/HowItWorks'
import MarqueeStrip from '../components/MarqueeStrip'
import Features from '../components/Features'
import UpcomingFeatures from '../components/UpcomingFeatures'
import Comparison from '../components/Comparison'
import ProductPreview from '../components/ProductPreview'
import BloodworkAI from '../components/BloodworkAI'
import Waitlist from '../components/Waitlist'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBand />
      <ProductPreview />
      <HowItWorks />
      <Comparison />
      <BloodworkAI />
      <Features />
      <UpcomingFeatures />
      <MarqueeStrip />
      <Waitlist />
      <FAQ />
      <Contact />
    </main>
  )
}
