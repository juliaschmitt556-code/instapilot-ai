'use client';

import { useState } from 'react';
import { ArrowUpRight, Search, Sparkles } from 'lucide-react';

export function PublicResearch() {
  const [query, setQuery] = useState('linen set');
  const [kind, setKind] = useState<'search' | 'popular' | 'reels'>('popular');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');
  const run = async () => {
    setStatus('Retrieving public data…');
    setResult('');
    const response = await fetch(`/api/public/instagram/discover?kind=${kind}&query=${encodeURIComponent(query)}`);
    const body = await response.json();
    setStatus(response.ok ? 'Source retrieved with provenance.' : body.error || 'Provider configuration required.');
    setResult(response.ok ? JSON.stringify(body.data, null, 2) : '');
  };
  return <><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="eyebrow">Research / public Instagram</div><h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-ink md:text-4xl">Find the signal in public conversation.</h1><p className="mt-2 max-w-[680px] text-sm leading-6 text-[#747781]">Use ScrapeCreators for public discovery and analysis. This data is not proof of ownership, endorsement, or permission to publish.</p></div><a href="/ai-agent" className="button-ghost">Open AI agent <ArrowUpRight size={15} /></a></div><div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"><div className="surface p-5 lg:p-6"><div className="eyebrow">Discovery query</div><h2 className="mt-2 text-lg font-semibold">Choose the public surface.</h2><label className="mt-5 block text-xs text-[#777a84]">Keyword, topic, handle, or hashtag<input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded-xl border border-[#deddd5] bg-white px-3 py-3 text-sm text-ink outline-none focus:border-indigo" /></label><div className="mt-4 grid grid-cols-3 gap-2">{(['search', 'popular', 'reels'] as const).map((item) => <button key={item} onClick={() => setKind(item)} className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize ${kind === item ? 'bg-ink text-white' : 'border border-[#deddd5] bg-white text-[#747781]'}`}>{item}</button>)}</div><button onClick={run} className="button-primary mt-5 w-full justify-center"><Search size={15} /> Retrieve public data</button><div className="mt-5 rounded-2xl border border-[#d9e6a5] bg-[#f1f8d7] p-4 text-xs leading-5 text-[#5e7120]"><strong>Provenance:</strong> every result is labeled with provider, source URL, collection time, and freshness before it enters analysis.</div></div><div className="surface-dark min-h-[380px] p-5 lg:p-7"><div className="flex items-center justify-between"><div><div className="eyebrow text-lime">Public context / preview</div><h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em]">Evidence before interpretation.</h2></div><Sparkles className="text-lime" size={20} /></div><div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/65">{status || 'Run a discovery query to preview the provider response. When configured, the LangChain agent can classify comments, summarize themes, and draft replies without publishing.'}</div>{result && <pre className="mt-4 max-h-[220px] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4 font-mono text-[10px] leading-5 text-white/55">{result}</pre>}<div className="mt-6 grid gap-3 text-xs text-white/55 sm:grid-cols-3"><div><div className="font-mono text-lime">01</div><div className="mt-2">Discover public posts</div></div><div><div className="font-mono text-lime">02</div><div className="mt-2">Classify conversation</div></div><div><div className="font-mono text-lime">03</div><div className="mt-2">Route to approval</div></div></div></div></div></>;
}
