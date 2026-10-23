"use client";

import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { articleYear, articlePath, type JournalArticle } from '../../lib/journal';
import { loadPublishedArticles } from '../../lib/journalRepository';
import { useLanguage } from '../../context/LanguageContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, lang } = useLanguage();
  
  const initialQuery = searchParams.get('q') || '';
  const initialField = searchParams.get('field') || 'All';
  const initialYear = searchParams.get('year') || 'All';

  const [query, setQuery] = useState(initialQuery);
  const [field, setField] = useState(initialField);
  const [year, setYear] = useState(initialYear);

  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  // Maqolalarni yuklash
  useEffect(() => {
    const fetchArticles = async () => {
      try { setArticles(await loadPublishedArticles()); }
      catch { setError('Qidiruv ma’lumotlarini yuklab bo‘lmadi. Qayta urinib ko‘ring.'); }
      finally { setLoading(false); }
    };

    fetchArticles();
  }, [isSupabaseConfigured]);

  // Qidiruv va filtrlash mantiqi
  const filteredArticles = useMemo(() => {
    if (loading) return [];

    let result = [...articles];

    // Matnli qidiruv (Sarlavha, Mualliflar, Kalit so'zlar, Annotatsiya)
    if (query.trim() !== '') {
      const q = query.toLowerCase();
      result = result.filter(art => {
        const titleMatch = art.title?.toLowerCase().includes(q);
        const abstractMatch = art.abstract?.toLowerCase().includes(q);
        const keywordsMatch = art.keywords?.toLowerCase().includes(q);
        
        let authorsMatch = false;
        if (Array.isArray(art.authors)) {
          authorsMatch = art.authors.some((auth: string) => auth.toLowerCase().includes(q));
        } else if (typeof art.authors === 'string') {
          authorsMatch = art.authors.toLowerCase().includes(q);
        }

        return titleMatch || abstractMatch || keywordsMatch || authorsMatch;
      });
    }

    // Soha bo'yicha filtr
    if (field !== 'All' && field !== t.search.allFields) {
      result = result.filter(art => {
        // Translation matching
        const artField = art.field || '';
        const matchFieldUz = (field === 'Biotibbiyot' || field === t.search.biology) && (artField.includes('Bio') || artField.includes('Tibbiyot') || artField.includes('Biotibbiyot'));
        const matchFieldCs = (field === 'Informatika' || field === t.search.cs) && (artField.includes('Informatika') || artField.includes('CS') || artField.includes('Kompyuter'));
        const matchFieldEcon = (field === 'Iqtisodiyot' || field === t.search.economics) && artField.includes('Iqtisod');
        const matchFieldChem = (field === 'Kimyo') && artField.includes('Kimyo');
        
        // Literal match
        const literalMatch = artField.toLowerCase().includes(field.toLowerCase()) || 
                             field.toLowerCase().includes(artField.toLowerCase());

        return matchFieldUz || matchFieldCs || matchFieldEcon || matchFieldChem || literalMatch;
      });
    }

    // Yil bo'yicha filtr
    if (year !== 'All') {
      result = result.filter(art => {
        const artYear = articleYear(art).toString();
        if (year === '2024–2025') {
          return artYear === '2024' || artYear === '2025';
        }
        return artYear === year;
      });
    }

    return result;
  }, [query, field, year, articles, loading, t]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // URL parametrlarini yangilash
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (field && field !== 'All') params.set('field', field);
    if (year && year !== 'All') params.set('year', year);
    router.push(`/search?${params.toString()}`);
  };

  const getPdfUrl = (art: JournalArticle) => {
    if (isSupabaseConfigured && art.id.length > 5) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`${art.kind === "thesis" ? "theses/" : ""}${art.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: 'var(--navy)', marginBottom: '1.5rem', textAlign: 'center' }}>
        {lang === 'UZ' ? 'Ilmiy Maqolalar Qidiruvi' : lang === 'RU' ? 'Поиск научных статей' : 'Search Scientific Articles'}
      </h1>

      {error && <p role="alert" className="error-notice">{error}</p>}
      {/* Qidiruv Paneli */}
      <form onSubmit={handleSearchSubmit} style={{ 
        background: '#fff', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        border: '1px solid var(--border)',
        boxShadow: '0 10px 30px rgba(10,22,40,0.04)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border)', borderRadius: '4px', padding: '10px 14px', background: 'var(--cream)' }}>
            <i className="ti ti-search" style={{ color: 'var(--muted)', fontSize: '18px' }}></i>
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.search.placeholder}
              style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '14px', outline: 'none', fontFamily: 'inherit', color: 'var(--text)' }}
            />
          </div>

          <select 
            value={field}
            onChange={e => setField(e.target.value)}
            style={{ padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff', cursor: 'pointer', minWidth: '160px' }}
          >
            <option value="All">{t.search.allFields}</option>
            <option value="Biotibbiyot">{t.search.biology}</option>
            <option value="Iqtisodiyot">{t.search.economics}</option>
            <option value="Informatika">{t.search.cs}</option>
            <option value="Kimyo">Kimyo / Химия</option>
          </select>

          <select 
            value={year}
            onChange={e => setYear(e.target.value)}
            style={{ padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff', cursor: 'pointer', minWidth: '120px' }}
          >
            <option value="All">{lang === 'UZ' ? 'Barcha yillar' : lang === 'RU' ? 'Все года' : 'All Years'}</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2024–2025">2024-2025</option>
            <option value="2023">2023</option>
          </select>

          <button type="submit" className="btn-primary" style={{ padding: '11px 24px', borderRadius: '4px' }}>
            {t.search.btn}
          </button>
        </div>
      </form>

      {/* Natijalar ro'yxati */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {lang === 'UZ' ? 'Qidiruv Natijalari' : lang === 'RU' ? 'Результаты поиска' : 'Search Results'}
          </h2>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>
            {filteredArticles.length} {lang === 'UZ' ? 'ta maqola topildi' : lang === 'RU' ? 'статей найдено' : 'articles found'}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <i className="ti ti-spinner" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', animation: 'spin 1s linear infinite' }}></i>
            {lang === 'UZ' ? 'Yuklanmoqda...' : 'Загрузка...'}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '5rem 2rem' }}>
            <i className="ti ti-search-off" style={{ fontSize: '3.5rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '0.5rem', fontFamily: '"Playfair Display", serif' }}>
              {lang === 'UZ' ? 'Hech narsa topilmadi' : lang === 'RU' ? 'Ничего не найдено' : 'No results found'}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '450px', margin: '0 auto' }}>
              {lang === 'UZ' 
                ? 'Iltimos, kalit so\'zlar to\'g\'riligini tekshiring yoki filtrlarni o\'zgartirib qaytadan urinib ko\'ring.'
                : lang === 'RU' 
                  ? 'Пожалуйста, проверьте правильность запроса или измените фильтры поиска.'
                  : 'Please check the spelling of your keywords or adjust the filters and search again.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredArticles.map(art => (
              <div 
                key={art.id} 
                className="article-card" 
                style={{ 
                  background: '#fff', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px', 
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(10,22,40,0.06)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span className="tag tag-field">{art.field || 'Ilmiy soha'}</span>
                  <span className="tag tag-open">Open Access</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>
                    {new Date(art.created_at || art.date || "2026-01-01").toLocaleDateString(lang === 'UZ' ? 'uz-UZ' : lang === 'RU' ? 'ru-RU' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px', lineHeight: '1.4' }}>
                  <Link href={articlePath(art)} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {art.title}
                  </Link>
                </h3>

                <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px', fontStyle: 'italic', fontWeight: 500 }}>
                  {Array.isArray(art.authors) ? art.authors.join(', ') : art.authors}
                  {art.affiliation && ` · ${art.affiliation}`}
                </div>

                <p style={{ fontSize: '13px', color: '#4a4a62', lineHeight: '1.7', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {art.abstract}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isSupabaseConfigured && art.has_pdf ? <a href={getPdfUrl(art)} target="_blank" rel="noopener noreferrer" className="btn-pdf" style={{ textDecoration: 'none' }}>
                      <i className="ti ti-file-type-pdf" style={{ color: '#e53935' }}></i> PDF Yuklash
                    </a> : <Link href={articlePath(art)} className="btn-pdf">Maqolani o‘qish ↗</Link>}
                    {isSupabaseConfigured && art.kind !== 'thesis' && <Link href={`/article/${art.id}/certificate`} target="_blank" className="btn-pdf" style={{ textDecoration: 'none', color: '#b8902a' }}>
                      <i className="ti ti-certificate"></i> Sertifikat
                    </Link>}
                  </div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--muted)' }}>
                    {art.doi ? `DOI: ${art.doi}` : `${articleYear(art)} · ${art.volume}-jild, ${art.issue}-son`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>Yuklanmoqda...</div>}>
      <SearchContent />
    </Suspense>
  );
}
