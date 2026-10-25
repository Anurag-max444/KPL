-- KPL migration: sirf naye kpl_ tables banata hai. Purane tables ko nahi chhuta.
create table if not exists kpl_profiles(
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  full_name text,
  role text not null default 'admin' check (role in ('superadmin','admin')),
  perms text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now());

create table if not exists kpl_chanda(
  id bigint generated always as identity primary key,  -- yehi receipt number hai
  year int not null,
  donor text not null,
  phone text,
  amount numeric(12,2) not null check (amount>0),
  paid_on date not null,
  mode text not null default 'Cash',
  collector text not null,
  note text,
  status text not null default 'active' check (status in ('active','cancelled')),
  cancel_reason text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now());

create table if not exists kpl_kharch(
  id bigint generated always as identity primary key,
  year int not null,
  category text not null,
  item text not null,
  amount numeric(12,2) not null check (amount>0),
  paid_on date not null,
  paid_to text not null,
  bill_no text,
  bill_path text,
  spent_by text not null,
  status text not null default 'active' check (status in ('active','cancelled')),
  cancel_reason text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now());

create table if not exists kpl_audit(
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  user_id uuid, username text, action text not null, tbl text, row_id bigint, detail jsonb);

create or replace function kpl_is_super() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from kpl_profiles where id=auth.uid() and active and role='superadmin') $$;

create or replace function kpl_has(p text) returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from kpl_profiles where id=auth.uid() and active and (role='superadmin' or p=any(perms))) $$;

alter table kpl_profiles enable row level security;
alter table kpl_chanda enable row level security;
alter table kpl_kharch enable row level security;
alter table kpl_audit enable row level security;

-- Update/delete ki koi policy nahi: entry badli ya mitayi nahi ja sakti, sirf kpl_cancel() se cancel hoti hai.
drop policy if exists p_prof on kpl_profiles;
create policy p_prof on kpl_profiles for select using (id=auth.uid() or kpl_is_super());
drop policy if exists p_ch_r on kpl_chanda;
create policy p_ch_r on kpl_chanda for select using (kpl_has('view_chanda'));
drop policy if exists p_ch_i on kpl_chanda;
create policy p_ch_i on kpl_chanda for insert with check (kpl_has('add_chanda') and created_by=auth.uid() and status='active');
drop policy if exists p_kh_r on kpl_kharch;
create policy p_kh_r on kpl_kharch for select using (kpl_has('view_kharch'));
drop policy if exists p_kh_i on kpl_kharch;
create policy p_kh_i on kpl_kharch for insert with check (kpl_has('add_kharch') and created_by=auth.uid() and status='active');
drop policy if exists p_au on kpl_audit;
create policy p_au on kpl_audit for select using (kpl_has('view_audit'));

create or replace function kpl_audit_fn() returns trigger language plpgsql security definer set search_path=public as $$
declare u text;
begin
  select username into u from kpl_profiles where id=auth.uid();
  insert into kpl_audit(user_id,username,action,tbl,row_id,detail) values(auth.uid(),u,tg_op,tg_table_name,new.id,to_jsonb(new));
  return new;
end $$;
drop trigger if exists t_ch on kpl_chanda;
create trigger t_ch after insert or update on kpl_chanda for each row execute function kpl_audit_fn();
drop trigger if exists t_kh on kpl_kharch;
create trigger t_kh after insert or update on kpl_kharch for each row execute function kpl_audit_fn();

create or replace function kpl_cancel(t text, rid bigint, reason text) returns void language plpgsql security definer set search_path=public as $$
begin
  if not kpl_has('cancel_entry') then raise exception 'Cancel karne ki permission nahi hai'; end if;
  if length(trim(coalesce(reason,'')))<5 then raise exception 'Kaaran kam se kam 5 akshar ka likho'; end if;
  if t='chanda' then update kpl_chanda set status='cancelled',cancel_reason=reason where id=rid and status='active';
  elsif t='kharch' then update kpl_kharch set status='cancelled',cancel_reason=reason where id=rid and status='active';
  else raise exception 'Galat table'; end if;
end $$;

-- Bill photos
insert into storage.buckets(id,name,public) values('kpl-bills','kpl-bills',false) on conflict do nothing;
drop policy if exists kpl_bill_r on storage.objects;
create policy kpl_bill_r on storage.objects for select using (bucket_id='kpl-bills' and kpl_has('view_kharch'));
drop policy if exists kpl_bill_i on storage.objects;
create policy kpl_bill_i on storage.objects for insert with check (bucket_id='kpl-bills' and kpl_has('add_kharch'));

-- Pehla superadmin: pehle Dashboard > Authentication > Add user me
-- email: superadmin@kpl.local, apna password, "Auto confirm" ON. Phir ye chalao:
-- insert into kpl_profiles(id,username,full_name,role) select id,'superadmin','Super Admin','superadmin' from auth.users where email='superadmin@kpl.local';
