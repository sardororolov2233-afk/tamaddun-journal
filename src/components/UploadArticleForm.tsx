"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { JOURNAL } from '../lib/journal';

export default function UploadArticleForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user, isSupabaseConfigured } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [field,setField] = useState('Pedagogika');
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState(['']);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddAuthor = () => setAuthors([...authors, '']);
  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };
  const handleRemoveAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isSupabaseConfigured) { setErrorMsg('Material topshirish uchun ro‘yxatdan o‘ting va akkauntingizga kiring.'); return; }
    if (!consent) { setErrorMsg('Topshirish shartlariga rozilik bildiring.'); return; }
    if (!docxFile || !pdfFile) {
      setErrorMsg("Ikkala faylni ham (DOCX va PDF) yuklashingiz shart!");
      return;
    }
    // Check if at least one author is provided
    if (authors.every(a => a.trim() === '')) {
      setErrorMsg("Kamida bitta muallif kiritilishi shart!");
      return;
    }
    setErrorMsg('');
    setIsPreviewOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    if (!user || !isSupabaseConfigured) { setErrorMsg('Avval hisobingizga kiring.'); setIsPreviewOpen(false); return; }
    setSubmitting(true);
    try {
    const {supabase:authenticatedClient} = await import('../lib/supabaseClient');
    const {data:{user:authenticatedUser},error:sessionError} = await authenticatedClient.auth.getUser();
    if(sessionError || authenticatedUser?.id !== user.id)throw new Error('Akkauntingizga qayta kiring.');
    const articleId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const newArticle = {
      id: articleId,
      title,
      field,
      keywords,
      abstract,
      authors: authors.filter(a => a.trim() !== ''),
      reviewer_notes: reviewerNotes,
      has_docx: !!docxFile,
      has_pdf: !!pdfFile,
      author_id: user?.id,
      status: 'pending',
      volume: JOURNAL.volume,
      issue: JOURNAL.issue,
      publication_year: JOURNAL.year,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      const { supabase } = await import('../lib/supabaseClient');

      // 1. Fayllarni yuklash (Storage)
      let pdfError = null;
      if (pdfFile) {
        const { error } = await supabase.storage.from('articles_files').upload(`${newArticle.id}.pdf`, pdfFile, { upsert: true });
        pdfError = error;
      }

      let docxError = null;
      if (docxFile) {
        const { error } = await supabase.storage.from('articles_files').upload(`${newArticle.id}.docx`, docxFile, { upsert: true });
        docxError = error;
      }

      if (pdfError || docxError) {
        alert("Fayllarni yuklashda xatolik yuz berdi! Iltimos, Storage bo'limini tekshiring (articles_files deb nomlangan Public bucket bo'lishi shart).");
        return;
      }

      // 2. Maqolani bazaga saqlash
      const { error } = await supabase.from('articles').insert([{ ...newArticle, id: newArticle.id }]);
      if (error) {
        alert("Xatolik yuz berdi: " + error.message);
        return;
      }
    }

    setIsPreviewOpen(false);
    alert("Materialingiz yuborildi. Admin ma’qullagach akkauntingizda to‘lov eslatmasi chiqadi.");

    // Reset form
    setTitle('');
    setKeywords('');
    setAbstract('');
    setAuthors(['']);
    setReviewerNotes('');
    setDocxFile(null);
    setPdfFile(null);

    if (onSuccess) onSuccess();
    } catch {
      setIsPreviewOpen(false);
      setErrorMsg('Yuborishda xatolik yuz berdi. Qayta urinib ko‘ring yoki email / Telegram orqali yuboring.');
    } finally { setSubmitting(false); }
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
    color: 'var(--text)'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--navy)',
    marginBottom: '8px'
  };

  return (
    <>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif' }}>
          Yangi maqola yuklash
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '2rem', lineHeight: '1.6' }}>
          Iltimos, maqola ma&apos;lumotlarini to&apos;liq kiriting. <strong>DOCX va PDF</strong> variantlarining ikkalasini ham yuklash majburiydir.
          PDF variantning yuqori (header) va pastki (footer) qismida jurnal nomi hamda hoshiyasi bo&apos;lishi shart.
        </p>

        {errorMsg && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '14px', fontWeight: 500 }}>
            <i className="ti ti-alert-circle" style={{ marginRight: '8px' }}></i>
            {errorMsg}
          </div>
        )}

        <p className="submission-info">2026 · 1-jild, 3-son · 24–48 soat ichida ko‘rib chiqish. Maqola: 120 000 so‘m; tezis: 80 000 so‘m.</p>
        <form onSubmit={handleInitialSubmit}>
          <label htmlFor="submission-field" style={labelStyle}>Ilmiy yo‘nalish</label>
          <select id="submission-field" value={field} onChange={e=>setField(e.target.value)} style={inputStyle}>{['Pedagogika','Filologiya','Tarix','Biotibbiyot','Informatika','Iqtisodiyot','Kimyo','Matematika','Boshqa'].map(name=><option key={name}>{name}</option>)}</select>
          <p className="receipt-help">Admin ma’qullagach akkauntingizda to‘lov eslatmasi chiqadi. Chek tasdiqlanmaguncha material nashr qilinmaydi.</p>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Maqola mavzusi nomi *</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: Sun'iy intellektning ta'limdagi o'rni..." style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Kalit so&apos;zlar *</label>
            <input type="text" required value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Sun'iy intellekt, ta'lim, innovatsiya..." style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Abstract (Annotatsiya) *</label>
            <textarea required rows={5} value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Maqolaning qisqacha mazmunini kiriting..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '1.5rem', background: 'var(--cream2)', padding: '1.5rem', borderRadius: '6px' }}>
            <label style={labelStyle}>Maqola mualliflari *</label>
            {authors.map((author, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input type="text" required value={author} onChange={(e) => handleAuthorChange(index, e.target.value)} placeholder={`${index + 1}-muallifning F.I.SH`} style={{ ...inputStyle, background: '#fff' }} />
                {authors.length > 1 && (
                  <button type="button" onClick={() => handleRemoveAuthor(index)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 15px', cursor: 'pointer' }}>
                    <i className="ti ti-trash"></i>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddAuthor} style={{ background: 'transparent', color: 'var(--navy)', border: '1px dashed var(--navy)', padding: '8px 15px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="ti ti-plus"></i> Muallif qo&apos;shish
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, border: `2px dashed ${docxFile ? '#4CAF50' : 'var(--border)'}`, padding: '2rem', textAlign: 'center', borderRadius: '6px', background: 'var(--cream)' }}>
              <i className="ti ti-file-word" style={{ fontSize: '2rem', color: docxFile ? '#4CAF50' : '#2b579a', marginBottom: '10px' }}></i>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '5px' }}>DOCX fayl {docxFile && '✅'}</div>
              <input type="file" accept=".doc,.docx" onChange={(e) => setDocxFile(e.target.files ? e.target.files[0] : null)} style={{ fontSize: '13px' }} />
            </div>

            <div style={{ flex: 1, border: `2px dashed ${pdfFile ? '#4CAF50' : 'var(--border)'}`, padding: '2rem', textAlign: 'center', borderRadius: '6px', background: 'var(--cream)' }}>
              <i className="ti ti-file-type-pdf" style={{ fontSize: '2rem', color: pdfFile ? '#4CAF50' : '#e53935', marginBottom: '10px' }}></i>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', marginBottom: '5px' }}>PDF fayl {pdfFile && '✅'}</div>
              <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} style={{ fontSize: '13px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Taqrizchi uchun maxsus eslatmalar (Majburiy emas)</label>
            <textarea rows={3} value={reviewerNotes} onChange={(e) => setReviewerNotes(e.target.value)} placeholder="Qo'shimcha ma'lumotlar..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <label className="consent-label"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span><Link href="/offer" target="_blank">Ommaviy oferta</Link>, <Link href="/privacy" target="_blank">maxfiylik siyosati</Link> va <Link href="/security" target="_blank">xavfsizlik qoidalari</Link> bilan tanishdim. Material va fayllarni ko‘rib chiqish uchun yuborishga roziman.</span></label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="submit" style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '12px 32px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ti ti-eye"></i> Ko&apos;zdan kechirish
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,22,40,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--navy)', fontFamily: '"Playfair Display", serif', margin: 0 }}>Ma&apos;lumotlarni tasdiqlash</h3>
              <button onClick={() => setIsPreviewOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}>&times;</button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Mavzu</div>
              <div style={{ fontSize: '15px', color: 'var(--navy)', fontWeight: 600 }}>{title}</div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Kalit so&apos;zlar</div>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>{keywords}</div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Abstract</div>
              <div style={{ fontSize: '14px', color: 'var(--text)', whiteSpace: 'pre-wrap', background: 'var(--cream)', padding: '10px', borderRadius: '4px' }}>{abstract}</div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Mualliflar</div>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', color: 'var(--text)' }}>
                {authors.filter(a => a.trim() !== '').map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Biriktirilgan fayllar</div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                {docxFile && <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>DOCX fayl mavjud</span>}
                {pdfFile && <span style={{ background: '#ffebee', color: '#c62828', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600 }}>PDF fayl mavjud</span>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setIsPreviewOpen(false)} style={{ background: 'var(--cream)', color: 'var(--navy)', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                Tahrirlashga qaytish
              </button>
              <button disabled={submitting} onClick={handleFinalSubmit} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-check"></i> {submitting ? 'Yuborilmoqda…' : 'Tasdiqlash va yuborish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
