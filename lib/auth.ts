import { createClient } from '@/lib/supabase/server'

export type SessionUser = { openId: string; name: string; email?: string; role: 'owner' | 'admin' | 'member' }

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: membership } = await supabase.from('workspace_members').select('role').eq('user_id', user.id).limit(1).maybeSingle()
  return { openId: user.id, name: user.user_metadata?.name ?? user.email ?? 'User', email: user.email, role: (membership?.role ?? 'member') as SessionUser['role'] }
}

export async function requireWorkspaceRole(allowed: SessionUser['role'][] = ['owner', 'admin', 'member']) {
  const user = await getSessionUser()
  if (!user || !allowed.includes(user.role)) throw new Error('Unauthorized workspace request.')
  return user
}
