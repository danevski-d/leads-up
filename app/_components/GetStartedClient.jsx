'use client'
import LeadFormModal from './LeadFormModal'

export default function GetStartedClient() {
  return (
    <>
      <LeadFormModal />
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[#080A0F]/95 backdrop-blur border-t border-white/10 px-4 py-3">
        <button
          onClick={() => window.__openLeadForm && window.__openLeadForm()}
          className="block w-full text-center bg-[#6B8AFF] hover:bg-[#5a79ee] text-white font-semibold text-sm rounded-xl py-3 transition-colors"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          Book a Free Demo
        </button>
      </div>
    </>
  )
}
