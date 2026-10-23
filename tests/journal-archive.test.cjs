const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

// Exercise the actual source without adding a test runner dependency.
function loadTs(file, mocks = {}) {
  const filename = path.resolve(__dirname, '..', file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const module = {exports:{}};
  const requireLocal = id => mocks[id] || require(id);
  vm.runInNewContext(source, {module,exports:module.exports,require:requireLocal,process,localStorage:global.localStorage,console}, {filename});
  return module.exports;
}
const journal = loadTs('src/lib/journal.ts');
const json = value => JSON.parse(JSON.stringify(value));
const record = (id, issue=3, status='published') => ({id,title:`Research ${id}`,authors:['Author'],abstract:'Abstract',keywords:'science',status,volume:1,issue,publication_year:2026,created_at:`2026-01-0${id}T00:00:00Z`});

test('sample archive contains exactly two stable issues, two articles each', () => {
  const groups = journal.groupIssues(journal.DEFAULT_ARTICLES);
  assert.deepEqual(json(groups.map(i => [i.year,i.volume,i.issue,i.articles.length])), [[2026,1,2,2],[2026,1,1,2]]);
  assert.equal(new Set(groups.flatMap(i=>i.articles.map(a=>a.id))).size,4);
});
test('new publications join their selected issue; pending records stay out', () => {
  const records = [...journal.DEFAULT_ARTICLES,record('5',3),record('6',3),record('7',4,'pending')];
  const groups = journal.groupIssues(records);
  assert.deepEqual(json(groups.map(i=>[i.issue,i.articles.length])),[[3,2],[2,2],[1,2]]);
  assert.equal(journal.issuePath(groups[0]),'/archive/2026/1/3');
});
test('year, volume and issue form an independent archive key and sort numerically',()=>{
  const records = [record('1',2), {...record('2',10),volume:2}, {...record('3',1),publication_year:2027}];
  const groups = journal.groupIssues(records);
  assert.deepEqual(json(groups.map(i=>[i.year,i.volume,i.issue])),[[2027,1,1],[2026,2,10],[2026,1,2]]);
});
test('complete PDF/cover collections attach to the same issue, including legacy title metadata',()=>{
  const groups = journal.groupIssues([record('1',3)], [{id:'cover',title:'Current',publication_year:2026,volume:1,issue:3,pdf_url:'https://example.org/issue.pdf'}, {id:'old',title:'1-Jild, 2-Son (2026)'}]);
  assert.deepEqual(json(groups.map(g=>[g.issue,g.collections.length])),[[3,1],[2,1]]);
});
test('local archive migrates once, preserves files/content and later selected issues',async()=>{
  const storage = new Map();
  global.localStorage = {getItem:k=>storage.get(k) || null,setItem:(k,v)=>storage.set(k,v)};
  const old = [record('1',4),record('2',4),record('3',4),record('4',4),record('5',4,'pending')];
  storage.set('gjir_articles',JSON.stringify(old));
  const repo = loadTs('src/lib/journalRepository.ts', {'./journal':journal,'./supabaseClient':{supabase:{}}});
  repo.migrateLocalArchive();
  let migrated = JSON.parse(storage.get('gjir_articles'));
  assert.deepEqual(migrated.map(a=>a.issue),[1,1,2,2,3]);
  assert.deepEqual(migrated.map(a=>a.title),old.map(a=>a.title));
  migrated.push(record('6',7));storage.set('gjir_articles',JSON.stringify(migrated));
  repo.migrateLocalArchive();
  assert.equal(JSON.parse(storage.get('gjir_articles')).at(-1).issue,7);
  const published = await repo.loadPublishedArticles();
  assert(!published.some(a=>a.id==='5'));
  assert.equal(published.find(a=>a.id==='6').issue,7);
});
test('thesis links remain distinct from articles with the same identifier',()=>{
  assert.equal(journal.articlePath({...record('1'),kind:'thesis'}),'/article/1?kind=thesis');
  assert.equal(journal.articlePath(record('1')),'/article/1');
});
