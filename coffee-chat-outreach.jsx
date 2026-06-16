import React, { useState } from 'react';
import { Mail, Plus, Trash2, Send, Search, Coffee, Link2, ChevronDown, ChevronUp, Check, Copy, Users, Building2, MapPin, Loader2 } from 'lucide-react';

const SENIORITY_OPTIONS = ['owner', 'founder', 'c_suite', 'partner', 'vp', 'head', 'director', 'manager', 'senior', 'entry', 'intern'];

const TONE_OPTIONS = [
  { id: 'warm', label: 'Warm & curious' },
  { id: 'direct', label: 'Direct & brief' },
  { id: 'formal', label: 'Formal' },
];

const ANGLE_OPTIONS = [
  { id: 'career', label: 'Career advice / mentorship' },
  { id: 'industry', label: 'Industry insights' },
  { id: 'shared', label: 'Shared background / interest' },
  { id: 'opportunity', label: 'Potential collaboration' },
];

function buildDraft({ name, firstName, company, role, industry, angle, tone, yourName, yourBackground, customNote }) {
  const greeting = `Hi ${firstName || name || 'there'},`;

  let subject = '';
  let body = '';

  const intro = {
    career: `I came across your profile and was really impressed by your path${role ? ` as ${role}` : ''}${company ? ` at ${company}` : ''}.`,
    industry: `I've been following the ${industry || 'industry'} space closely and your perspective${company ? ` from your work at ${company}` : ''} really stood out to me.`,
    shared: `I noticed we have some overlapping interests${industry ? ` in ${industry}` : ''}, and I'd love to connect.`,
    opportunity: `I've been exploring ideas in ${industry || 'this space'} and think there could be some interesting overlap with what you're working on${company ? ` at ${company}` : ''}.`,
  }[angle];

  const ask = {
    warm: `I'd love to grab a virtual coffee sometime in the next couple of weeks if you're open to it — no agenda beyond hearing more about your experience and sharing a bit about mine.`,
    direct: `Would you be open to a 20-minute coffee chat in the next week or two? Happy to work around your schedule.`,
    formal: `I would greatly appreciate the opportunity to schedule a brief 20-30 minute conversation at your convenience, either virtually or in person, to learn more about your experience.`,
  }[tone];

  const closing = {
    warm: `Either way, thanks for reading — and congrats on the work you're doing${company ? ` at ${company}` : ''}!`,
    direct: `Let me know what works, or feel free to point me to someone else on your team if that's more useful.`,
    formal: `Thank you very much for considering, and I look forward to hearing from you.`,
  }[tone];

  const signOff = tone === 'formal' ? 'Best regards,' : tone === 'direct' ? 'Best,' : 'Thanks so much,';

  body = `${greeting}\n\n${intro}${yourBackground ? ` ${yourBackground}` : ''}\n\n${ask}${customNote ? `\n\n${customNote}` : ''}\n\n${closing}\n\n${signOff}\n${yourName || '[Your name]'}`;

  subject = tone === 'formal'
    ? `Request for a brief conversation${company ? ` — ${company}` : ''}`
    : `Quick coffee chat?${company ? ` (re: ${company})` : ''}`;

  return { subject, body };
}

