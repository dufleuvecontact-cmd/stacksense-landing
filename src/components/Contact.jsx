import { Mail } from 'lucide-react'

const LinkedinIcon = ({ size = 24, color = '#0077B5' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function Contact() {
  return (
    <section id="contact" className="section-band" style={{ background: '#fff' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <div className="sr">
          <p className="eyebrow" style={{ marginBottom: '.75rem' }}>Contact Us</p>
          <h2 className="h2" style={{ marginBottom: '1.5rem' }}>
            Get in touch
          </h2>
          <p className="lead" style={{ marginBottom: '3.5rem', maxWidth: 600, margin: '0 auto 3.5rem' }}>
            Have questions, need support, or want to discuss an investment? We're here to help.
          </p>
        </div>

        <div className="sr" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          <div className="card-flat" style={{ padding: '2rem' }}>
            <Mail size={24} color="var(--teal)" style={{ marginBottom: '1rem' }} />
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Email Us</h3>
            <p className="body-text" style={{ marginBottom: '1rem' }}>For general inquiries and support.</p>
            <a href="mailto:contact@stacksense.ca" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>contact@stacksense.ca</a>
          </div>

          <div className="card-flat" style={{ padding: '2rem' }}>
            <LinkedinIcon size={24} color="#0077B5" />
            <div style={{ marginTop: '1rem' }} />
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Company LinkedIn</h3>
            <p className="body-text" style={{ marginBottom: '1rem' }}>Follow StackSense on LinkedIn.</p>
            <a href="https://linkedin.com/company/stacksense-health" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>StackSense.health</a>
          </div>

          <div className="card-flat" style={{ padding: '2rem' }}>
            <LinkedinIcon size={24} color="#0077B5" />
            <div style={{ marginTop: '1rem' }} />
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Founder LinkedIn</h3>
            <p className="body-text" style={{ marginBottom: '1rem' }}>Connect directly with Jad Gouiza.</p>
            <a href="https://linkedin.com/in/jadgouiza" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Jad Gouiza</a>
          </div>
        </div>
      </div>
    </section>
  )
}

