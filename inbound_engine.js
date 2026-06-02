import { workflow, node, trigger, ifElse, expr } from '@n8n/workflow-sdk';

const SUPA_URL = 'https://xayroatliafknstvekcv.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheXJvYXRsaWFma25zdHZla2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4MTEwMywiZXhwIjoyMDkzNjU3MTAzfQ.TwxYPBLo3XJFc28gZw5fDcTpjHYOJZPMx7FyWmvQlr4';

const supaBase = { parameters: [
  { name: 'apikey', value: SUPA_KEY },
  { name: 'Authorization', value: 'Bearer ' + SUPA_KEY },
  { name: 'Content-Type', value: 'application/json' }
] };

const supaReturn = { parameters: [
  { name: 'apikey', value: SUPA_KEY },
  { name: 'Authorization', value: 'Bearer ' + SUPA_KEY },
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Prefer', value: 'return=representation' }
] };

// ── TRIGGERS ──────────────────────────────────────────────────────

const formTrigger = trigger({
  type: 'n8n-nodes-base.formTrigger', version: 2.5,
  config: {
    name: 'On form submission',
    webhookId: 'ded227da-feff-4159-b0d8-83893d946900',
    parameters: {
      formTitle: 'Info',
      formFields: {
        values: [
          { fieldLabel: 'Name' },
          { fieldLabel: 'Company name' },
          { fieldLabel: 'Email', fieldType: 'email' },
          { fieldLabel: 'Phone Number', fieldType: 'number' },
          { fieldLabel: 'Question' }
        ]
      },
      options: {}
    }
  }
});

const gmailTrigger = trigger({
  type: 'n8n-nodes-base.gmailTrigger', version: 1,
  config: {
    name: 'Trigger: Gmail Inbox',
    credentials: { gmailOAuth2: { id: 'iijHc4F8JFhpDDBo', name: 'Gmail OAuth2 API' } },
    parameters: {
      pollTimes: { item: [{ mode: 'everyMinute' }] },
      filters: { labelIds: ['INBOX'], q: 'is:unread -from:me' }
    }
  }
});

const retellTrigger = trigger({
  type: 'n8n-nodes-base.webhook', version: 2,
  config: {
    name: 'Trigger: Retell Call',
    webhookId: 'retell-call-ended',
    parameters: { httpMethod: 'POST', path: 'retell-call-ended', responseMode: 'onReceived', options: {} }
  }
});

// ── NORMALIZE ─────────────────────────────────────────────────────

const normalizeForm = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Normalize: Form',
    parameters: {
      jsCode: "const d=$input.first()?.json||{};const wt=(d.query?.workspace_token||d.query?.wt||'').trim();const name=(d.Name||d.name||'').trim();const email=(d.Email||d.email||'').toLowerCase().trim();const phone=String(d['Phone Number']||d.phone||'').trim();const message=(d.Question||d.message||d.notes||'').trim();const company=(d['Company name']||d.company||'').trim();return[{json:{workspace_token:wt,source:'website_form',name,email,phone,message,company,budget:'',timeline:'',service_interest:''}}];"
    }
  }
});

const normalizeGmail = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Normalize: Gmail',
    parameters: {
      jsCode: "const email=$input.first().json;let fromRaw=email.from||'';let subject=email.subject||'';let bodyText=email.text||email.snippet||'';if(email.payload){const headers=email.payload.headers||[];if(!fromRaw){const h=headers.find(h=>h.name==='From'||h.name==='from');if(h)fromRaw=h.value;}if(!subject){const h=headers.find(h=>h.name==='Subject'||h.name==='subject');if(h)subject=h.value;}if(!bodyText&&email.payload.body&&email.payload.body.data){try{bodyText=Buffer.from(email.payload.body.data,'base64').toString('utf8');}catch(e){}}}const nameMatch=fromRaw.match(/^([^<]+)/);const emailMatch=fromRaw.match(/<([^>]+)>/)||fromRaw.match(/([\\w.-]+@[\\w.-]+\\.[\\w]+)/);const senderName=nameMatch?nameMatch[1].trim():'';const senderEmail=emailMatch?emailMatch[1].trim().toLowerCase():fromRaw.toLowerCase().trim();if(!senderEmail||senderEmail.includes('noreply')||senderEmail.includes('no-reply')||senderEmail.includes('mailer-daemon'))return[];return[{json:{workspace_token:'',source:'gmail',name:senderName,email:senderEmail,phone:'',message:'Subject: '+subject+'\\n\\n'+bodyText,email_thread_id:email.threadId||'',email_message_id:email.id||''}}];"
    }
  }
});