function ContactForm({ onAdd }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(true);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      company: company.trim(),
      role: role.trim(),
      industry: industry.trim(),
      linkedin: linkedin.trim(),
      email: email.trim(),
      status: email.trim() ? 'ready' : 'needs-email',
      draft: null,
    });
    setName(''); setCompany(''); setRole(''); setIndustry(''); setLinkedin(''); setEmail('');
  };

  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <h3 style={{ margin: 0 }}>Add a contact</h3>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {open && (
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Company</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Role</label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Product Manager" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Industry</label>
            <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Fintech" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>LinkedIn URL</label>
            <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/janedoe" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Email (from Apollo, optional)</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@acme.com" style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={handleAdd} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={16} /> Add contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ApolloLookup({ contact, apiKey, onEmailFound }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async () => {
    if (!apiKey.trim()) {
      setError('Add your Apollo.io API key in the settings panel above first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const nameParts = contact.name.trim().split(' ');
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(' ') || undefined;

      const res = await fetch('https://api.apollo.io/v1/people/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey.trim(),
        },
        body: JSON.stringify({
          first_name,
          last_name,
          organization_name: contact.company || undefined,
          reveal_personal_emails: false,
        }),
      });

      if (!res.ok) {
        throw new Error(`Apollo API error (${res.status}). Check your API key and plan permissions.`);
      }
      const data = await res.json();
      const foundEmail = data?.person?.email;
      if (foundEmail && foundEmail !== 'email_not_unlocked@domain.com') {
        onEmailFound(contact.id, foundEmail);
      } else {
        setError('No email found for this person on Apollo.');
      }
    } catch (e) {
      setError(e.message || 'Lookup failed. Apollo may block requests from the browser (CORS) — if so, run this lookup from a server or use Apollo\'s UI directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 8, padding: '0.75rem', background: 'var(--color-background-secondary)', borderRadius: 'var(--border-radius-md)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={lookup} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {loading ? <Loader2 size={14} className="spin" /> : <Search size={14} />} {loading ? 'Looking up...' : 'Find email via Apollo'}
        </button>
      </div>
      {error && <p style={{ fontSize: 13, color: 'var(--color-text-danger)', marginTop: 6, marginBottom: 0 }}>{error}</p>}
      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 6, marginBottom: 0 }}>
        Apollo's API may reject direct browser calls due to CORS. If lookup fails, search the name on Apollo.io and paste the email manually above.
      </p>
    </div>
  );
}

function DraftPanel({ contact, settings, onSaveDraft }) {
  const nameParts = contact.name.trim().split(' ');
  const firstName = nameParts[0];

  const generated = buildDraft({
    name: contact.name,
    firstName,
    company: contact.company,
    role: contact.role,
    industry: contact.industry,
    angle: settings.angle,
    tone: settings.tone,
    yourName: settings.yourName,
    yourBackground: settings.yourBackground,
    customNote: settings.customNote,
  });

  const [subject, setSubject] = useState(contact.draft?.subject ?? generated.subject);
  const [body, setBody] = useState(contact.draft?.body ?? generated.body);
  const [copied, setCopied] = useState(false);

  const regenerate = () => {
    const fresh = buildDraft({
      name: contact.name,
      firstName,
      company: contact.company,
      role: contact.role,
      industry: contact.industry,
      angle: settings.angle,
      tone: settings.tone,
      yourName: settings.yourName,
      yourBackground: settings.yourBackground,
      customNote: settings.customNote,
    });
    setSubject(fresh.subject);
    setBody(fresh.body);
  };

  const mailtoHref = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copyAll = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ marginTop: 12, borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Subject</span>
        <button onClick={regenerate} style={{ fontSize: 13, padding: '4px 10px' }}>Regenerate</button>
      </div>
      <input value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={10}
        style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.7, padding: '0.5rem', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        <button onClick={copyAll} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy draft'}
        </button>
        {contact.email ? (
          <a href={mailtoHref} onClick={() => onSaveDraft(contact.id, { subject, body, sent: true })}
             style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-text-info)', fontSize: 14 }}>
            <Send size={14} /> Open in email client
          </a>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--color-text-tertiary)', alignSelf: 'center' }}>Add an email address to send</span>
        )}
        <button onClick={() => onSaveDraft(contact.id, { subject, body, sent: false })} style={{ fontSize: 14 }}>
          Save draft
        </button>
      </div>
    </div>
  );
}

function ContactCard({ contact, settings, apiKey, onRemove, onEmailFound, onSaveDraft }) {
  const [expanded, setExpanded] = useState(false);
  const [showApollo, setShowApollo] = useState(false);

  const initials = contact.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-background-info)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 14, color: 'var(--color-text-info)', flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <p style={{ fontWeight: 500, fontSize: 15, margin: 0 }}>{contact.name}</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
                {[contact.role, contact.company].filter(Boolean).join(' at ')}
                {contact.industry ? ` · ${contact.industry}` : ''}
              </p>
            </div>
            <button onClick={() => onRemove(contact.id)} aria-label="Remove contact" style={{ padding: '6px 8px', flexShrink: 0 }}>
              <Trash2 size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {contact.linkedin && (
              <a href={contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-info)', textDecoration: 'none' }}>
                <Link2 size={13} /> LinkedIn
              </a>
            )}
            {contact.email ? (
              <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-secondary)' }}>
                <Mail size={13} /> {contact.email}
              </span>
            ) : (
              <button onClick={() => setShowApollo(!showApollo)} style={{ fontSize: 13, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Search size={13} /> Find email via Apollo
              </button>
            )}
            {contact.draft?.sent && (
              <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-success)', color: 'var(--color-text-success)' }}>
                Sent
              </span>
            )}
          </div>

          {showApollo && !contact.email && (
            <ApolloLookup contact={contact} apiKey={apiKey} onEmailFound={(id, email) => { onEmailFound(id, email); setShowApollo(false); }} />
          )}

          <button onClick={() => setExpanded(!expanded)} style={{ marginTop: 8, fontSize: 13, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Coffee size={13} /> {expanded ? 'Hide email draft' : 'Draft coffee chat email'}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && <DraftPanel contact={contact} settings={settings} onSaveDraft={onSaveDraft} />}
        </div>
      </div>
    </div>
  );
}

