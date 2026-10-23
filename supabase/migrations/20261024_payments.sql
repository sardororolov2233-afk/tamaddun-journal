-- Apply AFTER 20261023_issue_archive.sql, as the database owner in SQL Editor.
-- Run the complete transaction. Existing published materials remain unchanged.
begin;

create or replace function public.journal_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.journal_is_admin() from public;
grant execute on function public.journal_is_admin() to anon, authenticated;

-- Prevent self-registration/self-editing into an administrative role, even if
-- the existing profile RLS policy allows users to update their own record.
create or replace function public.journal_protect_profile_role() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null and current_user in ('postgres', 'supabase_admin') then return new; end if;
  if TG_OP = 'INSERT' then
    if coalesce(new.role, 'author') <> 'author' and not public.journal_is_admin() then
      raise exception 'Only an administrator can assign staff roles';
    end if;
  elsif new.role is distinct from old.role and not public.journal_is_admin() then
    raise exception 'Only an administrator can change roles';
  end if;
  return new;
end $$;
drop trigger if exists journal_profile_role_guard on public.profiles;
create trigger journal_profile_role_guard before insert or update on public.profiles
for each row execute function public.journal_protect_profile_role();

create or replace function public.journal_create_author_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, email, full_name, role)
  values(new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), 'author')
  on conflict(id) do nothing;
  return new;
end $$;
drop trigger if exists journal_author_profile on auth.users;
create trigger journal_author_profile after insert on auth.users
for each row execute function public.journal_create_author_profile();
insert into public.profiles(id,email,full_name,role)
select id,email,coalesce(raw_user_meta_data->>'full_name',split_part(email,'@',1)),'author' from auth.users
on conflict(id) do nothing;

alter table public.articles add column if not exists field text;
alter table public.theses add column if not exists field text;

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null check(kind in ('article','thesis')),
  submission_id uuid not null,
  author_id uuid not null references public.profiles(id),
  title text not null,
  field text,
  amount integer not null check(amount > 0),
  currency text not null default 'UZS' check(currency = 'UZS'),
  card_number text not null default '9860020144204623' check(card_number = '9860020144204623'),
  status text not null default 'awaiting_receipt'
    check(status in ('awaiting_receipt','submitted','confirmed','rejected','cancelled')),
  publication_year integer not null check(publication_year >= 2026),
  volume integer not null check(volume > 0),
  issue integer not null check(issue > 0),
  receipt_path text,
  review_note text,
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique(kind, submission_id)
);
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payment_requests(id),
  actor_id uuid not null references public.profiles(id),
  action text not null,
  receipt_path text,
  note text,
  created_at timestamptz not null default now()
);
alter table public.payment_requests enable row level security;
alter table public.payment_events enable row level security;
drop policy if exists journal_payment_read on public.payment_requests;
create policy journal_payment_read on public.payment_requests for select to authenticated
using (author_id = auth.uid() or public.journal_is_admin());
drop policy if exists journal_payment_event_read on public.payment_events;
create policy journal_payment_event_read on public.payment_events for select to authenticated
using (exists(select 1 from public.payment_requests p where p.id = payment_id and (p.author_id = auth.uid() or public.journal_is_admin())));
revoke all on public.payment_requests, public.payment_events from anon, authenticated;
grant select on public.payment_requests, public.payment_events to authenticated;
create index if not exists payment_requests_author_idx on public.payment_requests(author_id, created_at desc);
create index if not exists payment_requests_status_idx on public.payment_requests(status, created_at desc);

