import { workflow, node, trigger, ifElse, expr } from '@n8n/workflow-sdk';

const SUPA_URL = 'https://xayroatliafknstvekcv.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZw5fDcTpjHYOJZPMx7FyWmvQlr4';

const supaHeadersBase = { parameters: [
  { name: 'apikey', value: SUPA_KEY },
  { name: 'Authorization', value: 'Bearer ' + SUPA_KEY },
  { name: 'Content-Type', value: 'application/json' }
] };

const supaHeadersReturn = { parameters: [
  { name: 'apikey', value: SUPA_KEY },
  { name: 'Authorization', value: 'Bearer ' + SUPA_KEY },
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Prefer', value: 'return=representation' }
] };

// TRIGGERS

const formTrigger = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2,
  config: {
    name: 'Trigger: Website Form',
    webhookId: 'lead-form-intake',
    parameters: { httpMethod: 'POST', path: 'lead-form-intake', responseMode: 'lastNode', options: {} }
  }
});

const gmailTrigger = trigger({
  type: 'n8n-nodes-base.gmailTrigger',
  version: 1,
  config: {
    name: 'Trigger: Gmail New Email',
    credentials: { gmailOAuth2: { id: 'iijHc4F8JFhpDDBo', name: 'Gmail OAuth2 API' } },
    parameters: {
      pollTimes: { item: [{ mode: 'everyMinute' }] },
      filters: { labelIds: ['INBOX'], q: 'is:unread -from:me' }
    }
  }
});

const retellTrigger = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2,
  config: {
    name: 'Trigger: Retell Call Ended',
    webhookId: 'retell-call-ended',
    parameters: { httpMethod: 'POST', path: 'retell-call-ended', responseMode: 'lastNode', options: {} }
  }
});

// -- NORMALIZE NODES ---
// Each normalize node extracts workspace_token from the incoming payload.
// - Form/Retell: token comes from the request body (hidden field or webhook config)
// - Gmail: no token (leads land as unassigned; admin reviews and assigns)

const normalizeForm = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Normalize: Form Lead',
    parameters: {
      jsCode: "const raw = $input.first().json;\nconst body = raw.body || raw;\nconst query = raw.query || {};\nconst wt = (body.workspace_token || body.wt || query.token || '').trim();\nreturn [{ json: {\n  workspace_token: wt,\n  source: 'website_form',\n  name: body.name || body.full_name || body.firstName || '',\n  email: (body.email || body.email_address || '').toLowerCase().trim(),\n  phone: body.phone || body.phone_number || '',\n  message: body.message || body.notes || '',\n  company: body.company || body.business_name || '',\n  budget: body.budget || '',\n  timeline: body.timeline || '',\n  service_interest: body.service || body.service_interest || ''\n}}];"
    }
  }
});

const normalizeGmail = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Normalize: Gmail Lead',
    parameters: {
      jsCode: "const email = $input.first().json;\nlet fromRaw = email.from || '';\nlet subject = email.subject || '';\nlet bodyText = email.text || email.snippet || '';\nif (email.payload) {\n  const headers = email.payload.headers || [];\n  if (!fromRaw) { const h = headers.find(h => h.name === 'From' || h.name === 'from'); if (h) fromRaw = h.value; }\n  if (!subject) { const h = headers.find(h => h.name === 'Subject' || h.name === 'subject'); if (h) subject = h.value; }\n  if (!bodyText && email.payload.body && email.payload.body.data) {\n    try { bodyText = Buffer.from(email.payload.body.data, 'base64').toString('utf8'); } catch(e) {}\n  }\n}\nconst nameMatch = fromRaw.match(/^([^<]+)/);\nconst emailMatch = fromRaw.match(/<([^>]+)>/) || fromRaw.match(/([\\w.-]+@[\\w.-]+\\.[\\w]+)/);\nconst senderName = nameMatch ? nameMatch[1].trim() : '';\nconst senderEmail = emailMatch ? emailMatch[1].trim().toLowerCase() : fromRaw.toLowerCase().trim();\nif (!senderEmail || senderEmail.includes('noreply') || senderEmail.includes('no-reply') || senderEmail.includes('mailer-daemon')) return [];\nreturn [{ json: {\n  workspace_token: '',\n  source: 'gmail',\n  name: senderName,\n  email: senderEmail,\n  phone: '',\n  message: 'Subject: ' + subject + '\\n\\n' + bodyText,\n  email_thread_id: email.threadId || '',\n  email_message_id: email.id || ''\n}}];"
    }
  }
});