const normalizeRetell = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Normalize: Retell',
    parameters: {
      jsCode: "const body=$input.first().json;const call=body.call||body;const wt=(body.workspace_token||call.workspace_token||'').trim();const transcript=call.transcript||call.full_transcript||'';const callId=call.call_id||call.id||'';const callerNumber=call.from_number||call.caller_id||'';const emailMatch=transcript.match(/([\\w.-]+@[\\w.-]+\\.[\\w]{2,})/i);const namePatterns=[/my name is ([A-Z][a-z]+ ?[A-Z]?[a-z]*)/i,/i(?:'m| am) ([A-Z][a-z]+ ?[A-Z]?[a-z]*)/i,/this is ([A-Z][a-z]+ ?[A-Z]?[a-z]*)/i];let callerName='';for(const pat of namePatterns){const m=transcript.match(pat);if(m){callerName=m[1];break;}}return[{json:{workspace_token:wt,source:'retell_call',name:callerName,email:emailMatch?emailMatch[0].toLowerCase():'',phone:callerNumber,message:transcript,call_id:callId,call_duration:call.call_length||call.duration||0,call_summary:(call.call_analysis&&call.call_analysis.call_summary)?call.call_analysis.call_summary:''}}];"
    }
  }
});

// ── FETCH WORKSPACE ───────────────────────────────────────────────
// HTTP Request with responseFormat:'text' → always returns exactly 1 item
// regardless of whether Supabase returns [] or [{...}]

const fetchWorkspace = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Fetch Workspace',
    parameters: {
      method: 'GET',
      url: '=https://xayroatliafknstvekcv.supabase.co/rest/v1/workspaces?webhook_token=eq.{{ $json.workspace_token }}&select=id,owner_user_id,owner_email,notification_email,calendly_link,reply_from_name,name&limit=1',
      sendHeaders: true,
      headerParameters: supaBase,
      options: {
        response: { response: { responseFormat: 'text', neverError: true } }
      }
    }
  }
});

// ── MERGE WORKSPACE ───────────────────────────────────────────────
// Parses the text response from Supabase; grabs lead from whichever
// normalizer ran in this execution (only one fires per execution).

const mergeWorkspace = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Merge Workspace',
    parameters: {
      jsCode: "const raw=$input.first()?.json||{};let ws={};if(typeof raw.data==='string'){try{const arr=JSON.parse(raw.data);if(Array.isArray(arr)&&arr.length>0)ws=arr[0];}catch(e){}}else if(raw.id){ws=raw;}let lead={};const nodeNames=['Normalize: Form','Normalize: Gmail','Normalize: Retell'];for(const nn of nodeNames){try{const item=$(nn).first();if(item&&item.json&&(item.json.email||item.json.source)){lead=item.json;break;}}catch(e){}}return[{json:{...lead,workspace_id:ws.id||null,owner_user_id:ws.owner_user_id||null,owner_email:ws.owner_email||'',notification_email:ws.notification_email||ws.owner_email||'',calendly_link:ws.calendly_link||'',reply_from_name:ws.reply_from_name||'Maya',workspace_name:ws.name||''}}];"
    }
  }
});

// ── FETCH LEAD CHECK ──────────────────────────────────────────────
// HTTP Request with responseFormat:'text' → always returns exactly 1 item

const fetchLead = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'HTTP: Check Lead',
    parameters: {
      method: 'GET',
      url: '={{ "https://xayroatliafknstvekcv.supabase.co/rest/v1/leads?email=eq." + encodeURIComponent($json.email||"") + "&select=id,status,email,phone&limit=1" }}',
      sendHeaders: true,
      headerParameters: supaBase,
      options: {
        response: { response: { responseFormat: 'text', neverError: true } }
      }
    }
  }
});

