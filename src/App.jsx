import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import { consumeReturnParams } from './lib/waitlistShared'

// Code-split: the investor pitch deck (~870 lines + two dozen icons) shouldn't
// ship in the landing-page bundle that almost every visitor downloads.
const Investors = lazy(() => import('./pages/Investors'))

function NotFound() {
  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: 'var(--text-2)', marginBottom: '2rem' }}>This page doesn't exist.</p>
      <Link to="/" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>&larr; Back to StackSense</Link>
    </main>
  )
}

export default function App() {
  // Stripe return params are consumed here (child effects run first, so every
  // JOINED_EVENT listener is already bound and #waitlist exists in the DOM).
  useEffect(() => { consumeReturnParams() }, [])

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/investors" element={<Suspense fallback={null}><Investors /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
