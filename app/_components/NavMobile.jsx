'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { T, font } from './constants'

const navLinks = [
  ['#system', 'System'],
  ['#features', 'Features'],
  ['#pricing', 'Pricing'],
  ['#faq', 'FAQ'],
]

export default function NavMobile() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className="nav-burger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.sub, padding: 8, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 60, left: 0, right: 0, background: T.bg, borderBottom: `1px solid ${T.border}`, padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12, zIndex: 50 }}>
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              style={{ fontSize: 15, color: T.sub, textDecoration: 'none', padding: '8px 0', fontFamily: font }}>
              {label}
            </a>
          ))}
          <div style={{ height: 1, background: T.border, margin: '4px 0' }} />
          <Link href="/login" onClick={() => setOpen(false)}
            style={{ fontSize: 15, color: T.sub, textDecoration: 'none', padding: '8px 0', fontFamily: font }}>
            Sign in
          </Link>
          <Link href="/login?mode=signup" onClick={() => setOpen(false)}
            style={{ fontSize: 15, fontWeight: 600, color: '#080A0F', background: '#FFFFFF', padding: '12px 20px', borderRadius: 99, textDecoration: 'none', textAlign: 'center', fontFamily: font }}>
            Get started
          </Link>
        </div>
      )}
    </>
  )
}
