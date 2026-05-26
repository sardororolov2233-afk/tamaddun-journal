"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";

// Boshlang'ich mock maqolalar (bazada maqolalar yo'qligida ko'rsatish uchun)
const DEFAULT_ARTICLES = [
  {
    id: "1",
    title: "CRISPR-Cas9 texnologiyasi yordamida irsiy kasalliklarni davolashning yangi yondashuvlari",
    authors: "Karimov A.B., Yusupova N.K., Chen L.",
    affiliation: "Toshkent Tibbiyot Universiteti",
    abstract: "Ushbu tadqiqot CRISPR-Cas9 genni tahrirlash texnologiyasidan foydalangan holda monogen kasalliklarni in vivo sharoitda bartaraf etishning yangi usullarini taqdim etadi. Olib borilgan tajribalar natijasida β-talassemiya kasalligi bilan og'rigan in vitro modellarida 87% samaradorlik ko'rsatkichi erishildi.",
    keywords: "CRISPR-Cas9, gen tahrirlash, irsiy kasalliklar, β-talassemiya",
    field: "Biotibbiyot",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2025-05-12T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.001",
    has_docx: true,
    has_pdf: true
  },
  {
    id: "2",
    title: "O'rta Osiyo mamlakatlari eksport diversifikatsiyasi: Raqamli iqtisodiyot sektori tahlili",
    authors: "Toshmatov I.O., Rakhimova D.S.",
    affiliation: "Iqtisodiyot Instituti, Samarqand",
    abstract: "Maqolada O'zbekiston, Qozog'iston va Qirg'iziston iqtisodiyotlarida raqamli sektor eksport ulushini oshirishning makroiqtisodiy modeli taqdim etiladi. Panel ma'lumotlari asosida VECM modelidan foydalanib, 2010–2024 yillar oraliq statistikasi tahlil qilinadi.",
    keywords: "eksport diversifikatsiyasi, raqamli iqtisodiyot, O'rta Osiyo",
    field: "Iqtisodiyot",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2025-05-07T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.002",
    has_docx: true,
    has_pdf: true
  },
  {
    id: "3",
    title: "Kam resursli muhitlarda tabiiy tilni qayta ishlashda transformer modellarini optimallashtirish",
    authors: "Mirzayev J.T., Abdullayeva M.F., Kim S.H.",
    affiliation: "INHA University in Tashkent",
    abstract: "Ushbu ish o'zbek va tojik tillarini qayta ishlashga mo'ljallangan engil transformer arxitekturasini taklif etadi. LoRA (Low-Rank Adaptation) usuli qo'llanilganda parametrlar soni 93% kamaytirildi, F1-score ko'rsatkichi esa etalon modellar bilan raqobatbardosh bo'lib qoldi.",
    keywords: "NLP, transformer, LoRA, o'zbek tili",
    field: "Informatika",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2025-05-01T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.003",
    has_docx: true,
    has_pdf: true
  },
  {
    id: "4",
    title: "Qorakumdan olingan zeolitlar asosida yangi sorbentlar sintezi va ularning ekologik xususiyatlari",
    authors: "Xoliqov B.A., Saidova G.R.",
    affiliation: "Kimyo Fanlari Instituti, Toshkent",
    abstract: "Tabiiy zeolitlar asosida ishlab chiqilgan kompozit sorbentlarning og'ir metallarni (Pb, Cd, Cr) suvli eritmasilardan ushlab qolish samaradorligi o'rganildi. Sintez qilingan namunalar BET tahlili va SEM-EDX usullari bilan xarakterlandi.",
    keywords: "zeolit, sorbent, og'ir metallar",
    field: "Kimyo",
    status: "published",
    volume: 4,
    issue: 2,
    created_at: "2025-04-28T12:00:00.000Z",
    doi: "10.36001/tamaddun.2025.4.2.004",
    has_docx: true,
    has_pdf: true
  }
];

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  // Search input states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("All");
  const [searchYear, setSearchYear] = useState("All");

  // Articles state
  const [articles, setArticles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"latest" | "downloaded" | "review">("latest");
  const [loading, setLoading] = useState(true);

  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  useEffect(() => {
    const fetchArticles = async () => {
      let dbArticles: any[] = [];

      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (data && !error) {
          dbArticles = data;
        }
      } else {
        const saved = localStorage.getItem('gjir_articles');
        if (saved) {
          const parsed = JSON.parse(saved);
          dbArticles = parsed.filter((a: any) => a.status === 'published');
        }
      }

      // Merge database/localStorage articles with fallback articles
      const combined = [...dbArticles];
      DEFAULT_ARTICLES.forEach(mockArt => {
        if (!combined.some(c => c.id === mockArt.id || c.title.toLowerCase() === mockArt.title.toLowerCase())) {
          combined.push(mockArt);
        }
      });

      setArticles(combined);
      setLoading(false);
    };

    fetchArticles();
  }, [isSupabaseConfigured]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery);
    if (searchField !== "All" && searchField !== t.search.allFields) params.set("field", searchField);
    if (searchYear !== "All") params.set("year", searchYear);
    
    router.push(`/search?${params.toString()}`);
  };

  const getPdfUrl = (art: any) => {
    if (isSupabaseConfigured && art.id.length > 5) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`${art.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  // Filter articles based on active tab
  const getDisplayArticles = () => {
    if (activeTab === "latest") {
      return articles.slice(0, 5);
    } else if (activeTab === "downloaded") {
      // Mock downloads: sort by id length or default order
      return [...articles].sort((a, b) => (b.title.length - a.title.length)).slice(0, 3);
    } else {
      // Return a subset representing review process
      return articles.slice(2, 4);
    }
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
          <div className="stat-card"><div className="stat-num">{1240 + articles.filter(a => a.id.length > 5).length}</div><div className="stat-label">{t.stats.published}</div></div>
          <div className="stat-card"><div className="stat-num">48</div><div className="stat-label">{t.stats.editors}</div></div>
          <div className="stat-card"><div className="stat-num">92</div><div className="stat-label">{t.stats.countries}</div></div>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-wrap">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input 
            type="text" 
            placeholder={t.search.placeholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <select 
          className="filter-select"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="All">{t.search.allFields}</option>
          <option value="Biotibbiyot">{t.search.biology}</option>
          <option value="Iqtisodiyot">{t.search.economics}</option>
          <option value="Informatika">{t.search.cs}</option>
          <option value="Kimyo">Kimyo</option>
        </select>
        <select 
          className="filter-select"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        >
          <option value="All">Barcha yillar</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2024–2025">2024–2025</option>
          <option value="2023">2023</option>
        </select>
        <button className="btn-search" onClick={handleSearch}>{t.search.btn}</button>
      </div>

      <div className="main animate-fade-in-up">
        <div className="articles-col">
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'latest' ? 'active' : ''}`}
              onClick={() => setActiveTab('latest')}
            >
              {t.tabs.latest}
            </div>
            <div 
              className={`tab ${activeTab === 'downloaded' ? 'active' : ''}`}
              onClick={() => setActiveTab('downloaded')}
            >
              {t.tabs.downloaded}
            </div>
            <div 
              className={`tab ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => setActiveTab('review')}
            >
              {t.tabs.review}
            </div>
          </div>

          <div className="section-head">
            <h2>
              {activeTab === 'latest' && "2025 · Jild 4, Son 2"}
              {activeTab === 'downloaded' && "Ko'p o'qilgan ilmiy maqolalar"}
              {activeTab === 'review' && "Taqriz va muhokama bosqichidagi tadqiqotlar"}
            </h2>
            <Link href="/archive" style={{ textDecoration: 'none' }}>{t.tabs.viewAll}</Link>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
              Yuklanmoqda...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {getDisplayArticles().map((article) => (
                <div key={article.id} className="article-card">
                  <div className="article-meta">
                    <span className="tag tag-field">{article.field || "Biotibbiyot"}</span>
                    <span className="tag tag-open">Open Access</span>
                    {new Date(article.created_at || article.date || Date.now()).getFullYear() === 2025 && (
                      <span className="tag tag-new">Yangi</span>
                    )}
                    <span className="article-date">
                      {new Date(article.created_at || article.date || Date.now()).toLocaleDateString("uz-UZ", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3>
                    <Link href={`/article/${article.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {article.title}
                    </Link>
                  </h3>
                  <div className="authors">
                    {Array.isArray(article.authors) ? article.authors.join(", ") : article.authors} 
                    {article.affiliation && ` · ${article.affiliation}`}
                  </div>
                  <div className="abstract clamped">
                    {article.abstract}
                  </div>
                  <div className="article-actions">
                    <a href={getPdfUrl(article)} target="_blank" rel="noopener noreferrer" className="btn-pdf" style={{ textDecoration: 'none' }}>
                      <i className="ti ti-file-type-pdf" aria-hidden="true" style={{ color: '#e53935' }}></i> PDF yuklash
                    </a>
                    <Link href={`/article/${article.id}/certificate`} target="_blank" className="btn-cite" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="ti ti-certificate" aria-hidden="true" style={{ color: 'var(--gold)' }}></i> Sertifikat
                    </Link>
                    <span className="doi">
                      {article.doi || `DOI: 10.36001/tamaddun.2025.${article.volume}.${article.issue}.${article.id.slice(0, 5)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="volume-card">
            <div className="vol-label">{t.sidebar.currentIssue}</div>
            <div className="vol-num">Jild 4, Son 2</div>
            <div className="vol-date">2025 · May–Iyun</div>
            <hr className="vol-divider" />
            <div className="vol-stat"><span>{t.sidebar.articles}</span><strong>{articles.length}</strong></div>
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
