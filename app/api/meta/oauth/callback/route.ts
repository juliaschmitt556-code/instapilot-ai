import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  if (error) return NextResponse.redirect(new URL(`/accounts?error=${encodeURIComponent(error)}`, url.origin));
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const stateCookie = (await cookies()).get('meta_oauth_state')?.value;
  if (!code || !state || !stateCookie) return NextResponse.json({ error: 'Meta OAuth callback is missing code or state.' }, { status: 400 });
  let decoded: { nonce?: string; redirectUri?: string };
  try { decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf8')); } catch { return NextResponse.json({ error: 'Meta OAuth state is invalid.' }, { status: 400 }); }
  if (!decoded.nonce || decoded.nonce !== stateCookie || decoded.redirectUri !== process.env.META_REDIRECT_URI) return NextResponse.json({ error: 'Meta OAuth state validation failed.' }, { status: 400 });
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const version = process.env.META_GRAPH_API_VERSION;
  if (!appId || !appSecret || !version || !decoded.redirectUri) return NextResponse.json({ error: 'Meta OAuth server configuration is incomplete.' }, { status: 503 });
  const tokenUrl = new URL(`https://graph.facebook.com/${version}/oauth/access_token`);
  tokenUrl.searchParams.set('client_id', appId);
  tokenUrl.searchParams.set('client_secret', appSecret);
  tokenUrl.searchParams.set('redirect_uri', decoded.redirectUri);
  tokenUrl.searchParams.set('code', code);
  const tokenResponse = await fetch(tokenUrl, { method: 'GET', cache: 'no-store' });
  if (!tokenResponse.ok) return NextResponse.json({ error: 'Meta rejected the authorization code.' }, { status: 502 });
  const tokenPayload = await tokenResponse.json() as { access_token?: string; expires_in?: number };
  if (!tokenPayload.access_token) return NextResponse.json({ error: 'Meta returned no access token.' }, { status: 502 });
  // Persist the token only through an encrypted credential reference and then fetch
  // eligible Instagram accounts server-side. Never return the token to the browser.
  const response = NextResponse.redirect(new URL('/accounts?connected=1', url.origin));
  response.cookies.delete('meta_oauth_state');
  return response;
}
