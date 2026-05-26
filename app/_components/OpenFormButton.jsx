'use client'
export default function OpenFormButton({ children, className, style }) {
  return (
    <button
      onClick={() => window.__openLeadForm && window.__openLeadForm()}
      className={className}
      style={style}
    >
      {children}
    </button>
  )
}
