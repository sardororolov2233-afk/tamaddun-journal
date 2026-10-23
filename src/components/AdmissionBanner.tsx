import Link from 'next/link';
import { JOURNAL } from '../lib/journal';

export default function AdmissionBanner() {
  return <div className="admission-banner"><span><span className="admission-dot" /> {JOURNAL.year} · {JOURNAL.volume}-jild, {JOURNAL.issue}-son uchun qabul davom etmoqda</span><Link href="/submit">Maqola va tezis yuborish · 24–48 soat →</Link></div>;
}
