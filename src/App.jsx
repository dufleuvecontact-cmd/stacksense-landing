import Nav from './components/Nav'
import Hero from './components/Hero'
import MarqueeStrip from './components/MarqueeStrip'
import Features from './components/Features'
import Comparison from './components/Comparison'
import ProductPreview from './components/ProductPreview'
import Waitlist from './components/Waitlist'
import Timeline from './components/Timeline'
import Funding from './components/Funding'
import UpcomingFeatures from './components/UpcomingFeatures'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Comparison />
        <ProductPreview />
        <MarqueeStrip />
        <Waitlist />
        <Timeline />
        <Funding />
        <UpcomingFeatures />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
