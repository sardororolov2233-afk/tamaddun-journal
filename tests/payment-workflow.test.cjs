const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {PGlite}=require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const admin='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',author='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',other='cccccccc-cccc-4ccc-8ccc-cccccccccccc',reviewer='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const article='11111111-1111-4111-8111-111111111111',thesis='22222222-2222-4222-8222-222222222222';
async function fixture(){const db=new PGlite();await db.exec(`
create role anon;create role authenticated;
create schema auth;create schema storage;
create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}'::jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text,unique(bucket_id,name));
alter table storage.objects enable row level security;
create function storage.foldername(text) returns text[] language sql as $$ select string_to_array(regexp_replace($1,'/[^/]*$',''),'/') $$;
grant usage on schema auth,storage to anon,authenticated;
grant select,insert,update,delete on storage.objects to anon,authenticated;
create policy legacy_broad_storage on storage.objects for all to public using(true) with check(true);
`);await db.exec(fs.readFileSync(path.join(__dirname,'../supabase_schema.sql'),'utf8'));
await db.exec(`
grant select,insert,update,delete on all tables in schema public to authenticated;
grant select,insert on public.articles,public.theses to anon;
insert into auth.users(id,email) values('${admin}','admin@example.org'),('${author}','author@example.org'),('${other}','other@example.org'),('${reviewer}','reviewer@example.org');
insert into public.profiles(id,email,role) values('${admin}','admin@example.org','admin'),('${author}','author@example.org','author'),('${other}','other@example.org','author'),('${reviewer}','reviewer@example.org','reviewer');
alter table public.articles add column publication_year integer default 2026;
alter table public.theses add column publication_year integer default 2026;
insert into public.articles(id,title,keywords,abstract,authors,author_id) values('${article}','Article','test','Abstract','[]','${author}');
insert into public.theses(id,title,keywords,abstract,authors,author_id) values('${thesis}','Thesis','test','Abstract','[]','${author}');
`);await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/20261024_payments.sql'),'utf8'));return db;}
async function login(db,id,role='authenticated'){await db.exec('reset role');await db.query(`select set_config('request.jwt.claim.sub',$1,false)`,[id || '']);await db.exec(`set role ${role}`);}
async function request(db,kind='article',id=article){await login(db,admin);return(await db.query(`select public.journal_request_payment($1,$2,2026,1,3) as id`,[kind,id])).rows[0].id;}
async function receipt(db,payment,id=author,suffix='first.pdf'){await login(db,id);const object=`${id}/${payment}/${suffix}`;await db.query(`insert into storage.objects(bucket_id,name) values('payment-receipts',$1)`,[object]);await db.query(`select public.journal_submit_receipt($1,$2)`,[payment,object]);return object;}

test('approval requests correct amount, receipt stays private, payment confirmation publishes atomically',async()=>{const db=await fixture();try{
await login(db,author);await assert.rejects(db.query(`select public.journal_request_payment('article',$1,2026,1,3)`,[article]),/Administrator/);
const payment=await request(db);assert.equal(await request(db),payment);
await login(db,author);const row=(await db.query('select * from public.payment_requests')).rows[0];assert.equal(row.amount,120000);assert.equal(row.card_number,'9860020144204623');assert.equal(row.status,'awaiting_receipt');
await assert.rejects(db.query('update public.payment_requests set amount=1'),/permission denied/);
await login(db,admin);await assert.rejects(db.query(`update public.articles set status='published' where id=$1`,[article]),/confirm the payment/);
await login(db,other);assert.equal((await db.query('select * from public.payment_requests')).rows.length,0);await assert.rejects(db.query(`select public.journal_submit_receipt($1,'x')`,[payment]),/not found/);
const object=await receipt(db,payment);await assert.rejects(db.query(`delete from storage.objects where name=$1 returning *`,[object]).then(r=>{if(r.rows.length===0)throw new Error('blocked');}),/blocked/);
await login(db,null,'postgres');await db.query(`insert into storage.buckets(id,name,public) values('articles_files','articles_files',true)`);await db.query(`insert into storage.objects(bucket_id,name) values('articles_files','public.pdf')`);
await login(db,null,'anon');assert.equal((await db.query(`select * from storage.objects where name='public.pdf'`)).rows.length,1);
await login(db,other);assert.equal((await db.query(`select * from storage.objects where name=$1`,[object])).rows.length,0);
await login(db,null,'anon');assert.equal((await db.query(`select * from storage.objects where name=$1`,[object])).rows.length,0);
await login(db,reviewer);assert.equal((await db.query(`select * from storage.objects where name=$1`,[object])).rows.length,0);
await login(db,admin);assert.equal((await db.query(`select * from storage.objects where name=$1`,[object])).rows.length,1);
await db.query(`select public.journal_review_payment($1,'confirm',null)`,[payment]);assert.equal((await db.query(`select status,issue from public.articles where id=$1`,[article])).rows[0].status,'published');
assert.equal((await db.query(`select status from public.payment_requests where id=$1`,[payment])).rows[0].status,'confirmed');
await assert.rejects(db.query(`select public.journal_review_payment($1,'confirm',null)`,[payment]),/unavailable/);
await db.query(`select public.journal_delete_submission('article',$1)`,[article]);assert.equal((await db.query('select * from public.articles')).rows.length,0);assert((await db.query(`select deleted_at from public.payment_requests where id=$1`,[payment])).rows[0].deleted_at);
}finally{await db.close();}});

test('rejection allows a new receipt, cancellation prevents publication and deletion preserves audit',async()=>{const db=await fixture();try{
const payment=await request(db,'thesis',thesis);await receipt(db,payment);
await login(db,admin);assert.equal((await db.query('select amount from public.payment_requests')).rows[0].amount,80000);
await assert.rejects(db.query(`select public.journal_review_payment($1,'reject','')`,[payment]),/reason/);
await db.query(`select public.journal_review_payment($1,'reject','Summa mos emas')`,[payment]);
await receipt(db,payment,author,'corrected.png');await login(db,admin);assert.equal((await db.query(`select count(*)::int as n from public.payment_events where action='submitted'`)).rows[0].n,2);
await db.query(`select public.journal_review_payment($1,'cancel','Muallif bekor qilishni so‘radi')`,[payment]);assert.equal((await db.query('select status from public.theses')).rows[0].status,'rejected');
await assert.rejects(db.query(`select public.journal_review_payment($1,'confirm',null)`,[payment]),/unavailable/);
await login(db,author);await assert.rejects(db.query(`select public.journal_delete_submission('thesis',$1)`,[thesis]),/Administrator/);
await login(db,admin);await db.query(`select public.journal_delete_submission('thesis',$1)`,[thesis]);assert.equal((await db.query('select * from public.theses')).rows.length,0);assert((await db.query('select * from public.payment_events')).rows.length>=5);
}finally{await db.close();}});

test('registration cannot grant admin, anonymous/forged submissions and storage overwrites are rejected',async()=>{const db=await fixture();try{
await login(db,author);await assert.rejects(db.query(`update public.profiles set role='admin' where id=$1`,[author]),/Only an administrator/);
await assert.rejects(db.query(`insert into public.articles(title,keywords,abstract,authors,author_id,status) values('Forged','k','a','[]',$1,'published')`,[author]),/pending status/);
await assert.rejects(db.query(`insert into public.articles(title,keywords,abstract,authors,author_id) values('Forged','k','a','[]',$1)`,[other]),/own account/);
await login(db,null,'anon');await assert.rejects(db.query(`insert into public.articles(title,keywords,abstract,authors,author_id) values('Anon','k','a','[]',$1)`,[author]),/row-level security/);
await login(db,null,'postgres');await db.query(`insert into auth.users(id,email,raw_user_meta_data) values('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee','new@example.org','{"role":"admin"}')`);assert.equal((await db.query(`select role from public.profiles where id='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'`)).rows[0].role,'author');
const payment=await request(db);const object=await receipt(db,payment);
await login(db,author);assert.equal((await db.query(`update storage.objects set name='changed' where name=$1 returning *`,[object])).rows.length,0);
await login(db,other);await assert.rejects(db.query(`insert into storage.objects(bucket_id,name) values('payment-receipts',$1)`,[`${author}/${payment}/fake.pdf`]),/row-level security/);
await login(db,null,'postgres');await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/20261024_payments.sql'),'utf8'));assert.equal((await db.query('select status from public.payment_requests')).rows[0].status,'submitted');
}finally{await db.close();}});

test('failed publication rolls payment decision back; author can remove an unsubmitted upload',async()=>{
const db=await fixture();try{
 const payment=await request(db);
 await login(db,author);const orphan=`${author}/${payment}/orphan.pdf`;
 await db.query(`insert into storage.objects(bucket_id,name) values('payment-receipts',$1)`,[orphan]);
 assert.equal((await db.query(`delete from storage.objects where name=$1 returning *`,[orphan])).rows.length,1);
 await receipt(db,payment);
 await login(db,null,'postgres');await db.exec(`create function public.fail_publication() returns trigger language plpgsql as $$ begin if new.status='published' then raise exception 'Existing publication validation failed'; end if; return new; end $$;
 create trigger existing_publication_validation before update on public.articles for each row execute function public.fail_publication();`);
 await login(db,admin);await assert.rejects(db.query(`select public.journal_review_payment($1,'confirm',null)`,[payment]),/Existing publication validation failed/);
 assert.equal((await db.query(`select status from public.payment_requests where id=$1`,[payment])).rows[0].status,'submitted');
 assert.equal((await db.query(`select status from public.articles where id=$1`,[article])).rows[0].status,'pending');
}finally{await db.close();}});
