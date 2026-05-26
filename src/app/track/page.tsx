"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';

export default function TrackPage() {
  const { t, lang } = useLanguage();
  const [articleId, setArticleId] = useState('');
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleId.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setArticle(null);
    setSearched(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', articleId.trim())
          .single();

        if (error || !data) {
          setErrorMsg(lang === 'UZ' ? "Ushbu ID ga ega maqola topilmadi." : lang === 'RU' ? "Статья с таким ID не найдена." : "No article found with this ID.");
        } else {
          setArticle(data);
        }
      } else {
        // Mock fallback
        const saved = localStorage.getItem('gjir_articles');
        if (saved) {
          const parsed = JSON.parse(saved);
          const found = parsed.find((a: any) => a.id === articleId.trim());
          if (found) {
            setArticle(found);
          } else {
            setErrorMsg(lang === 'UZ' ? "Ushbu ID ga ega maqola topilmadi." : lang === 'RU' ? "Статья с таким ID не найдена." : "No article found with this ID.");
          }
        } else {
          setErrorMsg(lang === 'UZ' ? "Tizimda hozircha maqolalar yo'q." : lang === 'RU' ? "В системе пока нет статей." : "No articles in the system yet.");
        }
      }
    } catch (err) {
      setErrorMsg(lang === 'UZ' ? "Xatolik yuz berdi." : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'submitted', labelUz: 'Yuborilgan', labelRu: 'Отправлено', labelEn: 'Submitted', descUz: 'Maqola muvaffaqiyatli qabul qilindi', descRu: 'Статья успешно получена', descEn: 'Article successfully received' },
    { key: 'review', labelUz: 'Taqriz jarayoni', labelRu: 'Рецензирование', labelEn: 'Under Review', descUz: 'Ekspertlar tomonidan ko\'r-ko\'r taqriz', descRu: 'Двойное слепое рецензирование', descEn: 'Double-blind peer review process' },
    { key: 'editorial', labelUz: 'Tahririyat qarori', labelRu: 'Решение редакции', labelEn: 'Editorial Decision', descUz: 'Bosh muharrir qarori', descRu: 'Решение главного редактора', descEn: 'Editor-in-chief final decision' },
    { key: 'production', labelUz: 'Chop etilgan', labelRu: 'Опубликовано', labelEn: 'Published', descUz: 'Maqola nashr etildi va DOI berildi', descRu: 'Статья опубликована с DOI', descEn: 'Article published & DOI assigned' }
  ];

  const getStepStatus = (stepKey: string, articleStatus: string) => {
    if (!articleStatus) return 'upcoming';

    if (stepKey === 'submitted') return 'completed';
    
    if (stepKey === 'review') {
      if (articleStatus === 'pending') return 'active';
      return 'completed'; // published or rejected means passed review
    }
    
    if (stepKey === 'editorial') {
      if (articleStatus === 'pending') return 'upcoming';
      return 'completed';
    }
    
    if (stepKey === 'production') {
      if (articleStatus === 'published') return 'completed';
      if (articleStatus === 'rejected') return 'failed';
      return 'upcoming';
    }

    return 'upcoming';
  };

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '1rem' }}>
          {lang === 'UZ' ? 'Maqola holatini kuzatish' : lang === 'RU' ? 'Отслеживание статуса статьи' : 'Track Submission Status'}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          {lang === 'UZ' 
            ? "Sizga taqdim etilgan maqola ID raqamini (UUID) quyida kiriting va tahririyat hamda taqriz jarayoni bosqichlarini onlayn kuzating."
            : lang === 'RU' 
              ? "Введите полученный вами ID статьи (UUID) ниже для отслеживания стадий рецензирования и публикации."
              : "Enter your unique Article ID (UUID) below to track the editing, peer-review, and publication steps in real-time."}
        </p>
      </div>

      {/* Qidiruv Formasi */}
      <form onSubmit={handleTrack} style={{ 
        background: '#fff', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        border: '1px solid var(--border)',
        boxShadow: '0 8px 30px rgba(10,22,40,0.05)',
        display: 'flex',
        gap: '10px',
        marginBottom: '3rem'
      }}>
        <input 
          type="text" 
          value={articleId}
          onChange={(e) => setArticleId(e.target.value)}
          placeholder="Masalan / E.g.: a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
          required
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            border: '1px solid var(--border)', 
            borderRadius: '4px',
            fontSize: '14px', 
            outline: 'none', 
            fontFamily: 'inherit',
            background: 'var(--cream)',
            color: 'var(--text)'
          }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '12px 28px', borderRadius: '4px' }}>
          {lang === 'UZ' ? 'Tekshirish' : lang === 'RU' ? 'Проверить' : 'Track'}
        </button>
      </form>

      {/* Yuklash holati */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <i className="ti ti-loader" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px', animation: 'spin 1s linear infinite' }}></i>
          {lang === 'UZ' ? 'Tekshirilmoqda...' : 'Проверка...'}
        </div>
      )}

      {/* Xatolik */}
      {searched && errorMsg && (
        <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: '1.25rem', borderRadius: '6px', textAlign: 'center', fontSize: '15px', fontWeight: 500 }}>
          <i className="ti ti-alert-circle" style={{ fontSize: '20px', marginRight: '8px', verticalAlign: 'middle' }}></i>
          {errorMsg}
        </div>
      )}

      {/* Natija */}
      {searched && article && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', boxShadow: '0 8px 30px rgba(10,22,40,0.03)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 700, 
              padding: '4px 12px', 
              borderRadius: '100px',
              background: article.status === 'pending' ? 'rgba(255,193,7,0.15)' : article.status === 'published' ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
              color: article.status === 'pending' ? '#b8902a' : article.status === 'published' ? '#2e7d32' : '#c62828',
              textTransform: 'uppercase',
              float: 'right'
            }}>
              {article.status === 'pending' ? (lang === 'UZ' ? 'Kutilmoqda' : 'В ожидании') : article.status === 'published' ? (lang === 'UZ' ? 'Chop etildi' : 'Опубликовано') : (lang === 'UZ' ? 'Rad etildi' : 'Отклонено')}
            </span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.35rem', color: 'var(--navy)', marginBottom: '10px', maxWidth: '85%' }}>
              {article.title}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
              {lang === 'UZ' ? 'Mualliflar' : 'Авторы'}: {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', paddingLeft: '2.5rem' }}>
            {/* Vertikal chiziq */}
            <div style={{ 
              position: 'absolute', 
              left: '11px', 
              top: '8px', 
              bottom: '8px', 
              width: '2px', 
              background: '#cbd5e1', 
              zIndex: 1 
            }}></div>

            {steps.map((step, idx) => {
              const status = getStepStatus(step.key, article.status);
              const isLast = idx === steps.length - 1;

              let dotBg = '#fff';
              let dotBorder = '#cbd5e1';
              let dotColor = '#cbd5e1';
              let titleColor = 'var(--muted)';

              if (status === 'completed') {
                dotBg = '#2e7d32';
                dotBorder = '#2e7d32';
                dotColor = '#fff';
                titleColor = 'var(--navy)';
              } else if (status === 'active') {
                dotBg = '#fff';
                dotBorder = '#b8902a';
                dotColor = '#b8902a';
                titleColor = '#b8902a';
              } else if (status === 'failed') {
                dotBg = '#c62828';
                dotBorder = '#c62828';
                dotColor = '#fff';
                titleColor = '#c62828';
              }

              return (
                <div key={step.key} style={{ position: 'relative', zIndex: 2 }}>
                  {/* Timeline nuqtasi */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '-40px', 
                    top: '2px', 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: dotBg, 
                    border: `2px solid ${dotBorder}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: dotColor,
                    fontSize: '12px'
                  }}>
                    {status === 'completed' && <i className="ti ti-check" style={{ strokeWidth: 3 }}></i>}
                    {status === 'active' && <i className="ti ti-reload" style={{ animation: 'spin 2s linear infinite' }}></i>}
                    {status === 'failed' && <i className="ti ti-x" style={{ strokeWidth: 3 }}></i>}
                    {status === 'upcoming' && <span>{idx + 1}</span>}
                  </div>

                  {/* Step content */}
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: titleColor, marginBottom: '4px' }}>
                      {lang === 'UZ' ? step.labelUz : lang === 'RU' ? step.labelRu : step.labelEn}
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                      {lang === 'UZ' ? step.descUz : lang === 'RU' ? step.descRu : step.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Qo'shimcha havolalar (Agar chop etilgan bo'lsa) */}
          {article.status === 'published' && (
            <div style={{ 
              marginTop: '2.5rem', 
              background: 'var(--cream)', 
              padding: '1.5rem', 
              borderRadius: '6px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>DOI</div>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>
                  {article.doi || `10.36001/tamaddun.2025.${article.volume}.${article.issue}.${article.id.slice(0, 5)}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link 
                  href={`/article/${article.id}`} 
                  style={{ background: 'var(--navy)', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }}
                >
                  {lang === 'UZ' ? "Maqolani O'qish" : "Читать статью"}
                </Link>
                <Link 
                  href={`/article/${article.id}/certificate`} 
                  target="_blank" 
                  style={{ background: '#fff', border: '1px solid var(--border)', color: '#b8902a', textDecoration: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 600 }}
                >
                  {lang === 'UZ' ? "Sertifikat yuklash" : "Скачать сертификат"}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
