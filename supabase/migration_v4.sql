-- v4: "किसने लिया / किसने खर्च किया" का नाम हमेशा लॉगिन यूज़र का असली नाम (कोई बदल नहीं सकता)
create or replace function kpl_set_by() returns trigger language plpgsql security definer set search_path=public as $$
declare n text;
begin
  select coalesce(nullif(trim(full_name),''),username) into n from kpl_profiles where id=auth.uid();
  if tg_table_name='kpl_chanda' then new.collector := n; else new.spent_by := n; end if;
  return new;
end $$;
drop trigger if exists t_ch_by on kpl_chanda;
create trigger t_ch_by before insert on kpl_chanda for each row execute function kpl_set_by();
drop trigger if exists t_kh_by on kpl_kharch;
create trigger t_kh_by before insert on kpl_kharch for each row execute function kpl_set_by();
