import { workflow, node, trigger, ifElse, expr } from '@n8n/workflow-sdk';

const SUPA_URL = 'https://xayroatliafknstvekcv.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZw5fDcTpjHYOJZPMx7FyWmvQlr4';

const supaBase = { parameters: [
  { name: 'apikey', value: SUPA_KEY },
  { name: 'Authorization', value: 'Bearer ' + SUPA_KEY },
  { name: 'Content-Type', value: 'application/json' }
]};

const supaReturn = { parameters: [
  { name: 'apikey', value: SUPA_KEY },
  { name: 'Authorization', value: 'Bearer ' + SUPA_KEY },
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Prefer', value: 'return=representation' }
]};

// ── TRIGGER ───────────────────────────────────────────────────────

const nurtureSchedule = trigger({
  type: 'n8n-nodes-base.scheduleTrigger', version: 1,
  config: {
    name: 'Schedule: Nurture Check',
    parameters: { rule: { interval: [{ field: 'hours', hoursInterval: 2 }] } }
  }
});

// ── FETCH NURTURE LEADS ───────────────────────────────────────────
// responseFormat:'text' + neverError always produces 1 output item

const httpNurtureLeads = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Fetch Nurture Leads',
    parameters: {
      method: 'GET',
      url: '={{ "https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?status=eq.contacted&next_followup_at=lte." + encodeURIComponent(new Date().toISOString()) + "&nurture_step=lte.3&select=id,name,email,phone,company,workspace_id,nurture_step&limit=100" }}',
      sendHeaders: true,
      headerParameters: supaBase,
      options: { response: { response: { responseFormat: 'text', neverError: true } } }
    }
  }
});

// ── PARSE LEADS + BUILD WORKSPACE URL ────────────────────────────
// Returns [] if no leads (stops pipeline). Returns [{leads_json, ws_url}].

const parseNurtureLeads = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Parse Nurture Leads',
    parameters: {
      jsCode: "const raw=$input.first()?.json||{};let leads=[];if(typeof raw.data==='string'){try{leads=JSON.parse(raw.data)||[];}catch(e){}}if(!Array.isArray(leads)||leads.length===0)return[];const wsIds=[...new Set(leads.map(l=>l.workspace_id).filter(Boolean))];const base='https://xayroatliafknstvekcv.supabase.co/rest/v1/workspaces';const wsUrl=wsIds.length>0?base+'?id=in.('+wsIds.join(',')+')'+'&select=id,reply_from_name':base+'?id=eq.00000000-0000-0000-0000-000000000000&select=id,reply_from_name';return[{json:{leads_json:JSON.stringify(leads),ws_url:wsUrl}}];"
    }
  }
});

// ── FETCH WORKSPACES (for reply_from_name) ────────────────────────

const httpWorkspaces = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Fetch Workspaces',
    parameters: {
      method: 'GET',
      url: '={{ $json.ws_url }}',
      sendHeaders: true,
      headerParameters: supaBase,
      options: { response: { response: { responseFormat: 'text', neverError: true } } }
    }
  }
});

// ── BUILD EMAIL ITEMS ─────────────────────────────────────────────
// Cross-refs Parse Nurture Leads for lead list; $input = workspace response.
// Returns one item per lead with email content + new nurture state.

const buildEmailItems = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Build Email Items',
    parameters: {
      jsCode: "let leads=[];try{leads=JSON.parse($('Parse Nurture Leads').first()?.json?.leads_json||'[]');}catch(e){}const raw=$input.first()?.json||{};let wsList=[];if(typeof raw.data==='string'){try{wsList=JSON.parse(raw.data)||[];}catch(e){}}const wsMap={};if(Array.isArray(wsList))wsList.forEach(w=>{wsMap[w.id]=w;});const now=Date.now();return leads.map(l=>{const ws=wsMap[l.workspace_id]||{};const step=l.nurture_step||0;const name=l.name||'there';const rf=ws.reply_from_name||'Maya';let subject,body,newStep,newStatus,newNext;if(step<=1){subject='Quick follow-up on your inquiry';body='Hi '+name+',\\n\\nI wanted to follow up on your recent submission. We have helped similar businesses solve exactly this -- would you have 15 minutes this week for a quick call?\\n\\nBest,\\n'+rf;newStep=2;newStatus='contacted';newNext=new Date(now+172800000).toISOString();}else if(step===2){subject='Still thinking it over?';body='Hi '+name+',\\n\\nJust checking in -- I know timing can be tricky. If this week does not work, no problem at all. Just reply with a good time and we will make it work.\\n\\nBest,\\n'+rf;newStep=3;newStatus='contacted';newNext=new Date(now+345600000).toISOString();}else{subject='Last check-in from us';body='Hi '+name+',\\n\\nI have reached out a few times and have not heard back -- I will go ahead and close your file for now. If your situation changes, feel free to reach out anytime.\\n\\nWishing you all the best.\\n\\nBest,\\n'+rf;newStep=4;newStatus='lost';newNext=null;}return{json:{...l,emailSubject:subject,emailBody:body,nurture_step_new:newStep,status_new:newStatus,next_followup_at_new:newNext}};});"
    }
  }
});