// ── EVALUATE LEAD ─────────────────────────────────────────────────
// Parses lead-check text response; reads lead from Merge Workspace node

const evalLead = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Evaluate Lead',
    parameters: {
      jsCode: "const raw=$input.first()?.json||{};let existing=null;if(typeof raw.data==='string'){try{const arr=JSON.parse(raw.data);if(Array.isArray(arr)&&arr.length>0)existing=arr[0];}catch(e){}}else if(raw.id){existing=raw;}let lead={};try{lead=$('Merge Workspace').first()?.json||{};}catch(e){}return[{json:{...lead,is_existing_lead:existing!==null,existing_lead_id:existing?existing.id:null,existing_stage:existing?existing.status:null}}];"
    }
  }
});

// ── AI BANT QUALIFICATION ─────────────────────────────────────────
// LangChain OpenAI node v2.3 (Responses API). Model kept as gpt-4o-mini.
// responses.values[0].content = system prompt; prompt = user message.

const BANT_SYSTEM = "You are a sales qualification agent. Score this lead on BANT (Budget, Authority, Need, Timeline).\n\nBANT Scoring:\n- Budget confirmed ($1k+/mo): +3\n- Decision maker / authority: +2\n- Clear business need stated: +2\n- Timeline within 60 days: +2\n- Referral or warm source: +1\n\n7-10 = QUALIFIED | 4-6 = NURTURE | 0-3 = NOT A FIT\n\nReturn ONLY valid JSON (no markdown):\n{\"lead_score\":0,\"is_qualified\":false,\"qualification_notes\":\"BANT analysis here\",\"ai_reply_email\":\"Warm reply under 120 words\",\"ai_reply_subject\":\"Subject under 8 words\",\"extracted_name\":\"\",\"extracted_email\":\"\",\"extracted_phone\":\"\",\"extracted_company\":\"\"}";

const aiBANT = node({
  type: '@n8n/n8n-nodes-langchain.openAi', version: 2.3,
  config: {
    name: 'Message a model',
    credentials: { openAiApi: { id: 'aZLC2GUnsPfLg8ME', name: 'OpenAI (managed free credits)' } },
    parameters: {
      operation: 'response',
      modelId: { __rl: true, value: 'gpt-4o-mini', mode: 'list', cachedResultName: 'GPT-4O-MINI' },
      responses: { values: [{ content: BANT_SYSTEM }] },
      prompt: '={{ "Source: " + ($json.source||"") + "\\nName: " + ($json.name||"") + "\\nEmail: " + ($json.email||"") + "\\nPhone: " + ($json.phone||"") + "\\nCompany: " + ($json.company||"") + "\\nMessage:\\n" + ($json.message||"") }}',
      builtInTools: {},
      options: {}
    }
  }
});

// ── PARSE BANT + BUILD EMAIL CONTENT ─────────────────────────────
// Reads AI output from $input; reads lead data from Evaluate Lead
// via cross-node reference (workspace_id, email, etc. are all set there).

