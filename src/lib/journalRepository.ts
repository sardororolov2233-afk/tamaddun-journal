import { supabase } from './supabaseClient';
import { DEFAULT_ARTICLES, JOURNAL, type JournalArticle, type JournalVolume } from './journal';

export const isLiveJournal = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http');

export function readLocal<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

// A one-time, persisted reassignment: subsequent uploads keep their explicit issue.
export function migrateLocalArchive() {
  const marker = 'tamaddun_archive_2026_v1';
  if (localStorage.getItem(marker)) return;
  localStorage.setItem('tamaddun_archive_backup_2026_v1', JSON.stringify({ articles: localStorage.getItem('gjir_articles'), theses: localStorage.getItem('gjir_theses') }));
  const articles = readLocal<JournalArticle>('gjir_articles');
  const theses = readLocal<JournalArticle>('gjir_theses');
  const existing = [
    ...articles.map(a => ({ ...a, kind: 'article' as const })),
    ...theses.map(a => ({ ...a, kind: 'thesis' as const })),
  ].filter(a => a.status === 'published')
    .sort((a,b) => (a.created_at || a.date || '').localeCompare(b.created_at || b.date || '') || a.id.localeCompare(b.id));
  const assignments = new Map(existing.map((a, index) => [`${a.kind}/${a.id}`, index < Math.ceil(existing.length / 2) ? 1 : 2]));
  const migrate = (items: JournalArticle[], kind: string) => items.map(a => ({ ...a,
    volume: 1, issue: assignments.get(`${kind}/${a.id}`) || JOURNAL.issue, publication_year: 2026,
  }));
  localStorage.setItem('gjir_articles', JSON.stringify(migrate(articles, 'article')));
  localStorage.setItem('gjir_theses', JSON.stringify(migrate(theses, 'thesis')));
  localStorage.setItem(marker, 'done');
}

export async function loadPublishedArticles(): Promise<JournalArticle[]> {
  if (isLiveJournal) {
    const [articles, theses] = await Promise.all([
      supabase.from('articles').select('*').eq('status', 'published'),
      supabase.from('theses').select('*').eq('status', 'published'),
    ]);
    if (articles.error) throw new Error(articles.error.message);
    if (theses.error) throw new Error(theses.error.message);
    return [
      ...(articles.data || []).map(a => ({ ...a, kind: 'article' as const })),
      ...(theses.data || []).map(a => ({ ...a, kind: 'thesis' as const })),
    ];
  }
  migrateLocalArchive();
  const articles = readLocal<JournalArticle>('gjir_articles').filter(a => a.status === 'published').map(a => ({ ...a, kind: 'article' as const }));
  const theses = readLocal<JournalArticle>('gjir_theses').filter(a => a.status === 'published').map(a => ({ ...a, kind: 'thesis' as const }));
  return [...articles, ...theses, ...DEFAULT_ARTICLES.filter(sample => !articles.some(a => a.id === sample.id || a.title.toLowerCase() === sample.title.toLowerCase()))];
}

export async function loadVolumes(): Promise<JournalVolume[]> {
  if (!isLiveJournal) return readLocal<JournalVolume>('gjir_volumes');
  const { data, error } = await supabase.from('volumes').select('*');
  if (error) throw new Error(error.message);
  return data || [];
}
