import { useEffect } from 'react'

export default function Investors() {
  useEffect(() => {
    // TODO: Replace this URL with the actual old investor data page link
    window.location.replace('https://stacksense.notion.site/old-investor-data-replace-me')
  }, [])

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: 'var(--text-2)', fontFamily: 'var(--font-sans)' }}>Redirecting to investor data...</p>
    </main>
  )
}
