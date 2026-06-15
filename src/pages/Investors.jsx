import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Investors() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the homepage funding section instead of an external placeholder URL
    navigate('/#funding', { replace: true })
    setTimeout(() => document.getElementById('funding')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [navigate])

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: 'var(--text-2)', fontFamily: 'var(--font-sans)' }}>Redirecting to investor information...</p>
    </main>
  )
}