const normalizeRetell = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Normalize: Retell Lead',
    parameters: {
      jsCode: "const body = $input.first().json;\nconst call = body.call || body;\nconst wt = (body.workspace_token || call.workspace_token || '').trim();\nconst transcript = call.transcript || call.full_transcript || '';\nconst callId = call.call_id || call.id || '';\nconst callerNumber = call.from_number || call.caller_id || '';\nconst emailMatch = transcript.match(/([\\w.-]+@[\\w.-]+\\.[\\w]{2,})/i);\nconst namePatterns = [/my name is ([A-Z][a-z]+ ?[A-Z]?[a-z]*)/i,/i(?:'m| am) ([A-Z][a-z]+ ?[A-Z]?[a-z]*)/i,/this is ([A-Z][a-z]+ ?[A-Z]?[a-z]*)/i];\nlet callerName = '';\nfor (const pat of namePatterns) { const m = transcript.match(pat); if (m) { callerName = m[1]; break; } }\nreturn [{ json: {\n  workspace_token: wt,\n  source: 'retell_call',\n  name: callerName,\n  email: emailMatch ? emailMatch[0].toLowerCase() : '',\n  phone: callerNumber,\n  message: transcript,\n  call_id: callId,\n  call_duration: call.call_length || call.duration || 0,\n  call_summary: (call.call_analysis && call.call_analysis.call_summary) ? call.call_analysis.call_summary : ''\n}}];"
    }
  }
});

// -- ATTACH WORKSPACE ---
// Fan-in from all 3 normalize nodes.
// Uses workspace_token to look up workspace_id + owner_user_id from Supabase.
// Falls back gracefully if token is missing or workspaces table doesn't exist yet.

const attachWorkspace = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Attach Workspace',
    parameters: {
      jsCode: "const lead = $input.first().json;\nconst token = (lead.workspace_token || '').trim();\nlet workspaceId = null;\nlet ownerUserId = null;\nif (token) {\n  try {\n    const r = await fetch(\n      'https://xayroatliafknstvekcv.supabase.co/rest/v1/workspaces?webhook_token=eq.' + encodeURIComponent(token) + '&select=id,owner_user_id&limit=1',\n      { headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZw5fDcTpjHYOJZPMx7FyWmvQlr4', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZw5fDcTpjHYOJZPMx7FyWmvQlr4' } }\n    );\n    const data = await r.json();\n    if (Array.isArray(data) && data.length > 0) {\n      workspaceId = data[0].id;\n      ownerUserId = data[0].owner_user_id;\n    }\n  } catch(e) {}\n}\nreturn [{ json: { ...lead, workspace_id: workspaceId, owner_user_id: ownerUserId } }];"
    }
  }
});

// -- CHECK LEAD EXISTS ---

const checkLeadExists = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4,
  config: {
    name: 'Supabase: Check Lead Exists',
    credentials: { httpHeaderAuth: { id: 'RBtWKSFsqtQqEVGN', name: 'Header Auth account' } },
    parameters: {
      url: '=' + SUPA_URL + '/rest/v1/leads?or=(email.eq.{{ $json.email }},phone.eq.{{ $json.phone }})&select=id,status,email,phone,workspace_id&limit=1',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: supaHeadersBase,
      options: {}
    }
  }
});

// -- EVALUATE LEAD EXISTS ---
// Combines checkLeadExists result with enriched lead from Attach Workspace.
// Only treats a lead as "existing" if it belongs to the same workspace.

