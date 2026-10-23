'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { articlePath, groupIssues, issuePath, type JournalIssue, type JournalVolume } from '../lib/journal';
import { isLiveJournal, loadPublishedArticles, loadVolumes } from '../lib/journalRepository';
import IssueCover from './IssueCover';
import AdmissionBanner from './AdmissionBanner';

export default function ArchiveBrowser({ selected }: { selected?: { year: number; volume: number; issue: number } }) {
  const [issues, setIssues] = useState<JournalIssue[]>([]);
  const [unassigned, setUnassigned] = useState<JournalVolume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [articles, volumes] = await Promise.all([loadPublishedArticles(), loadVolumes()]);
        if (active) {
          const groups = groupIssues(articles, volumes);
          setIssues(groups);
          const assigned = new Set(groups.flatMap(group => group.collections.map(v => v.id)));
          setUnassigned(volumes.filter(v => !assigned.has(v.id)));
        }
      } catch { if (active) setError('Arxivni yuklab bo‘lmadi. Iltimos, sahifani qayta yuklang yoki tahririyat bilan bog‘laning.'); }
      finally { if (active) setLoading(false); }
    }
    load();
    const refresh = () => { load(); };
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); window.removeEventListener('storage', refresh); };
  }, []);
  const current = selected && issues.find(i => i.year === selected.year && i.volume === selected.volume && i.issue === selected.issue);
  return <>
    <AdmissionBanner />
    <div className="journal-page">
      <div className="breadcrumbs"><Link href="/">Bosh sahifa</Link><span>/</span>{selected ? <><Link href="/archive">Arxivlar</Link><span>/</span><span>{selected.volume}-jild, {selected.issue}-son</span></> : <span>Arxivlar</span>}</div>
      <div className="page-heading"><div><span className="section-kicker">TAMADDUN / OPEN ACCESS</span><h1>{selected ? `${selected.volume}-jild, ${selected.issue}-son (${selected.year})` : 'Jurnal arxivi'}</h1></div><p>{selected ? 'Ushbu sonda chop etilgan ilmiy maqolalar va tezislar.' : 'Har bir son — yangi izlanishlar to‘plami. Muqovani tanlab, shu songa tegishli maqolalar bilan tanishing.'}</p></div>
      {!isLiveJournal && <p className="demo-notice">Namuna maqolalar va ushbu brauzerda saqlangan materiallar ko‘rsatilmoqda.</p>}
      {loading ? <p role="status" className="empty-state">Arxiv yuklanmoqda…</p> : error ? <p role="alert" className="error-notice">{error}</p> : selected ? (
        current ? <div className="issue-detail-layout">
          <aside><IssueCover {...current} image={current.collections.find(v => v.cover_image_url)?.cover_image_url} /><div className="issue-summary"><h2>Son haqida</h2><p>{current.articles.length} ta ilmiy material</p><p>{current.year} · {current.volume}-jild · {current.issue}-son</p><p>Ochiq kirish · CC BY 4.0</p>{current.collections.map(v => v.pdf_url && v.pdf_url !== '#' && <a key={v.id} className="btn-pdf" href={v.pdf_url} target="_blank" rel="noopener noreferrer">To‘liq son PDF →</a>)}</div><Link href="/archive" className="text-link">← Barcha sonlar</Link></aside>
          <section><h2 className="issue-contents-title">Mundarija <span>{current.articles.length}</span></h2>{current.articles.length === 0 && <p className="empty-state">Bu sonning alohida maqolalari hali yuklanmagan.</p>}{current.articles.map((article, index) => <article key={`${article.kind}/${article.id}`} className="issue-article"><span className="issue-article-number">{String(index + 1).padStart(2, '0')}</span><div><div className="article-meta"><span className="tag tag-field">{article.field || 'Ilmiy tadqiqot'}</span><span className="tag tag-open">{article.kind === 'thesis' ? 'Tezis' : 'Maqola'} · Open Access</span></div><h3><Link href={articlePath(article)}>{article.title}</Link></h3><p className="authors">{Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}</p><p className="issue-abstract">{article.abstract}</p><Link className="text-link" href={articlePath(article)}>Batafsil o‘qish →</Link></div></article>)}</section>
        </div> : <div className="empty-state"><h2>Bu son hali nashr etilmagan</h2><p>Qabul qilinayotgan materiallar tasdiqlanib, chop etilgach shu yerda paydo bo‘ladi.</p><Link href="/archive">Barcha sonlarga qaytish</Link></div>
      ) : <>
        {issues.length === 0 && <p className="empty-state">Hozircha chop etilgan sonlar yo‘q.</p>}
        {[...new Set(issues.map(i => i.year))].map(year => <section className="archive-year" key={year}><div className="archive-year-title"><h2>{year}</h2><span>{issues.filter(i => i.year === year).length} ta son</span></div><div className="issue-grid">{issues.filter(i => i.year === year).map(item => <Link className="issue-card" href={issuePath(item)} key={issuePath(item)}><IssueCover {...item} image={item.collections.find(v => v.cover_image_url)?.cover_image_url} /><div className="issue-card-meta"><h3>{item.volume}-jild, {String(item.issue).padStart(2, '0')}-son ({item.year})</h3><p>{item.articles.length} ta ilmiy material <span>→</span></p></div></Link>)}</div></section>)}
        {unassigned.length > 0 && <section className="legacy-collections"><h2>Qo‘shimcha to‘plamlar</h2><p>Jild va son ma’lumoti kiritilmagan avvalgi to‘plamlar.</p>{unassigned.map(v => <article key={v.id}><h3>{v.title}</h3>{v.pdf_url && v.pdf_url !== '#' && <a href={v.pdf_url} target="_blank" rel="noopener noreferrer">PDF to‘plam →</a>}</article>)}</section>}
      </>}
    </div>
  </>;
}
