'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setStatus('')
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) setStatus('Invalid email or password, or confirm your email before signing in.')
    else { await fetch('/api/workspace/bootstrap', { method: 'POST' }); window.location.href = '/dashboard' }
    setPending(false)
  }
  return <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-10"><div className="w-full max-w-[420px]"><BrandMark light /><form onSubmit={submit} className="mt-10 rounded-[28px] bg-paper p-7 shadow-lift"><div className="eyebrow text-indigo">Welcome back</div><h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.06em]">Sign in to your workspace.</h1><p className="mt-3 text-sm leading-6 text-[#747781]">Use your secure InstaPilot account to continue.</p><div className="mt-7 flex flex-col gap-4"><label className="text-xs text-[#777a84]">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#deddd5] bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo" /></label><label className="text-xs text-[#777a84]">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#deddd5] bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo" /></label></div>{status && <p role="status" className="mt-4 rounded-xl bg-[#f5f3ee] px-3 py-2 text-xs leading-5 text-[#686b76]">{status}</p>}<button disabled={pending} className="button-primary mt-7 w-full py-3 disabled:cursor-wait disabled:opacity-60">{pending ? 'Signing in…' : 'Sign in'} <ArrowRight size={15} /></button><div className="mt-5 flex gap-2 rounded-2xl border border-[#deddd5] bg-white p-3 text-[11px] leading-5 text-[#777a84]"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-indigo" /> We never ask for or store your Instagram password.</div><p className="mt-7 text-center text-xs text-[#858791]">New to InstaPilot? <Link href="/signup" className="font-semibold text-indigo">Create an account</Link></p></form><Link href="/" className="mt-6 block text-center text-xs text-white/50 hover:text-white">Back to home</Link></div></main>
}