const evaluateLeadExists = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Evaluate Lead Exists',
    parameters: {
      jsCode: "const supaResp = $input.first().json;\nconst records = Array.isArray(supaResp) ? supaResp : [];\nlet lead = {};\ntry { const ws = $items('Attach Workspace'); if (ws && ws.length > 0) lead = ws[0].json; } catch(e) {}\nconst wsId = lead.workspace_id || null;\nconst existing = records.find(r => r.workspace_id === wsId) || null;\nreturn [{ json: { ...lead, is_existing_lead: existing !== null, existing_lead_id: existing ? existing.id : null, existing_stage: existing ? existing.status : null } }];"
    }
  }
});

// -- AI QUALIFY ---

const systemPrompt = "You are a senior sales analyst for Leads Up, an AI revenue automation agency that builds AI voice receptionists, lead qualification systems, and AI revenue pipelines for service businesses.\n\nWHAT WE SELL:\n- AI Voice Receptionist (Retell + n8n): answers calls 24/7, qualifies, books meetings\n- Full Lead Pipeline Automation: instant response across phone, email, chat\n- Complete AI Revenue Engine: everything automated end to end\nPricing: Growth $2,400/mo | Scale $4,900/mo | Enterprise custom\n\nIDEAL CLIENT: Service business (HVAC, cleaning, dental, legal, agency, coach, consultant)\nHas inbound leads but losing them due to slow response. Revenue $5k+/mo.\nDecision maker, open to investing in automation.\n\nDISQUALIFIERS: No real business, wants free solution, budget under $500.\n\nTASK: Analyze the lead. Return ONLY valid JSON, no markdown:\n{\"lead_score\":0,\"lead_stage\":\"New\",\"qualification_notes\":\"\",\"estimated_value\":0,\"pain_points\":[],\"service_match\":\"\",\"is_qualified\":false,\"extracted_name\":\"\",\"extracted_email\":\"\",\"extracted_phone\":\"\",\"extracted_company\":\"\",\"extracted_budget\":\"\",\"extracted_timeline\":\"\",\"ai_reply_email\":\"Full reply from Maya at Leads Up. Max 150 words.\",\"ai_reply_subject\":\"Subject max 8 words\"}\n\nScoring: Budget $1k+:+3 | Clear problem:+2 | Timeline<60d:+2 | DM:+2 | Referral:+1\n7-10=qualified 4-6=nurture 0-3=not a fit\nestimated_value=USD deal value (0 if not a fit)";

const aiQualify = node({
  type: '@n8n/n8n-nodes-langchain.openAi',
  version: 1,
  config: {
    name: 'AI: Qualify Lead + Write Reply',
    credentials: { openAiApi: { id: 'aZLC2GUnsPfLg8ME', name: 'n8n free OpenAI API credits' } },
    parameters: {
      modelId: { __rl: true, value: 'gpt-4o', mode: 'list' },
      messages: {
        values: [
          { content: systemPrompt, role: 'system' },
          { content: "=Lead Source: {{ $json.source }}\nName: {{ $json.name }}\nEmail: {{ $json.email }}\nPhone: {{ $json.phone }}\nCompany: {{ $json.company }}\nBudget: {{ $json.budget }}\nTimeline: {{ $json.timeline }}\nService interest: {{ $json.service_interest }}\nMessage:\n{{ $json.message }}" }
        ]
      },
      options: { maxTokens: 1000, temperature: 0.3 }
    }
  }
});

// -- PARSE AI ---