// ── EMAIL ROUTING ─────────────────────────────────────────────────

const hasEmail = ifElse({
  version: 2.2,
  config: {
    name: 'Has Email?',
    parameters: {
      conditions: {
        options: { caseSensitive: false, leftValue: '', typeValidation: 'loose' },
        conditions: [{ leftValue: expr('{{ $json.email }}'), operator: { type: 'string', operation: 'notEmpty' } }],
        combinator: 'and'
      }
    }
  }
});

const sendNurture = node({
  type: 'n8n-nodes-base.gmail', version: 2,
  config: {
    name: 'Gmail: Send Nurture',
    credentials: { gmailOAuth2: { id: 'iijHc4F8JFhpDDBo', name: 'Gmail OAuth2 API' } },
    parameters: {
      operation: 'send',
      sendTo: '={{ $json.email }}',
      subject: '={{ $json.emailSubject }}',
      emailType: 'text',
      message: '={{ $json.emailBody }}',
      options: { appendAttribution: false }
    }
  }
});

// ── PREP UPDATE ───────────────────────────────────────────────────
// After Gmail the $json is the Gmail API response (not lead data).
// Use .item to recover the paired Build Email Items output for this lead.

const prepNurtureUpdate = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Prep Nurture Update',
    parameters: {
      jsCode: "const lead=$('Build Email Items').item.json;return[{json:{lead_id:lead.id,nurture_step:lead.nurture_step_new,lead_status:lead.status_new,next_followup_at:lead.next_followup_at_new}}];"
    }
  }
});

// ── SUPABASE UPDATES ──────────────────────────────────────────────

const updateAfterNurture = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'Update: After Nurture Email',
    parameters: {
      method: 'PATCH',
      url: '={{ "https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?id=eq." + $json.lead_id }}',
      sendHeaders: true, headerParameters: supaReturn,
      sendBody: true, contentType: 'json', specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ nurture_step: $json.nurture_step, status: $json.lead_status, next_followup_at: $json.next_followup_at, last_contacted_at: new Date().toISOString() }) }}',
      options: { response: { response: { neverError: true } } }
    }
  }
});

const markLostNoEmail = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'Update: Mark Lost (no email)',
    parameters: {
      method: 'PATCH',
      url: '={{ "https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?id=eq." + $json.id }}',
      sendHeaders: true, headerParameters: supaReturn,
      sendBody: true, contentType: 'json', specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ status: "lost", nurture_step: 4, next_followup_at: null, last_contacted_at: new Date().toISOString() }) }}',
      options: { response: { response: { neverError: true } } }
    }
  }
});

// ── WORKFLOW COMPOSITION ──────────────────────────────────────────
//
//  Schedule (2h) → HTTP: Fetch Nurture Leads (text, neverError)
//  → Parse Nurture Leads (Code: returns [] or [{leads_json, ws_url}])
//  → HTTP: Fetch Workspaces (text, neverError)
//  → Build Email Items (Code: N items, one per lead)
//  → Has Email?
//    → YES: Gmail Send → Prep Nurture Update (Code: .item ref) → HTTP PATCH
//    → NO:  HTTP PATCH mark lost

export default workflow('zKjmjq3d7PYTEx9B', 'Nurture Loop')
  .add(nurtureSchedule)
  .to(httpNurtureLeads)
  .to(parseNurtureLeads)
  .to(httpWorkspaces)
  .to(buildEmailItems)
  .to(hasEmail
    .onTrue(sendNurture.to(prepNurtureUpdate).to(updateAfterNurture))
    .onFalse(markLostNoEmail)
  );
