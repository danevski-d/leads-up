import { T, font } from './constants'

const footerLinks = [
  { label: 'Privacy',  href: '/privacy'  },
  { label: 'Terms',    href: '/terms'    },
  { label: 'Security', href: '/security' },
  { label: 'Contact',  href: '#'         },
]

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, padding: '36px 40px', fontFamily: font }}>
      <div className="footer-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent' }}>
          <img src="/leadsup-icon.png.png" alt="Leads Up" style={{ height: 20, width: 'auto', background: 'transparent', objectFit: 'contain' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Leads <span style={{ color: '#6B8AFF' }}>up</span></span>
          <span style={{ fontSize: 13, color: T.sub, marginLeft: 8 }}>© 2026 · AI Revenue System</span>
        </div>
        <nav className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }} aria-label="Footer">
          {footerLinks.map(({ label, href }) => (
            <a key={label} href={href} className="lp-footer-link" style={{ fontSize: 13 }}>{label}</a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
