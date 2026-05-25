"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname?.endsWith('/certificate')) {
    return null;
  }

  return (
    <nav>
      <Link href="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <div className="nav-logo">T</div>
        <div>
          <div className="nav-name">Tamaddun</div>
          <div className="nav-abbr">Open Access · Peer-Reviewed</div>
        </div>
      </Link>
      <div className="nav-links">
        <Link href="/archive">{t.nav.archive}</Link>
        <Link href="/about">{t.nav.about}</Link>
        <Link href="/editors">{t.nav.editors}</Link>
        <Link href="/guidelines">{t.nav.guidelines}</Link>
        <Link href="/login">{t.nav.login}</Link>
        <LanguageSwitcher />
        <Link href="/login" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>{t.nav.submit}</Link>
      </div>
    </nav>
  );
}
