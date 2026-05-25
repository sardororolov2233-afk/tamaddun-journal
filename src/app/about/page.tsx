"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

export default function AboutPage() {
  const { lang } = useLanguage();

  const content = {
    UZ: {
      title: "Jurnal Haqida",
      subtitle: "Tamaddun",
      description: "Tamaddun — fanlararo tadqiqotlarni qo'llab-quvvatlovchi, xalqaro va ochiq kirishli (Open Access) ilmiy nashrdir. Biz ilm-fan va innovatsiyalarni keng jamoatchilikka yetkazishda ko'prik vazifasini bajaramiz.",
      
      missionTitle: "Bizning Missiyamiz",
      missionDesc: "Ilmiy tadqiqotlar natijalarini to'siqlarsiz, ochiq va sifatli taqrizdan o'tkazilgan holda dunyo miqyosida tarqatish. Biz turli ilmiy yo'nalishlar o'rtasida muloqot va hamkorlikni rivojlantirishga intilamiz.",
      
      scopeTitle: "Jurnal Qamrovi",
      scopeDesc: "Jurnal quyidagi asosiy va fanlararo sohalardagi ilmiy maqolalarni qabul qiladi:",
      scopes: [
        "Tabiiy va aniq fanlar (Fizika, Kimyo, Matematika, Biologiya)",
        "Tibbiyot, sog'liqni saqlash va farmatsevtika",
        "Axborot texnologiyalari va muhandislik",
        "Iqtisodiyot, moliya va biznes boshqaruvi",
        "Ijtimoiy-gumanitar fanlar, pedagogika va psixologiya"
      ],

      policyTitle: "Nashr Siyosati",
      policyDesc: "Tamaddun jurnali barcha maqolalarni Creative Commons Attribution (CC BY 4.0) litsenziyasi ostida chop etadi. Bu mualliflarga o'z ishlariga egalik huquqini saqlab qolish imkonini beradi va o'quvchilarga maqolalarni bepul o'qish, yuklab olish hamda iqtibos keltirish imkonini beradi.",
      
      detailsTitle: "Qo'shimcha Ma'lumotlar",
      frequency: "Davriylik",
      frequencyVal: "Har 2 oyda bir marta (Yiliga 6 ta son)",
      peerReview: "Taqriz Jarayoni",
      peerReviewVal: "Ikki tomonlama yashirin (Double-blind peer review), 2-4 hafta davomida",
      plagiarism: "Plagiat Siyosati",
      plagiarismVal: "Barcha maqolalar Plagiarism detector va Turnitin dasturlarida tekshiriladi (ruxsat etilgan max. ulush 15%)",
      
      ctaTitle: "O'z tadqiqotingizni nashr qiling",
      ctaDesc: "Biz yuqori sifatli va dolzarb mavzulardagi ilmiy ishlar qabulini davom ettirmoqdamiz.",
      ctaBtn: "Maqola Yuklash"
    },
    RU: {
      title: "О журнале",
      subtitle: "Tamaddun",
      description: "Tamaddun — это международный междисциплинарный научный журнал открытого доступа (Open Access). Мы служим платформой для продвижения передовых научных исследований и инноваций во всем мире.",
      
      missionTitle: "Наша Миссия",
      missionDesc: "Беспрепятственное и открытое распространение результатов качественных рецензируемых научных исследований. Мы стремимся развивать диалог и сотрудничество между различными научными дисциплинами.",
      
      scopeTitle: "Направления Журнала",
      scopeDesc: "Журнал принимает научные статьи по следующим основным и междисциплинарным областям:",
      scopes: [
        "Естественные и точные науки (Физика, Химия, Математика, Биология)",
        "Медицина, здравоохранение и фармация",
        "Информационные технологии и инженерия",
        "Экономика, финансы и бизнес-администрирование",
        "Социально-гуманитарные науки, педагогика и психология"
      ],

      policyTitle: "Публикационная Политика",
      policyDesc: "Журнал Tamaddun публикует все статьи под лицензией Creative Commons Attribution (CC BY 4.0). Это позволяет авторам сохранять авторские права, а читателям — свободно читать, скачивать и цитировать статьи без ограничений.",
      
      detailsTitle: "Дополнительная Информация",
      frequency: "Периодичность",
      frequencyVal: "Раз в 2 месяца (6 выпусков в год)",
      peerReview: "Рецензирование",
      peerReviewVal: "Двойное слепое рецензирование (Double-blind peer review), в течение 2-4 недель",
      plagiarism: "Плагиат",
      plagiarismVal: "Все статьи проходят проверку на антиплагиат через специализированные системы (допустимый лимит оригинальности от 85%)",
      
      ctaTitle: "Опубликуйте свое исследование",
      ctaDesc: "Мы продолжаем прием качественных и актуальных научных статей для будущих выпусков.",
      ctaBtn: "Отправить статью"
    },
    ENG: {
      title: "About the Journal",
      subtitle: "Tamaddun",
      description: "Tamaddun is an international, peer-reviewed, open-access scientific journal. We serve as a gateway to disseminate leading-edge scientific research and innovations to a global audience.",
      
      missionTitle: "Our Mission",
      missionDesc: "To facilitate barrier-free, open, and high-quality dissemination of peer-reviewed research findings. We aim to foster dialogue, synergy, and collaboration across diverse scientific fields.",
      
      scopeTitle: "Journal Scope",
      scopeDesc: "The journal welcomes original research papers in the following core and interdisciplinary branches:",
      scopes: [
        "Natural and Exact Sciences (Physics, Chemistry, Mathematics, Biology)",
        "Medicine, Health Sciences, and Pharmacy",
        "Information Technology and Engineering",
        "Economics, Finance, and Business Administration",
        "Social Sciences, Humanities, Pedagogy, and Psychology"
      ],

      policyTitle: "Publishing Policy",
      policyDesc: "All papers in Tamaddun are published under the Creative Commons Attribution (CC BY 4.0) License. Authors retain copyright of their works, while readers are free to read, download, distribute, and cite articles.",
      
      detailsTitle: "Key Details",
      frequency: "Frequency",
      frequencyVal: "Bimonthly (6 issues per year)",
      peerReview: "Peer Review",
      peerReviewVal: "Double-blind peer review within 2-4 weeks",
      plagiarism: "Plagiarism Policy",
      plagiarismVal: "All articles are checked with anti-plagiarism tools like Turnitin (minimum originality required: 85%)",
      
      ctaTitle: "Publish Your Research With Us",
      ctaDesc: "We welcome submissions of high-quality papers reporting original research in any discipline.",
      ctaBtn: "Submit Article"
    }
  };

  const t = content[lang as keyof typeof content] || content.UZ;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem', minHeight: 'calc(100vh - 200px)' }}>
      {/* Back to Home */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
          <i className="ti ti-arrow-left"></i> {lang === 'UZ' ? 'Bosh sahifa' : lang === 'RU' ? 'Главная' : 'Home'}
        </Link>
      </div>

      {/* Header section */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.75rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 600, fontFamily: '"Playfair Display", serif', marginBottom: '1rem' }}>
          {t.subtitle}
        </p>
        <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: '1.75', maxWidth: '800px' }}>
          {t.description}
        </p>
      </div>

      {/* Grid of info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="ti ti-target" style={{ color: 'var(--gold)' }}></i> {t.missionTitle}
            </h2>
            <p style={{ color: 'var(--text)', fontSize: '14.5px', lineHeight: '1.8' }}>
              {t.missionDesc}
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="ti ti-world" style={{ color: 'var(--gold)' }}></i> {t.policyTitle}
            </h2>
            <p style={{ color: 'var(--text)', fontSize: '14.5px', lineHeight: '1.8' }}>
              {t.policyDesc}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="ti ti-bookmarks" style={{ color: 'var(--gold)' }}></i> {t.scopeTitle}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '12px' }}>{t.scopeDesc}</p>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {t.scopes.map((scope, idx) => (
                <li key={idx} style={{ lineHeight: '1.5' }}>{scope}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Details Table Card */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', marginBottom: '4rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="ti ti-info-square-rounded" style={{ color: 'var(--gold)' }}></i> {t.detailsTitle}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div style={{ width: '200px', fontWeight: 600, color: 'var(--navy)', fontSize: '14.5px' }}>{t.frequency}</div>
            <div style={{ flex: 1, color: 'var(--text)', fontSize: '14.5px' }}>{t.frequencyVal}</div>
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div style={{ width: '200px', fontWeight: 600, color: 'var(--navy)', fontSize: '14.5px' }}>{t.peerReview}</div>
            <div style={{ flex: 1, color: 'var(--text)', fontSize: '14.5px' }}>{t.peerReviewVal}</div>
          </div>
          <div style={{ display: 'flex', paddingBottom: '0.5rem' }}>
            <div style={{ width: '200px', fontWeight: 600, color: 'var(--navy)', fontSize: '14.5px' }}>{t.plagiarism}</div>
            <div style={{ flex: 1, color: 'var(--text)', fontSize: '14.5px' }}>{t.plagiarismVal}</div>
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: '8px', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: 'var(--gold-light)', marginBottom: '0.75rem' }}>
            {t.ctaTitle}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            {t.ctaDesc}
          </p>
          <Link href="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            {t.ctaBtn} <i className="ti ti-upload"></i>
          </Link>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(184,144,42,0.03) 40px, rgba(184,144,42,0.03) 80px)', pointerEvents: 'none' }}></div>
      </div>
    </div>
  );
}
