import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  const { data: existing } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()
  if (existing) return NextResponse.json({ workspaceId: existing.workspace_id })

  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({ name: `${user.user_metadata?.name ?? user.email ?? 'My'} workspace`, created_by: user.id })
    .select('id')
    .single()
  if (workspaceError || !workspace) return NextResponse.json({ error: 'Unable to create workspace.' }, { status: 500 })

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: user.id, role: 'owner' })
  if (memberError) return NextResponse.json({ error: 'Unable to configure workspace membership.' }, { status: 500 })

  return NextResponse.json({ workspaceId: workspace.id }, { status: 201 })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { data, error } = await supabase.from('workspace_members').select('workspace_id, role, workspaces(id, name)').eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'Unable to load workspaces.' }, { status: 500 })
  return NextResponse.json({ data })
}