const parseAI = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Parse AI Qualification',
    parameters: {
      jsCode: "const aiRaw = $input.first().json.message?.content || $input.first().json.text || '{}';\nconst lead = $('Evaluate Lead Exists').first().json;\nlet ai;\ntry {\n  const cleaned = aiRaw.replace(/```json|```/g, '').trim();\n  ai = JSON.parse(cleaned);\n} catch(e) {\n  ai = { lead_score:1, lead_stage:'New', qualification_notes:'Parse error', estimated_value:0, pain_points:[], service_match:'unknown', is_qualified:false, extracted_name:'', extracted_email:'', extracted_phone:'', extracted_company:'', extracted_budget:'', extracted_timeline:'', ai_reply_email:'Thank you for reaching out to Leads Up! We will be in touch shortly.\\n\\nBest,\\nMaya\\nLeads Up', ai_reply_subject:'Thanks for reaching out' };\n}\nconst name = lead.name || ai.extracted_name || '';\nconst email = lead.email || ai.extracted_email || '';\nconst phone = lead.phone || ai.extracted_phone || '';\nconst company = lead.company || ai.extracted_company || '';\nconst budget = lead.budget || ai.extracted_budget || '';\nconst timeline = lead.timeline || ai.extracted_timeline || '';\nlet stage = 'New';\nif (ai.lead_score >= 7) stage = 'Qualified';\nelse if (ai.lead_score >= 4) stage = 'Contacted';\nreturn [{ json: {\n  name, email, phone, company,\n  source: lead.source,\n  message: lead.message,\n  budget, timeline,\n  service_interest: lead.service_interest || ai.service_match,\n  lead_score: ai.lead_score,\n  lead_stage: stage,\n  is_qualified: ai.is_qualified,\n  estimated_value: ai.estimated_value,\n  qualification_notes: ai.qualification_notes,\n  pain_points: JSON.stringify(ai.pain_points),\n  service_match: ai.service_match,\n  ai_reply_email: ai.ai_reply_email,\n  ai_reply_subject: ai.ai_reply_subject,\n  is_existing_lead: lead.is_existing_lead,\n  existing_lead_id: lead.existing_lead_id,\n  existing_stage: lead.existing_stage,\n  workspace_id: lead.workspace_id || null,\n  owner_user_id: lead.owner_user_id || null,\n  email_thread_id: lead.email_thread_id || '',\n  call_id: lead.call_id || '',\n  call_duration: lead.call_duration || 0,\n  call_summary: lead.call_summary || '',\n  created_at: new Date().toISOString()\n}}];"
    }
  }
});

// -- BRANCH: EXISTING OR NEW ---

const existingOrNew = ifElse({
  version: 2.2,
  config: {
    name: 'Existing or New Lead?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [{ leftValue: expr('{{ $json.is_existing_lead }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and'
      }
    }
  }
});

// LEAD_BODY: columns that actually exist in the live leads table.
// workspace_id and user_id are included so leads are tied to the right client.
const LEAD_BODY = '={{ JSON.stringify({ name: $json.name, email: $json.email, phone: $json.phone, source: $json.source, notes: $json.message, call_duration: $json.call_duration, call_summary: $json.call_summary, qualified: $json.is_qualified, status: $json.lead_stage, workspace_id: $json.workspace_id, user_id: $json.owner_user_id }) }}';

// -- UPDATE EXISTING LEAD ---

const updateLead = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4,
  config: {
    name: 'Supabase: Update Existing Lead',
    credentials: { httpHeaderAuth: { id: 'RBtWKSFsqtQqEVGN', name: 'Header Auth account' } },
    parameters: {
      method: 'PATCH',
      url: '=' + SUPA_URL + '/rest/v1/leads?id=eq.{{ $json.existing_lead_id }}',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: supaHeadersReturn,
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: LEAD_BODY,
      options: {}
    }
  }
});

// -- INSERT NEW LEAD ---

const insertLead = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4,
  config: {
    name: 'Supabase: Insert New Lead',
    credentials: { httpHeaderAuth: { id: 'RBtWKSFsqtQqEVGN', name: 'Header Auth account' } },
    parameters: {
      method: 'POST',
      url: SUPA_URL + '/rest/v1/leads',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: supaHeadersReturn,
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ name: $json.name, email: $json.email, phone: $json.phone, source: $json.source, notes: $json.message, call_duration: $json.call_duration, call_summary: $json.call_summary, qualified: $json.is_qualified, status: $json.lead_stage, workspace_id: $json.workspace_id, user_id: $json.owner_user_id, created_at: $json.created_at }) }}',
      options: {}
    }
  }
});

// -- ATTACH LEAD ID ---

const attachLeadId = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Attach Supabase Lead ID',
    parameters: {
      jsCode: "const supaResp = $input.first().json;\nconst prev = $('Parse AI Qualification').first().json;\nconst record = Array.isArray(supaResp) ? supaResp[0] : supaResp;\nreturn [{ json: { ...prev, supabase_lead_id: record?.id || prev.existing_lead_id || null } }];"
    }
  }
});

