import { workflow, node, trigger } from '@n8n/workflow-sdk';

const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZw5fDcTpjHYOJZPMx7FyWmvQlr4';

const supaBase = { parameters: [
  { name: 'apikey', value: SUPA_KEY },
  { name: 'Authorization', value: 'Bearer ' + SUPA_KEY },
  { name: 'Content-Type', value: 'application/json' }
]};

// ═══════════════════════════════════════════════════════════════
//  DAILY ANOMALY FLOW  (runs every day at 9am)
// ═══════════════════════════════════════════════════════════════

const dailySchedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger', version: 1,
  config: {
    name: 'Schedule: Daily 9am',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * *' }] } }
  }
});

// Step 1: Fetch active workspaces

const httpDailyWs = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Daily Workspaces',
    parameters: {
      method: 'GET',
      url: 'https://xayroatliafknstvekcv.supabase.co/rest/v1/workspaces?status=eq.active&select=id,name,owner_email,notification_email',
      sendHeaders: true,
      headerParameters: supaBase,
      options: { response: { response: { responseFormat: 'text', neverError: true } } }
    }
  }
});

// Step 2: Parse workspaces, build query URLs for anomaly checks

const parseDailyWs = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Parse Daily Workspaces',
    parameters: {
      jsCode: "const raw=$input.first()?.json||{};let ws=[];if(typeof raw.data==='string'){try{ws=JSON.parse(raw.data)||[];}catch(e){}}if(!Array.isArray(ws)||ws.length===0)return[];const ids=ws.map(w=>w.id).filter(Boolean);const now=Date.now();const ago48h=new Date(now-172800000).toISOString();const ago6h=new Date(now-21600000).toISOString();const base='https://xayroatliafknstvekcv.supabase.co/rest/v1/leads';const recentUrl=base+'?workspace_id=in.('+ids.join(',')+')'+'&created_at=gte.'+encodeURIComponent(ago48h)+'&select=id,workspace_id&limit=500';const stuckUrl=base+'?workspace_id=in.('+ids.join(',')+')'+'&status=eq.new&created_at=lte.'+encodeURIComponent(ago6h)+'&select=id,workspace_id&limit=500';return[{json:{workspaces_json:JSON.stringify(ws),recent_url:recentUrl,stuck_url:stuckUrl}}];"
    }
  }
});

// Step 3: Fetch leads from last 48h (to detect workspaces with no recent activity)

const httpRecentLeads = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Fetch Recent Leads',
    parameters: {
      method: 'GET',
      url: '={{ $json.recent_url }}',
      sendHeaders: true,
      headerParameters: supaBase,
      options: { response: { response: { responseFormat: 'text', neverError: true } } }
    }
  }
});

// Step 4: Fetch leads stuck in 'new' status for >6h

const httpStuckLeads = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Fetch Stuck Leads',
    parameters: {
      method: 'GET',
      url: "={{ $('Parse Daily Workspaces').first().json.stuck_url }}",
      sendHeaders: true,
      headerParameters: supaBase,
      options: { response: { response: { responseFormat: 'text', neverError: true } } }
    }
  }
});

// Step 5: Build alert items — one item per alert email to send

const buildAlerts = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Build Anomaly Alerts',
    parameters: {
      jsCode: "let workspaces=[];try{workspaces=JSON.parse($('Parse Daily Workspaces').first()?.json?.workspaces_json||'[]');}catch(e){}const rawRecent=$('HTTP: Fetch Recent Leads').first()?.json||{};let recentLeads=[];if(typeof rawRecent.data==='string'){try{recentLeads=JSON.parse(rawRecent.data)||[];}catch(e){}}const recentWsIds=new Set(recentLeads.map(l=>l.workspace_id).filter(Boolean));const rawStuck=$input.first()?.json||{};let stuckLeads=[];if(typeof rawStuck.data==='string'){try{stuckLeads=JSON.parse(rawStuck.data)||[];}catch(e){}}const stuckWsIds=new Set(stuckLeads.map(l=>l.workspace_id).filter(Boolean));const alerts=[];for(const ws of workspaces){const to=ws.notification_email||ws.owner_email;if(!to)continue;if(!recentWsIds.has(ws.id)){alerts.push({json:{to,subject:'Alert: No new leads in 48 hours -- '+ws.name,body:'Hi,\\n\\nYour workspace '+ws.name+' has not received any new leads in the past 48 hours.\\n\\nThis may indicate an issue with your form, webhook, or lead sources. Please check your integrations.\\n\\nLeadsUp System'}});}if(stuckWsIds.has(ws.id)){alerts.push({json:{to,subject:'Alert: Lead stuck in New status -- '+ws.name,body:'Hi,\\n\\nOne or more leads in '+ws.name+' have been sitting in New status for more than 6 hours without being contacted.\\n\\nPlease check your pipeline:\\nhttps://useleadsup.com/app/leads\\n\\nLeadsUp System'}});}}return alerts;"
    }
  }
});

// Step 6: Send each alert

const sendAlert = node({
  type: 'n8n-nodes-base.gmail', version: 2,
  config: {
    name: 'Gmail: Send Alert',
    credentials: { gmailOAuth2: { id: 'iijHc4F8JFhpDDBo', name: 'Gmail OAuth2 API' } },
    parameters: {
      operation: 'send',
      sendTo: '={{ $json.to }}',
      subject: '={{ $json.subject }}',
      emailType: 'text',
      message: '={{ $json.body }}',
      options: { appendAttribution: false }
    }
  }
});

