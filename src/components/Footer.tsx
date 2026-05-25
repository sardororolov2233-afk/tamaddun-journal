"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname?.endsWith('/certificate')) {
    return null;
  }

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Tamaddun</h4>
          <p>{t.footer.desc}</p>
          <p style={{ marginTop: '8px' }}>ISSN (online): <span className="issn">2949-XXXX</span></p>
        </div>
        <div className="footer-col">
          <h4>{t.footer.journal}</h4>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/editors">{t.footer.editorialBoard}</Link>
          <Link href="/ethics">{t.footer.ethics}</Link>
          <Link href="/review-process">{t.footer.reviewProcess}</Link>
          <Link href="/archive">{t.nav.archive}</Link>
        </div>
        <div className="footer-col">
          <h4>{t.footer.forAuthors}</h4>
          <Link href="/guidelines">{t.nav.guidelines}</Link>
          <Link href="/template">{t.footer.template}</Link>
          <Link href="/apc">APC To'lov (Click/Payme)</Link>
          <Link href="/plagiarism">{t.footer.plagiarism}</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Tamaddun. Creative Commons Attribution 4.0 International (CC BY 4.0)</p>
        <p>{t.footer.privacy} editor@tamaddun.uz</p>
      </div>
    </footer>
  );
}
