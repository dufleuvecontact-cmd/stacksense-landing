import Hero from '../components/Hero'
import MarqueeStrip from '../components/MarqueeStrip'
import Features from '../components/Features'
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
      <ProductPreview />
      <Comparison />
      <BloodworkAI />
      <Features />
      <MarqueeStrip />
      <Waitlist />
      <FAQ />
      <Contact />
    </main>
  )
}
