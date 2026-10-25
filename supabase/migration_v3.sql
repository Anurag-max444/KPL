-- v3: samiti ke sadasya
create table if not exists kpl_members(
  id bigint generated always as identity primary key,
  name text not null, role text, photo text,
  sort int not null default 0,
  created_at timestamptz not null default now());
alter table kpl_members enable row level security;
drop policy if exists p_mem_r on kpl_members;
create policy p_mem_r on kpl_members for select using (auth.uid() is not null);
drop policy if exists p_mem_w on kpl_members;
create policy p_mem_w on kpl_members for all using (kpl_is_super()) with check (kpl_is_super());
