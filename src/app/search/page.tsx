"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';

// Boshlang'ich mock maqolalar (qidiruv va arxiv uchun)
const DEFAULT_ARTICLES = [
  {
    id: "1",
    title: "CRISPR-Cas9 texnologiyasi yordamida irsiy kasalliklarni davolashning yangi yondashuvlari",
    authors: ["Karimov A.B.", "Yusupova N.K.", "Chen L."],
    affiliation: "Toshkent Tibbiyot Universiteti",
    abstract: "Ushbu tadqiqot CRISPR-Cas9 genni tahrirlash texnologiyasidan foydalangan holda monogen kasalliklarni in vivo sharoitda bartaraf etishning yangi usullarini taqdim etadi. Olib borilgan tajribalar natijasida β-talassemiya kasalligi bilan og'rigan in vitro modellarida 87% samaradorlik ko'rsatkichi erishildi.",
    keywords: "CRISPR-Cas9, gen tahrirlash, irsiy kasalliklar, β-talassemiya, biotibbiyot",
    field: "Biotibbiyot",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2025-05-12T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.001",
    has_docx: true,
    has_pdf: true
  },
  {
    id: "2",
    title: "O'rta Osiyo mamlakatlari eksport diversifikatsiyasi: Raqamli iqtisodiyot sektori tahlili",
    authors: ["Toshmatov I.O.", "Rakhimova D.S."],
    affiliation: "Iqtisodiyot Instituti, Samarqand",
    abstract: "Maqolada O'zbekiston, Qozog'iston va Qirg'iziston iqtisodiyotlarida raqamli sektor eksport ulushini oshirishning makroiqtisodiy modeli taqdim etiladi. Panel ma'lumotlari asosida VECM modelidan foydalanib, 2010–2024 yillar oraliq statistikasi tahlil qilinadi.",
    keywords: "eksport diversifikatsiyasi, raqamli iqtisodiyot, O'rta Osiyo, VECM modeli, iqtisodiyot",
    field: "Iqtisodiyot",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2025-05-07T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.002",
    has_docx: true,
    has_pdf: true
  },
  {
    id: "3",
    title: "Kam resursli muhitlarda tabiiy tilni qayta ishlashda transformer modellarini optimallashtirish",
    authors: ["Mirzayev J.T.", "Abdullayeva M.F.", "Kim S.H."],
    affiliation: "INHA University in Tashkent",
    abstract: "Ushbu ish o'zbek va tojik tillarini qayta ishlashga mo'ljallangan engil transformer arxitekturasini taklif etadi. LoRA (Low-Rank Adaptation) usuli qo'llanilganda parametrlar soni 93% kamaytirildi, F1-score ko'rsatkichi esa etalon modellar bilan raqobatbardosh bo'lib qoldi.",
    keywords: "NLP, tabiiy tilni qayta ishlash, transformer, LoRA, o'zbek tili, informatika",
    field: "Informatika",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2025-05-01T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.003",
    has_docx: true,
    has_pdf: true
  },
  {
    id: "4",
    title: "Qorakumdan olingan zeolitlar asosida yangi sorbentlar sintezi va ularning ekologik xususiyatlari",
    authors: ["Xoliqov B.A.", "Saidova G.R."],
    affiliation: "Kimyo Fanlari Instituti, Toshkent",
    abstract: "Tabiiy zeolitlar asosida ishlab chiqilgan kompozit sorbentlarning og'ir metallarni (Pb, Cd, Cr) suvli eritmasilardan ushlab qolish samaradorligi o'rganildi. Sintez qilingan namunalar BET tahlili va SEM-EDX usullari bilan xarakterlandi.",
    keywords: "zeolit, sorbent, og'ir metallar, adsorbsiya, ekologiya, kimyo",
    field: "Kimyo",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2026-04-28T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.004",
    has_docx: true,
    has_pdf: true
  }
];

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

  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  // Maqolalarni yuklash
  useEffect(() => {
    const fetchArticles = async () => {
      let dbArticles: any[] = [];

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (data && !error) {
          dbArticles = data;
        }
      } else {
        const saved = localStorage.getItem('gjir_articles');
        if (saved) {
          const parsed = JSON.parse(saved);
          dbArticles = parsed.filter((a: any) => a.status === 'published');
        }
      }

      // Mock ma'lumotlar bilan birlashtirish (ID takrorlanmasligi uchun)
      const combined = [...dbArticles];
      DEFAULT_ARTICLES.forEach(mockArt => {
        if (!combined.some(c => c.id === mockArt.id || c.title.toLowerCase() === mockArt.title.toLowerCase())) {
          combined.push(mockArt);
        }
      });

      setArticles(combined);
      setLoading(false);
    };

    fetchArticles();
  }, [isSupabaseConfigured]);

  // Qidiruv va filtrlash mantiqi
  useEffect(() => {
    if (loading) return;

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
        const artYear = new Date(art.created_at || art.date || Date.now()).getFullYear().toString();
        if (year === '2024–2025') {
          return artYear === '2024' || artYear === '2025';
        }
        return artYear === year;
      });
    }

    setFilteredArticles(result);
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

  const getPdfUrl = (art: any) => {
    if (isSupabaseConfigured && art.id.length > 5) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`${art.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: 'var(--navy)', marginBottom: '1.5rem', textAlign: 'center' }}>
        {lang === 'UZ' ? 'Ilmiy Maqolalar Qidiruvi' : lang === 'RU' ? 'Поиск научных статей' : 'Search Scientific Articles'}
      </h1>

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
                    {new Date(art.created_at || art.date || Date.now()).toLocaleDateString(lang === 'UZ' ? 'uz-UZ' : lang === 'RU' ? 'ru-RU' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '8px', lineHeight: '1.4' }}>
                  <Link href={`/article/${art.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
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
                    <a href={getPdfUrl(art)} target="_blank" rel="noopener noreferrer" className="btn-pdf" style={{ textDecoration: 'none' }}>
                      <i className="ti ti-file-type-pdf" style={{ color: '#e53935' }}></i> PDF Yuklash
                    </a>
                    <Link href={`/article/${art.id}/certificate`} target="_blank" className="btn-pdf" style={{ textDecoration: 'none', color: '#b8902a' }}>
                      <i className="ti ti-certificate"></i> Sertifikat
                    </Link>
                  </div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--muted)' }}>
                    {art.doi || `DOI: 10.36001/tamaddun.2025.${art.volume}.${art.issue}.${art.id.slice(0, 5)}`}
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
