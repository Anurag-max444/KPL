import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const bad = (m: string, s = 400) => NextResponse.json({ error: m }, { status: s });

export async function POST(req: Request) {
  const a = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const tok = (req.headers.get('authorization') || '').replace('Bearer ', '');
  const { data: { user } } = await a.auth.getUser(tok);
  if (!user) return bad('पहले लॉगिन करें', 401);
  const { data: me } = await a.from('kpl_profiles').select('*').eq('id', user.id).single();
  if (!me?.active || me.role !== 'superadmin') return bad('सिर्फ़ सुपरएडमिन यह कर सकता है', 403);
  const b = await req.json();
  const log = (action: string, detail: any) => a.from('kpl_audit').insert({ user_id: me.id, username: me.username, action, tbl: 'kpl_profiles', detail });
  try {
    if (b.action === 'create') {
      const un = String(b.username || '').trim().toLowerCase();
      if (!/^[a-z0-9_]{3,20}$/.test(un)) throw new Error('यूज़रनेम 3-20 अक्षर का हो (a-z, 0-9, _)');
      if (String(b.password || '').length < 6) throw new Error('पासवर्ड कम से कम 6 अक्षर का हो');
      const { data, error } = await a.auth.admin.createUser({ email: `${un}@kpl.local`, password: b.password, email_confirm: true });
      if (error) throw error;
      const { error: e2 } = await a.from('kpl_profiles').insert({ id: data.user.id, username: un, full_name: b.full_name || un, role: 'admin', perms: b.perms || [] });
      if (e2) { await a.auth.admin.deleteUser(data.user.id); throw e2; }
      await log('USER_CREATE', { username: un, perms: b.perms });
    } else if (b.action === 'update') {
      const { data: t } = await a.from('kpl_profiles').select('role,username').eq('id', b.id).single();
      if (!t || t.role === 'superadmin') throw new Error('सुपरएडमिन को बदल नहीं सकते');
      const patch: any = {};
      if (Array.isArray(b.perms)) patch.perms = b.perms;
      if (typeof b.active === 'boolean') patch.active = b.active;
      if (Object.keys(patch).length) await a.from('kpl_profiles').update(patch).eq('id', b.id);
      if (b.password) {
        if (String(b.password).length < 6) throw new Error('पासवर्ड कम से कम 6 अक्षर का हो');
        await a.auth.admin.updateUserById(b.id, { password: b.password });
      }
      await log('USER_UPDATE', { username: t.username, ...patch, password_reset: !!b.password });
    } else throw new Error('गलत कार्रवाई');
    return NextResponse.json({ ok: true });
  } catch (e: any) { return bad(e.message); }
}
