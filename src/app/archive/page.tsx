"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function ArchivePage() {
  const [publishedArticles, setPublishedArticles] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<any[]>([]);
  const [tab, setTab] = useState<'articles' | 'volumes'>('articles');
  const [loading, setLoading] = useState(true);

  // Supabase ishlayotganini tekshirish
  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  useEffect(() => {
    const fetchArchive = async () => {
      if (isSupabaseConfigured) {
        const { data: artData, error: artError } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('volume', { ascending: false })
          .order('issue', { ascending: false })
          .order('created_at', { ascending: false });

        if (artData && !artError) {
          setPublishedArticles(artData);
        }

        const { data: volData } = await supabase
          .from('volumes')
          .select('*')
          .order('created_at', { ascending: false });
        if (volData) {
          setVolumes(volData);
        }
      } else {
        const saved = localStorage.getItem('gjir_articles');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPublishedArticles(parsed.filter((a: any) => a.status === 'published'));
        }

        const savedVols = localStorage.getItem('gjir_volumes');
        if (savedVols) {
          setVolumes(JSON.parse(savedVols));
        }
      }
      setLoading(false);
    };

    fetchArchive();
  }, [isSupabaseConfigured]);

  // Jildlar va nashrlar bo'yicha guruhlash (Grouping by Volume and Issue)
  const groupedArticles = publishedArticles.reduce((acc, article) => {
    const key = `Volume ${article.volume}, Issue ${article.issue}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(article);
    return acc;
  }, {} as Record<string, any[]>);

  const getPdfUrl = (articleId: string) => {
    if (isSupabaseConfigured) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`${articleId}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '1rem', textAlign: 'center' }}>
        Jurnal Arxivi
      </h1>
      <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '15px' }}>
        Bu yerda chop etilgan maqolalar hamda tahririyat tomonidan yuklangan to'liq jildlar kitoblari (PDF) bilan tanishishingiz mumkin.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <button 
          onClick={() => setTab('articles')}
          style={{
            padding: '10px 24px',
            border: 'none',
            borderRadius: '30px',
            background: tab === 'articles' ? 'var(--navy)' : 'var(--cream)',
            color: tab === 'articles' ? 'var(--gold-light)' : 'var(--navy)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          Ilmiy maqolalar ({publishedArticles.length})
        </button>
        <button 
          onClick={() => setTab('volumes')}
          style={{
            padding: '10px 24px',
            border: 'none',
            borderRadius: '30px',
            background: tab === 'volumes' ? 'var(--navy)' : 'var(--cream)',
            color: tab === 'volumes' ? 'var(--gold-light)' : 'var(--navy)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s'
          }}
        >
          To'liq jild to'plamlari ({volumes.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>Yuklanmoqda...</div>
      ) : tab === 'articles' ? (
        Object.keys(groupedArticles).length === 0 ? (
          <div style={{ textAlign: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '4rem 2rem' }}>
            <i className="ti ti-archive" style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>Hozircha arxiv bo'sh</h3>
            <p style={{ color: 'var(--muted)' }}>Tahririyat tomonidan tasdiqlangan maqolalar shu yerda paydo bo'ladi.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {Object.entries(groupedArticles).map(([groupName, articles]: [string, any]) => (
              <div key={groupName} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ background: 'var(--navy)', color: '#fff', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', margin: 0, color: 'var(--gold)' }}>
                    {groupName}
                  </h2>
                  <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                    {articles.length} ta maqola
                  </span>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {articles.map((article: any, index: number) => (
                    <div key={article.id} style={{ display: 'flex', gap: '1.5rem', borderBottom: index !== articles.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: index !== articles.length - 1 ? '1.5rem' : '0' }}>

                      <div style={{ flexShrink: 0, width: '48px', height: '64px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e53935' }}>
                        <i className="ti ti-file-type-pdf" style={{ fontSize: '1.5rem' }}></i>
                      </div>

                      <div style={{ flex: 1 }}>
                        <Link href={`/article/${article.id}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', color: '#1976d2', marginBottom: '6px', lineHeight: '1.3', cursor: 'pointer' }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--gold)'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#1976d2'}
                          >
                            {article.title}
                          </h3>
                        </Link>
                        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px', fontStyle: 'italic' }}>
                          Mualliflar: {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: '1.6', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.abstract}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '15px' }}>
                          <span><i className="ti ti-tags"></i> {article.keywords}</span>
                        </div>
                      </div>

                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <Link
                          href={`/article/${article.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--navy)', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, transition: 'background 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'var(--gold)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'var(--navy)'}
                        >
                          Maqolani o'qish <i className="ti ti-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        volumes.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '4rem 2rem' }}>
            <i className="ti ti-book" style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '1rem', display: 'block' }}></i>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>Hozircha to'liq jild kitoblari yuklanmagan</h3>
            <p style={{ color: 'var(--muted)' }}>Yuklangan to'liq jild (nashr) PDF kitoblari shu yerda ko'rinadi.</p>
          </div>
        ) : (
          <div className="archive-volumes-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {volumes.map(vol => (
              <div key={vol.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '1.5rem' }}>
                <div style={{ flexShrink: 0, width: '70px', height: '95px', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}>
                  <img 
                    src={vol.cover_image_url || "/jild_cover.png"} 
                    alt="Jild Muqovasi" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.style.background = 'var(--navy)';
                        parent.style.color = 'var(--gold-light)';
                        parent.style.display = 'flex';
                        parent.style.flexDirection = 'column';
                        parent.style.alignItems = 'center';
                        parent.style.justifyContent = 'center';
                        parent.innerHTML = '<i class="ti ti-book" style="font-size: 1.5rem; margin-bottom: 4px;"></i><span style="font-size: 9px; font-weight: 700; text-transform: uppercase;">Tamaddun</span>';
                      }
                    }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', color: 'var(--navy)', margin: '0 0 6px 0', fontWeight: 700 }}>{vol.title}</h3>
                    <span style={{ fontSize: '11px', background: 'var(--cream2)', color: 'var(--navy)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px', fontWeight: 600 }}>
                      Soha: {vol.field}
                    </span>
                    {vol.comment && (
                      <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 0 0', lineHeight: '1.4', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {vol.comment}
                      </p>
                    )}
                  </div>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <a 
                      href={vol.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ textDecoration: 'none', background: 'var(--gold)', color: 'var(--navy)', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <i className="ti ti-download"></i> To'liq PDFni yuklab olish
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
