"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function JoinEditorsPage() {
  const { lang } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orcid, setOrcid] = useState('');
  const [field, setField] = useState('Biotibbiyot');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  const text = {
    UZ: {
      title: "Tahririyatga a'zo bo'lish",
      subtitle: "«Tamaddun» ilmiy jurnali o'z sohasida yetuk mutaxassis bo'lgan olimlar va tadqiqotchilarni tahririyat kengashi a'zoligiga hamda taqrizchilikka taklif qiladi.",
      requirementsTitle: "Nomzodlarga talablar",
      req1: "Ilmiy daraja (PhD, DSc yoki xorijiy PhD) mavjudligi",
      req2: "So'nggi 3 yilda kamida 5 ta nufuzli ilmiy maqola nashr etganlik",
      req3: "Xalqaro ORCID profiliga ega bo'lish",
      req4: "Ingliz tili (kamida B2) va o'zbek/rus tillarini mukammal bilish",
      formTitle: "A'zolik uchun ariza topshirish",
      nameLabel: "F.I.SH. (To'liq)",
      emailLabel: "Elektron pochta",
      orcidLabel: "ORCID iD raqamingiz",
      fieldLabel: "Sohangiz",
      bioLabel: "O'zingiz haqingizda qisqacha (ilmiy qiziqishlar, nashrlar)",
      submitBtn: "Ariza yuborish",
      submitting: "Yuborilmoqda...",
      successTitle: "Arizangiz qabul qilindi!",
      successDesc: "Tahririyat kengashi arizangiz va ilmiy ishlaringizni ko'rib chiqib, 7 ish kuni ichida siz bilan bog'lanadi. Hamkorlik uchun tashakkur!",
      fields: {
        bio: "Biotibbiyot",
        econ: "Iqtisodiyot",
        cs: "Informatika",
        chem: "Kimyo",
        math: "Matematika",
        other: "Boshqa sohalar"
      }
    },
    RU: {
      title: "Стать редактором / рецензентом",
      subtitle: "Научный журнал «Tamaddun» приглашает ученых и исследователей, являющихся экспертами в своей области, стать членами редакционной коллегии и рецензентами.",
      requirementsTitle: "Требования к кандидатам",
      req1: "Наличие ученой степени (PhD, доктор наук или эквивалент)",
      req2: "Наличие не менее 5 научных публикаций за последние 3 года",
      req3: "Наличие активного профиля ORCID",
      req4: "Владение английским (не ниже B2) и узбекским/русским языками",
      formTitle: "Подать заявку на членство",
      nameLabel: "Ф.И.О. (Полностью)",
      emailLabel: "Электронная почта",
      orcidLabel: "Номер ORCID iD",
      fieldLabel: "Ваша область науки",
      bioLabel: "Кратко о себе (научные интересы, ключевые публикации)",
      submitBtn: "Отправить заявку",
      submitting: "Отправка...",
      successTitle: "Заявка принята!",
      successDesc: "Редакционная коллегия рассмотрит вашу заявку и свяжется с вами в течение 7 рабочих дней. Спасибо за сотрудничество!",
      fields: {
        bio: "Биомедицина",
        econ: "Экономика",
        cs: "Информатика",
        chem: "Химия",
        math: "Математика",
        other: "Другие сферы"
      }
    },
    ENG: {
      title: "Join the Editorial Board / Become a Reviewer",
      subtitle: "The Tamaddun Scientific Journal welcomes researchers and scientists with strong expertise to join our team as editors or peer reviewers.",
      requirementsTitle: "Requirements for Candidates",
      req1: "Ph.D. or doctoral degree in relevant scientific discipline",
      req2: "At least 5 peer-reviewed publications in international journals in the last 3 years",
      req3: "Active ORCID registration iD",
      req4: "High proficiency in English (B2 level or higher) and regional languages",
      formTitle: "Submit Editorial Application",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      orcidLabel: "ORCID iD Number",
      fieldLabel: "Academic Field",
      bioLabel: "Short Bio (Research interests, top publications)",
      submitBtn: "Submit Application",
      submitting: "Submitting...",
      successTitle: "Application Received!",
      successDesc: "The Editorial Board will evaluate your research profile and contact you within 7 working days. Thank you for your interest!",
      fields: {
        bio: "Biomedicine",
        econ: "Economics",
        cs: "Computer Science",
        chem: "Chemistry",
        math: "Mathematics",
        other: "Other Disciplines"
      }
    }
  };

  const t = text[lang as 'UZ' | 'RU' | 'ENG'] || text.UZ;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '1rem' }}>
          {t.title}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Left Column: Requirements */}
        <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(10,22,40,0.1)' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--gold-light)', marginBottom: '1.5rem' }}>
            {t.requirementsTitle}
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '20px', margin: 0, fontSize: '14px', lineHeight: '1.7', color: 'rgba(255,255,255,0.85)' }}>
            <li>{t.req1}</li>
            <li>{t.req2}</li>
            <li>{t.req3}</li>
            <li>{t.req4}</li>
          </ul>
        </div>

        {/* Right Column: Submission Form */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(10,22,40,0.03)' }}>
          {!success ? (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
                {t.formTitle}
              </h2>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                  {t.nameLabel} *
                </label>
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="E.g. John Doe"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', background: 'var(--cream)', color: 'var(--text)' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                  {t.emailLabel} *
                </label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', background: 'var(--cream)', color: 'var(--text)' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                  {t.orcidLabel} *
                </label>
                <input 
                  type="text" 
                  required 
                  value={orcid}
                  onChange={e => setOrcid(e.target.value)}
                  placeholder="0000-0002-1825-0097"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', background: 'var(--cream)', color: 'var(--text)' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                  {t.fieldLabel}
                </label>
                <select 
                  value={field}
                  onChange={e => setField(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', background: 'var(--cream)', color: 'var(--text)', fontFamily: 'inherit', cursor: 'pointer' }}
                >
                  <option value="Biotibbiyot">{t.fields.bio}</option>
                  <option value="Iqtisodiyot">{t.fields.econ}</option>
                  <option value="Informatika">{t.fields.cs}</option>
                  <option value="Kimyo">{t.fields.chem}</option>
                  <option value="Matematika">{t.fields.math}</option>
                  <option value="Boshqa">{t.fields.other}</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
                  {t.bioLabel} *
                </label>
                <textarea 
                  required 
                  rows={4} 
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '14px', outline: 'none', background: 'var(--cream)', color: 'var(--text)', resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                style={{ 
                  width: '100%', 
                  background: 'var(--navy)', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {submitting ? (
                  <>
                    <i className="ti ti-reload" style={{ animation: 'spin 1.5s linear infinite' }}></i>
                    {t.submitting}
                  </>
                ) : (
                  t.submitBtn
                )}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e8f5e9', color: '#2e7d32', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '1.5rem' }}>
                <i className="ti ti-check"></i>
              </div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1rem' }}>
                {t.successTitle}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '2rem' }}>
                {t.successDesc}
              </p>
              <button onClick={() => setSuccess(false)} className="btn-primary" style={{ padding: '8px 24px', borderRadius: '4px' }}>
                {lang === 'UZ' ? "Yangi ariza" : "Новая заявка"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
