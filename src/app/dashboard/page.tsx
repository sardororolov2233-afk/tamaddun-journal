"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import UploadArticleForm from '../../components/UploadArticleForm';

export default function DashboardPage() {
  const { user, logout, isSupabaseConfigured } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [articles, setArticles] = useState<any[]>([]);

  const fetchArticles = async () => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setArticles(data);
      }
    } else {
      const saved = localStorage.getItem('gjir_articles');
      if (saved) {
        setArticles(JSON.parse(saved));
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!user && mounted) {
      router.push('/login');
    }
    
    if (user) fetchArticles();
  }, [user, router, mounted, isSupabaseConfigured]);

  const handlePublish = async (id: string) => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('articles').update({ status: 'published' }).eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchArticles();
      alert("Maqola muvaffaqiyatli chop etildi!");
    } else {
      const updated = articles.map(a => a.id === id ? { ...a, status: 'published' } : a);
      setArticles(updated);
      localStorage.setItem('gjir_articles', JSON.stringify(updated));
      alert("Maqola muvaffaqiyatli chop etildi!");
    }
  };

  if (!mounted || !user) return null;

  const pendingArticles = articles.filter(a => a.status === 'pending');
  const publishedArticles = articles.filter(a => a.status === 'published');
  
  // Ma'lumotlarni user roliga qarab filtrlash
  const authorArticles = articles.filter(a => {
    if (isSupabaseConfigured) return a.author_id === user.id;
    return a.authorEmail === user.email;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', display: 'flex', gap: '2rem', minHeight: 'calc(100vh - 200px)' }}>
      {/* Dashboard Sidebar */}
      <div style={{ width: '280px', flexShrink: 0 }}>
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          position: 'sticky',
          top: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{user.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'capitalize' }}>
                {user.role === 'author' ? 'Muallif' : user.role === 'reviewer' ? 'Taqrizchi' : 'Admin'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{ textAlign: 'left', padding: '10px 12px', background: activeTab === 'overview' ? 'var(--cream)' : 'transparent', color: activeTab === 'overview' ? 'var(--navy)' : 'var(--text)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'overview' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ti ti-layout-dashboard"></i> Bosh panel
            </button>
            <button style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', color: 'var(--text)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ti ti-user"></i> Profil sozlamalari
            </button>
            
            {user.role === 'author' && (
              <>
                <button 
                  onClick={() => setActiveTab('my-articles')}
                  style={{ textAlign: 'left', padding: '10px 12px', background: activeTab === 'my-articles' ? 'var(--cream)' : 'transparent', color: activeTab === 'my-articles' ? 'var(--navy)' : 'var(--text)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'my-articles' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-file-text"></i> Mening maqolalarim
                </button>
                <button 
                  onClick={() => setActiveTab('upload')}
                  style={{ textAlign: 'left', padding: '10px 12px', background: activeTab === 'upload' ? 'var(--cream)' : 'transparent', color: activeTab === 'upload' ? 'var(--navy)' : 'var(--text)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'upload' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-upload"></i> Yangi maqola yuklash
                </button>
              </>
            )}

            {user.role === 'reviewer' && (
              <>
                <button style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', color: 'var(--text)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-clipboard-list"></i> Taqriz kutayotganlar
                </button>
                <button style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', color: 'var(--text)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-check"></i> Taqrizlanganlar
                </button>
              </>
            )}

            {user.role === 'admin' && (
              <>
                <button style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', color: 'var(--text)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-users"></i> Foydalanuvchilar
                </button>
                <button 
                  onClick={() => setActiveTab('admin-pending')}
                  style={{ textAlign: 'left', padding: '10px 12px', background: activeTab === 'admin-pending' ? 'var(--cream)' : 'transparent', color: activeTab === 'admin-pending' ? 'var(--navy)' : 'var(--text)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'admin-pending' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ti ti-files"></i> Kutayotgan maqolalar</span>
                  {pendingArticles.length > 0 && <span style={{ background: '#e53935', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>{pendingArticles.length}</span>}
                </button>
                <button style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', color: 'var(--text)', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ti ti-settings"></i> Tizim sozlamalari
                </button>
              </>
            )}

            <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }}></div>
            
            <button onClick={logout} style={{ textAlign: 'left', padding: '10px 12px', background: 'transparent', color: '#e53935', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ti ti-logout"></i> Tizimdan chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Main Area */}
      <div style={{ flex: 1 }}>
        {activeTab === 'upload' && user.role === 'author' && (
          <UploadArticleForm onSuccess={() => {
            fetchArticles();
            setActiveTab('my-articles');
          }} />
        )}

        {activeTab === 'my-articles' && user.role === 'author' && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif' }}>Mening maqolalarim</h2>
            {authorArticles.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>Hozircha sizda yuklangan maqolalar yo'q.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {authorArticles.map(article => (
                  <div key={article.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '4px' }}>{article.title}</h3>
                      <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{article.authors.join(', ')}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {article.hasDocx && <span style={{ fontSize: '11px', background: 'var(--cream)', padding: '2px 8px', borderRadius: '4px', color: 'var(--navy)' }}><i className="ti ti-file-word"></i> DOCX</span>}
                        {article.hasPdf && <span style={{ fontSize: '11px', background: 'var(--cream)', padding: '2px 8px', borderRadius: '4px', color: 'var(--navy)' }}><i className="ti ti-file-type-pdf"></i> PDF</span>}
                      </div>
                    </div>
                    <div>
                      <span style={{ 
                        fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px',
                        background: article.status === 'pending' ? 'rgba(255,193,7,0.2)' : 'rgba(76,175,80,0.2)',
                        color: article.status === 'pending' ? '#f57c00' : '#388e3c',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        {article.status === 'pending' ? 'Kutmoqda' : 'Chop etildi'}
                      </span>
                      
                      {article.status === 'published' && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <Link href={`/article/${article.id}`} style={{ fontSize: '12px', color: '#1976d2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <i className="ti ti-external-link"></i> Maqola sahifasi
                          </Link>
                          <Link href={`/article/${article.id}/certificate`} target="_blank" style={{ fontSize: '12px', color: '#b8902a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <i className="ti ti-certificate"></i> Sertifikat (PDF)
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin-pending' && user.role === 'admin' && (
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif' }}>Tahririyatga kelib tushgan maqolalar</h2>
            {pendingArticles.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>Hozircha yangi maqolalar yo'q.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingArticles.map(article => (
                  <div key={article.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', margin: 0 }}>{article.title}</h3>
                      <button onClick={() => handlePublish(article.id)} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="ti ti-check"></i> Chop etish
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Mualliflar</div>
                        <div style={{ fontSize: '14px', color: 'var(--text)' }}>{article.authors.join(', ')}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Kalit so'zlar</div>
                        <div style={{ fontSize: '14px', color: 'var(--text)' }}>{article.keywords}</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Abstract</div>
                      <div style={{ fontSize: '13px', color: 'var(--text)', background: 'var(--cream)', padding: '10px', borderRadius: '4px' }}>{article.abstract}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', marginRight: '10px' }}>Fayllar:</div>
                      {article.has_docx && (
                        <a href={isSupabaseConfigured ? `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/articles_files/${article.id}.docx` : '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#e3f2fd', color: '#1976d2', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          <i className="ti ti-download"></i> DOCX
                        </a>
                      )}
                      {article.has_pdf && (
                        <a href={isSupabaseConfigured ? `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/articles_files/${article.id}.pdf` : '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#ffebee', color: '#c62828', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          <i className="ti ti-download"></i> PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              Xush kelibsiz, {user.name}!
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {user.role === 'author' && (
                <>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Mening maqolalarim</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{authorArticles.length}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Chop etilgan</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{authorArticles.filter(a => a.status === 'published').length}</div>
                  </div>
                </>
              )}

              {user.role === 'reviewer' && (
                <>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Yangi vazifalar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>3</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Tugallangan taqrizlar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>14</div>
                  </div>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Kutayotgan maqolalar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{pendingArticles.length}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Chop etilgan maqolalar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{publishedArticles.length}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Oylik tushum (APC)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4CAF50' }}>$1,240</div>
                  </div>
                </>
              )}
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem' }}>Oxirgi Faoliyatlar</h2>
              <p style={{ color: 'var(--muted)' }}>Bu yerda sizning va tizimdagi so'nggi harakatlar ko'rinadi.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
