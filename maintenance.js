import { workflow, node, trigger, ifElse, expr } from '@n8n/workflow-sdk';

const SUPA_URL = 'https://xayroatliafknstvekcv.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZw5fDcTpjHYOJZPMx7FyWmvQlr4';

// ── TRIGGERS ──────────────────────────────────────────────────────

// Runs every day at 9:00 AM (anomaly check)
const dailySchedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger', version: 1,
  config: {
    name: 'Schedule: Daily 9am',
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * *' }] }
    }
  }
});

// Runs every Monday at 9:00 AM (weekly report)
const weeklySchedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger', version: 1,
  config: {
    name: 'Schedule: Weekly Monday',
    parameters: {
      rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * 1' }] }
    }
  }
});

// ── DAILY: ANOMALY CHECK ──────────────────────────────────────────
// Per workspace: alert if no new leads in 48h, or leads stuck in 'new' for >6h

const checkAnomalies = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Check Anomalies',
    parameters: {
      jsCode: "const SK='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZow5fDcTpjHYOJZPMx7FyWmvQlr4';const h={'apikey':SK,'Authorization':'Bearer '+SK};const now=Date.now();const ago48h=new Date(now-172800000).toISOString();const ago6h=new Date(now-21600000).toISOString();const wr=await fetch('https://xayroatliafknstvekcv.supabase.co/rest/v1/workspaces?status=eq.active&select=id,name,owner_email,notification_email',{headers:h});const workspaces=await wr.json();if(!Array.isArray(workspaces)||workspaces.length===0)return[];const alerts=[];for(const ws of workspaces){const notifEmail=ws.notification_email||ws.owner_email;if(!notifEmail)continue;const lr=await fetch('https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?workspace_id=eq.'+ws.id+'&created_at=gte.'+encodeURIComponent(ago48h)+'&select=id&limit=1',{headers:h});const recentLeads=await lr.json();if(!Array.isArray(recentLeads)||recentLeads.length===0){alerts.push({json:{to:notifEmail,subject:'Alert: No new leads in 48 hours -- '+ws.name,body:'Hi,\\n\\nYour workspace '+ws.name+' has not received any new leads in the past 48 hours.\\n\\nThis may indicate an issue with your form, webhook, or lead sources. Please check your integrations.\\n\\nLeadsUp System'}});}const sr=await fetch('https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?workspace_id=eq.'+ws.id+'&status=eq.new&created_at=lte.'+encodeURIComponent(ago6h)+'&select=id&limit=1',{headers:h});const stuckLeads=await sr.json();if(Array.isArray(stuckLeads)&&stuckLeads.length>0){alerts.push({json:{to:notifEmail,subject:'Alert: Lead stuck in New status -- '+ws.name,body:'Hi,\\n\\nOne or more leads in '+ws.name+' have been sitting in New status for more than 6 hours without being contacted.\\n\\nPlease check your pipeline:\\nhttps://useleadsup.com/app/leads\\n\\nLeadsUp System'}});}}return alerts;"
    }
  }
});

// ── SEND ANOMALY ALERTS ───────────────────────────────────────────

const sendAnomalyAlert = node({
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

// ── WEEKLY: PIPELINE REPORT ───────────────────────────────────────
// Per workspace: counts leads by status, emails summary report

const generateReports = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Generate Weekly Reports',
    parameters: {
      jsCode: "const SK='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZow5fDcTpjHYOJZPMx7FyWmvQlr4';const h={'apikey':SK,'Authorization':'Bearer '+SK};const ago7d=new Date(Date.now()-604800000).toISOString();const wr=await fetch('https://xayroatliafknstvekcv.supabase.co/rest/v1/workspaces?status=eq.active&select=id,name,owner_email,notification_email',{headers:h});const workspaces=await wr.json();if(!Array.isArray(workspaces)||workspaces.length===0)return[];const reports=[];for(const ws of workspaces){const notifEmail=ws.notification_email||ws.owner_email;if(!notifEmail)continue;const lr=await fetch('https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?workspace_id=eq.'+ws.id+'&select=status,lead_score,created_at',{headers:h});const leads=await lr.json();if(!Array.isArray(leads))continue;const counts={new:0,contacted:0,qualified:0,booked:0,won:0,lost:0};leads.forEach(l=>{if(counts[l.status]!==undefined)counts[l.status]++;});const thisWeek=leads.filter(l=>l.created_at>=ago7d).length;const avgScore=leads.length>0?Math.round(leads.reduce((s,l)=>s+(l.lead_score||0),0)/leads.length):0;const body='Weekly Pipeline Report -- '+ws.name+'\\n'+'Week ending '+new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})+'\\n\\n'+'New leads this week: '+thisWeek+'\\nTotal leads all time: '+leads.length+'\\nAverage BANT score: '+avgScore+'/10\\n\\nPIPELINE BREAKDOWN:\\n'+'  New:       '+counts.new+'\\n'+'  Contacted: '+counts.contacted+'\\n'+'  Qualified: '+counts.qualified+'\\n'+'  Booked:    '+counts.booked+'\\n'+'  Won:       '+counts.won+'\\n'+'  Lost:      '+counts.lost+'\\n\\nView your full dashboard:\\nhttps://useleadsup.com/app/dashboard\\n\\nLeadsUp';reports.push({json:{to:notifEmail,subject:'Weekly report: '+thisWeek+' new leads this week -- '+ws.name,body}});}return reports;"
    }
  }
});

// ── SEND WEEKLY REPORTS ───────────────────────────────────────────

const sendWeeklyReport = node({
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
//  Daily 9am → Check Anomalies (returns N alert items) → Send Alert emails
//  Monday 9am → Generate Reports (returns N report items) → Send reports

export default workflow('', 'Maintenance and Reports')
  .add(dailySchedule).to(checkAnomalies).to(sendAnomalyAlert)
  .add(weeklySchedule).to(generateReports).to(sendWeeklyReport);