// -- GMAIL SEND ---

const gmailSend = node({
  type: 'n8n-nodes-base.gmail',
  version: 2,
  config: {
    name: 'Gmail: Send AI Reply to Lead',
    credentials: { gmailOAuth2: { id: 'iijHc4F8JFhpDDBo', name: 'Gmail OAuth2 API' } },
    parameters: {
      operation: 'send',
      sendTo: '={{ $json.email }}',
      subject: '={{ $json.ai_reply_subject }}',
      emailType: 'text',
      message: '={{ $json.ai_reply_email }}',
      options: { appendAttribution: false }
    }
  }
});

// -- STAGE: CONTACTED ---

const stageContacted = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4,
  config: {
    name: 'Supabase: Stage → Contacted',
    credentials: { httpHeaderAuth: { id: 'RBtWKSFsqtQqEVGN', name: 'Header Auth account' } },
    parameters: {
      method: 'PATCH',
      url: '=' + SUPA_URL + '/rest/v1/leads?id=eq.{{ $json.supabase_lead_id }}',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: supaHeadersBase,
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={"status":"Contacted"}',
      options: {}
    }
  }
});

// -- BRANCH: IS QUALIFIED ---

const isQualified = ifElse({
  version: 2.2,
  config: {
    name: 'Is Qualified?',
    parameters: {
      conditions: {
        options: { caseSensitive: false, leftValue: '', typeValidation: 'loose' },
        conditions: [{ leftValue: expr('{{ $json.is_qualified }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and'
      }
    }
  }
});

// -- STAGE: QUALIFIED ---

const stageQualified = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4,
  config: {
    name: 'Supabase: Stage → Qualified',
    credentials: { httpHeaderAuth: { id: 'RBtWKSFsqtQqEVGN', name: 'Header Auth account' } },
    parameters: {
      method: 'PATCH',
      url: '=' + SUPA_URL + '/rest/v1/leads?id=eq.{{ $json.supabase_lead_id }}',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendHeaders: true,
      headerParameters: supaHeadersBase,
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: '={"status":"Qualified"}',
      options: {}
    }
  }
});

// -- RESPOND 200 OK ---

const respond200 = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1,
  config: {
    name: 'Respond 200 OK',
    parameters: {
      respondWith: 'json',
      responseBody: '={ "success": true, "message": "Lead received" }',
      options: { responseCode: 200 }
    }
  }
});

// -- WORKFLOW COMPOSITION ---
//
// Flow:
//   [Form/Gmail/Retell] → Normalize → Attach Workspace (fan-in)
//   → Check Lead Exists → Evaluate Lead Exists → AI Qualify → Parse AI
//   → Existing or New? → Update/Insert Lead → Attach Lead ID
//   → Has email? → Gmail Reply → Stage Contacted → Is Qualified?
//   → No email?  → Is Qualified?
//   → Qualified TRUE  → Stage Qualified → Respond 200
//   → Qualified FALSE → Respond 200

export default workflow('Y8addhiWa8ujdV6b', 'My workflow')
  // Three triggers normalize then fan-in at Attach Workspace
  .add(formTrigger).to(normalizeForm).to(attachWorkspace)
  .add(gmailTrigger).to(normalizeGmail).to(attachWorkspace)
  .add(retellTrigger).to(normalizeRetell).to(attachWorkspace)
  // Shared pipeline
  .add(attachWorkspace).to(checkLeadExists).to(evaluateLeadExists).to(aiQualify).to(parseAI)
  // Existing vs new lead branch
  .to(existingOrNew
    .onTrue(updateLead)
    .onFalse(insertLead))
  // Both branches converge at attachLeadId
  .add(updateLead).to(attachLeadId)
  .add(insertLead).to(attachLeadId)
  // Path A: no email → straight to qualification check
  .add(attachLeadId)
  .to(isQualified
    .onTrue(stageQualified.to(respond200))
    .onFalse(respond200))
  // Path B: has email → send AI reply → mark contacted → qualification check
  .add(attachLeadId)
  .to(gmailSend.to(stageContacted).to(isQualified));
