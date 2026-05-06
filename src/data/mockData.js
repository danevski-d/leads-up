export const metrics = {
  newLeads: { value: 47, change: +18, unit: '' },
  responseTime: { value: '43s', change: -12, unit: '' },
  conversionRate: { value: '34.2%', change: +6.1, unit: '' },
  bookedRevenue: { value: '$128,400', change: +22, unit: '' },
}

export const pipelineData = {
  new: [
    { id: 'l1', name: 'Marcus Johnson', company: 'Johnson HVAC', value: 4200, source: 'Web Form', time: '2m ago', phone: '+1 (555) 012-3456', email: 'marcus@johnsonhvac.com', score: 92 },
    { id: 'l2', name: 'Priya Mehta', company: 'Mehta Plumbing', value: 6800, source: 'Google Ads', time: '14m ago', phone: '+1 (555) 234-5678', email: 'priya@mehtaplumbing.com', score: 87 },
    { id: 'l3', name: 'Derek Walsh', company: 'Walsh Electric', value: 3100, source: 'Facebook', time: '31m ago', phone: '+1 (555) 345-6789', email: 'derek@walshelectric.com', score: 74 },
    { id: 'l4', name: 'Sandra Kim', company: 'Kim Roofing', value: 9500, source: 'Referral', time: '1h ago', phone: '+1 (555) 456-7890', email: 'sandra@kimroofing.com', score: 95 },
  ],
  contacted: [
    { id: 'l5', name: 'Tom Baxter', company: 'Baxter Landscaping', value: 2400, source: 'Web Form', time: '2h ago', phone: '+1 (555) 567-8901', email: 'tom@baxterland.com', score: 68 },
    { id: 'l6', name: 'Nina Patel', company: 'Patel Cleaning', value: 1800, source: 'Yelp', time: '3h ago', phone: '+1 (555) 678-9012', email: 'nina@patelcleaning.com', score: 71 },
    { id: 'l7', name: 'Craig Monroe', company: 'Monroe Pest Control', value: 5200, source: 'Google Ads', time: '5h ago', phone: '+1 (555) 789-0123', email: 'craig@monroepest.com', score: 83 },
  ],
  qualified: [
    { id: 'l8', name: 'Lisa Nguyen', company: 'Nguyen Contracting', value: 12000, source: 'Referral', time: '1d ago', phone: '+1 (555) 890-1234', email: 'lisa@nguyencontracting.com', score: 96 },
    { id: 'l9', name: 'James Orton', company: 'Orton Security', value: 8700, source: 'Web Form', time: '1d ago', phone: '+1 (555) 901-2345', email: 'james@ortonsecurity.com', score: 89 },
    { id: 'l10', name: 'Rachel Flores', company: 'Flores Electrical', value: 4400, source: 'Facebook', time: '2d ago', phone: '+1 (555) 012-3456', email: 'rachel@floreselectrical.com', score: 78 },
  ],
  booked: [
    { id: 'l11', name: 'Brian Stanton', company: 'Stanton Pool Service', value: 6300, source: 'Google Ads', time: '2d ago', phone: '+1 (555) 123-4567', email: 'brian@stantonpools.com', score: 91, bookDate: 'May 8, 10:00 AM' },
    { id: 'l12', name: 'Angela Torres', company: 'Torres Cleaning Co', value: 3200, source: 'Yelp', time: '3d ago', phone: '+1 (555) 234-5678', email: 'angela@torrescleaning.com', score: 85, bookDate: 'May 9, 2:00 PM' },
    { id: 'l13', name: 'Kevin Hall', company: 'Hall HVAC Solutions', value: 15000, source: 'Referral', time: '4d ago', phone: '+1 (555) 345-6789', email: 'kevin@hallhvac.com', score: 98, bookDate: 'May 7, 9:00 AM' },
    { id: 'l14', name: 'Diana Shaw', company: 'Shaw Painting', value: 4800, source: 'Web Form', time: '5d ago', phone: '+1 (555) 456-7890', email: 'diana@shawpainting.com', score: 82, bookDate: 'May 10, 11:00 AM' },
  ],
  lost: [
    { id: 'l15', name: 'Ron Bridges', company: 'Bridges Flooring', value: 7200, source: 'Facebook', time: '6d ago', phone: '+1 (555) 567-8901', email: 'ron@bridgesflooring.com', score: 55, lostReason: 'Went with competitor' },
    { id: 'l16', name: 'Tammy West', company: 'West Roofing', value: 2900, source: 'Google Ads', time: '1w ago', phone: '+1 (555) 678-9012', email: 'tammy@westroofing.com', score: 48, lostReason: 'Budget constraints' },
  ],
}

