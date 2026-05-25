"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";

export default function GenericPage() {
  const params = useParams();
  const { t, lang } = useLanguage();
  const slugArray = params.slug as string[];
  const pageName = slugArray ? slugArray.join("/") : "";

  const title = lang === 'UZ' ? 'Sahifa tayyorlanmoqda' : lang === 'RU' ? 'Страница в разработке' : 'Page Under Construction';
  const desc = lang === 'UZ' 
    ? `Kechirasiz, /${pageName} sahifasi ayni paytda ishlab chiqilmoqda. Tez orada bu yerda to'liq ma'lumotlar joylashtiriladi.`
    : lang === 'RU' 
      ? `Извините, страница /${pageName} находится в стадии разработки. Вскоре здесь будет размещена полная информация.`
      : `Sorry, the /${pageName} page is currently under development. Full information will be posted here soon.`;
  const back = lang === 'UZ' ? 'Bosh sahifaga qaytish' : lang === 'RU' ? 'Вернуться на главную' : 'Back to Home';

  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '1rem' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px' }}>
        {desc}
      </p>
      <Link href="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <i className="ti ti-arrow-left"></i> {back}
      </Link>
    </div>
  );
}
