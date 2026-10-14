'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setStatus('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setStatus(error.message.toLowerCase().includes('password') ? 'Use a stronger password.' : 'Unable to create your account. Check your details and try again.')
    else if (data.session) {
      await fetch('/api/workspace/bootstrap', { method: 'POST' })
      window.location.href = '/dashboard'
    } else setStatus('Check your email to confirm your account, then sign in.')
    setPending(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-10"><div className="w-full max-w-[460px]"><BrandMark /><form onSubmit={submit} className="mt-10 rounded-[28px] border border-[#deddd5] bg-white p-7 shadow-soft"><div className="eyebrow text-indigo">Start your workspace</div><h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.06em]">Less tab switching. More considered replies.</h1><p className="mt-3 text-sm leading-6 text-[#747781]">Create a secure workspace, then connect an eligible Instagram professional account when you are ready.</p><div className="mt-7 flex flex-col gap-4"><label className="text-xs text-[#777a84]">Name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#deddd5] px-3 py-2.5 text-sm outline-none focus:border-indigo" /></label><label className="text-xs text-[#777a84]">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-[#deddd5] px-3 py-2.5 text-sm outline-none focus:border-indigo" /></label><label className="text-xs text-[#777a84]">Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-[#deddd5] px-3 py-2.5 text-sm outline-none focus:border-indigo" /></label></div>{status && <p role="status" className="mt-4 rounded-xl bg-[#f5f3ee] px-3 py-2 text-xs leading-5 text-[#686b76]">{status}</p>}<button disabled={pending} className="button-primary mt-7 w-full py-3 disabled:cursor-wait disabled:opacity-60">{pending ? 'Creating workspace…' : 'Create workspace'} <ArrowRight size={15} /></button><div className="mt-5 flex flex-col gap-3 rounded-2xl bg-[#f5f3ee] p-4 text-xs text-[#70737e]">{['One workspace for ads, comments, and analytics', 'Approval mode is on by default', 'Official APIs and authorized content only'].map((item) => <div key={item} className="flex items-center gap-2"><Check size={14} className="text-[#819c24]" />{item}</div>)}</div><p className="mt-7 text-center text-xs text-[#858791]">Already have access? <Link href="/login" className="font-semibold text-indigo">Sign in</Link></p></form><div className="mt-6 flex justify-center gap-1.5 text-[10px] text-[#858791]"><ShieldCheck size={13} /> Your provider credentials stay server-side.</div></div></main>
}