-- Private receipts. Signed downloads require the author's or administrator's session.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('payment-receipts','payment-receipts',false,10485760,array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false, file_size_limit=10485760,
  allowed_mime_types=array['application/pdf','image/jpeg','image/png','image/webp'];
create or replace function public.journal_can_read_receipt(p_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(
    select 1 from public.payment_events e join public.payment_requests p on p.id=e.payment_id
    where e.receipt_path=p_name and (p.author_id=auth.uid() or public.journal_is_admin())
  ) or (auth.uid() is not null and (storage.foldername(p_name))[1]=auth.uid()::text
    and not exists(select 1 from public.payment_events where receipt_path=p_name));
$$;
create or replace function public.journal_can_upload_receipt(p_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(
    select 1 from public.payment_requests p where p.author_id=auth.uid()
      and p.status in ('awaiting_receipt','rejected') and p.deleted_at is null
      and (storage.foldername(p_name))[1]=auth.uid()::text
      and (storage.foldername(p_name))[2]=p.id::text
  );
$$;
create or replace function public.journal_can_delete_receipt(p_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and (storage.foldername(p_name))[1]=auth.uid()::text
    and not exists(select 1 from public.payment_events where receipt_path=p_name);
$$;
revoke all on function public.journal_can_read_receipt(text), public.journal_can_upload_receipt(text), public.journal_can_delete_receipt(text) from public;
grant execute on function public.journal_can_read_receipt(text), public.journal_can_upload_receipt(text), public.journal_can_delete_receipt(text) to anon,authenticated;
drop policy if exists journal_receipt_insert on storage.objects;
create policy journal_receipt_insert on storage.objects for insert to authenticated
with check(bucket_id='payment-receipts' and public.journal_can_upload_receipt(name));
drop policy if exists journal_receipt_read on storage.objects;
create policy journal_receipt_read on storage.objects for select to authenticated
using(bucket_id='payment-receipts' and public.journal_can_read_receipt(name));
drop policy if exists journal_orphan_receipt_delete on storage.objects;
create policy journal_orphan_receipt_delete on storage.objects for delete to authenticated
using(bucket_id='payment-receipts' and public.journal_can_delete_receipt(name));

-- Restrictive bucket boundaries also constrain older, broad storage policies.
-- Helpers evaluate access without exposing payment tables to anonymous users
-- or disrupting existing public article/cover downloads in other buckets.
drop policy if exists journal_receipt_select_boundary on storage.objects;
create policy journal_receipt_select_boundary on storage.objects as restrictive for select to public
using(bucket_id <> 'payment-receipts' or public.journal_can_read_receipt(name));
drop policy if exists journal_receipt_insert_boundary on storage.objects;
create policy journal_receipt_insert_boundary on storage.objects as restrictive for insert to public
with check(bucket_id <> 'payment-receipts' or public.journal_can_upload_receipt(name));
drop policy if exists journal_receipt_update_boundary on storage.objects;
create policy journal_receipt_update_boundary on storage.objects as restrictive for update to public
using(bucket_id <> 'payment-receipts') with check(bucket_id <> 'payment-receipts');
drop policy if exists journal_receipt_delete_boundary on storage.objects;
create policy journal_receipt_delete_boundary on storage.objects as restrictive for delete to public
using(bucket_id <> 'payment-receipts' or public.journal_can_delete_receipt(name));

create or replace function public.journal_request_payment(
  p_kind text, p_submission uuid, p_year integer, p_volume integer, p_issue integer
) returns uuid language plpgsql security definer set search_path = '' as $$
declare material record; payment uuid; existing record; table_name text;
begin
  if not public.journal_is_admin() then raise exception 'Administrator access required'; end if;
  if p_kind not in ('article','thesis') or p_kind is null then raise exception 'Invalid material type'; end if;
  if p_year < 2026 or p_volume < 1 or p_issue < 1 or p_year is null or p_volume is null or p_issue is null then raise exception 'Invalid issue'; end if;
  table_name := case when p_kind='article' then 'articles' else 'theses' end;
  execute format('select id,author_id,title,field,status from public.%I where id=$1 for update', table_name)
    into material using p_submission;
  if material.id is null or material.author_id is null or material.status <> 'pending' then raise exception 'Pending submission with an author required'; end if;
  select * into existing from public.payment_requests where kind=p_kind and submission_id=p_submission;
  if found then
    if existing.status = 'cancelled' or existing.deleted_at is not null then raise exception 'This request was cancelled'; end if;
    return existing.id;
  end if;
  insert into public.payment_requests(kind,submission_id,author_id,title,field,amount,publication_year,volume,issue)
    values(p_kind,p_submission,material.author_id,material.title,material.field,
      case when p_kind='article' then 120000 else 80000 end,p_year,p_volume,p_issue)
    returning id into payment;
  insert into public.payment_events(payment_id,actor_id,action) values(payment,auth.uid(),'requested');
  return payment;
end $$;

create or replace function public.journal_submit_receipt(p_payment uuid, p_path text)
returns void language plpgsql security definer set search_path = '' as $$
declare payment public.payment_requests%rowtype;
begin
  select * into payment from public.payment_requests where id=p_payment for update;
  if not found or auth.uid() is null or payment.author_id <> auth.uid() then raise exception 'Payment request not found'; end if;
  if payment.deleted_at is not null or payment.status not in ('awaiting_receipt','rejected') then raise exception 'Receipt cannot be submitted in this state'; end if;
  if p_path is null or p_path not like auth.uid()::text || '/' || p_payment::text || '/%'
    or not exists(select 1 from storage.objects where bucket_id='payment-receipts' and name=p_path) then
    raise exception 'Upload a receipt belonging to this payment first';
  end if;
  update public.payment_requests set receipt_path=p_path,status='submitted',review_note=null,reviewed_by=null,updated_at=now() where id=p_payment;
  insert into public.payment_events(payment_id,actor_id,action,receipt_path) values(p_payment,auth.uid(),'submitted',p_path);
end $$;

-- Database enforcement also prevents publishing through the previous dashboard
-- or by calling the REST update endpoint directly without a confirmed payment.
create or replace function public.journal_require_paid_publication() returns trigger
language plpgsql security definer set search_path = '' as $$
declare kind_name text := case when TG_TABLE_NAME='articles' then 'article' else 'thesis' end;
begin
  if TG_OP='INSERT' then
    if (auth.uid() is null and current_user not in ('postgres','supabase_admin')) or
      (auth.uid() is not null and (new.author_id is distinct from auth.uid() or new.status <> 'pending')) then
      raise exception 'Sign in and submit under your own account with pending status';
    end if;
  elsif new.status='published' and old.status <> 'published' then
    if not public.journal_is_admin() or not exists(
      select 1 from public.payment_requests where kind=kind_name and submission_id=new.id
        and author_id=new.author_id and status='confirmed' and deleted_at is null
        and publication_year=new.publication_year and volume=new.volume and issue=new.issue
    ) then raise exception 'Administrator must confirm the payment before publication'; end if;
  end if;
  return new;
end $$;
drop trigger if exists journal_paid_publication on public.articles;
create trigger journal_paid_publication before insert or update on public.articles for each row execute function public.journal_require_paid_publication();
drop trigger if exists journal_paid_publication on public.theses;
create trigger journal_paid_publication before insert or update on public.theses for each row execute function public.journal_require_paid_publication();

create or replace function public.journal_review_payment(p_payment uuid, p_action text, p_note text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare payment public.payment_requests%rowtype; material record; table_name text; new_status text;
begin
  if not public.journal_is_admin() then raise exception 'Administrator access required'; end if;
  -- Use the same lock ordering as approval/deletion to serialize conflicting actions.
  select * into payment from public.payment_requests where id=p_payment;
  if not found then raise exception 'Payment request not found'; end if;
  table_name := case when payment.kind='article' then 'articles' else 'theses' end;
  execute format('select id,author_id,status from public.%I where id=$1 for update',table_name) into material using payment.submission_id;
  select * into payment from public.payment_requests where id=p_payment for update;
  if material.id is null or material.author_id <> payment.author_id or material.status <> 'pending' or payment.deleted_at is not null then raise exception 'Submission is unavailable for payment review'; end if;
  if p_action='confirm' then
    if payment.status <> 'submitted' or payment.receipt_path is null then raise exception 'A submitted receipt is required'; end if;
    new_status := 'confirmed';
  elsif p_action='reject' then
    if payment.status <> 'submitted' or nullif(trim(p_note),'') is null then raise exception 'A submitted receipt and rejection reason are required'; end if;
    new_status := 'rejected';
  elsif p_action='cancel' then
    if payment.status not in ('awaiting_receipt','submitted','rejected') or nullif(trim(p_note),'') is null then raise exception 'Active request and cancellation reason required'; end if;
    new_status := 'cancelled';
  else raise exception 'Invalid review action'; end if;
  update public.payment_requests set status=new_status,review_note=nullif(trim(p_note),''),reviewed_by=auth.uid(),updated_at=now() where id=p_payment;
  if new_status='confirmed' then
    execute format('update public.%I set status=''published'',publication_year=$1,volume=$2,issue=$3 where id=$4',table_name)
      using payment.publication_year,payment.volume,payment.issue,payment.submission_id;
  elsif new_status='cancelled' then
    execute format('update public.%I set status=''rejected'' where id=$1',table_name) using payment.submission_id;
  end if;
  insert into public.payment_events(payment_id,actor_id,action,receipt_path,note)
    values(p_payment,auth.uid(),new_status,payment.receipt_path,nullif(trim(p_note),''));
end $$;

create or replace function public.journal_delete_submission(p_kind text,p_submission uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare table_name text; material record; removed uuid;
begin
  if not public.journal_is_admin() then raise exception 'Administrator access required'; end if;
  if p_kind not in ('article','thesis') or p_kind is null then raise exception 'Invalid material type'; end if;
  table_name := case when p_kind='article' then 'articles' else 'theses' end;
  execute format('select id from public.%I where id=$1 for update',table_name) into material using p_submission;
  if material.id is null then raise exception 'Submission not found'; end if;
  insert into public.payment_events(payment_id,actor_id,action,note)
    select id,auth.uid(),'submission_deleted','Administrator deleted the submission' from public.payment_requests
    where kind=p_kind and submission_id=p_submission and deleted_at is null;
  update public.payment_requests set deleted_at=now(),updated_at=now(),
    status=case when status='confirmed' then status else 'cancelled' end,
    review_note='Material admin tomonidan o‘chirildi.' where kind=p_kind and submission_id=p_submission;
  execute format('delete from public.%I where id=$1 returning id',table_name) into removed using p_submission;
  if removed is null then raise exception 'Deletion blocked by an existing database rule'; end if;
end $$;

revoke all on function public.journal_request_payment(text,uuid,integer,integer,integer) from public;
revoke all on function public.journal_submit_receipt(uuid,text) from public;
revoke all on function public.journal_review_payment(uuid,text,text) from public;
revoke all on function public.journal_delete_submission(text,uuid) from public;
grant execute on function public.journal_request_payment(text,uuid,integer,integer,integer) to authenticated;
grant execute on function public.journal_submit_receipt(uuid,text) to authenticated;
grant execute on function public.journal_review_payment(uuid,text,text) to authenticated;
grant execute on function public.journal_delete_submission(text,uuid) to authenticated;

-- Explicit deletion policy also supports existing admin tools, while the RPC
-- above additionally preserves payment history and cancels outstanding requests.
drop policy if exists journal_admin_article_delete on public.articles;
create policy journal_admin_article_delete on public.articles for delete to authenticated using(public.journal_is_admin());
drop policy if exists journal_admin_thesis_delete on public.theses;
create policy journal_admin_thesis_delete on public.theses for delete to authenticated using(public.journal_is_admin());

-- Restrictive boundaries also constrain legacy permissive deletion policies.
drop policy if exists journal_article_delete_boundary on public.articles;
create policy journal_article_delete_boundary on public.articles as restrictive for delete to public using(public.journal_is_admin());
drop policy if exists journal_thesis_delete_boundary on public.theses;
create policy journal_thesis_delete_boundary on public.theses as restrictive for delete to public using(public.journal_is_admin());

-- Anonymous users cannot submit; even permissive legacy INSERT policies are
-- constrained to the authenticated owner and pending status.
drop policy if exists journal_authenticated_article_insert on public.articles;
create policy journal_authenticated_article_insert on public.articles as restrictive for insert to public
with check(auth.uid() is not null and author_id=auth.uid() and status='pending');
drop policy if exists journal_authenticated_thesis_insert on public.theses;
create policy journal_authenticated_thesis_insert on public.theses as restrictive for insert to public
with check(auth.uid() is not null and author_id=auth.uid() and status='pending');
commit;
