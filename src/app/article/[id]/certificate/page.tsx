"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';

export default function CertificatePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [articleUrl, setArticleUrl] = useState('');
  const [hasCustomBg, setHasCustomBg] = useState(false);
  const [useCustomBg, setUseCustomBg] = useState(false);

  useEffect(() => {
    const checkBg = async () => {
      try {
        const res = await fetch('/sertifikat_bg.jpg', { method: 'HEAD' });
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('image')) {
          setHasCustomBg(true);
          setUseCustomBg(true);
        }
      } catch (e) {}
    };
    checkBg();
  }, []);

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

  useEffect(() => {
    if (article) {
      setArticleUrl(`https://jurnal-tamaddun.uz/article/${article.id}`);
    }
  }, [article]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1e293b', color: '#fff' }}>
        <div>Yuklanmoqda...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1e293b', color: '#fff', gap: '20px' }}>
        <h2>Sertifikat ma'lumotlari topilmadi</h2>
        <Link href="/" style={{ color: '#f0d88a', textDecoration: 'underline' }}>Bosh sahifaga qaytish</Link>
      </div>
    );
  }

  const dateObj = new Date(article.created_at || article.date || Date.now());
  const pubYear = dateObj.getFullYear();
  const pubDateFormatted = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${pubYear}`;

  const displayUrl = articleUrl ? articleUrl.replace(/^https?:\/\//, '') : `jurnal-tamaddun.uz/article/${article.id}`;
  const doiCode = `10.36001/tamaddun.${pubYear}.${article.volume}.${article.issue}.${article.id.slice(0, 8)}`;

  return (
    <div className="cert-page-bg">
      <style dangerouslySetInnerHTML={{__html: `
        .cert-page-bg {
          background: #1e293b;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Source Serif 4', Georgia, serif;
        }

        .cert-control-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1100px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          box-sizing: border-box;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.5rem 1.25rem;
          border-radius: 30px;
          background: transparent;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-weight: 600;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s;
        }
        .btn-back:hover {
          background: #f1f5f9;
        }

        .btn-print {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.6rem 1.5rem;
          border-radius: 30px;
          background: #b8902a;
          border: none;
          color: #0a1628;
          font-weight: 700;
          cursor: pointer;
          font-size: 13px;
          box-shadow: 0 4px 10px rgba(184, 144, 42, 0.3);
          transition: all 0.2s;
        }
        .btn-print:hover {
          background: #f0d88a;
          transform: translateY(-1px);
        }

        .cert-scale-container {
          width: 100%;
          max-width: 1100px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }

        /* Certificate outer design */
        .cert-card-outer {
          position: relative;
          width: 100%;
          aspect-ratio: 297 / 210;
          background: #fdfbf7;
          border: ${useCustomBg ? 'none' : '15px solid #0a1628'};
          padding: ${useCustomBg ? '0' : '10px'};
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
          box-sizing: border-box;
        }

        .cert-card-inner {
          position: relative;
          height: 100%;
          border: 3px solid #b8902a;
          padding: 2.25rem 3rem 1.75rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          background-image: 
            radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(253,251,247,0.2) 100%),
            repeating-linear-gradient(45deg, rgba(184,144,42,0.012) 0px, rgba(184,144,42,0.012) 2px, transparent 2px, transparent 10px);
        }

        /* Certificate Corners */
        .corner {
          position: absolute;
          width: 45px;
          height: 45px;
          border-color: #b8902a;
          border-style: solid;
          pointer-events: none;
        }
        .corner::after {
          content: '';
          position: absolute;
          width: 25px;
          height: 25px;
          border: 1.5px solid #0a1628;
        }
        .corner.top-left {
          top: 10px;
          left: 10px;
          border-width: 4px 0 0 4px;
        }
        .corner.top-left::after {
          top: 5px;
          left: 5px;
          border-width: 1.5px 0 0 1.5px;
        }
        .corner.top-right {
          top: 10px;
          right: 10px;
          border-width: 4px 4px 0 0;
        }
        .corner.top-right::after {
          top: 5px;
          right: 5px;
          border-width: 1.5px 1.5px 0 0;
        }
        .corner.bottom-left {
          bottom: 10px;
          left: 10px;
          border-width: 0 0 4px 4px;
        }
        .corner.bottom-left::after {
          bottom: 5px;
          left: 5px;
          border-width: 0 0 1.5px 1.5px;
        }
        .corner.bottom-right {
          bottom: 10px;
          right: 10px;
          border-width: 0 4px 4px 0;
        }
        .corner.bottom-right::after {
          bottom: 5px;
          right: 5px;
          border-width: 0 1.5px 1.5px 0;
        }

        .cert-bg-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 45%;
          height: 45%;
          opacity: 0.035;
          pointer-events: none;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,0 63,38 100,38 70,60 82,100 50,75 18,100 30,60 0,38 37,38" fill="%23b8902a"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .cert-header {
          text-align: center;
          z-index: 10;
        }
        
        .cert-logo {
          width: 45px;
          height: 45px;
          background: #b8902a;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          color: #0a1628;
          font-size: 20px;
          margin: 0 auto 8px auto;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .cert-journal-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #0a1628;
          letter-spacing: 2px;
          text-transform: uppercase;
          line-height: 1.2;
          margin-bottom: 2px;
        }
        .cert-journal-subtitle {
          font-size: 0.65rem;
          color: #b8902a;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 700;
        }
        .cert-issn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #5a5a72;
          margin-top: 2px;
        }

        .cert-title-section {
          text-align: center;
          margin: 0.75rem 0;
          z-index: 10;
        }
        .cert-title-uz {
          font-family: 'Playfair Display', serif;
          font-size: 2.1rem;
          font-weight: 700;
          font-style: italic;
          color: #b8902a;
          text-transform: uppercase;
          letter-spacing: 4px;
          line-height: 1.1;
        }
        .cert-title-en {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0a1628;
          letter-spacing: 6px;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .cert-body {
          text-align: center;
          max-width: 90%;
          z-index: 10;
        }
        .cert-award-text {
          font-size: 0.75rem;
          color: #5a5a72;
          font-style: italic;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .cert-recipient-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.65rem;
          font-weight: 700;
          color: #0a1628;
          border-bottom: 1.5px solid rgba(184, 144, 42, 0.4);
          padding-bottom: 4px;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
          display: inline-block;
          min-width: 50%;
        }
        .cert-article-intro {
          font-size: 0.72rem;
          color: #5a5a72;
          margin-bottom: 0.4rem;
          line-height: 1.4;
        }
        .cert-article-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          font-style: italic;
          color: #0a1628;
          line-height: 1.35;
          margin-bottom: 0.5rem;
          padding: 0 1rem;
          word-break: break-word;
        }
        .cert-pub-details {
          font-size: 0.75rem;
          color: #0a1628;
          font-weight: 600;
          line-height: 1.4;
        }

        .cert-footer {
          display: grid;
          grid-template-columns: 1fr 100px 1fr;
          width: 100%;
          align-items: flex-end;
          z-index: 10;
          margin-top: 0.5rem;
        }
        .cert-footer-left {
          text-align: left;
          font-size: 0.7rem;
          color: #5a5a72;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cert-footer-right {
          text-align: right;
          font-size: 0.75rem;
          color: #0a1628;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .cert-signature-line {
          width: 160px;
          border-bottom: 1.5px solid #b8902a;
          margin-bottom: 4px;
          position: relative;
          height: 35px;
        }
        .cert-signature-img {
          position: absolute;
          bottom: -4px;
          right: 20px;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1.2rem;
          color: #1a2e5c;
          opacity: 0.85;
          letter-spacing: 1px;
        }

        .cert-footer-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cert-seal {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Print Overrides */
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .cert-page-bg {
            background: #fff !important;
            padding: 0 !important;
            min-height: 0 !important;
            display: block !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
          }
          .cert-scale-container {
            width: 297mm !important;
            height: 210mm !important;
            display: block !important;
            max-width: none !important;
          }
          .cert-card-outer {
            width: 297mm !important;
            height: 210mm !important;
            border: ${useCustomBg ? 'none' : '15px solid #0a1628'} !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: ${useCustomBg ? '0' : '10px'} !important;
            border-radius: 0 !important;
            page-break-inside: avoid;
            box-sizing: border-box;
          }
        }
      `}} />

      {/* Control Bar (Hidden on Print) */}
      <div className="cert-control-bar no-print">
        <Link href={`/article/${article.id}`} className="btn-back">
          <i className="ti ti-arrow-left"></i> Maqolaga qaytish
        </Link>
        <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '15px' }}>
          Sertifikatni chop etish yoki PDF sifatida saqlash
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {hasCustomBg && (
            <button 
              onClick={() => setUseCustomBg(!useCustomBg)} 
              style={{ 
                background: useCustomBg ? '#0a1628' : '#e2e8f0', 
                color: useCustomBg ? '#fdfbf7' : '#0a1628', 
                border: '1px solid #cbd5e1', 
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontWeight: 600, 
                fontSize: '12px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <i className={useCustomBg ? "ti ti-layout-grid" : "ti ti-photo"}></i>
              {useCustomBg ? "Klassik shablon" : "PPTX shablon"}
            </button>
          )}
          <button onClick={handlePrint} className="btn-print">
            <i className="ti ti-printer"></i> Chop etish / PDF yuklash
          </button>
        </div>
      </div>

      {/* Certificate Scale Container */}
      <div className="cert-scale-container">
        <div className="cert-card-outer">
          <div className="cert-card-inner" style={useCustomBg ? { 
            backgroundImage: "url('/sertifikat_bg.jpg')", 
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            border: 'none',
            padding: 0
          } : {}}>
            {useCustomBg ? (
              /* Custom PPTX Background Mode */
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* {{ism_familya}} */}
                <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', textAlign: 'center', fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', fontWeight: 700, color: '#0a1628' }}>
                  {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}
                </div>

                {/* {{mavzu}} */}
                <div style={{ position: 'absolute', top: '56%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', textAlign: 'center', fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', fontWeight: 700, fontStyle: 'italic', color: '#0a1628', lineHeight: '1.35', wordBreak: 'break-word' }}>
                  "{article.title}"
                </div>

                {/* {{jild}}, {{nashr}}, {{yil}} */}
                <div style={{ position: 'absolute', top: '67%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#0d1d33', fontFamily: 'sans-serif' }}>
                  «Tamaddun» jurnali · Jild {article.volume}, Nashr {article.issue} ({pubYear})
                </div>

                {/* {{sana}} */}
                <div style={{ position: 'absolute', bottom: '15%', left: '8%', fontSize: '0.75rem', fontWeight: 600, color: '#0a1628' }}>
                  Sana / Date: {pubDateFormatted}
                </div>

                {/* {{qr}} */}
                <div style={{ position: 'absolute', bottom: '10%', left: '26%', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {articleUrl && (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(articleUrl)}`} 
                      alt="Verification QR" 
                      style={{ width: '48px', height: '48px', border: '1px solid #cbd5e1', padding: '2px', background: '#fff', borderRadius: '2px' }}
                    />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#0a1628' }}>VERIFICATION:</span>
                    <a href={articleUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none', fontFamily: 'monospace' }}>
                      {displayUrl}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Classic HTML/CSS Mode */
              <>
                {/* Corners */}
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>

                {/* Background Watermark */}
                <div className="cert-bg-watermark"></div>

                {/* Header */}
                <div className="cert-header">
                  <div className="cert-logo">T</div>
                  <div className="cert-journal-name">Tamaddun</div>
                  <div className="cert-journal-subtitle">Ilmiy tadbirkorlik va innovatsiyalar jurnali</div>
                  <div className="cert-issn">ISSN (online): 2949-XXXX · jurnal-tamaddun.uz</div>
                </div>

                {/* Certificate Title */}
                <div className="cert-title-section">
                  <div className="cert-title-uz">Sertifikat</div>
                  <div className="cert-title-en">Certificate of Publication</div>
                </div>

                {/* Certificate Body */}
                <div className="cert-body">
                  <div className="cert-award-text">
                    <div>Ushbu sertifikat ilmiy maqolasi muvaffaqiyatli chop etilganligi munosabati bilan taqdim etiladi:</div>
                    <div style={{ color: '#b8902a', margin: '2px 0' }}>This is to certify that the scientific article authored by:</div>
                  </div>

                  <div className="cert-recipient-name">
                    {Array.isArray(article.authors) ? article.authors.join(', ') : article.authors}
                  </div>

                  <div className="cert-article-intro">
                    <div>quyidagi nomli ilmiy maqolani taqdim etgani va nashr etilgani uchun:</div>
                    <div style={{ color: '#b8902a' }}>has been successfully peer-reviewed and published under the title:</div>
                  </div>

                  <div className="cert-article-title">
                    "{article.title}"
                  </div>

                  <div className="cert-pub-details">
                    <div>«Tamaddun» ilmiy jurnalining Jild {article.volume}, Nashr {article.issue} ({pubYear}) sonida chop etildi.</div>
                    <div style={{ color: '#b8902a', fontWeight: 500, fontSize: '0.72rem' }}>
                      Published in the Tamaddun Scientific Journal, Volume {article.volume}, Issue {article.issue} ({pubYear}).
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="cert-footer">
                  {/* Left Column - Verification & DOI */}
                  <div className="cert-footer-left">
                    <div><strong>DOI:</strong> {doiCode}</div>
                    <div><strong>Sana / Date:</strong> {pubDateFormatted}</div>
                    
                    {/* QR Code and verification link */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      {articleUrl && (
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(articleUrl)}`} 
                          alt="Verification QR" 
                          style={{ width: '45px', height: '45px', border: '1px solid #cbd5e1', padding: '2px', background: '#fff', borderRadius: '2px' }}
                        />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '9px' }}>
                        <span style={{ fontWeight: 700, color: '#0a1628' }}>VERIFIKATSIYA / VERIFICATION:</span>
                        <a href={articleUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none', fontFamily: 'monospace' }}>
                          {displayUrl}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Center Column - Empty to preserve grid layout spacing */}
                  <div className="cert-footer-center">
                  </div>
      
                  {/* Right Column - Editor Signature with Stamped Seal Overlay */}
                  <div className="cert-footer-right">
                    <div className="cert-signature-line" style={{ position: 'relative' }}>
                      {/* Highly Realistic, Artistic SVG Signature starting with 'A' */}
                      <svg viewBox="0 0 120 40" width="120" height="40" style={{ 
                        position: 'absolute', 
                        bottom: '-4px', 
                        right: '18px', 
                        zIndex: 3 
                      }}>
                        <path 
                          d="M 14,28 Q 18,7 22,7 C 26,7 28,18 29,29 C 26,22 20,20 18,22 C 16,24 18,26 24,25 C 28,17 31,13 33,13 L 37,27 C 40,19 42,16 45,16 L 49,27 C 52,21 54,18 57,18 L 61,27 C 64,23 66,20 69,20 L 73,27 C 76,24 78,22 81,22 L 85,27 Q 90,26 95,20 T 105,18" 
                          fill="none" 
                          stroke="#102574" 
                          strokeWidth="1.6" 
                          strokeLinecap="round" 
                          strokeLinejoin="miter" 
                          strokeOpacity="0.95"
                        />
                        {/* Bottom sweep loop flourish */}
                        <path 
                          d="M 88,23 C 70,33 42,36 21,34 C 15,34 12,29 18,25 C 24,21 34,23 48,23 C 68,23 93,19 112,14" 
                          fill="none" 
                          stroke="#102574" 
                          strokeWidth="1.3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeOpacity="0.9"
                        />
                      </svg>
                      
                      {/* Blue Official Seal Overlapping the Signature */}
                      <div className="cert-seal" style={{ 
                        position: 'absolute',
                        top: '-32px', 
                        right: '15px',
                        transform: 'rotate(-5deg)', 
                        filter: 'drop-shadow(0.5px 1.5px 2px rgba(29, 48, 143, 0.12))',
                        opacity: 0.92,
                        mixBlendMode: 'multiply',
                        pointerEvents: 'none',
                        zIndex: 5
                      }}>
                        <svg viewBox="0 0 100 100" width="85" height="85">
                          <defs>
                            {/* Define text paths */}
                            <path id="seal-text-top" d="M 12 50 A 38 38 0 1 1 88 50" fill="none" />
                            <path id="seal-text-bottom" d="M 12 50 A 38 38 0 0 0 88 50" fill="none" />
                          </defs>
                          
                          {/* Outer rings */}
                          <circle cx="50" cy="50" r="48" fill="none" stroke="#1d308f" strokeWidth="0.8" />
                          <circle cx="50" cy="50" r="46.2" fill="none" stroke="#1d308f" strokeWidth="1.8" />
                          <circle cx="50" cy="50" r="44.8" fill="none" stroke="#1d308f" strokeWidth="0.6" />
                          
                          {/* Inner dash and solid circle */}
                          <circle cx="50" cy="50" r="33.5" fill="none" stroke="#1d308f" strokeWidth="0.8" strokeDasharray="2 1.5" />
                          <circle cx="50" cy="50" r="31.8" fill="none" stroke="#1d308f" strokeWidth="0.6" />

                          {/* Top Text: TAMADDUN JURNALI */}
                          <text fontSize="4.5" fontWeight="800" fill="#1d308f" letterSpacing="0.8" fontFamily="system-ui, -apple-system, sans-serif">
                            <textPath href="#seal-text-top" startOffset="50%" textAnchor="middle">
                              TAMADDUN JURNALI
                            </textPath>
                          </text>

                          {/* Star Separators */}
                          <text x="14.5" y="51.5" fontSize="5.5" fontWeight="bold" fill="#1d308f" textAnchor="middle">✵</text>
                          <text x="85.5" y="51.5" fontSize="5.5" fontWeight="bold" fill="#1d308f" textAnchor="middle">✵</text>

                          {/* Bottom Text: O'ZBEKISTON RESPUBLIKASI • ILMIY-ADABIY NASHR */}
                          <text fontSize="3.1" fontWeight="800" fill="#1d308f" letterSpacing="0.4" fontFamily="system-ui, -apple-system, sans-serif">
                            <textPath href="#seal-text-bottom" startOffset="50%" textAnchor="middle">
                              O'ZBEKISTON RESPUBLIKASI • ILMIY-ADABIY NASHR
                            </textPath>
                          </text>

                          {/* Central Emblem - Uzbekistan Coat of Arms */}
                          <g>
                            {/* Sunrays */}
                            <path d="M50,48 L36,34 M50,48 L39,31 M50,48 L44,28 M50,48 L50,27 M50,48 L56,28 M50,48 L61,31 M50,48 L64,34 M50,48 L33,39 M50,48 L67,39 M50,48 L31,45 M50,48 L69,45" stroke="#1d308f" strokeWidth="0.4" strokeOpacity="0.6" />
                            
                            {/* Mountains */}
                            <path d="M 37,55 Q 43,50 50,54 Q 57,50 63,55" fill="none" stroke="#1d308f" strokeWidth="0.8" />
                            
                            {/* Octagram Star at top center */}
                            <g>
                              <rect x="47.5" y="21" width="5" height="5" fill="none" stroke="#1d308f" strokeWidth="0.8" />
                              <rect x="47.5" y="21" width="5" height="5" fill="none" stroke="#1d308f" strokeWidth="0.8" transform="rotate(45 50 23.5)" />
                              {/* Crescent inside */}
                              <path d="M 49.3,22.8 A 1.0,1.0 0 1,0 50.8,24.3 A 0.8,0.8 0 1,1 49.3,22.8" fill="#1d308f" stroke="none" />
                              {/* Star inside */}
                              <polygon points="50.6,22.5 50.8,22.9 51.2,22.9 50.9,23.1 51.0,23.5 50.6,23.2 50.2,23.5 50.3,23.1 50.0,22.9 50.4,22.9" fill="#1d308f" stroke="none" />
                            </g>

                            {/* Humo Bird Wings */}
                            <path d="M 49,54 C 46,51 37,42 34,34 C 32,29 33,27 35,29 C 37,31 41,38 46,45 C 43,39 38,31 37,26 C 37,24 39,24 40,26 C 43,30 46,38 49,47 C 47,37 45,27 45,23 C 45,21 47,21 48,23 C 49.5,27 50,35 50.5,48" fill="none" stroke="#1d308f" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M 51,54 C 54,51 63,42 66,34 C 68,29 67,27 65,29 C 63,31 59,38 54,45 C 57,39 62,31 63,26 C 63,24 61,24 60,26 C 57,30 54,38 51,47 C 53,37 55,27 55,23 C 55,21 53,21 52,23 C 50.5,27 50,35 49.5,48" fill="none" stroke="#1d308f" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                            
                            {/* Bird Body and Tail */}
                            <path d="M 48.5,50 Q 50,53 51.5,50 L 50,59 Z" fill="#1d308f" />
                            <path d="M 50,49 Q 50,44 48.8,42 Q 50,40 51.2,42 Q 50,44 50,49" fill="#1d308f" />
                            <path d="M 46.5,54 Q 50,60 53.5,54 Q 51.8,60 50,63 Q 48.2,60 46.5,54 Z" fill="none" stroke="#1d308f" strokeWidth="0.8" />

                            {/* Cotton (Left side branch) */}
                            <path d="M 33,54 Q 30,42 35.5,29" fill="none" stroke="#1d308f" strokeWidth="0.7" />
                            <g fill="none" stroke="#1d308f" strokeWidth="0.6">
                              <circle cx="31.5" cy="49" r="1.1" /><circle cx="30.2" cy="50.2" r="1.1" /><circle cx="32.8" cy="50.2" r="1.1" />
                              <circle cx="30.5" cy="41" r="1.1" /><circle cx="29.2" cy="42.2" r="1.1" /><circle cx="31.8" cy="42.2" r="1.1" />
                              <circle cx="32.5" cy="33" r="1.1" /><circle cx="31.2" cy="34.2" r="1.1" /><circle cx="33.8" cy="34.2" r="1.1" />
                            </g>

                            {/* Wheat (Right side branch) */}
                            <path d="M 67,54 Q 70,42 64.5,29" fill="none" stroke="#1d308f" strokeWidth="0.7" />
                            <g fill="none" stroke="#1d308f" strokeWidth="0.7" strokeLinecap="round">
                              <path d="M 66.5,47.5 L 68.5,45.5 M 67.5,49.5 L 69.5,47.5" />
                              <path d="M 67.5,40.5 L 69.5,38.5 M 68.5,42.5 L 70.5,40.5" />
                              <path d="M 65.5,33.5 L 67.5,31.5 M 66.5,35.5 L 68.5,33.5" />
                            </g>

                            {/* Uzbekistan Ribbon */}
                            <path d="M 35,56 Q 50,61 65,56 L 64,60 Q 50,65 36,60 Z" fill="#ffffff" stroke="#1d308f" strokeWidth="0.9" strokeLinejoin="round" />
                            <text x="50" y="59.5" fontSize="3" fontWeight="900" textAnchor="middle" fill="#1d308f" letterSpacing="0.2" fontFamily="system-ui, -apple-system, sans-serif">UZBEKISTAN</text>

                            {/* Year 2026 overlay */}
                            <text x="50.5" y="69" fontSize="9.5" fontWeight="900" textAnchor="middle" fill="#1d308f" letterSpacing="0.3" fontFamily="'Courier New', Courier, monospace" opacity="0.9">2026</text>
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>Prof. Dr. A. S. Karimov</div>
                    <div style={{ fontSize: '10px', color: '#5a5a72' }}>Bosh muharrir / Editor-in-Chief</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
