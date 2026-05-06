import { useState } from 'react'
import { Check, ChevronRight, Mail, MessageSquare, Calendar, Zap, Bell, User, Shield, Plug } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'ai', label: 'AI Settings', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`}
        style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }} />
    </button>
  )
}

function ProfileTab() {
  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-5">Account Details</h3>
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">AR</div>
          <div>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Change photo</button>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'First Name', value: 'Alex' },
            { label: 'Last Name', value: 'Rivera' },
            { label: 'Email', value: 'alex@leadsup.io' },
            { label: 'Phone', value: '+1 (555) 123-4567' },
            { label: 'Company', value: 'Rivera Services LLC' },
            { label: 'Time Zone', value: 'Eastern (UTC-5)' },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="text-xs text-slate-500 block mb-1.5">{label}</label>
              <input defaultValue={value} className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all" />
            </div>
          ))}
        </div>
        <button className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2.5 rounded-xl font-medium transition-all">
          Save Changes
        </button>
      </div>
    </div>
  )
}

function IntegrationsTab() {
  const [connected, setConnected] = useState({ gmail: true, twilio: true, gcal: false, hubspot: false, zapier: false, outlook: false })

  const integrations = [
    {
      group: 'Email',
      icon: Mail,
      items: [
        { key: 'gmail', name: 'Gmail / Google Workspace', desc: 'Send and receive emails through your Gmail account', color: 'from-red-500 to-orange-500' },
        { key: 'outlook', name: 'Microsoft Outlook', desc: 'Connect your Outlook or Office 365 inbox', color: 'from-blue-500 to-cyan-500' },
      ],
    },
    {
      group: 'SMS & Messaging',
      icon: MessageSquare,
      items: [
        { key: 'twilio', name: 'Twilio SMS', desc: 'Send two-way SMS messages to leads via your number', color: 'from-red-500 to-pink-500' },
      ],
    },
    {
      group: 'Calendar',
      icon: Calendar,
      items: [
        { key: 'gcal', name: 'Google Calendar', desc: 'Auto-book appointments and sync availability', color: 'from-blue-500 to-indigo-500' },
        { key: 'outlook', name: 'Outlook Calendar', desc: 'Sync with Microsoft 365 calendar', color: 'from-blue-600 to-blue-700' },
      ],
    },
    {
      group: 'CRM & Automation',
      icon: Plug,
      items: [
        { key: 'hubspot', name: 'HubSpot CRM', desc: 'Sync leads, deals, and contacts bidirectionally', color: 'from-orange-500 to-red-500' },
        { key: 'zapier', name: 'Zapier', desc: 'Connect to 5,000+ apps via Zapier workflows', color: 'from-amber-400 to-orange-500' },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      {integrations.map(({ group, icon: Icon, items }) => (
        <div key={group} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon size={15} className="text-slate-400" />
            <h3 className="text-white font-semibold text-sm">{group}</h3>
          </div>
          <div className="space-y-3">
            {items.map(({ key, name, desc, color }) => (
              <div key={key + name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{name}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {connected[key] && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <Check size={11} /> Connected
                    </span>
                  )}
                  <button
                    onClick={() => setConnected(c => ({ ...c, [key]: !c[key] }))}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${connected[key]
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30'
                    }`}>
                    {connected[key] ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AISettingsTab() {
  const [settings, setSettings] = useState({
    autoRespond: true,
    qualify: true,
    followUp: true,
    reactivate: true,
    businessHours: false,
  })

  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }))

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-1">AI Behavior</h3>
        <p className="text-slate-500 text-sm mb-5">Control how the AI interacts with your leads</p>
        <div className="space-y-5">
          {[
            { key: 'autoRespond', label: 'Auto-Respond to New Leads', desc: 'Send an immediate personalized reply to every new inbound lead' },
            { key: 'qualify', label: 'Automatic Lead Qualification', desc: 'Conduct qualification conversations and score leads automatically' },
            { key: 'followUp', label: 'Automated Follow-up Sequences', desc: 'Enroll unresponsive leads in multi-touch follow-up campaigns' },
            { key: 'reactivate', label: 'Dormant Lead Reactivation', desc: 'Automatically re-engage contacts that haven\'t been active in 30+ days' },
            { key: 'businessHours', label: 'Restrict to Business Hours', desc: 'Only send AI messages between 8 AM – 8 PM in the lead\'s local time zone' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
              <Toggle checked={settings[key]} onChange={() => toggle(key)} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-1">Response Templates</h3>
        <p className="text-slate-500 text-sm mb-4">Customize the AI's initial message</p>
        <textarea
          defaultValue={`Hi {first_name}! Thanks for reaching out to {business_name}. I'm here to help get your {service} project started. Can I ask a few quick questions to best assist you?`}
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all resize-none"
        />
        <div className="flex gap-2 mt-3">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl font-medium transition-all">Save Template</button>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm px-4 py-2 rounded-xl transition-all">Reset to Default</button>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [settings, setSettings] = useState({ newLead: true, booked: true, qualified: true, lost: false, weekly: true, reactivation: false })
  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-1">Notification Preferences</h3>
      <p className="text-slate-500 text-sm mb-5">Choose what triggers a notification</p>
      <div className="space-y-5">
        {[
          { key: 'newLead', label: 'New lead arrives', desc: 'Get notified instantly when a new lead is captured' },
          { key: 'booked', label: 'Appointment booked', desc: 'When a lead books a time on your calendar' },
          { key: 'qualified', label: 'Lead qualified', desc: 'When AI marks a lead as qualified (score ≥ 80)' },
          { key: 'lost', label: 'Lead marked lost', desc: 'When a lead enters the Lost stage' },
          { key: 'weekly', label: 'Weekly report digest', desc: 'Receive a weekly summary of pipeline performance' },
          { key: 'reactivation', label: 'Reactivation campaign results', desc: 'Summary of dormant lead re-engagement results' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-white">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
            </div>
            <Toggle checked={settings[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Change Password</h3>
        {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
          <div key={label} className="mb-3">
            <label className="text-xs text-slate-500 block mb-1.5">{label}</label>
            <input type="password" className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all" />
          </div>
        ))}
        <button className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2.5 rounded-xl font-medium transition-all">Update Password</button>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">Two-Factor Authentication</div>
            <div className="text-slate-500 text-sm mt-0.5">Add an extra layer of security to your account</div>
          </div>
          <button className="flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-sm px-4 py-2 rounded-xl font-medium hover:bg-emerald-600/30 transition-all">
            <Shield size={14} />
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  )
}

const tabContent = { profile: ProfileTab, integrations: IntegrationsTab, ai: AISettingsTab, notifications: NotificationsTab, security: SecurityTab }

export default function Settings() {
  const [active, setActive] = useState('profile')
  const ActiveTab = tabContent[active]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account, integrations, and AI configuration</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Tab sidebar */}
        <div className="md:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${active === id
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}>
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <ActiveTab />
        </div>
      </div>
    </div>
  )
}
