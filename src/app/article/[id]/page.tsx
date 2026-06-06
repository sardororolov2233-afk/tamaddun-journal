"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  useEffect(() => {
    const fetchArticle = async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId)
          .single();
          
        if (data && !error) {
          setArticle(data);
        }
      } else {
        const saved = localStorage.getItem('gjir_articles');
        if (saved) {
          const parsed = JSON.parse(saved);
          const found = parsed.find((a: any) => a.id === articleId);
          if (found) setArticle(found);
        }
      }
      setLoading(false);
    };

    fetchArticle();
  }, [articleId, isSupabaseConfigured]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--muted)' }}>Yuklanmoqda...</div>;
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Maqola topilmadi</h2>
        <Link href="/archive" style={{ color: 'var(--navy)', textDecoration: 'underline' }}>Arxivga qaytish</Link>
      </div>
    );
  }

  const getPdfUrl = () => {
    if (isSupabaseConfigured) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`${article.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      {/* Breadcrumbs */}
      <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '2rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#1976d2', textDecoration: 'none' }}>Bosh sahifa</Link> / 
        <Link href="/archive" style={{ color: '#1976d2', textDecoration: 'none' }}>Arxivlar</Link> / 
        <span>Jild {article.volume} Nashr {article.issue} ({new Date(article.created_at || article.date).getFullYear()})</span> / 
        <span style={{ color: 'var(--text)' }}>Maqolalar</span>
      </div>

      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: 'var(--navy)', marginBottom: '2.5rem', lineHeight: '1.3', textTransform: 'uppercase' }}>
        {article.title}
        <div style={{ width: '60px', height: '4px', background: '#1976d2', marginTop: '1rem', borderRadius: '2px' }}></div>
      </h1>

      <div className="article-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        {/* Chap qism (Ma'lumotlar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Mualliflar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(Array.isArray(article.authors) ? article.authors : (typeof article.authors === 'string' ? (article.authors as string).split(', ') : [])).map((authorName: string, idx: number) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.1rem', marginBottom: '4px' }}>
                  {authorName}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>
                  Muallif
                </div>
              </div>
            ))}
          </div>

          {/* Kalit so'zlar */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--navy)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
              Kalit so'zlar
            </h3>
            <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              {article.keywords}
            </p>
          </div>

          {/* Abstract */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--navy)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
              Abstrak
            </h3>
            <p style={{ color: 'var(--text)', fontSize: '15px', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' }}>
              {article.abstract}
            </p>
          </div>

        </div>

        {/* O'ng qism (Sidebar) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Muqova / Banner (Mockup) */}
          <div style={{ background: 'var(--navy)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', fontWeight: 700 }}>Tamaddun</div>
            <img 
              src="/jild_cover.png" 
              alt="Jurnal Muqovasi" 
              style={{ width: '150px', height: '210px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div style={{ fontSize: '11px', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Jild {article.volume} · Nashr {article.issue}</div>
          </div>

          {/* Fayllar */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--navy)', textTransform: 'uppercase', marginBottom: '15px', fontWeight: 700 }}>Yuklab olish</h3>
            
            <a 
              href={getPdfUrl()} 
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#1976d2', color: '#fff', textDecoration: 'none', padding: '12px', borderRadius: '30px', fontSize: '14px', fontWeight: 600, transition: 'background 0.2s', width: '100%', marginBottom: '10px' }}
            >
              <i className="ti ti-file-type-pdf" style={{ fontSize: '1.2rem' }}></i> PDF (Yuklash)
            </a>
            
            <Link 
              href={`/article/${article.id}/certificate`} 
              target="_blank"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#e3f2fd', color: '#1976d2', textDecoration: 'none', padding: '10px', borderRadius: '30px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
            >
              <i className="ti ti-certificate"></i> Sertifikatni ko'rish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
