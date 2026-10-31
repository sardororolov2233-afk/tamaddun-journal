"use client";
import JournalMark from "./JournalMark";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  if (pathname?.endsWith('/certificate')) return null;
  const menuLabel = lang === 'UZ' ? 'Menyu' : lang === 'RU' ? 'Меню' : 'Menu';
  return (
    <nav className="site-nav" aria-label={menuLabel}>
      <Link href="/" className="nav-brand" onClick={() => setMenuPath(null)}>
        <div className="nav-logo" aria-hidden="true"><JournalMark /></div>
        <div><div className="nav-name">Tamaddun<span>®</span></div><div className="nav-abbr">ILMIY-AMALIY KONFERENSIYA</div></div>
      </Link>
      <button className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setMenuPath(open ? null : pathname)}>{open ? '×' : '☰'} <span>{menuLabel}</span></button>
      <div id="primary-navigation" className={`nav-links ${open ? 'is-open' : ''}`} onKeyDown={e => { if (e.key === 'Escape') setMenuPath(null); }}>
        {([['/archive', t.nav.archive], ['/about', t.nav.about], ['/guidelines', t.nav.guidelines], [user ? '/dashboard' : '/login', user ? 'Kabinet' : t.nav.login]]).map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setMenuPath(null)}>{label}</Link>)}
        <LanguageSwitcher />
        <Link href="/submit" className="btn-submit" onClick={() => setMenuPath(null)}>{t.nav.submit} <span aria-hidden="true">→</span></Link>
      </div>
    </nav>
  );
}
