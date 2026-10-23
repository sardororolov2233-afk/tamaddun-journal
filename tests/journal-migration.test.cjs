const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
// Optional PostgreSQL test engine; install separately as documented in ARCHIVE_SETUP.md.
const {PGlite} = require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const migration = fs.readFileSync(path.join(__dirname,'../supabase/migrations/20261023_issue_archive.sql'),'utf8');
async function fixture() {
  const db = new PGlite();
  await db.exec(`
    create table public.articles(id text primary key, title text, status text, volume integer default 1, issue integer default 1, created_at timestamptz);
    create table public.theses(like public.articles including all);
    create table public.volumes(id text primary key, title text);
    insert into public.articles values ('a','Original A','published',4,2,'2025-01-01'),('b','Original B','published',4,2,'2025-02-01'),('c','Pending','pending',3,4,'2026-01-01');
    insert into public.theses values ('t','Thesis','published',4,2,'2025-03-01');
    insert into public.volumes values ('v','1-Jild, 2-Son (2026)');
    create function public.check_article_security() returns trigger language plpgsql as $$ begin
      if old.status = 'published' then raise exception 'You cannot edit a published article. (Nashr qilingan maqolani tahrirlay olmaysiz)'; end if;
      return new;
    end $$;
    create trigger security_normal before update on public.articles for each row execute function public.check_article_security();
    create trigger security_always before update on public.articles for each row execute function public.check_article_security();
    alter table public.articles enable always trigger security_always;
    create trigger security_replica before update on public.articles for each row execute function public.check_article_security();
    alter table public.articles enable replica trigger security_replica;
    create trigger security_disabled before update on public.articles for each row execute function public.check_article_security();
    alter table public.articles disable trigger security_disabled;
    create trigger thesis_security before update on public.theses for each row execute function public.check_article_security();
    create table public.audit_log(id text);
    create function public.audit_archive_update() returns trigger language plpgsql as $$ begin insert into public.audit_log values(new.id);return new;end $$;
    create trigger archive_audit after update on public.articles for each row execute function public.audit_archive_update();
  `);
  return db;
}
const modes = async db => (await db.query(`select tgname,tgenabled from pg_trigger where not tgisinternal order by tgname`)).rows;

test('published security error is reproduced; migration preserves guards, audit and future issues',async()=>{
  const db = await fixture();
  try {
    await assert.rejects(db.exec(`update public.articles set issue=1 where id='a'`), /You cannot edit a published article/);
    const before = await modes(db);
    await db.exec(migration);
    assert.deepEqual((await db.query('select id,volume,issue,publication_year from public.articles order by id')).rows,[{id:'a',volume:1,issue:1,publication_year:2026},{id:'b',volume:1,issue:1,publication_year:2026},{id:'c',volume:1,issue:3,publication_year:2026}]);
    assert.equal((await db.query('select issue from public.theses')).rows[0].issue,2);
    assert.equal((await db.query('select issue from public.volumes')).rows[0].issue,2);
    assert.equal((await db.query('select count(*)::integer as count from public.audit_log')).rows[0].count,3);
    assert.deepEqual(await modes(db),before);
    await assert.rejects(db.exec(`update public.articles set title='Unauthorized edit' where id='a'`), /You cannot edit a published article/);
    await db.exec(`insert into public.articles(id,title,status,volume,issue,created_at) values ('new','New','published',1,4,now())`);
    await db.exec(migration);
    assert.equal((await db.query(`select issue from public.articles where id='new'`)).rows[0].issue,4);
    assert.equal((await db.query(`select title from public.articles where id='a'`)).rows[0].title,'Original A');
    assert.deepEqual(await modes(db),before);
  } finally {await db.close();}
});

test('an unrelated trigger remains active and failure rolls back paused guards and schema',async()=>{
  const db=await fixture();
  try {
    await db.exec(`create function public.reject_archive_change() returns trigger language plpgsql as $$ begin raise exception 'Unrelated business rule'; end $$;
      create trigger unrelated_rule before update on public.articles for each row execute function public.reject_archive_change();`);
    const before=await modes(db);
    await assert.rejects(db.exec(migration),/Unrelated business rule/);
    await db.exec('rollback');
    assert.deepEqual(await modes(db),before);
    assert.equal((await db.query(`select count(*)::integer as count from information_schema.columns where table_schema='public' and table_name='articles' and column_name='publication_year'`)).rows[0].count,0);
    assert.equal((await db.query(`select volume from public.articles where id='a'`)).rows[0].volume,4);
  } finally {await db.close();}
});
