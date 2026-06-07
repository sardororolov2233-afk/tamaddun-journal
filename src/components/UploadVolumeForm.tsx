"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function UploadVolumeForm({ onSuccess }: { onSuccess?: () => void }) {
  const { isSupabaseConfigured } = useAuth();
  const { lang } = useLanguage();
  const [title, setTitle] = useState('');
  const [field, setField] = useState('Pedagogika');
  const [customField, setCustomField] = useState('');
  const [comment, setComment] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pdfFile) {
      setErrorMsg(lang === 'UZ' ? "PDF faylni yuklash majburiy!" : "Загрузка PDF файла обязательна!");
      return;
    }

    setLoading(true);
    const volumeId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const selectedField = field === 'Boshqa' ? customField : field;

    if (!selectedField.trim()) {
      setErrorMsg(lang === 'UZ' ? "Sohani kiriting!" : "Укажите область!");
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured) {
        const { supabase } = await import('../lib/supabaseClient');

        // 1. Upload PDF to Storage in 'articles_files' under 'volumes/' folder
        const filePath = `volumes/${volumeId}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('articles_files')
          .upload(filePath, pdfFile, { upsert: true });

        if (uploadError) {
          throw new Error("Faylni yuklashda xatolik: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('articles_files')
          .getPublicUrl(filePath);

        const pdfUrl = publicUrlData?.publicUrl || '';

        // Upload Cover Image if exists
        let coverImageUrl = '';
        if (coverImage) {
          const imagePath = `volumes/covers/${volumeId}_cover.${coverImage.name.split('.').pop()}`;
          const { error: imgError } = await supabase.storage
            .from('articles_files')
            .upload(imagePath, coverImage, { upsert: true });
            
          if (!imgError) {
            const { data: imgUrlData } = supabase.storage
              .from('articles_files')
              .getPublicUrl(imagePath);
            coverImageUrl = imgUrlData?.publicUrl || '';
          }
        }

        // 2. Insert Volume info in Database
        const { error: dbError } = await supabase
          .from('volumes')
          .insert([
            {
              id: volumeId,
              title,
              comment,
              field: selectedField,
              pdf_url: pdfUrl,
              cover_image_url: coverImageUrl
            }
          ]);

        if (dbError) {
          throw new Error("Ma'lumotlar bazasiga saqlashda xatolik: " + dbError.message);
        }
      } else {
        // localStorage mock
        const newVolume = {
          id: volumeId,
          title,
          comment,
          field: selectedField,
          pdf_url: '#', // mock URL
          created_at: new Date().toISOString()
        };

        const existingStr = localStorage.getItem('gjir_volumes');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        localStorage.setItem('gjir_volumes', JSON.stringify([newVolume, ...existing]));
      }

      alert(lang === 'UZ' ? "Yangi jild muvaffaqiyatli yuklandi!" : "Новый том успешно загружен!");
      setTitle('');
      setComment('');
      setPdfFile(null);
      setCoverImage(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'var(--cream)',
    color: 'var(--text)',
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--navy)',
    marginBottom: '8px'
  };

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif' }}>
        {lang === 'UZ' ? "Yangi jild yuklash" : "Загрузить новый том"}
      </h2>

      {errorMsg && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '14px', fontWeight: 500 }}>
          <i className="ti ti-alert-circle" style={{ marginRight: '8px' }}></i>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>{lang === 'UZ' ? "Jild/Nashr nomi (Sarlavha) *" : "Название тома/выпуска *"}</label>
          <input 
            type="text" 
            required 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder={lang === 'UZ' ? "Masalan: 5-Jild, 1-Son (2026)" : "Например: Том 5, Выпуск 1 (2026)"} 
            style={inputStyle} 
          />
        </div>

        <div>
          <label style={labelStyle}>{lang === 'UZ' ? "Soha (Yo'nalish) *" : "Сфера/Направление *"}</label>
          <select 
            value={field} 
            onChange={(e) => setField(e.target.value)} 
            style={inputStyle}
          >
            <option value="Pedagogika">Pedagogika</option>
            <option value="Filologiya">Filologiya</option>
            <option value="Tarix">Tarix</option>
            <option value="Biotibbiyot">Biotibbiyot</option>
            <option value="Informatika">Informatika</option>
            <option value="Iqtisodiyot">Iqtisodiyot</option>
            <option value="Boshqa">Boshqa (O'zingiz kiriting)</option>
          </select>
        </div>

        {field === 'Boshqa' && (
          <div>
            <label style={labelStyle}>{lang === 'UZ' ? "Soha nomini yozing *" : "Введите название сферы *"}</label>
            <input 
              type="text" 
              required 
              value={customField} 
              onChange={(e) => setCustomField(e.target.value)} 
              placeholder={lang === 'UZ' ? "Masalan: Kimyo" : "Например: Химия"} 
              style={inputStyle} 
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>{lang === 'UZ' ? "Jild uchun tahririyat sharhi / Annotatsiya" : "Комментарий редакции / Аннотация к тому"}</label>
          <textarea 
            rows={4} 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            placeholder={lang === 'UZ' ? "Ushbu jildda chop etilgan ilmiy maqolalar haqida umumiy tahririyat xulosasi..." : "Общий комментарий к опубликованным в этом томе статьям..."} 
            style={{ ...inputStyle, resize: 'vertical' }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ border: `2px dashed ${pdfFile ? '#4CAF50' : 'var(--border)'}`, padding: '2rem', textAlign: 'center', borderRadius: '6px', background: 'var(--cream)' }}>
            <i className="ti ti-file-type-pdf" style={{ fontSize: '2.5rem', color: pdfFile ? '#4CAF50' : '#e53935', marginBottom: '10px' }}></i>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '5px' }}>
              {lang === 'UZ' ? `PDF shaklidagi to'liq kitob ${pdfFile ? '✅' : '*'}` : `Полная книга в формате PDF ${pdfFile ? '✅' : '*'}`}
            </div>
            <input 
              type="file" 
              accept=".pdf" 
              required
              onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} 
              style={{ fontSize: '13px', width: '100%' }} 
            />
          </div>

          <div style={{ border: `2px dashed ${coverImage ? '#4CAF50' : 'var(--border)'}`, padding: '2rem', textAlign: 'center', borderRadius: '6px', background: 'var(--cream)' }}>
            <i className="ti ti-photo" style={{ fontSize: '2.5rem', color: coverImage ? '#4CAF50' : '#2196F3', marginBottom: '10px' }}></i>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '5px' }}>
              {lang === 'UZ' ? `Jild muqovasi (Rasm) ${coverImage ? '✅' : ''}` : `Обложка тома (Фото) ${coverImage ? '✅' : ''}`}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)} 
              style={{ fontSize: '13px', width: '100%' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary" 
            style={{ padding: '12px 32px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? (lang === 'UZ' ? "Yuklanmoqda..." : "Загрузка...") : (lang === 'UZ' ? "Yuklash" : "Загрузить")}
          </button>
        </div>
      </form>
    </div>
  );
}
