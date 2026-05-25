"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = () => {
    router.push("/search");
  };

  return (
    <>
      <h2 className="sr-only">Tamaddun — jurnal bosh sahifasi</h2>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-badge"><i className="ti ti-award" aria-hidden="true"></i>{t.hero.badge}</div>
          <h1>{t.hero.title1}<em>{t.hero.title2}</em></h1>
          <p>{t.hero.desc}</p>
          <div className="hero-actions">
            <Link href="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>{t.hero.btnPrimary}</Link>
            <Link href="/archive" className="btn-outline" style={{ display: 'inline-block', textDecoration: 'none' }}>{t.hero.btnOutline}</Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card"><div className="stat-num">1,240</div><div className="stat-label">{t.stats.published}</div></div>
          <div className="stat-card"><div className="stat-num">48</div><div className="stat-label">{t.stats.editors}</div></div>
          <div className="stat-card"><div className="stat-num">92</div><div className="stat-label">{t.stats.countries}</div></div>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-wrap">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input type="text" placeholder={t.search.placeholder} />
        </div>
        <select className="filter-select">
          <option>{t.search.allFields}</option>
          <option>{t.search.physics}</option>
          <option>{t.search.biology}</option>
          <option>{t.search.economics}</option>
          <option>{t.search.medicine}</option>
          <option>{t.search.cs}</option>
        </select>
        <select className="filter-select">
          <option>2024–2025</option>
          <option>2023</option>
          <option>2022</option>
        </select>
        <button className="btn-search" onClick={handleSearch}>{t.search.btn}</button>
      </div>

      <div className="main">
        <div className="articles-col">
          <div className="tabs">
            <div className="tab active">{t.tabs.latest}</div>
            <div className="tab">{t.tabs.downloaded}</div>
            <div className="tab">{t.tabs.review}</div>
          </div>

          <div className="section-head">
            <h2>2025 · Jild 4, Son 2</h2>
            <Link href="/archive/2025-v4-i2" style={{ textDecoration: 'none' }}>{t.tabs.viewAll}</Link>
          </div>

          <div className="article-card">
            <div className="article-meta">
              <span className="tag tag-field">Biotibbiyot</span>
              <span className="tag tag-open">Open Access</span>
              <span className="article-date">12 May 2025</span>
            </div>
            <h3><Link href="/article/1" style={{ color: 'inherit', textDecoration: 'none' }}>CRISPR-Cas9 texnologiyasi yordamida irsiy kasalliklarni davolashning yangi yondashuvlari</Link></h3>
            <div className="authors">Karimov A.B., Yusupova N.K., Chen L. · Toshkent Tibbiyot Universiteti</div>
            <div className="abstract clamped">Ushbu tadqiqot CRISPR-Cas9 genni tahrirlash texnologiyasidan foydalangan holda monogen kasalliklarni in vivo sharoitda bartaraf etishning yangi usullarini taqdim etadi. Olib borilgan tajribalar natijasida β-talassemiya kasalligi bilan og&apos;rigan in vitro modellarida 87% samaradorlik ko&apos;rsatkichi erishildi.</div>
            <div className="article-actions">
              <button className="btn-pdf"><i className="ti ti-file-type-pdf" aria-hidden="true"></i>PDF yuklash</button>
              <button className="btn-cite"><i className="ti ti-quote" aria-hidden="true"></i>Iqtibos</button>
              <span className="doi">DOI: 10.36001/tamaddun.2025.4.2.001</span>
            </div>
          </div>

          <div className="article-card">
            <div className="article-meta">
              <span className="tag tag-field">Iqtisodiyot</span>
              <span className="tag tag-open">Open Access</span>
              <span className="tag tag-new">Yangi</span>
              <span className="article-date">7 May 2025</span>
            </div>
            <h3><Link href="/article/2" style={{ color: 'inherit', textDecoration: 'none' }}>O&apos;rta Osiyo mamlakatlari eksport diversifikatsiyasi: Raqamli iqtisodiyot sektori tahlili</Link></h3>
            <div className="authors">Toshmatov I.O., Rakhimova D.S. · Iqtisodiyot Instituti, Samarqand</div>
            <div className="abstract clamped">Maqolada O&apos;zbekiston, Qozog&apos;iston va Qirg&apos;iziston iqtisodiyotlarida raqamli sektor eksport ulushini oshirishning makroiqtisodiy modeli taqdim etiladi. Panel ma&apos;lumotlari asosida VECM modelidan foydalanib, 2010–2024 yillar oraliq statistikasi tahlil qilinadi.</div>
            <div className="article-actions">
              <button className="btn-pdf"><i className="ti ti-file-type-pdf" aria-hidden="true"></i>PDF yuklash</button>
              <button className="btn-cite"><i className="ti ti-quote" aria-hidden="true"></i>Iqtibos</button>
              <span className="doi">DOI: 10.36001/tamaddun.2025.4.2.002</span>
            </div>
          </div>

          <div className="article-card">
            <div className="article-meta">
              <span className="tag tag-field">Informatika</span>
              <span className="tag tag-open">Open Access</span>
              <span className="article-date">1 May 2025</span>
            </div>
            <h3><Link href="/article/3" style={{ color: 'inherit', textDecoration: 'none' }}>Kam resursli muhitlarda tabiiy tilni qayta ishlashda transformer modellarini optimallashtirish</Link></h3>
            <div className="authors">Mirzayev J.T., Abdullayeva M.F., Kim S.H. · INHA University in Tashkent</div>
            <div className="abstract clamped">Ushbu ish o&apos;zbek va tojik tillarini qayta ishlashga mo&apos;ljallangan engil transformer arxitekturasini taklif etadi. LoRA (Low-Rank Adaptation) usuli qo&apos;llanilganda parametrlar soni 93% kamaytirildi, F1-score ko&apos;rsatkichi esa etalon modellar bilan raqobatbardosh bo&apos;lib qoldi.</div>
            <div className="article-actions">
              <button className="btn-pdf"><i className="ti ti-file-type-pdf" aria-hidden="true"></i>PDF yuklash</button>
              <button className="btn-cite"><i className="ti ti-quote" aria-hidden="true"></i>Iqtibos</button>
              <span className="doi">DOI: 10.36001/tamaddun.2025.4.2.003</span>
            </div>
          </div>

          <div className="article-card">
            <div className="article-meta">
              <span className="tag tag-field">Kimyo</span>
              <span className="tag tag-review">Taqriz ostida</span>
              <span className="article-date">28 Apr 2025</span>
            </div>
            <h3><Link href="/article/4" style={{ color: 'inherit', textDecoration: 'none' }}>Qorakumdan olingan zeolitlar asosida yangi sorbentlar sintezi va ularning ekologik xususiyatlari</Link></h3>
            <div className="authors">Xoliqov B.A., Saidova G.R. · Kimyo Fanlari Instituti, Toshkent</div>
            <div className="abstract clamped">Tabiiy zeolitlar asosida ishlab chiqilgan kompozit sorbentlarning og&apos;ir metallarni (Pb, Cd, Cr) suvli eritmasilardan ushlab qolish samaradorligi o&apos;rganildi. Sintez qilingan namunalar BET tahlili va SEM-EDX usullari bilan xarakterlandi.</div>
            <div className="article-actions">
              <button className="btn-pdf"><i className="ti ti-file-type-pdf" aria-hidden="true"></i>PDF yuklash</button>
              <button className="btn-cite"><i className="ti ti-quote" aria-hidden="true"></i>Iqtibos</button>
              <span className="doi">DOI: 10.36001/tamaddun.2025.4.2.004</span>
            </div>
          </div>

          <div className="pagination">
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">5</button>
            <button className="page-btn"><i className="ti ti-chevron-right" aria-hidden="true"></i></button>
          </div>
        </div>

        <div className="sidebar">
          <div className="volume-card">
            <div className="vol-label">{t.sidebar.currentIssue}</div>
            <div className="vol-num">Jild 3, Son 4</div>
            <div className="vol-date">2026 · May–Iyun</div>
            <hr className="vol-divider" />
            <div className="vol-stat"><span>{t.sidebar.articles}</span><strong>18</strong></div>
            <div className="vol-stat"><span>{t.sidebar.downloads}</span><strong>4,120</strong></div>
            <div className="vol-stat"><span>{t.sidebar.citations}</span><strong>312</strong></div>
          </div>

          <div className="sidebar-section">
            <h3>{t.sidebar.quickLinks}</h3>
            <Link href="/login" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-upload" aria-hidden="true"></i>{t.nav.submit}</Link>
            <Link href="/track" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-clock" aria-hidden="true"></i>{t.sidebar.track}</Link>
            <Link href="/apc" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-currency-dollar" aria-hidden="true"></i>{t.sidebar.apc}</Link>
            <Link href="/guidelines" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-book" aria-hidden="true"></i>{t.sidebar.authorGuide}</Link>
            <Link href="/join-editors" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-certificate" aria-hidden="true"></i>{t.sidebar.beEditor}</Link>
          </div>

          <div className="sidebar-section">
            <h3>{t.sidebar.fields}</h3>
            <div>
              <span className="subject-pill">{t.search.biology}</span>
              <span className="subject-pill">Kimyo</span>
              <span className="subject-pill">{t.search.physics}</span>
              <span className="subject-pill">{t.search.medicine}</span>
              <span className="subject-pill">{t.search.cs}</span>
              <span className="subject-pill">Matematika</span>
              <span className="subject-pill">{t.search.economics}</span>
              <span className="subject-pill">Pedagogika</span>
              <span className="subject-pill">Ekologiya</span>
              <span className="subject-pill">Tarix</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>{t.sidebar.indexation}</h3>
            <div className="indexed-badge"><div className="idx-dot"></div>Google Scholar</div>
            <div className="indexed-badge"><div className="idx-dot"></div>CrossRef · DOI Ro&apos;yxati</div>
            <div className="indexed-badge"><div className="idx-dot"></div>DOAJ {t.sidebar.inProgress}</div>
            <div className="indexed-badge"><div className="idx-dot"></div>ROAD · ISSN Portal</div>
          </div>
        </div>
      </div>
    </>
  );
}
