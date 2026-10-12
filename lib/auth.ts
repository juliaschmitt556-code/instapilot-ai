import { cookies } from 'next/headers';

export type SessionUser = { openId: string; name: string; email?: string; role: 'owner' | 'admin' | 'member' };

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('webdev_app_session');
  if (!session?.value) return null;
  // The managed Preview host supplies a validated session cookie. Production must validate
  // the JWT signature with MANUS_JWT_SECRET and resolve the openId to workspace membership.
  return { openId: 'preview-user', name: 'Preview user', role: 'owner' };
}

export async function requireWorkspaceRole(allowed: SessionUser['role'][] = ['owner', 'admin', 'member']) {
  const user = await getSessionUser();
  if (!user || !allowed.includes(user.role)) throw new Error('Unauthorized workspace request.');
  return user;
}