const parseBANT = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Parse BANT',
    parameters: {
      jsCode: "const r=$input.first().json;let aiText='';if(typeof r.output==='string')aiText=r.output;else if(Array.isArray(r.output))aiText=r.output[0]?.content?.[0]?.text||r.output[0]?.text||JSON.stringify(r.output);else if(r.message?.content)aiText=r.message.content;else if(r.choices?.[0])aiText=r.choices[0].message?.content||'';else aiText=JSON.stringify(r);let ai;try{const cleaned=aiText.replace(/```json|```/g,'').trim();ai=JSON.parse(cleaned);}catch(e){ai={lead_score:0,is_qualified:false,qualification_notes:'Parse error: '+e.message,ai_reply_email:'Thank you for reaching out. We will review your details and be in touch shortly.',ai_reply_subject:'Thanks for reaching out',extracted_name:'',extracted_email:'',extracted_phone:'',extracted_company:''};}const lead=$('Evaluate Lead').first().json;const score=typeof ai.lead_score==='number'?ai.lead_score:0;const isQual=score>=7;const stage=isQual?'qualified':'contacted';const name=lead.name||ai.extracted_name||'there';const email=lead.email||ai.extracted_email||'';const phone=lead.phone||ai.extracted_phone||'';const company=lead.company||ai.extracted_company||'';const calendlyLink=lead.calendly_link||'';const replyFrom=lead.reply_from_name||'Maya';const ownerEmail=lead.notification_email||lead.owner_email||'';let emailBody,emailSubject;if(isQual){emailSubject='You qualify -- book your strategy call';emailBody='Hi '+name+',\\n\\nGreat news -- based on your submission you are a strong fit for what we do.\\n\\n'+(calendlyLink?'Book your free 30-minute strategy call here:\\n'+calendlyLink+'\\n\\nLooking forward to it.':'Our team will reach out within 24 hours to schedule a call.')+'\\n\\nBest,\\n'+replyFrom;}else{emailSubject=ai.ai_reply_subject||'Thanks for reaching out';emailBody=ai.ai_reply_email||'Thank you for reaching out. We will review your details and be in touch soon.';}const now=new Date().toISOString();const nextFollowup=isQual?null:new Date(Date.now()+86400000).toISOString();const notifyBody='New qualified lead!\\n\\nName: '+name+'\\nEmail: '+email+'\\nPhone: '+phone+'\\nBANT Score: '+score+'/10\\nCompany: '+company+'\\n\\nView in dashboard:\\nhttps://useleadsup.com/app/leads';return[{json:{name,email,phone,company,source:lead.source,message:lead.message,lead_score:score,is_qualified:isQual,lead_stage:stage,qualification_notes:ai.qualification_notes||'',ai_reply_email:emailBody,ai_reply_subject:emailSubject,notification_email:ownerEmail,notification_body:notifyBody,workspace_id:lead.workspace_id||null,owner_user_id:lead.owner_user_id||null,nurture_step:isQual?0:1,next_followup_at:nextFollowup,last_contacted_at:now,is_existing_lead:lead.is_existing_lead,existing_lead_id:lead.existing_lead_id,existing_stage:lead.existing_stage,email_thread_id:lead.email_thread_id||'',call_id:lead.call_id||'',call_duration:lead.call_duration||0,call_summary:lead.call_summary||'',created_at:now}}];"
    }
  }
});

// ── UPSERT LEAD ───────────────────────────────────────────────────

const existingOrNew = ifElse({
  version: 2.2,
  config: {
    name: 'Existing or New?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [{ leftValue: expr('{{ $json.is_existing_lead }}'), operator: { type: 'boolean', operation: 'true', singleValue: true } }],
        combinator: 'and'
      }
    }
  }
});

const LEAD_BODY = '={{ JSON.stringify({ name: $json.name, email: $json.email, phone: $json.phone, company: $json.company, source: $json.source, notes: $json.message, call_duration: $json.call_duration, call_summary: $json.call_summary, call_id: $json.call_id, email_thread_id: $json.email_thread_id, qualified: $json.is_qualified, status: $json.lead_stage, lead_score: $json.lead_score, qualification_notes: $json.qualification_notes, nurture_step: $json.nurture_step, next_followup_at: $json.next_followup_at, last_contacted_at: $json.last_contacted_at, workspace_id: $json.workspace_id, user_id: $json.owner_user_id }) }}';

const updateLead = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'Supabase: Update Lead',
    credentials: { httpHeaderAuth: { id: 'RBtWKSFsqtQqEVGN', name: 'Header Auth account' } },
    parameters: {
      method: 'PATCH',
      url: '=' + SUPA_URL + '/rest/v1/leads?id=eq.{{ $json.existing_lead_id }}',
      authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
      sendHeaders: true, headerParameters: supaReturn,
      sendBody: true, contentType: 'json', specifyBody: 'json',
      jsonBody: LEAD_BODY, options: {}
    }
  }
});

