import Link from 'next/link';
import { JOURNAL } from '../../lib/journal';
export default function ContactPage() {
  return <div className="journal-page"><div className="page-heading"><div><span className="section-kicker">TAMADDUN / ALOQA</span><h1>Tahririyat bilan bog‘lanish</h1></div><p>Topshirish, nashr va to‘lov bo‘yicha savollaringizni yuboring. Materiallar 24–48 soat ichida ko‘rib chiqiladi.</p></div><div className="submission-methods"><a className="method-card" href={JOURNAL.telegram} target="_blank" rel="noopener noreferrer"><h2>Telegram</h2><strong>@sardorbekuralov →</strong></a><a className="method-card" href={`mailto:${JOURNAL.email}`}><h2>Email</h2><strong>{JOURNAL.email} →</strong></a><Link href="/submit" className="method-card"><h2>Material yuborish</h2><strong>Uchta qulay usul →</strong></Link></div></div>;
}