// ═══════════════════════════════════════════════════════════════
//  WEEKLY REPORT FLOW  (runs every Monday at 9am)
// ═══════════════════════════════════════════════════════════════

const weeklySchedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger', version: 1,
  config: {
    name: 'Schedule: Weekly Monday',
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * 1' }] } }
  }
});

// Step 1: Fetch active workspaces

const httpWeeklyWs = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Weekly Workspaces',
    parameters: {
      method: 'GET',
      url: 'https://xayroatliafknstvekcv.supabase.co/rest/v1/workspaces?status=eq.active&select=id,name,owner_email,notification_email',
      sendHeaders: true,
      headerParameters: supaBase,
      options: { response: { response: { responseFormat: 'text', neverError: true } } }
    }
  }
});

// Step 2: Parse workspaces, build leads URL (all leads for all workspaces)

const parseWeeklyWs = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Parse Weekly Workspaces',
    parameters: {
      jsCode: "const raw=$input.first()?.json||{};let ws=[];if(typeof raw.data==='string'){try{ws=JSON.parse(raw.data)||[];}catch(e){}}if(!Array.isArray(ws)||ws.length===0)return[];const ids=ws.map(w=>w.id).filter(Boolean);const ago7d=new Date(Date.now()-604800000).toISOString();const leadsUrl='https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?workspace_id=in.('+ids.join(',')+')'+'&select=status,lead_score,created_at,workspace_id';return[{json:{workspaces_json:JSON.stringify(ws),leads_url:leadsUrl,week_start:ago7d}}];"
    }
  }
});

// Step 3: Fetch all leads for those workspaces

const httpAllLeads = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Fetch All Leads',
    parameters: {
      method: 'GET',
      url: '={{ $json.leads_url }}',
      sendHeaders: true,
      headerParameters: supaBase,
      options: { response: { response: { responseFormat: 'text', neverError: true } } }
    }
  }
});

// Step 4: Build one report item per workspace

const buildReports = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Build Weekly Reports',
    parameters: {
      jsCode: "let workspaces=[];let weekStart='';try{const pw=$('Parse Weekly Workspaces').first()?.json||{};workspaces=JSON.parse(pw.workspaces_json||'[]');weekStart=pw.week_start||'';}catch(e){}const raw=$input.first()?.json||{};let allLeads=[];if(typeof raw.data==='string'){try{allLeads=JSON.parse(raw.data)||[];}catch(e){}}const leadsMap={};for(const l of allLeads){if(!leadsMap[l.workspace_id])leadsMap[l.workspace_id]=[];leadsMap[l.workspace_id].push(l);}const reports=[];for(const ws of workspaces){const to=ws.notification_email||ws.owner_email;if(!to)continue;const leads=leadsMap[ws.id]||[];const counts={new:0,contacted:0,qualified:0,booked:0,won:0,lost:0};leads.forEach(l=>{if(counts[l.status]!==undefined)counts[l.status]++;});const thisWeek=leads.filter(l=>l.created_at>=weekStart).length;const avgScore=leads.length>0?Math.round(leads.reduce((s,l)=>s+(l.lead_score||0),0)/leads.length):0;const dateStr=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});const body='Weekly Pipeline Report -- '+ws.name+'\\nWeek ending '+dateStr+'\\n\\nNew leads this week: '+thisWeek+'\\nTotal leads all time: '+leads.length+'\\nAverage BANT score: '+avgScore+'/10\\n\\nPIPELINE BREAKDOWN:\\n  New:       '+counts.new+'\\n  Contacted: '+counts.contacted+'\\n  Qualified: '+counts.qualified+'\\n  Booked:    '+counts.booked+'\\n  Won:       '+counts.won+'\\n  Lost:      '+counts.lost+'\\n\\nView your full dashboard:\\nhttps://useleadsup.com/app/dashboard\\n\\nLeadsUp';reports.push({json:{to,subject:'Weekly report: '+thisWeek+' new leads this week -- '+ws.name,body}});}return reports;"
    }
  }
});

// Step 5: Send each report

const sendReport = node({
  type: 'n8n-nodes-base.gmail', version: 2,
  config: {
    name: 'Gmail: Send Weekly Report',
    credentials: { gmailOAuth2: { id: 'iijHc4F8JFhpDDBo', name: 'Gmail OAuth2 API' } },
    parameters: {
      operation: 'send',
      sendTo: '={{ $json.to }}',
      subject: '={{ $json.subject }}',
      emailType: 'text',
      message: '={{ $json.body }}',
      options: { appendAttribution: false }
    }
  }
});

// ── WORKFLOW COMPOSITION ──────────────────────────────────────────
//
//  DAILY:  Schedule → HTTP Workspaces → Parse Workspaces
//          → HTTP Recent Leads → HTTP Stuck Leads → Build Alerts → Gmail
//
//  WEEKLY: Schedule → HTTP Workspaces → Parse Workspaces
//          → HTTP All Leads → Build Reports → Gmail

export default workflow('jl3X1ozcS2w6kI96', 'Maintenance & Reports')
  // Daily anomaly flow
  .add(dailySchedule)
  .to(httpDailyWs)
  .to(parseDailyWs)
  .to(httpRecentLeads)
  .to(httpStuckLeads)
  .to(buildAlerts)
  .to(sendAlert)
  // Weekly report flow
  .add(weeklySchedule)
  .to(httpWeeklyWs)
  .to(parseWeeklyWs)
  .to(httpAllLeads)
  .to(buildReports)
  .to(sendReport);