export const activityTimeline = [
  { id: 1, leadId: 'l8', type: 'ai_response', text: 'AI sent initial response', detail: '"Hi Lisa, thanks for reaching out about your contracting project..."', time: '2 days ago, 9:02 AM', icon: 'bot' },
  { id: 2, leadId: 'l8', type: 'lead_reply', text: 'Lead replied via SMS', detail: '"Yes I\'m interested. Can you give me a call tomorrow?"', time: '2 days ago, 9:47 AM', icon: 'message' },
  { id: 3, leadId: 'l8', type: 'qualification', text: 'AI qualified lead — Score: 96/100', detail: 'Budget confirmed: $10k–$15k. Timeline: within 30 days. Decision maker: Yes.', time: '2 days ago, 9:48 AM', icon: 'check' },
  { id: 4, leadId: 'l8', type: 'call', text: 'Call completed (14 min)', detail: 'Discussed project scope. Customer ready to move forward.', time: '1 day ago, 10:15 AM', icon: 'phone' },
  { id: 5, leadId: 'l8', type: 'ai_followup', text: 'AI sent follow-up with proposal link', detail: '"Lisa, here\'s the proposal we discussed. Click to review..."', time: '1 day ago, 10:20 AM', icon: 'bot' },
  { id: 6, leadId: 'l8', type: 'note', text: 'Note added by Alex', detail: 'Very engaged. High close probability. Wants to start ASAP.', time: '1 day ago, 11:00 AM', icon: 'note' },
]

export const revenueChart = [
  { month: 'Nov', value: 68000 },
  { month: 'Dec', value: 82000 },
  { month: 'Jan', value: 74000 },
  { month: 'Feb', value: 91000 },
  { month: 'Mar', value: 105000 },
  { month: 'Apr', value: 118000 },
  { month: 'May', value: 128400 },
]

export const sourceBreakdown = [
  { label: 'Google Ads', value: 38, color: '#6366f1' },
  { label: 'Web Form', value: 24, color: '#8b5cf6' },
  { label: 'Referral', value: 21, color: '#06b6d4' },
  { label: 'Facebook', value: 12, color: '#10b981' },
  { label: 'Yelp', value: 5, color: '#f59e0b' },
]

export const funnelData = [
  { stage: 'Leads Captured', count: 284, pct: 100 },
  { stage: 'AI Contacted', count: 271, pct: 95 },
  { stage: 'Responded', count: 189, pct: 67 },
  { stage: 'Qualified', count: 142, pct: 50 },
  { stage: 'Booked', count: 97, pct: 34 },
]

export const faqs = [
  {
    q: 'How fast does Leads Up respond to new leads?',
    a: 'Leads Up responds in an average of 43 seconds — 24/7, including weekends and holidays. No lead waits longer than 60 seconds for a first touch.',
  },
  {
    q: 'How does the AI qualify leads?',
    a: 'Our AI asks smart, conversational questions to determine budget, timeline, project scope, and decision-making authority. Each lead receives a score from 0–100 so your team knows exactly where to focus.',
  },
  {
    q: 'What happens to leads that don\'t respond?',
    a: 'Leads Up automatically enrolls them in a multi-touch follow-up sequence (SMS, email, and voicemail drops) over 14 days — based on the channel and time patterns that get the best results in your industry.',
  },
  {
    q: 'Can it integrate with my existing calendar and CRM?',
    a: 'Yes. Leads Up integrates natively with Google Calendar, Outlook, Calendly, ServiceTitan, HubSpot, Salesforce, and over 40 other tools via Zapier.',
  },
  {
    q: 'Is the AI messaging customizable?',
    a: 'Absolutely. You control the tone, scripts, and offer — the AI stays on-brand. You can also set business hours, service areas, and special rules for different lead sources.',
  },
  {
    q: 'What does "lead reactivation" mean?',
    a: 'Leads Up automatically identifies contacts in your database that went cold and runs targeted re-engagement campaigns via SMS and email. Most clients recover 10–20% of previously lost leads within the first 30 days.',
  },
]