function ProspectSearch({ apiKey, onAddContact, existingIds }) {
  const [title, setTitle] = useState('');
  const [industryKeyword, setIndustryKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [seniority, setSeniority] = useState('');
  const [results, setResults] = useState(null);
  const [totalEntries, setTotalEntries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrichingId, setEnrichingId] = useState(null);
  const [open, setOpen] = useState(false);

  const search = async () => {
    if (!apiKey.trim()) {
      setError('Add your Apollo.io master API key in settings above first.');
      return;
    }
    if (!title.trim() && !industryKeyword.trim() && !location.trim()) {
      setError('Add at least a job title, keyword, or location to search.');
      return;
    }
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const params = new URLSearchParams();
      if (title.trim()) params.append('person_titles[]', title.trim());
      if (location.trim()) params.append('person_locations[]', location.trim());
      if (seniority) params.append('person_seniorities[]', seniority);
      if (industryKeyword.trim()) params.append('q_keywords', industryKeyword.trim());
      params.append('per_page', '10');
      params.append('page', '1');

      const res = await fetch(`https://api.apollo.io/api/v1/mixed_people/api_search?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey.trim(),
        },
      });

      if (!res.ok) {
        if (res.status === 403) throw new Error('Apollo returned 403 — this endpoint requires a master API key (Settings → Integrations → API in Apollo).');
        throw new Error(`Apollo API error (${res.status}).`);
      }
      const data = await res.json();
      setResults(data?.people || []);
      setTotalEntries(data?.total_entries ?? null);
    } catch (e) {
      setError(e.message || 'Search failed. Apollo may block direct browser requests (CORS) — this may need to run from a server.');
    } finally {
      setLoading(false);
    }
  };

  const enrichAndAdd = async (person) => {
    setEnrichingId(person.id);
    setError('');
    try {
      const res = await fetch('https://api.apollo.io/v1/people/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey.trim(),
        },
        body: JSON.stringify({ id: person.id, reveal_personal_emails: false }),
      });
      if (!res.ok) throw new Error(`Enrichment failed (${res.status}). This step consumes Apollo credits.`);
      const data = await res.json();
      const p = data?.person || {};
      const email = p.email && p.email !== 'email_not_unlocked@domain.com' ? p.email : '';

      onAddContact({
        id: person.id,
        name: [p.first_name || person.first_name, p.last_name || ''].filter(Boolean).join(' '),
        company: p.organization?.name || person.organization?.name || '',
        role: p.title || person.title || '',
        industry: p.organization?.industry || '',
        linkedin: p.linkedin_url || '',
        email,
        status: email ? 'ready' : 'needs-email',
        draft: null,
      });
    } catch (e) {
      setError(e.message || 'Enrichment failed.');
    } finally {
      setEnrichingId(null);
    }
  };

  return (
    <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} /> Search by industry, title, or location</h3>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {open && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Job title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Product Manager" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Industry / keyword</label>
              <input value={industryKeyword} onChange={e => setIndustryKeyword(e.target.value)} placeholder="fintech" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="San Francisco" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Seniority</label>
              <select value={seniority} onChange={e => setSeniority(e.target.value)} style={{ width: '100%' }}>
                <option value="">Any</option>
                {SENIORITY_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <button onClick={search} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? <Loader2 size={14} className="spin" /> : <Search size={14} />} {loading ? 'Searching...' : 'Search Apollo'}
          </button>

          {error && <p style={{ fontSize: 13, color: 'var(--color-text-danger)', marginTop: 8 }}>{error}</p>}

          {results !== null && (
            <div style={{ marginTop: 12 }}>
              {totalEntries !== null && (
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  {totalEntries.toLocaleString()} total matches — showing {results.length}
                </p>
              )}
              {results.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>No results. Try broadening your filters.</p>
              ) : (
                results.map(person => {
                  const alreadyAdded = existingIds.has(person.id);
                  return (
                    <div key={person.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '0.5px solid var(--color-border-tertiary)', gap: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{person.first_name} {person.last_name_obfuscated}</p>
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {person.title && <span>{person.title}</span>}
                          {person.organization?.name && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={12} />{person.organization.name}</span>}
                        </p>
                      </div>
                      <button onClick={() => enrichAndAdd(person)} disabled={alreadyAdded || enrichingId === person.id} style={{ fontSize: 13, padding: '4px 10px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {alreadyAdded ? <Check size={13} /> : enrichingId === person.id ? <Loader2 size={13} className="spin" /> : <Plus size={13} />}
                        {alreadyAdded ? 'Added' : enrichingId === person.id ? 'Adding...' : 'Reveal & add'}
                      </button>
                    </div>
                  );
                })
              )}
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
                Search itself is free. "Reveal & add" calls Apollo's enrichment endpoint and uses credits.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoffeeChatOutreach() {
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState({
    yourName: '',
    yourBackground: '',
    angle: 'industry',
    tone: 'warm',
    customNote: '',
    apolloApiKey: '',
  });
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const addContact = (c) => setContacts(prev => prev.some(p => p.id === c.id) ? prev : [c, ...prev]);
  const removeContact = (id) => setContacts(prev => prev.filter(c => c.id !== id));
  const setEmail = (id, email) => setContacts(prev => prev.map(c => c.id === id ? { ...c, email, status: 'ready' } : c));
  const saveDraft = (id, draft) => setContacts(prev => prev.map(c => c.id === id ? { ...c, draft } : c));
  const existingIds = new Set(contacts.map(c => c.id));

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0.5rem 0' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 1s linear infinite; }`}</style>
      <h1 style={{ marginBottom: 4 }}>Coffee chat outreach</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 0, marginBottom: '1.5rem' }}>
        Add people from LinkedIn or Apollo search, find their email, and generate a personal outreach email.
      </p>

      <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSettingsOpen(!settingsOpen)}>
          <h3 style={{ margin: 0 }}>Settings</h3>
          {settingsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {settingsOpen && (
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Apollo.io API key (master key, for search + enrichment)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.apolloApiKey}
                  onChange={e => setSettings(s => ({ ...s, apolloApiKey: e.target.value }))}
                  placeholder="Paste your Apollo API key"
                  style={{ flex: 1 }}
                />
                <button onClick={() => setShowKey(!showKey)} style={{ padding: '0 10px' }}>{showKey ? 'Hide' : 'Show'}</button>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4, marginBottom: 0 }}>
                From Apollo: Settings → Integrations → API. The prospecting search below requires a master key.
              </p>
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Your name (used in sign-off)</label>
              <input value={settings.yourName} onChange={e => setSettings(s => ({ ...s, yourName: e.target.value }))} placeholder="Alex Chen" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>One line about you (optional, inserted into the intro)</label>
              <input value={settings.yourBackground} onChange={e => setSettings(s => ({ ...s, yourBackground: e.target.value }))} placeholder="I'm a software engineer transitioning into product management." style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Reason for reaching out</label>
                <select value={settings.angle} onChange={e => setSettings(s => ({ ...s, angle: e.target.value }))} style={{ width: '100%' }}>
                  {ANGLE_OPTIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Tone</label>
                <select value={settings.tone} onChange={e => setSettings(s => ({ ...s, tone: e.target.value }))} style={{ width: '100%' }}>
                  {TONE_OPTIONS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 4 }}>Extra note to include (optional)</label>
              <input value={settings.customNote} onChange={e => setSettings(s => ({ ...s, customNote: e.target.value }))} placeholder="I'll be in the Bay Area next month if useful for an in-person chat." style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>

      <ProspectSearch apiKey={settings.apolloApiKey} onAddContact={addContact} existingIds={existingIds} />

      <ContactForm onAdd={addContact} />

      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-tertiary)', fontSize: 14 }}>
          No contacts yet. Search above or add someone manually.
        </div>
      ) : (
        contacts.map(c => (
          <ContactCard key={c.id} contact={c} settings={settings} apiKey={settings.apolloApiKey} onRemove={removeContact} onEmailFound={setEmail} onSaveDraft={saveDraft} />
        ))
      )}

      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: '1.5rem' }}>
        Emails open in your default mail client for you to review and send — nothing is sent automatically. Apollo search is free; revealing an email or running "Find email via Apollo" uses credits and requires a master API key. Apollo may block direct browser requests (CORS) — if so, search/copy emails from Apollo's site instead.
      </p>
    </div>
  );
}