const insertLead = node({
  type: 'n8n-nodes-base.httpRequest', version: 4,
  config: {
    name: 'Supabase: Insert Lead',
    credentials: { httpHeaderAuth: { id: 'RBtWKSFsqtQqEVGN', name: 'Header Auth account' } },
    parameters: {
      method: 'POST',
      url: SUPA_URL + '/rest/v1/leads',
      authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
      sendHeaders: true, headerParameters: supaReturn,
      sendBody: true, contentType: 'json', specifyBody: 'json',
      jsonBody: '={{ JSON.stringify({ name: $json.name, email: $json.email, phone: $json.phone, company: $json.company, source: $json.source, notes: $json.message, call_duration: $json.call_duration, call_summary: $json.call_summary, call_id: $json.call_id, email_thread_id: $json.email_thread_id, qualified: $json.is_qualified, status: $json.lead_stage, lead_score: $json.lead_score, qualification_notes: $json.qualification_notes, nurture_step: $json.nurture_step, next_followup_at: $json.next_followup_at, last_contacted_at: $json.last_contacted_at, workspace_id: $json.workspace_id, user_id: $json.owner_user_id, created_at: $json.created_at }) }}',
      options: {}
    }
  }
});

// ── ATTACH LEAD ID ────────────────────────────────────────────────

const attachLeadId = node({
  type: 'n8n-nodes-base.code', version: 2,
  config: {
    name: 'Attach Lead ID',
    parameters: {
      jsCode: "const supaResp=$input.first().json;const prev=$('Parse BANT').first().json;const record=Array.isArray(supaResp)?supaResp[0]:supaResp;return[{json:{...prev,supabase_lead_id:record?.id||prev.existing_lead_id||null}}];"
    }
  }
});

// ── EMAIL BRANCH ──────────────────────────────────────────────────

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

const sendEmail = node({
  type: 'n8n-nodes-base.gmail', version: 2,
  config: {
    name: 'Gmail: Send Reply',
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

const notifyOwner = node({
  type: 'n8n-nodes-base.gmail', version: 2,
  config: {
    name: 'Gmail: Notify Owner',
    credentials: { gmailOAuth2: { id: 'iijHc4F8JFhpDDBo', name: 'Gmail OAuth2 API' } },
    parameters: {
      operation: 'send',
      sendTo: '={{ $json.notification_email }}',
      subject: '={{ "New qualified lead: " + $json.name }}',
      emailType: 'text',
      message: '={{ $json.notification_body }}',
      options: { appendAttribution: false }
    }
  }
});

// ── WORKFLOW COMPOSITION ──────────────────────────────────────────
//
//  [Form/Gmail/Retell Trigger] → Normalize
//  → HTTP: Fetch Workspace (text, always 1 item)
//  → Merge Workspace (Code: parses text + merges lead from normalizer)
//  → HTTP: Check Lead (text, always 1 item)
//  → Evaluate Lead (Code: parses text + cross-refs Merge Workspace)
//  → AI: BANT Qualify (LangChain OpenAI node, managed credential)
//  → Parse BANT (Code: parses AI output + cross-refs Evaluate Lead)
//  → Existing or New? → Update/Insert Lead → Attach Lead ID
//  → Has Email? → Send Reply → Qualified? → Notify Owner
//
//  Key: All Supabase GETs use responseFormat:'text' so they always
//  return exactly 1 item even when PostgREST returns an empty array.

export default workflow('Y8addhiWa8ujdV6b', 'Inbound Revenue Engine')
  .add(formTrigger).to(normalizeForm).to(fetchWorkspace)
  .add(gmailTrigger).to(normalizeGmail).to(fetchWorkspace)
  .add(retellTrigger).to(normalizeRetell).to(fetchWorkspace)
  .add(fetchWorkspace).to(mergeWorkspace).to(fetchLead).to(evalLead).to(aiBANT).to(parseBANT)
  .to(existingOrNew.onTrue(updateLead).onFalse(insertLead))
  .add(updateLead).to(attachLeadId)
  .add(insertLead).to(attachLeadId)
  .add(attachLeadId).to(hasEmail
    .onTrue(sendEmail.to(isQualified.onTrue(notifyOwner))));
