-- v2: gaon ka naam, samiti settings, logo/photo storage
alter table kpl_chanda add column if not exists village text;

create table if not exists kpl_settings(key text primary key, value text not null default '');
alter table kpl_settings enable row level security;
drop policy if exists p_set_r on kpl_settings;
create policy p_set_r on kpl_settings for select using (true);
drop policy if exists p_set_w on kpl_settings;
create policy p_set_w on kpl_settings for all using (kpl_is_super()) with check (kpl_is_super());

insert into storage.buckets(id,name,public) values('kpl-brand','kpl-brand',true) on conflict do nothing;
drop policy if exists kpl_brand_r on storage.objects;
create policy kpl_brand_r on storage.objects for select using (bucket_id='kpl-brand');
drop policy if exists kpl_brand_w on storage.objects;
create policy kpl_brand_w on storage.objects for insert with check (bucket_id='kpl-brand' and kpl_is_super());
