"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function ApcPage() {
  const { lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const handlePaySimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
    }, 2000);
  };

  const resetPayment = () => {
    setSelectedPlan(null);
    setPhone('');
    setPaySuccess(false);
  };

  const text = {
    UZ: {
      title: "APC Nashr To'lovlari (Article Processing Charges)",
      subtitle: "Tamaddun ochiq kirish jurnali bo'lgani sababli, maqolalarni taqriz qilish, tahrirlash va saqlash xarajatlarini qoplash maqsadida mualliflardan to'lov undiriladi.",
      intro: "Nashr to'lovi faqat maqola taqrizdan o'tib, chop etishga qabul qilingandan so'ng amalga oshiriladi. Maqolani yuborish va ko'rib chiqish bepul.",
      plansTitle: "To'lov Tariflari",
      standardName: "Standart nashr",
      standardPrice: "250,000 UZS",
      standardTime: "10-15 kun davomida taqriz va nashr",
      fastName: "Tezkor nashr (Express)",
      fastPrice: "450,000 UZS",
      fastTime: "3-5 kun davomida tezkor taqriz va nashr",
      foreignName: "Xorijiy mualliflar",
      foreignPrice: "$45 USD",
      foreignTime: "Xalqaro hamkorlik doirasida xizmat ko'rsatish",
      paymentMethods: "To'lov usullari",
      payNow: "To'lash",
      modalTitle: "Click / Payme to'lov simulyatsiyasi",
      phoneLabel: "Telefon raqamingiz (Click/Payme akkaunti)",
      simulateBtn: "Simulyatsiya qilish",
      simulating: "To'lov so'rovi yuborilmoqda...",
      successMsg: "To'lov muvaffaqiyatli amalga oshirildi! Elektron pochtangizga to'lov kvitansiyasi yuborildi.",
      closeBtn: "Yopish",
      detailsTitle: "To'lov nimalarni o'z ichiga oladi?",
      detailsList: [
        "Plagiat tekshiruvi (Turnitin / Antiplagiat)",
        "Tashqi va ichki ekspert taqrizi (Peer-review)",
        "DOI raqamini ro'yxatdan o'tkazish (CrossRef)",
        "Sertifikat va maqolaning PDF shaklini tayyorlash",
        "Jurnalning xalqaro bazalarda indeksatsiyalanishi"
      ]
    },
    RU: {
      title: "Плата за публикацию (APC)",
      subtitle: "Поскольку Tamaddun является журналом открытого доступа, плата взимается для покрытия расходов на рецензирование, редактирование и архивирование статей.",
      intro: "Плата за публикацию взимается только после того, как статья успешно пройдет рецензирование и будет принята к публикации. Отправка и рассмотрение статьи бесплатны.",
      plansTitle: "Тарифные планы",
      standardName: "Стандартная публикация",
      standardPrice: "250,000 UZS",
      standardTime: "Рецензирование и публикация в течение 10-15 дней",
      fastName: "Быстрая публикация (Express)",
      fastPrice: "450,000 UZS",
      fastTime: "Рецензирование и публикация в течение 3-5 дней",
      foreignName: "Иностранные авторы",
      foreignPrice: "$45 USD",
      foreignTime: "Обслуживание в рамках международного сотрудничества",
      paymentMethods: "Способы оплаты",
      payNow: "Оплатить",
      modalTitle: "Симуляция оплаты Click / Payme",
      phoneLabel: "Номер телефона (аккаунт Click/Payme)",
      simulateBtn: "Симулировать оплату",
      simulating: "Отправка запроса на оплату...",
      successMsg: "Оплата успешно произведена! Квитанция об оплате отправлена на вашу почту.",
      closeBtn: "Закрыть",
      detailsTitle: "Что входит в стоимость?",
      detailsList: [
        "Проверка на уникальность (Antiplagiat / Turnitin)",
        "Внешнее рецензирование (Peer-review)",
        "Регистрация DOI (CrossRef)",
        "Оформление сертификата и PDF-версии статьи",
        "Индексация журнала в международных базах данных"
      ]
    },
    ENG: {
      title: "Article Processing Charges (APC)",
      subtitle: "As Tamaddun is an open access journal, publishing costs are covered by charging authors an APC for peer-review, editing, and archiving.",
      intro: "The publication fee is only charged after the article has been peer-reviewed and accepted for publication. Article submission and consideration are free of charge.",
      plansTitle: "Pricing Plans",
      standardName: "Standard Publication",
      standardPrice: "250,000 UZS",
      standardTime: "Peer-review and publication within 10-15 days",
      fastName: "Express Publication",
      fastPrice: "450,000 UZS",
      fastTime: "Accelerated peer-review and publication within 3-5 days",
      foreignName: "Foreign Authors",
      foreignPrice: "$45 USD",
      foreignTime: "International authors priority review services",
      paymentMethods: "Payment Methods",
      payNow: "Pay Now",
      modalTitle: "Click / Payme Payment Simulation",
      phoneLabel: "Phone Number (Click/Payme Account)",
      simulateBtn: "Simulate Payment",
      simulating: "Sending payment request...",
      successMsg: "Payment successful! A digital receipt has been sent to your email.",
      closeBtn: "Close",
      detailsTitle: "What does the APC cover?",
      detailsList: [
        "Plagiarism check (Turnitin / Antiplagiat)",
        "Internal and external peer-review process",
        "DOI registration and metadata minting (CrossRef)",
        "Formatting of the PDF and publication certificate",
        "Indexing services in international databases"
      ]
    }
  };

  const t = text[lang as 'UZ' | 'RU' | 'ENG'] || text.UZ;

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>
          {t.title}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
        {/* Plans and billing */}
        <div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1.5rem' }}>
            {t.plansTitle}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Standard Plan */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '6px' }}>{t.standardName}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{t.standardTime}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--navy)', fontWeight: 800, marginBottom: '8px' }}>{t.standardPrice}</div>
                <button onClick={() => setSelectedPlan('Standard')} className="btn-primary" style={{ padding: '6px 20px', borderRadius: '30px', fontSize: '13px' }}>
                  {t.payNow}
                </button>
              </div>
            </div>

            {/* Express Plan */}
            <div style={{ background: '#fff', border: '2px solid var(--gold)', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '20px', background: 'var(--gold)', color: 'var(--navy)', fontSize: '10px', fontWeight: 800, padding: '2px 10px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Express
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '6px' }}>{t.fastName}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{t.fastTime}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 800, marginBottom: '8px' }}>{t.fastPrice}</div>
                <button onClick={() => setSelectedPlan('Express')} className="btn-primary" style={{ padding: '6px 20px', borderRadius: '30px', fontSize: '13px' }}>
                  {t.payNow}
                </button>
              </div>
            </div>

            {/* Foreign Plan */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '6px' }}>{t.foreignName}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>{t.foreignTime}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--navy)', fontWeight: 800, marginBottom: '8px' }}>{t.foreignPrice}</div>
                <button onClick={() => setSelectedPlan('International')} className="btn-primary" style={{ padding: '6px 20px', borderRadius: '30px', fontSize: '13px' }}>
                  {t.payNow}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What APC covers info */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.75rem', boxShadow: '0 4px 15px rgba(10,22,40,0.02)' }}>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            {t.detailsTitle}
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'var(--text)', lineHeight: '1.6' }}>
            {t.detailsList.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Simulation Modal */}
      {selectedPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,22,40,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '8px', width: '100%', maxWidth: '440px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', fontFamily: '"Playfair Display", serif', margin: 0 }}>
                {t.modalTitle}
              </h3>
              <button onClick={resetPayment} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}>&times;</button>
            </div>

            {!paySuccess ? (
              <form onSubmit={handlePaySimulate}>
                <div style={{ marginBottom: '1.5rem', background: 'var(--cream)', padding: '12px', borderRadius: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>TANLANGAN TARIF</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', marginTop: '4px' }}>
                    {selectedPlan === 'Standard' ? t.standardPrice : selectedPlan === 'Express' ? t.fastPrice : t.foreignPrice}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>
                    {t.phoneLabel}
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+998 (90) 123-45-67" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 14px', 
                      border: '1px solid var(--border)', 
                      borderRadius: '4px', 
                      fontSize: '14px', 
                      outline: 'none', 
                      background: 'var(--cream)',
                      color: 'var(--text)'
                    }} 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isPaying}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {isPaying ? (
                    <>
                      <i className="ti ti-reload" style={{ animation: 'spin 1.5s linear infinite' }}></i>
                      {t.simulating}
                    </>
                  ) : (
                    t.simulateBtn
                  )}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#e8f5e9', color: '#2e7d32', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '1rem' }}>
                  <i className="ti ti-circle-check"></i>
                </div>
                <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {t.successMsg}
                </p>
                <button onClick={resetPayment} className="btn-primary" style={{ padding: '8px 24px', borderRadius: '4px' }}>
                  {t.closeBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
