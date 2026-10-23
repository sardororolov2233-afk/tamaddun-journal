'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { JOURNAL } from '../lib/journal';
export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();
  if (pathname?.endsWith('/certificate')) return null;
  return <footer><div className="footer-grid"><div className="footer-col"><h4>Tamaddun</h4><p>{t.footer.desc}</p><p>2026 · 1-jild, 3-son uchun qabul davom etmoqda.</p><a href={JOURNAL.telegram} target="_blank" rel="noopener noreferrer">Telegram: @sardorbekuralov →</a><a href={`mailto:${JOURNAL.email}`}>{JOURNAL.email}</a></div><div className="footer-col"><h4>{t.footer.journal}</h4><Link href="/about">{t.nav.about}</Link><Link href="/archive">{t.nav.archive}</Link><Link href="/offer">Ommaviy oferta</Link><Link href="/privacy">Maxfiylik siyosati</Link><Link href="/security">Xavfsizlik qoidalari</Link><Link href="/contact">Aloqa</Link></div><div className="footer-col"><h4>{t.footer.forAuthors}</h4><Link href="/submit">Maqola va tezis topshirish</Link><Link href="/guidelines">{t.nav.guidelines}</Link><Link href="/apc">APC: maqola 120 000 so‘m · tezis 80 000 so‘m</Link><Link href="/track">Topshirilma holatini kuzatish</Link><p>Ko‘rib chiqish: 24–48 soat ichida.</p></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Tamaddun. Creative Commons Attribution 4.0 International (CC BY 4.0)</p><p><Link href="/privacy">Maxfiylik</Link> · <Link href="/security">Xavfsizlik</Link> · <Link href="/contact">Murojaat</Link></p></div></footer>;
}
