-- Run in the connected project's Supabase SQL Editor after reviewing a database backup.
-- Run the WHOLE file in one execution. Known publication guards are paused only
-- while exclusive table locks are held, then restored to their original mode.
-- Any error rolls back both data changes and trigger changes.
-- Idempotent: existing published articles/theses are assigned only on the FIRST run.
begin;
lock table public.articles, public.theses, public.volumes in access exclusive mode;
do $$
declare
  first_run boolean;
  guard record;
  paused_guards jsonb := '[]'::jsonb;
begin
  first_run := not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'articles' and column_name = 'publication_year'
  );
  alter table public.articles add column if not exists publication_year integer not null default 2026;
  alter table public.theses add column if not exists publication_year integer not null default 2026;
  alter table public.volumes add column if not exists publication_year integer not null default 2026;
  alter table public.volumes add column if not exists volume integer not null default 1;
  alter table public.volumes add column if not exists issue integer not null default 3;
  alter table public.articles alter column volume set default 1;
  alter table public.articles alter column issue set default 3;
  alter table public.theses alter column volume set default 1;
  alter table public.theses alter column issue set default 3;
  if first_run then
    -- The SQL Editor owner performs this one-time metadata reassignment.
    -- Pause ONLY recognized publication security guards, not all user triggers
    -- or foreign-key constraints. Original disabled triggers stay disabled.
    for guard in
      select ns.nspname as table_schema, tbl.relname as table_name,
             trg.tgname as trigger_name, trg.tgenabled::text as enabled_mode
      from pg_trigger trg
      join pg_class tbl on tbl.oid = trg.tgrelid
      join pg_namespace ns on ns.oid = tbl.relnamespace
      join pg_proc fn on fn.oid = trg.tgfoid
      where ns.nspname = 'public' and tbl.relname in ('articles', 'theses')
        and not trg.tgisinternal and trg.tgenabled <> 'D'
        and (trg.tgtype & 16) <> 0
        and fn.proname in ('check_article_security', 'check_thesis_security')
    loop
      paused_guards := paused_guards || jsonb_build_array(to_jsonb(guard));
      execute format('alter table %I.%I disable trigger %I',
        guard.table_schema, guard.table_name, guard.trigger_name);
    end loop;

    -- Stable ordering, no deletion and no modification of titles, files or author data.
    with numbered as (
      select kind, id, row_number() over(order by created_at, kind, id) as rn, count(*) over() as total
      from (
        select 'article' as kind, id, created_at from public.articles where status = 'published'
        union all
        select 'thesis' as kind, id, created_at from public.theses where status = 'published'
      ) published
    )
    update public.articles a set volume = 1, publication_year = 2026,
      issue = case when n.rn <= ceil(n.total / 2.0) then 1 else 2 end
    from numbered n where n.kind = 'article' and n.id = a.id;
    with numbered as (
      select kind, id, row_number() over(order by created_at, kind, id) as rn, count(*) over() as total
      from (
        select 'article' as kind, id, created_at from public.articles where status = 'published'
        union all
        select 'thesis' as kind, id, created_at from public.theses where status = 'published'
      ) published
    )
    update public.theses t set volume = 1, publication_year = 2026,
      issue = case when n.rn <= ceil(n.total / 2.0) then 1 else 2 end
    from numbered n where n.kind = 'thesis' and n.id = t.id;
    update public.articles set volume = 1, issue = 3, publication_year = 2026 where status <> 'published';
    update public.theses set volume = 1, issue = 3, publication_year = 2026 where status <> 'published';
    -- Infer old collection titles; these can be adjusted by the editor before deployment.
    update public.volumes set
      volume = coalesce(((regexp_match(title, '(\d+)\s*[-–]?\s*[Jj]ild'))[1])::integer, 1),
      issue = coalesce(((regexp_match(title, '(\d+)\s*[-–]?\s*[Ss]on'))[1])::integer, 3);
    -- Restore each guard exactly as it was (ordinary, ALWAYS or REPLICA).
    for guard in
      select * from jsonb_to_recordset(paused_guards)
        as original(table_schema text, table_name text, trigger_name text, enabled_mode text)
    loop
      execute format('alter table %I.%I %s trigger %I',
        guard.table_schema, guard.table_name,
        case guard.enabled_mode
          when 'A' then 'enable always'
          when 'R' then 'enable replica'
          else 'enable'
        end,
        guard.trigger_name);
    end loop;
  end if;
end $$;
create index if not exists articles_issue_archive_idx on public.articles (publication_year, volume, issue, created_at) where status = 'published';
create index if not exists theses_issue_archive_idx on public.theses (publication_year, volume, issue, created_at) where status = 'published';
commit;
