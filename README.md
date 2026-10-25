# KPL – Durga Puja Hisaab

## 1. Supabase
1. SQL Editor me `supabase/migration.sql` poora paste karke Run karo (purane tables ko nahi chhuta).
2. Authentication → Users → Add user: email `superadmin@kpl.local`, apna password, **Auto Confirm** ON.
3. SQL Editor me chalao:
   `insert into kpl_profiles(id,username,full_name,role) select id,'superadmin','Super Admin','superadmin' from auth.users where email='superadmin@kpl.local';`
4. Authentication → Providers → Email me "Confirm email" band rakho.

## 2. Local chalana (VS Code terminal)
```
npm install
copy .env.example .env.local   (Mac/Linux: cp)
# .env.local me URL, anon key, service_role key bharo
npm run dev
```
http://localhost:3000 par login: `superadmin` + tumhara password.

## 3. Vercel par deploy
GitHub par push karo (`.env.local` push nahi hota) → vercel.com → Import → Environment Variables me wahi 3 keys daalo → Deploy.

## 4. Icon aur APK
- Apna icon `public/icon-192.png` (192x192) aur `public/icon-512.png` (512x512) naam se rakho.
- Phone me site kholo → "Add to Home screen / Install app" = PWA ready.
- APK ke liye deploy hone ke baad https://www.pwabuilder.com me site ka link daalo → Android package download karo.
