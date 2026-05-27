import { Mail, Linkedin } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="section" style={{ background: '#fff' }}>
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
            <Linkedin size={24} color="#0077B5" style={{ marginBottom: '1rem' }} />
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Company LinkedIn</h3>
            <p className="body-text" style={{ marginBottom: '1rem' }}>Follow StackSense on LinkedIn.</p>
            <a href="https://linkedin.com/company/stacksense-health" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>StackSense.health</a>
          </div>

          <div className="card-flat" style={{ padding: '2rem' }}>
            <Linkedin size={24} color="#0077B5" style={{ marginBottom: '1rem' }} />
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Founder LinkedIn</h3>
            <p className="body-text" style={{ marginBottom: '1rem' }}>Connect directly with Jad Gouiza.</p>
            <a href="https://linkedin.com/in/jadgouiza" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>Jad Gouiza</a>
          </div>
        </div>
      </div>
    </section>
  )
}
