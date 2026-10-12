import Link from 'next/link';
import { ArrowUpRight, Check, ChevronRight, Command, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';

const capabilities = [
  ['01', 'Ads, without the guesswork', 'See spend, reach, clicks, and delivery status in one focused workspace.'],
  ['02', 'Comments, with context', 'Pull accessible post and ad comments into a queue built for thoughtful follow-up.'],
  ['03', 'AI, with a human in the loop', 'Draft replies in your brand voice. Approve every publish by default.'],
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 lg:px-10">
        <BrandMark />
        <div className="hidden items-center gap-8 text-sm text-[#6e717c] md:flex">
          <a href="#product" className="transition hover:text-ink">Product</a>
          <a href="#principles" className="transition hover:text-ink">Principles</a>
          <a href="#security" className="transition hover:text-ink">Trust & access</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden px-3 py-2 text-sm font-semibold text-ink sm:block">Sign in</Link>
          <Link href="/dashboard" className="button-primary">Open demo <ArrowUpRight size={15} /></Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-10 lg:pb-32 lg:pt-24">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d8e5a5] bg-[#eff7ca] px-3 py-1.5 text-xs font-semibold text-[#47541a]"><span className="h-1.5 w-1.5 rounded-full bg-[#809b22]" />Built for authorized Instagram accounts</div>
          <h1 className="max-w-[680px] font-display text-[clamp(3.5rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-ink">Make every comment feel <span className="relative inline-block whitespace-nowrap">considered<span className="absolute -bottom-1 left-0 h-2 w-full -rotate-2 rounded-full bg-lime" /></span>.</h1>
          <p className="mt-8 max-w-[540px] text-lg leading-8 text-[#686b76]">InstaPilot is the calm command center for Instagram ads, comments, and AI-assisted engagement — with clear provenance and a human in the loop.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="button-primary px-5 py-3">Explore the workspace <ChevronRight size={16} /></Link>
            <Link href="/onboarding" className="button-ghost px-5 py-3">Connect an account</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#777a84]"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo" /> Official APIs only</span><span className="inline-flex items-center gap-1.5"><Command size={14} className="text-indigo" /> Approval mode by default</span></div>
        </div>
        <div className="relative">
          <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full bg-lime/50 blur-3xl" />
          <div className="relative rotate-[2deg] rounded-[28px] border border-[#c9c8c0] bg-[#111629] p-4 shadow-lift">
            <div className="rounded-[20px] border border-white/10 bg-[#171d34] p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-5"><div><div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Workspace / overview</div><div className="mt-2 text-lg font-semibold">Northstar Studio</div></div><span className="flex items-center gap-1.5 rounded-full bg-lime/15 px-2.5 py-1 text-[10px] font-semibold text-lime"><span className="h-1.5 w-1.5 rounded-full bg-lime" /> Sample mode</span></div>
              <div className="grid grid-cols-2 gap-3 py-5"><div className="rounded-2xl bg-white/5 p-4"><div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">Ad spend</div><div className="mt-2 text-2xl font-semibold">$4,286</div><div className="mt-1 text-xs text-lime">↑ 12.8%</div></div><div className="rounded-2xl bg-white/5 p-4"><div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">Comments</div><div className="mt-2 text-2xl font-semibold">1,284</div><div className="mt-1 text-xs text-lime">↑ 23.1%</div></div></div>
              <div className="rounded-2xl border border-white/10 bg-[#0e1326] p-4"><div className="flex items-center justify-between"><div><div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">AI reply queue</div><div className="mt-1 text-sm font-semibold">Maya needs a thoughtful answer</div></div><Sparkles size={16} className="text-lime" /></div><div className="mt-4 rounded-xl bg-white/5 p-3 text-xs leading-5 text-white/70">“We love that you noticed the color. Yes — the linen set is available in a longer length…”</div><div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-white/40">94% confidence · Friendly</span><span className="rounded-full bg-lime px-3 py-1.5 text-[10px] font-bold text-ink">Review draft</span></div></div>
            </div>
          </div>
          <div className="absolute -bottom-7 -left-8 rounded-2xl border border-[#d6d4cb] bg-white p-4 shadow-soft"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e4e3ff] text-indigo"><Check size={18} /></div><div><div className="text-xs font-semibold text-ink">Human approval stays on</div><div className="mt-1 text-[10px] text-[#777a84]">Every publish is intentional</div></div></div></div>
        </div>
      </section>

      <section id="product" className="border-y border-[#deddd5] bg-[#eeece6]">
        <div className="mx-auto grid max-w-[1240px] gap-0 px-6 lg:grid-cols-3 lg:px-10">{capabilities.map(([number, title, copy]) => <div key={number} className="border-[#d4d2ca] py-10 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"><div className="eyebrow text-indigo">{number}</div><h2 className="mt-5 max-w-[240px] text-xl font-semibold tracking-[-0.03em]">{title}</h2><p className="mt-3 max-w-[290px] text-sm leading-6 text-[#70737e]">{copy}</p></div>)}</div>
      </section>

      <section id="principles" className="mx-auto max-w-[1240px] px-6 py-24 lg:px-10 lg:py-32"><div className="grid gap-12 lg:grid-cols-[0.85fr_1fr]"><div><div className="eyebrow">A better operating rhythm</div><h2 className="mt-5 max-w-[520px] font-display text-4xl font-semibold leading-tight tracking-[-0.06em] md:text-5xl">Signal over noise. Context over speed.</h2></div><div className="grid gap-6 sm:grid-cols-2"><div className="border-l-2 border-lime pl-5"><h3 className="font-semibold">Truthful by design</h3><p className="mt-2 text-sm leading-6 text-[#70737e]">Sample data is labeled. Unavailable metrics stay unavailable. Access limits are explained, not glossed over.</p></div><div className="border-l-2 border-indigo pl-5"><h3 className="font-semibold">AI that knows its lane</h3><p className="mt-2 text-sm leading-6 text-[#70737e]">The agent drafts from context and brand voice — it does not invent product details or publish without permission.</p></div><div className="border-l-2 border-coral pl-5"><h3 className="font-semibold">Built for the handoff</h3><p className="mt-2 text-sm leading-6 text-[#70737e]">Priority, sentiment, audit trails, and approval queues keep teams moving together.</p></div><div className="border-l-2 border-ink pl-5"><h3 className="font-semibold">Official paths only</h3><p className="mt-2 text-sm leading-6 text-[#70737e]">A replaceable adapter boundary keeps the Meta integration explicit, testable, and policy-aware.</p></div></div></div></section>

      <section id="security" className="bg-ink text-white"><div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-10"><div><div className="eyebrow text-lime">Start in sample mode</div><h2 className="mt-3 max-w-[600px] font-display text-3xl font-semibold tracking-[-0.05em] md:text-4xl">When the account is ready, the workspace is ready too.</h2><p className="mt-3 max-w-[560px] text-sm leading-6 text-white/55">Connect only eligible Instagram professional accounts. No scraping, no mystery metrics, no hidden publishing.</p></div><Link href="/dashboard" className="button-lime shrink-0">Open InstaPilot <ArrowUpRight size={15} /></Link></div></section>
      <footer className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-7 text-xs text-[#858791] lg:px-10"><BrandMark /><span>Instagram operations, with a human in the loop.</span></footer>
    </main>
  );
}
