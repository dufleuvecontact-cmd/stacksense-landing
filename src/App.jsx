import { Routes, Route, Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Investors from './pages/Investors'

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
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
