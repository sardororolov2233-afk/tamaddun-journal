"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import UploadArticleForm from '../../components/UploadArticleForm';
import UploadThesisForm from '../../components/UploadThesisForm';
import UploadVolumeForm from '../../components/UploadVolumeForm';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const { user, logout, isSupabaseConfigured } = useAuth();
  const { lang } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [articles, setArticles] = useState<any[]>([]);
  const [theses, setTheses] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [profileName, setProfileName] = useState('');
  const [reviewNoteText, setReviewNoteText] = useState<{ [key: string]: string }>({});
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingCert, setUploadingCert] = useState<{ [key: string]: boolean }>({});

  // Fetch articles from Supabase or LocalStorage
  const fetchArticles = async () => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
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

  // Fetch theses from Supabase or LocalStorage
  const fetchTheses = async () => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { data, error } = await supabase
        .from('theses')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setTheses(data);
      }
    } else {
      const saved = localStorage.getItem('gjir_theses');
      if (saved) {
        setTheses(JSON.parse(saved));
      }
    }
  };

  // Fetch volumes from Supabase or LocalStorage
  const fetchVolumes = async () => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { data, error } = await supabase
        .from('volumes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setVolumes(data);
      }
    } else {
      const saved = localStorage.getItem('gjir_volumes');
      if (saved) {
        setVolumes(JSON.parse(saved));
      }
    }
  };

  // Fetch users (Admin only)
  const fetchUsers = async () => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) {
        setUsersList(data);
      }
    } else {
      const saved = localStorage.getItem('gjir_profiles');
      if (saved) {
        setUsersList(JSON.parse(saved));
      } else {
        const defaultUsers = [
          { id: '1', email: 'admin@tamaddun.uz', full_name: 'Jurnal Adminstratori', role: 'admin' },
          { id: '2', email: 'reviewer@tamaddun.uz', full_name: 'Dr. Karimov A.B.', role: 'reviewer' },
          { id: '3', email: 'author@tamaddun.uz', full_name: 'Ergashev Sherzod', role: 'author' }
        ];
        localStorage.setItem('gjir_profiles', JSON.stringify(defaultUsers));
        setUsersList(defaultUsers);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!user && mounted) {
      router.push('/login');
    }
    if (user) {
      fetchArticles();
      fetchTheses();
      fetchVolumes();
      setProfileName(user.name || '');
      if (user.role === 'admin') {
        fetchUsers();
      }
    }
  }, [user, router, mounted, isSupabaseConfigured]);

  // Publish Article Action
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

  // Reject Article Action (Requested by User)
  const handleReject = async (id: string) => {
    const reason = window.prompt(lang === 'UZ' ? "Rad etish sababini yozing:" : "Укажите причину отклонения:");
    if (reason === null) return; // cancelled

    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('articles').update({ status: 'rejected', reviewer_notes: reason }).eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchArticles();
      alert("Maqola rad etildi!");
    } else {
      const updated = articles.map(a => a.id === id ? { ...a, status: 'rejected', reviewer_notes: reason } : a);
      setArticles(updated);
      localStorage.setItem('gjir_articles', JSON.stringify(updated));
      alert("Maqola rad etildi!");
    }
  };

  // Delete Article Action (Requested by User)
  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm(lang === 'UZ' ? "Rostdan ham ushbu maqolani o'chirib tashlamoqchimisiz? Ushbu amal qaytarilmaydi!" : "Вы действительно хотите удалить эту статью? Это действие необратимо!")) return;

    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchArticles();
      alert("Maqola o'chirib tashlandi!");
    } else {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      localStorage.setItem('gjir_articles', JSON.stringify(updated));
      alert("Maqola o'chirib tashlandi!");
    }
  };

  // Save Reviewer Notes Action
  const handleSaveReview = async (id: string) => {
    const note = reviewNoteText[id] || '';
    if (!note.trim()) {
      alert(lang === 'UZ' ? "Taqriz matnini kiriting!" : "Введите текст рецензии!");
      return;
    }

    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('articles').update({ reviewer_notes: note }).eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchArticles();
      alert("Taqriz yozib qo'yildi!");
    } else {
      const updated = articles.map(a => a.id === id ? { ...a, reviewer_notes: note } : a);
      setArticles(updated);
      localStorage.setItem('gjir_articles', JSON.stringify(updated));
      alert("Taqriz yozib qo'yildi!");
    }
  };

  // Update Profile Name Action
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    setUpdatingProfile(true);
    if (isSupabaseConfigured && user?.id) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('profiles').update({ full_name: profileName }).eq('id', user.id);
      if (error) {
        alert("Xatolik: " + error.message);
      } else {
        alert(lang === 'UZ' ? "Profil nomi yangilandi! O'zgarishlar keyingi kirishda to'liq aks etadi." : "Имя профиля обновлено!");
      }
    } else {
      // Mock update
      const savedUser = localStorage.getItem('gjir_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.name = profileName;
        localStorage.setItem('gjir_user', JSON.stringify(parsed));
      }
      alert(lang === 'UZ' ? "Profil nomi yangilandi!" : "Имя профиля обновлено!");
    }
    setUpdatingProfile(false);
  };

  // Change User Role (Admin only)
  const handleChangeRole = async (userId: string, newRole: string) => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) {
        alert("Xatolik: " + error.message);
      } else {
        fetchUsers();
        alert("Foydalanuvchi roli muvaffaqiyatli o'zgartirildi!");
      }
    } else {
      const updated = usersList.map(u => u.id === userId ? { ...u, role: newRole } : u);
      setUsersList(updated);
      localStorage.setItem('gjir_profiles', JSON.stringify(updated));
      alert("Foydalanuvchi roli muvaffaqiyatli o'zgartirildi!");
    }
  };

  // Publish Thesis Action
  const handlePublishThesis = async (id: string) => {
    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('theses').update({ status: 'published' }).eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchTheses();
      alert("Tezis muvaffaqiyatli chop etildi!");
    } else {
      const updated = theses.map(t => t.id === id ? { ...t, status: 'published' } : t);
      setTheses(updated);
      localStorage.setItem('gjir_theses', JSON.stringify(updated));
      alert("Tezis muvaffaqiyatli chop etildi!");
    }
  };

  // Reject Thesis Action
  const handleRejectThesis = async (id: string) => {
    const reason = window.prompt(lang === 'UZ' ? "Rad etish sababini yozing:" : "Укажите причину отклонения:");
    if (reason === null) return;

    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('theses').update({ status: 'rejected', reviewer_notes: reason }).eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchTheses();
      alert("Tezis rad etildi!");
    } else {
      const updated = theses.map(t => t.id === id ? { ...t, status: 'rejected', reviewer_notes: reason } : t);
      setTheses(updated);
      localStorage.setItem('gjir_theses', JSON.stringify(updated));
      alert("Tezis rad etildi!");
    }
  };

  // Delete Thesis Action
  const handleDeleteThesis = async (id: string) => {
    if (!window.confirm(lang === 'UZ' ? "Rostdan ham ushbu tezisni o'chirib tashlamoqchimisiz?" : "Удалить этот тезис?")) return;

    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('theses').delete().eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchTheses();
      alert("Tezis o'chirib tashlandi!");
    } else {
      const updated = theses.filter(t => t.id !== id);
      setTheses(updated);
      localStorage.setItem('gjir_theses', JSON.stringify(updated));
      alert("Tezis o'chirib tashlandi!");
    }
  };

  // Save Reviewer Notes for Thesis
  const handleSaveReviewThesis = async (id: string) => {
    const note = reviewNoteText[id] || '';
    if (!note.trim()) {
      alert(lang === 'UZ' ? "Taqriz matnini kiriting!" : "Введите текст рецензии!");
      return;
    }

    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('theses').update({ reviewer_notes: note }).eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchTheses();
      alert("Taqriz yozib qo'yildi!");
    } else {
      const updated = theses.map(t => t.id === id ? { ...t, reviewer_notes: note } : t);
      setTheses(updated);
      localStorage.setItem('gjir_theses', JSON.stringify(updated));
      alert("Taqriz yozib qo'yildi!");
    }
  };

  // Delete Volume
  const handleDeleteVolume = async (id: string) => {
    if (!window.confirm(lang === 'UZ' ? "Rostdan ham ushbu jildni o'chirib tashlamoqchimisiz?" : "Вы действительно хотите удалить этот том?")) return;

    if (isSupabaseConfigured) {
      const { supabase } = await import('../../lib/supabaseClient');
      const { error } = await supabase.from('volumes').delete().eq('id', id);
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      fetchVolumes();
      alert("Jild o'chirib tashlandi!");
    } else {
      const updated = volumes.filter(v => v.id !== id);
      setVolumes(updated);
      localStorage.setItem('gjir_volumes', JSON.stringify(updated));
      alert("Jild o'chirib tashlandi!");
    }
  };

  // Upload Certificate
  const handleUploadCertificate = async (articleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      alert(lang === 'UZ' ? "Supabase ulanmagan. Ma'lumotlarni saqlab bo'lmaydi." : "Supabase не подключен. Невозможно сохранить данные.");
      return;
    }

    setUploadingCert({ ...uploadingCert, [articleId]: true });
    
    try {
      const { supabase } = await import('../../lib/supabaseClient');
      const fileName = `certificates/${articleId}.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('articles_files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase.from('articles')
        .update({ has_certificate: true })
        .eq('id', articleId);

      if (updateError) throw updateError;

      alert(lang === 'UZ' ? "Sertifikat muvaffaqiyatli yuklandi!" : "Сертификат успешно загружен!");
      fetchArticles();
    } catch (error: any) {
      alert("Xatolik yuz berdi: " + error.message);
    } finally {
      setUploadingCert({ ...uploadingCert, [articleId]: false });
    }
  };

  if (!mounted || !user) return null;

  // Filtered listings
  const pendingArticles = articles.filter(a => a.status === 'pending');
  const publishedArticles = articles.filter(a => a.status === 'published');
  const rejectedArticles = articles.filter(a => a.status === 'rejected');

  const authorArticles = articles.filter(a => {
    if (isSupabaseConfigured) return a.author_id === user.id;
    return a.authorEmail === user.email;
  });

  const pendingTheses = theses.filter(t => t.status === 'pending');
  const publishedTheses = theses.filter(t => t.status === 'published');
  const rejectedTheses = theses.filter(t => t.status === 'rejected');

  const authorTheses = theses.filter(t => {
    if (isSupabaseConfigured) return t.author_id === user.id;
    return t.authorEmail === user.email;
  });

  const getPdfUrl = (art: any) => {
    if (isSupabaseConfigured && art.id.length > 5) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`${art.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  const getThesisPdfUrl = (th: any) => {
    if (isSupabaseConfigured && th.id.length > 5) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`theses/${th.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  const getCertificateUrl = (art: any) => {
    if (isSupabaseConfigured && art.id.length > 5) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`certificates/${art.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  return (
    <div className="dashboard-layout animate-fade-in-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', minHeight: 'calc(100vh - 200px)' }}>
      
      {/* Dashboard Sidebar */}
      <div className="dashboard-sidebar">
        <div style={{
          background: '#fff',
          padding: '2rem 1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          position: 'sticky',
          top: '90px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* User profile brief card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, border: '2px solid var(--gold)' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '14px', lineHeight: '1.2' }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 700, marginTop: '2px', letterSpacing: '0.5px' }}>
                {user.role === 'author' ? (lang === 'UZ' ? 'Muallif' : 'Автор') : user.role === 'reviewer' ? (lang === 'UZ' ? 'Taqrizchi' : 'Рецензент') : 'Admin'}
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'overview' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'overview' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
              <i className="ti ti-layout-dashboard" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Bosh panel' : 'Главная панель'}
            </button>
            <button 
              onClick={() => setActiveTab('profile-settings')}
              style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'profile-settings' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'profile-settings' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
              <i className="ti ti-user" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Profil sozlamalari' : 'Настройки профиля'}
            </button>
            
            {/* Author specific actions */}
            {user.role === 'author' && (
              <>
                <button 
                  onClick={() => setActiveTab('my-articles')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'my-articles' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'my-articles' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-file-text" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Mening maqolalarim' : 'Мои статьи'}
                </button>
                <button 
                  onClick={() => setActiveTab('upload')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'upload' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'upload' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-upload" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Yangi maqola yuklash' : 'Загрузить статью'}
                </button>
                <button 
                  onClick={() => setActiveTab('my-theses')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'my-theses' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'my-theses' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-notes" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Mening tezislarim' : 'Мои тезисы'}
                </button>
                <button 
                  onClick={() => setActiveTab('upload-thesis')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'upload-thesis' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'upload-thesis' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-upload" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Yangi tezis yuklash' : 'Загрузить тезис'}
                </button>
              </>
            )}

            {/* Reviewer specific actions */}
            {user.role === 'reviewer' && (
              <>
                <button 
                  onClick={() => setActiveTab('reviewer-pending')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'reviewer-pending' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'reviewer-pending' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-clipboard-list" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Taqriz kutayotganlar' : 'Ожидают рецензии'}
                </button>
                <button 
                  onClick={() => setActiveTab('reviewer-completed')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'reviewer-completed' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'reviewer-completed' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-check-double" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Taqriz qilinganlar' : 'Рецензированные'}
                </button>
                <button 
                  onClick={() => setActiveTab('reviewer-theses-pending')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'reviewer-theses-pending' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'reviewer-theses-pending' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-clipboard-list" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Taqriz kutayotgan tezislar' : 'Тезисы на рецензии'}
                </button>
              </>
            )}

            {/* Admin specific actions */}
            {user.role === 'admin' && (
              <>
                <button 
                  onClick={() => setActiveTab('admin-users')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'admin-users' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'admin-users' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-users" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Foydalanuvchilar' : 'Пользователи'}
                </button>
                <button 
                  onClick={() => setActiveTab('admin-pending')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'admin-pending' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'admin-pending' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="ti ti-files" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Kutayotgan maqolalar' : 'Ожидающие статьи'}</span>
                  {pendingArticles.length > 0 && <span style={{ background: '#e53935', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{pendingArticles.length}</span>}
                </button>
                <button 
                  onClick={() => setActiveTab('admin-published')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'admin-published' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'admin-published' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="ti ti-checklist" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Chop etilgan maqolalar' : 'Опубликованные статьи'}</span>
                  {publishedArticles.length > 0 && <span style={{ background: 'var(--navy)', color: 'var(--gold-light)', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{publishedArticles.length}</span>}
                </button>
                <button 
                  onClick={() => setActiveTab('admin-theses')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'admin-theses' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'admin-theses' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><i className="ti ti-notes" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Tezislar boshqaruvi' : 'Управление тезисами'}</span>
                  {pendingTheses.length > 0 && <span style={{ background: '#e53935', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{pendingTheses.length}</span>}
                </button>
                <button 
                  onClick={() => setActiveTab('admin-volumes')}
                  style={{ textAlign: 'left', padding: '10px 14px', background: activeTab === 'admin-volumes' ? 'var(--cream2)' : 'transparent', color: 'var(--navy)', border: 'none', borderRadius: '4px', fontWeight: activeTab === 'admin-volumes' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', transition: 'var(--transition)' }}>
                  <i className="ti ti-book" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Jildlar boshqaruvi' : 'Управление томами'}
                </button>
              </>
            )}

            <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }}></div>
            
            <button onClick={logout} style={{ textAlign: 'left', padding: '10px 14px', background: 'transparent', color: '#e53935', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 600 }}>
              <i className="ti ti-logout" style={{ fontSize: '16px' }}></i> {lang === 'UZ' ? 'Tizimdan chiqish' : 'Выйти'}
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Main Area */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        
        {/* PROFILE SETTINGS TAB */}
        {activeTab === 'profile-settings' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Profil sozlamalari' : 'Настройки профиля'}
            </h2>
            <form onSubmit={handleUpdateProfile} style={{ maxWidth: '480px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
                  {lang === 'UZ' ? "To'liq ismingiz" : "Полное имя"}
                </label>
                <input 
                  type="text" 
                  required 
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', background: 'var(--cream)', color: 'var(--text)' }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
                  Email pochta (O'zgartirib bo'lmaydi)
                </label>
                <input 
                  type="text" 
                  disabled
                  value={user.email}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', background: 'var(--cream2)', color: 'var(--muted)', cursor: 'not-allowed' }}
                />
              </div>

              <button type="submit" disabled={updatingProfile} className="btn-primary" style={{ padding: '10px 28px', borderRadius: '4px' }}>
                {updatingProfile ? "Saqlanmoqda..." : (lang === 'UZ' ? "Saqlash" : "Сохранить")}
              </button>
            </form>
          </div>
        )}

        {/* UPLOAD MANUSCRIPT TAB */}
        {activeTab === 'upload' && user.role === 'author' && (
          <UploadArticleForm onSuccess={() => {
            fetchArticles();
            setActiveTab('my-articles');
          }} />
        )}

        {/* AUTHOR ARTICLES LIST TAB */}
        {activeTab === 'my-articles' && user.role === 'author' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Mening maqolalarim' : 'Мои статьи'}
            </h2>
            {authorArticles.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{lang === 'UZ' ? "Hozircha sizda yuklangan maqolalar yo'q." : "У вас пока нет загруженных статей."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {authorArticles.map(article => (
                  <div key={article.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--cream)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '6px' }}>{article.title}</h3>
                      <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px', fontStyle: 'italic' }}>
                        {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        {article.has_docx && <span style={{ fontSize: '11px', background: '#fff', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--navy)' }}><i className="ti ti-file-word" style={{ color: '#2b579a' }}></i> DOCX</span>}
                        {article.has_pdf && <span style={{ fontSize: '11px', background: '#fff', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--navy)' }}><i className="ti ti-file-type-pdf" style={{ color: '#e53935' }}></i> PDF</span>}
                      </div>

                      {article.reviewer_notes && (
                        <div style={{ fontSize: '12.5px', background: '#fff', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--gold)', marginTop: '8px', color: 'var(--text)' }}>
                          <strong>{lang === 'UZ' ? 'Tahririyat izohi:' : 'Комментарий редакции:'}</strong> {article.reviewer_notes}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '30px', textTransform: 'uppercase',
                        background: article.status === 'pending' ? 'rgba(255,193,7,0.15)' : article.status === 'published' ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                        color: article.status === 'pending' ? '#b8902a' : article.status === 'published' ? '#2e7d32' : '#c62828',
                        display: 'inline-block',
                        marginBottom: '12px'
                      }}>
                        {article.status === 'pending' ? (lang === 'UZ' ? 'Kutilmoqda' : 'Ожидает') : article.status === 'published' ? (lang === 'UZ' ? 'Chop etildi' : 'Опубликовано') : (lang === 'UZ' ? 'Rad etildi' : 'Отклонено')}
                      </span>
                      
                      {article.status === 'published' && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                          <Link href={`/article/${article.id}`} style={{ fontSize: '12.5px', color: 'var(--navy)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                            <i className="ti ti-external-link"></i> Maqola sahifasi
                          </Link>
                          {article.has_certificate ? (
                            <a href={getCertificateUrl(article)} target="_blank" rel="noopener noreferrer" download={`Sertifikat_${article.title}.pdf`} style={{ fontSize: '12.5px', color: '#b8902a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                              <i className="ti ti-certificate"></i> Sertifikatni yuklab olish
                            </a>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <i className="ti ti-clock"></i> Sertifikat kutilmoqda
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWER TASKS LIST TAB (NEW FUNCTION) */}
        {activeTab === 'reviewer-pending' && user.role === 'reviewer' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Taqriz kutayotgan maqolalar' : 'Статьи на рецензировании'}
            </h2>
            {pendingArticles.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>{lang === 'UZ' ? "Taqriz kutayotgan yangi maqolalar mavjud emas." : "Нет новых статей для рецензирования."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pendingArticles.map(article => (
                  <div key={article.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', background: 'var(--cream)' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '8px' }}>{article.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                      {lang === 'UZ' ? 'Kalit so\'zlar' : 'Ключевые слова'}: <strong>{article.keywords}</strong>
                    </p>
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '4px', fontSize: '13px', color: 'var(--text)', lineHeight: '1.6', marginBottom: '1rem' }}>
                      <strong>Abstract:</strong> {article.abstract}
                    </div>

                    {/* Submit Review */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
                        {lang === 'UZ' ? "Ekspert Taqrizi (Taqriz yozing)" : "Рецензия эксперта"}
                      </label>
                      <textarea
                        rows={3}
                        value={reviewNoteText[article.id] || ''}
                        onChange={e => setReviewNoteText({ ...reviewNoteText, [article.id]: e.target.value })}
                        placeholder={lang === 'UZ' ? "Maqola sifati haqida xulosalaringizni yozing..." : "Напишите рецензию о качестве статьи..."}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13.5px', outline: 'none', background: '#fff', marginBottom: '10px', resize: 'vertical' }}
                      />
                      <button onClick={() => handleSaveReview(article.id)} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '4px', fontSize: '13px' }}>
                        {lang === 'UZ' ? "Taqrizni saqlash" : "Сохранить рецензию"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWER COMPLETED TASKS TAB (NEW FUNCTION) */}
        {activeTab === 'reviewer-completed' && user.role === 'reviewer' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Taqriz qilingan maqolalar' : 'Рецензированные статьи'}
            </h2>
            {articles.filter(a => a.reviewer_notes && a.reviewer_notes.trim() !== '').length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>{lang === 'UZ' ? "Hozircha taqriz qilingan maqolalar mavjud emas." : "У вас нет рецензированных статей."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {articles.filter(a => a.reviewer_notes && a.reviewer_notes.trim() !== '').map(article => (
                  <div key={article.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', background: '#fff' }}>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '6px' }}>{article.title}</h3>
                    <div style={{ fontSize: '11px', background: 'var(--cream)', padding: '2px 8px', borderRadius: '4px', color: 'var(--navy)', display: 'inline-block', marginBottom: '10px' }}>
                      Status: {article.status}
                    </div>
                    <div style={{ background: 'var(--cream2)', padding: '12px', borderRadius: '4px', fontSize: '13px', color: 'var(--text)', borderLeft: '4px solid #2e7d32' }}>
                      <strong>{lang === 'UZ' ? 'Sizning taqrizingiz:' : 'Ваша рецензия:'}</strong> {article.reviewer_notes}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN USER MANAGEMENT TAB (NEW FUNCTION) */}
        {activeTab === 'admin-users' && user.role === 'admin' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Foydalanuvchilarni boshqarish' : 'Управление пользователями'}
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--cream)', borderBottom: '2.5px solid var(--navy)' }}>
                    <th style={{ padding: '12px 10px', color: 'var(--navy)', fontWeight: 700 }}>F.I.SH (Name)</th>
                    <th style={{ padding: '12px 10px', color: 'var(--navy)', fontWeight: 700 }}>Email</th>
                    <th style={{ padding: '12px 10px', color: 'var(--navy)', fontWeight: 700 }}>Rol (Role)</th>
                    <th style={{ padding: '12px 10px', color: 'var(--navy)', fontWeight: 700, textAlign: 'right' }}>Amallar (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--navy)' }}>{u.full_name || u.name || 'Noma\'lum'}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--muted)' }}>{u.email}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: u.role === 'admin' ? '#ffebee' : u.role === 'reviewer' ? '#e8f5e9' : '#e3f2fd', color: u.role === 'admin' ? '#c62828' : u.role === 'reviewer' ? '#2e7d32' : '#1565c0', textTransform: 'uppercase' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <select 
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px', background: '#fff', cursor: 'pointer' }}
                        >
                          <option value="author">Author</option>
                          <option value="reviewer">Reviewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN PENDING ARTICLES LIST TAB (WITH REJECT FUNCTION) */}
        {activeTab === 'admin-pending' && user.role === 'admin' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Kutayotgan maqolalar' : 'Ожидающие публикации'}
            </h2>
            {pendingArticles.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{lang === 'UZ' ? "Kutayotgan maqolalar mavjud emas." : "Нет новых статей в очереди."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pendingArticles.map(article => (
                  <div key={article.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', background: 'var(--cream)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '12px' }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', fontWeight: 700, margin: 0, maxWidth: '65%' }}>{article.title}</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleReject(article.id)} style={{ background: '#e53935', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <i className="ti ti-x"></i> {lang === 'UZ' ? 'Rad etish' : 'Отклонить'}
                        </button>
                        <button onClick={() => handlePublish(article.id)} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                          <i className="ti ti-check"></i> {lang === 'UZ' ? 'Chop etish' : 'Опубликовать'}
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Mualliflar</div>
                        <div style={{ fontSize: '13.5px', color: 'var(--text)' }}>
                          {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Kalit so'zlar</div>
                        <div style={{ fontSize: '13.5px', color: 'var(--text)' }}>{article.keywords}</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Abstract</div>
                      <div style={{ fontSize: '13px', color: 'var(--text)', background: '#fff', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)', lineHeight: '1.6' }}>{article.abstract}</div>
                    </div>

                    {article.reviewer_notes && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Reviewer/Author Notes</div>
                        <div style={{ fontSize: '13px', color: 'var(--text)', background: 'rgba(197, 160, 69, 0.08)', padding: '12px', borderRadius: '4px', borderLeft: '3px solid var(--gold)', lineHeight: '1.6' }}>{article.reviewer_notes}</div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Yuklangan fayllar:</div>
                      {article.has_docx && (
                        <a href={isSupabaseConfigured ? `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/articles_files/${article.id}.docx` : '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#e3f2fd', color: '#1976d2', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          <i className="ti ti-download"></i> DOCX
                        </a>
                      )}
                      {article.has_pdf && (
                        <a href={getPdfUrl(article)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#ffebee', color: '#c62828', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
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

        {activeTab === 'admin-published' && user.role === 'admin' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Chop etilgan maqolalar' : 'Опубликованные статьи'}
            </h2>
            {publishedArticles.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{lang === 'UZ' ? "Chop etilgan maqolalar mavjud emas." : "Нет опубликованных статей."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {publishedArticles.map(article => (
                  <div key={article.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', background: '#fff', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '12px' }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', fontWeight: 700, margin: 0, maxWidth: '65%' }}>{article.title}</h3>
                      <button onClick={() => handleDeleteArticle(article.id)} style={{ background: '#e53935', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <i className="ti ti-trash"></i> {lang === 'UZ' ? "Maqolani o'chirish" : 'Удалить статью'}
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Mualliflar</div>
                        <div style={{ fontSize: '13.5px', color: 'var(--text)' }}>
                          {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Kalit so'zlar</div>
                        <div style={{ fontSize: '13.5px', color: 'var(--text)' }}>{article.keywords}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Fayllar:</div>
                      {article.has_docx && (
                        <a href={isSupabaseConfigured ? `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/articles_files/${article.id}.docx` : '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#e3f2fd', color: '#1976d2', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          <i className="ti ti-download"></i> DOCX
                        </a>
                      )}
                      {article.has_pdf && (
                        <a href={getPdfUrl(article)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#ffebee', color: '#c62828', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                          <i className="ti ti-download"></i> PDF
                        </a>
                      )}
                      
                      {/* Sertifikat yuklash qismi */}
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {article.has_certificate && (
                          <a href={getCertificateUrl(article)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#b8902a', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="ti ti-certificate"></i> Yuklangan
                          </a>
                        )}
                        <label style={{ cursor: uploadingCert[article.id] ? 'not-allowed' : 'pointer', background: 'var(--navy)', color: 'var(--gold-light)', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: uploadingCert[article.id] ? 0.7 : 1 }}>
                          <i className="ti ti-upload"></i> {uploadingCert[article.id] ? 'Yuklanmoqda...' : (article.has_certificate ? 'Sertifikatni yangilash' : 'Sertifikat yuklash')}
                          <input 
                            type="file" 
                            accept=".pdf" 
                            style={{ display: 'none' }}
                            disabled={uploadingCert[article.id]}
                            onChange={(e) => handleUploadCertificate(article.id, e)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* UPLOAD THESIS TAB */}
        {activeTab === 'upload-thesis' && user.role === 'author' && (
          <UploadThesisForm onSuccess={() => {
            fetchTheses();
            setActiveTab('my-theses');
          }} />
        )}

        {/* AUTHOR THESES LIST TAB */}
        {activeTab === 'my-theses' && user.role === 'author' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Mening tezislarim' : 'Мои тезисы'}
            </h2>
            {authorTheses.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{lang === 'UZ' ? "Hozircha sizda yuklangan tezislar yo'q." : "У вас пока нет загруженных тезисов."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {authorTheses.map(thesis => (
                  <div key={thesis.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--cream)' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '6px' }}>{thesis.title}</h3>
                      <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px', fontStyle: 'italic' }}>
                        {Array.isArray(thesis.authors) ? thesis.authors.join(', ') : thesis.authors}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        {thesis.has_docx && <span style={{ fontSize: '11px', background: '#fff', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--navy)' }}><i className="ti ti-file-word" style={{ color: '#2b579a' }}></i> DOCX</span>}
                        {thesis.has_pdf && <span style={{ fontSize: '11px', background: '#fff', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', color: 'var(--navy)' }}><i className="ti ti-file-type-pdf" style={{ color: '#e53935' }}></i> PDF</span>}
                      </div>

                      {thesis.reviewer_notes && (
                        <div style={{ fontSize: '12.5px', background: '#fff', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--gold)', marginTop: '8px', color: 'var(--text)' }}>
                          <strong>{lang === 'UZ' ? 'Tahririyat izohi:' : 'Комментарий редакции:'}</strong> {thesis.reviewer_notes}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '30px', textTransform: 'uppercase',
                        background: thesis.status === 'pending' ? 'rgba(255,193,7,0.15)' : thesis.status === 'published' ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                        color: thesis.status === 'pending' ? '#b8902a' : thesis.status === 'published' ? '#2e7d32' : '#c62828',
                        display: 'inline-block',
                        marginBottom: '12px'
                      }}>
                        {thesis.status === 'pending' ? (lang === 'UZ' ? 'Kutilmoqda' : 'Ожидает') : thesis.status === 'published' ? (lang === 'UZ' ? 'Chop etildi' : 'Опубликовано') : (lang === 'UZ' ? 'Rad etildi' : 'Отклонено')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWER PENDING THESES */}
        {activeTab === 'reviewer-theses-pending' && user.role === 'reviewer' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Taqriz kutayotgan tezislar' : 'Тезисы на рецензировании'}
            </h2>
            {pendingTheses.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>{lang === 'UZ' ? "Taqriz kutayotgan yangi tezislar mavjud emas." : "Нет новых тезисов для рецензирования."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pendingTheses.map(thesis => (
                  <div key={thesis.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.5rem', background: 'var(--cream)' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '8px' }}>{thesis.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                      {lang === 'UZ' ? 'Kalit so\'zlar' : 'Ключевые слова'}: <strong>{thesis.keywords}</strong>
                    </p>
                    <div style={{ background: '#fff', padding: '12px', borderRadius: '4px', fontSize: '13px', color: 'var(--text)', lineHeight: '1.6', marginBottom: '1rem' }}>
                      <strong>Abstract:</strong> {thesis.abstract}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
                        {lang === 'UZ' ? "Ekspert Taqrizi (Taqriz yozing)" : "Рецензия эксперта"}
                      </label>
                      <textarea
                        rows={3}
                        value={reviewNoteText[thesis.id] || ''}
                        onChange={e => setReviewNoteText({ ...reviewNoteText, [thesis.id]: e.target.value })}
                        placeholder={lang === 'UZ' ? "Tezis sifati haqida xulosalaringizni yozing..." : "Напишите рецензию о качестве тезиса..."}
                        style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13.5px', outline: 'none', background: '#fff', marginBottom: '10px', resize: 'vertical' }}
                      />
                      <button onClick={() => handleSaveReviewThesis(thesis.id)} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '4px', fontSize: '13px' }}>
                        {lang === 'UZ' ? "Taqrizni saqlash" : "Сохранить рецензию"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN THESES MANAGEMENT */}
        {activeTab === 'admin-theses' && user.role === 'admin' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? 'Tezislar boshqaruvi' : 'Управление тезисами'}
            </h2>
            
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginTop: '2rem', marginBottom: '1rem' }}>
              {lang === 'UZ' ? 'Kutayotgan tezislar' : 'Ожидающие тезисы'}
            </h3>
            {pendingTheses.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '2rem' }}>{lang === 'UZ' ? "Kutayotgan tezislar mavjud emas." : "Нет новых тезисов в очереди."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                {pendingTheses.map(thesis => (
                  <div key={thesis.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', background: 'var(--cream)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '12px' }}>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--navy)', fontWeight: 700, margin: 0, maxWidth: '65%' }}>{thesis.title}</h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleRejectThesis(thesis.id)} style={{ background: '#e53935', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
                          {lang === 'UZ' ? 'Rad etish' : 'Отклонить'}
                        </button>
                        <button onClick={() => handlePublishThesis(thesis.id)} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
                          {lang === 'UZ' ? 'Chop etish' : 'Опубликовать'}
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Mualliflar</div>
                        <div style={{ fontSize: '13px', color: 'var(--text)' }}>
                          {Array.isArray(thesis.authors) ? thesis.authors.join(', ') : thesis.authors}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Kalit so'zlar</div>
                        <div style={{ fontSize: '13px', color: 'var(--text)' }}>{thesis.keywords}</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Abstract</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text)', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}>{thesis.abstract}</div>
                    </div>

                    {thesis.reviewer_notes && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Reviewer Notes</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text)', background: 'rgba(197, 160, 69, 0.08)', padding: '10px', borderRadius: '4px', borderLeft: '3px solid var(--gold)' }}>{thesis.reviewer_notes}</div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Fayllar:</div>
                      {thesis.has_docx && (
                        <a href={isSupabaseConfigured ? `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}/storage/v1/object/public/articles_files/theses/${thesis.id}.docx` : '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          DOCX
                        </a>
                      )}
                      {thesis.has_pdf && (
                        <a href={getThesisPdfUrl(thesis)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#ffebee', color: '#c62828', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginTop: '2.5rem', marginBottom: '1rem' }}>
              {lang === 'UZ' ? 'Chop etilgan tezislar' : 'Опубликованные тезисы'}
            </h3>
            {publishedTheses.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{lang === 'UZ' ? "Chop etilgan tezislar mavjud emas." : "Нет опубликованных тезисов."}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {publishedTheses.map(thesis => (
                  <div key={thesis.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--navy)', fontWeight: 700, margin: 0 }}>{thesis.title}</h4>
                      <button onClick={() => handleDeleteThesis(thesis.id)} style={{ background: '#e53935', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                        {lang === 'UZ' ? "O'chirish" : 'Удалить'}
                      </button>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
                      Mualliflar: {Array.isArray(thesis.authors) ? thesis.authors.join(', ') : thesis.authors}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {thesis.has_pdf && (
                        <a href={getThesisPdfUrl(thesis)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: '#ffebee', color: '#c62828', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                          PDF ko'rish
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN VOLUMES MANAGEMENT */}
        {activeTab === 'admin-volumes' && user.role === 'admin' && (
          <div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '2rem' }}>
              {lang === 'UZ' ? 'Jildlar boshqaruvi' : 'Управление томами'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Left Column: Upload Volume Form */}
              <UploadVolumeForm onSuccess={() => fetchVolumes()} />

              {/* Right Column: Uploaded Volumes List */}
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif' }}>
                  {lang === 'UZ' ? 'Mavjud jildlar ro\'yxati' : 'Список существующих томов'}
                </h3>
                {volumes.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13.5px' }}>
                    {lang === 'UZ' ? "Hozircha yuklangan jildlar yo'q." : "Пока нет загруженных томов."}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {volumes.map(vol => (
                      <div key={vol.id} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', background: 'var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ flexShrink: 0, width: '40px', height: '55px', borderRadius: '4px', overflow: 'hidden', background: 'var(--navy)' }}>
                          <img 
                            src={vol.cover_image_url || "/jild_cover.png"} 
                            alt="Jild Muqovasi" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <div style={{ flex: 1, marginRight: '10px' }}>
                          <h4 style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: 700, margin: '0 0 4px 0' }}>{vol.title}</h4>
                          <span style={{ fontSize: '11px', background: 'var(--navy)', color: 'var(--gold-light)', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px', fontWeight: 600 }}>
                            {vol.field}
                          </span>
                          {vol.comment && (
                            <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                              {vol.comment}
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                          <a 
                            href={vol.pdf_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ textDecoration: 'none', background: '#ffebee', color: '#c62828', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <i className="ti ti-download"></i> PDF
                          </a>
                          <button 
                            onClick={() => handleDeleteVolume(vol.id)} 
                            style={{ background: 'transparent', border: 'none', color: '#e53935', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                          >
                            {lang === 'UZ' ? "O'chirish" : "Удалить"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW PANEL TAB */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
              {lang === 'UZ' ? `Xush kelibsiz, ${user.name}!` : `Добро пожаловать, ${user.name}!`}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {user.role === 'author' && (
                <>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Mening maqolalarim</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{authorArticles.length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Chop etilgan maqolalar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{authorArticles.filter(a => a.status === 'published').length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Mening tezislarim</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{authorTheses.length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Chop etilgan tezislar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{authorTheses.filter(t => t.status === 'published').length}</div>
                  </div>
                </>
              )}

              {user.role === 'reviewer' && (
                <>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Kutayotgan maqolalar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{pendingArticles.length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Kutayotgan tezislar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{pendingTheses.length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Tugallangan maqola taqrizlari</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{articles.filter(a => a.reviewer_notes && a.reviewer_notes.trim() !== '').length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Tugallangan tezis taqrizlari</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{theses.filter(t => t.reviewer_notes && t.reviewer_notes.trim() !== '').length}</div>
                  </div>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Kutayotgan maqolalar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{pendingArticles.length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Chop etilgan maqolalar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{publishedArticles.length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Kutayotgan tezislar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>{pendingTheses.length}</div>
                  </div>
                  <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem' }}>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Chop etilgan tezislar</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)' }}>{publishedTheses.length}</div>
                  </div>
                </>
              )}
            </div>

            <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem', fontWeight: 700 }}>
                {lang === 'UZ' ? 'Oxirgi Faoliyatlar' : 'Последние действия'}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0 }}>
                {lang === 'UZ' ? 'Tizimdagi barcha harakatlar to\'g\'ridan-to\'g\'ri boshqaruv a\'zolariga xabar qilinadi. Kuzatuv paneli yangilandi.' : 'Все действия в системе синхронизированы.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
