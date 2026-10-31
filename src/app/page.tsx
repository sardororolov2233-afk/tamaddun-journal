"use client";
import JournalMark from "../components/JournalMark";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { JOURNAL, articlePath, type JournalArticle as Article } from "../lib/journal";
import { loadPublishedArticles } from "../lib/journalRepository";
import AdmissionBanner from "../components/AdmissionBanner";

// Boshlang'ich mock maqolalar (bazada maqolalar yo'qligida ko'rsatish uchun)

export default function Home() {
  const router = useRouter();
  const [loadedAt] = useState(() => Date.now());
  const { t, lang } = useLanguage();

  // Search input states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("All");
  const [searchYear, setSearchYear] = useState("All");

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  useEffect(() => {
    const fetchArticles = async () => {
      try { setArticles(await loadPublishedArticles()); }
      catch { setArticles([]); }
      finally { setLoading(false); }
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

  const getPdfUrl = (art: Article) => {
    if (isSupabaseConfigured && art.has_pdf) {
      const { data } = supabase.storage.from('articles_files').getPublicUrl(`${art.kind === "thesis" ? "theses/" : ""}${art.id}.pdf`);
      return data.publicUrl;
    }
    return '#';
  };

  const getDisplayArticles = () => articles
    .filter(article => activeTab === "All" || article.field === activeTab)
    .sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime())
    .slice(0, 5);
  const copy = {
    UZ: { label: "ILM. IZLANISH. TARAQQIYOT.", discover: "Yangi bilimlar shu yerdan boshlanadi", disciplines: "Ilmiy yo‘nalishlar", access: "Erkin foydalanish", sample: "Namuna maqolalar", all: "Barcha maqolalar", empty: "Bu yo‘nalishda maqola topilmadi.", details: "Maqolani o‘qish", year: "Barcha yillar", fields: "Ilmiy soha" },
    RU: { label: "НАУКА. ПОИСК. ПРОГРЕСС.", discover: "Новые знания начинаются здесь", disciplines: "Научные направления", access: "Открытый доступ", sample: "Демонстрационные статьи", all: "Все статьи", empty: "Статьи не найдены.", details: "Читать статью", year: "Все годы", fields: "Научная область" },
    ENG: { label: "SCIENCE. DISCOVERY. PROGRESS.", discover: "New knowledge starts here", disciplines: "Research disciplines", access: "Open access", sample: "Sample articles", all: "All articles", empty: "No articles in this discipline.", details: "Read article", year: "All years", fields: "Research discipline" }
  }[lang as "UZ" | "RU" | "ENG"];

  return (
    <>
      <AdmissionBanner />
      <h2 className="sr-only">Tamaddun — konferensiya bosh sahifasi</h2>

      <div className="hero">
        <div className="hero-eyebrow">{copy.label}<span>EST. 2026 / TAMADDUN</span></div>
        <div className="hero-inner">
          <div className="hero-badge"><i className="ti ti-award" aria-hidden="true"></i>{t.hero.badge}</div>
          <h1>{t.hero.title1}<em>{t.hero.title2}</em></h1>
          <p>{t.hero.desc}</p>
          <div className="hero-actions">
            <Link href="/submit" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>{t.hero.btnPrimary}</Link>
            <Link href="/archive" className="btn-outline" style={{ display: 'inline-block', textDecoration: 'none' }}>{t.hero.btnOutline}</Link>
          </div>
        </div>
        <Link href="/archive" className="journal-art" aria-label={t.hero.btnOutline}>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="journal-cover"><span className="cover-top">ILMIY KONFERENSIYA / SCIENTIFIC CONFERENCE</span><strong>Tamaddun<span>∗</span></strong><div className="cover-symbol" aria-hidden="true"><JournalMark /></div><div className="cover-bottom"><span>ILM-FAN<br />CHEGARASIZ.</span><span>OPEN<br />ACCESS →</span></div></div>
          <span className="art-caption">{copy.discover} →</span>
        </Link>
        <div className="hero-stats">
          <div className="stat-card"><div className="stat-num">{articles.length.toString().padStart(2, '0')}</div><div className="stat-label">{isSupabaseConfigured ? t.stats.published : copy.sample}</div></div>
          <div className="stat-card"><div className="stat-num">{new Set(articles.map(a => a.field)).size.toString().padStart(2, '0')}</div><div className="stat-label">{copy.disciplines}</div></div>
          <div className="stat-card"><div className="stat-num">100%</div><div className="stat-label">{copy.access}</div></div>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-wrap">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input 
            aria-label={t.search.placeholder}
            type="search"
            placeholder={t.search.placeholder} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <select 
          className="filter-select"
          aria-label={copy.fields}
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
          aria-label={copy.year}
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
        >
          <option value="All">{copy.year}</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
        <button className="btn-search" onClick={handleSearch}>{t.search.btn}</button>
      </div>

      <div className="main animate-fade-in-up">
        <div className="articles-col">
          <div className="section-kicker">TAMADDUN / {isSupabaseConfigured ? 'OPEN ACCESS' : copy.sample}</div>
          <div className="section-head"><h2>{t.tabs.latest}</h2><Link href="/archive">{t.tabs.viewAll}</Link></div>
          <div className="tabs" aria-label={copy.fields}>
            {["All", "Biotibbiyot", "Iqtisodiyot", "Informatika", "Kimyo"].map(field => (
              <button type="button" key={field} aria-pressed={activeTab === field} className={`tab ${activeTab === field ? 'active' : ''}`} onClick={() => setActiveTab(field)}>{field === 'All' ? copy.all : field}</button>
            ))}
          </div>
          {!loading && getDisplayArticles().length === 0 && <p role="status">{copy.empty}</p>}

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
                    {loadedAt - new Date(article.created_at || article.date || 0).getTime() >= 0 && loadedAt - new Date(article.created_at || article.date || 0).getTime() < 30 * 86400000 && (
                      <span className="tag tag-new">Yangi</span>
                    )}
                    <span className="article-date">
                      {new Date(article.created_at || article.date || loadedAt).toLocaleDateString("uz-UZ", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3>
                    <Link href={articlePath(article)} style={{ color: 'inherit', textDecoration: 'none' }}>
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
                    {getPdfUrl(article) !== '#' ? <a href={getPdfUrl(article)} target="_blank" rel="noopener noreferrer" className="btn-pdf" style={{ textDecoration: 'none' }}>
                      <i className="ti ti-file-type-pdf" aria-hidden="true" style={{ color: '#e53935' }}></i> PDF yuklash
                    </a> : <Link href={articlePath(article)} className="btn-pdf">{copy.details} →</Link>}
                    <span className="doi">
                      {article.doi ? `DOI: ${article.doi}` : `${article.publication_year || 2026} · ${article.volume}-jild, ${article.issue}-son`}
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
            <div className="vol-num">Jild {JOURNAL.volume}, Son {JOURNAL.issue}</div>
            <div className="vol-date">2026 · Qabul davom etmoqda</div>
            <hr className="vol-divider" />
            <div className="vol-stat"><span>{t.sidebar.articles}</span><strong>{articles.filter(a => a.volume === JOURNAL.volume && a.issue === JOURNAL.issue).length}</strong></div>
            <Link href="/archive" className="issue-link">{t.tabs.viewAll}</Link>
          </div>

          <div className="sidebar-section">
            <h3>{t.sidebar.quickLinks}</h3>
            <Link href="/submit" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-upload" aria-hidden="true"></i>{t.nav.submit}</Link>
            <Link href="/submit" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-notes" aria-hidden="true"></i>{lang === 'UZ' ? 'Tezis yuborish' : lang === 'RU' ? 'Отправить тезис' : 'Submit Thesis'}</Link>
            <Link href="/track" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-clock" aria-hidden="true"></i>{t.sidebar.track}</Link>
            <Link href="/apc" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-currency-dollar" aria-hidden="true"></i>{t.sidebar.apc}</Link>
            <Link href="/guidelines" className="quick-link" style={{ textDecoration: 'none' }}><i className="ti ti-book" aria-hidden="true"></i>{t.sidebar.authorGuide}</Link>
          </div>

          <div className="sidebar-section">
            <h3>{t.sidebar.fields}</h3>
            <div>
              <Link href={{ pathname: "/search", query: { field: "Biotibbiyot" } }} className="subject-pill">{t.search.biology}</Link>
              <Link href={{ pathname: "/search", query: { field: "Kimyo" } }} className="subject-pill">Kimyo</Link>
              <Link href={{ pathname: "/search", query: { field: "Fizika" } }} className="subject-pill">{t.search.physics}</Link>
              <Link href={{ pathname: "/search", query: { field: "Tibbiyot" } }} className="subject-pill">{t.search.medicine}</Link>
              <Link href={{ pathname: "/search", query: { field: "Informatika" } }} className="subject-pill">{t.search.cs}</Link>
              <Link href={{ pathname: "/search", query: { field: "Matematika" } }} className="subject-pill">Matematika</Link>
              <Link href={{ pathname: "/search", query: { field: "Iqtisodiyot" } }} className="subject-pill">{t.search.economics}</Link>
              <Link href={{ pathname: "/search", query: { field: "Pedagogika" } }} className="subject-pill">Pedagogika</Link>
              <Link href={{ pathname: "/search", query: { field: "Ekologiya" } }} className="subject-pill">Ekologiya</Link>
              <Link href={{ pathname: "/search", query: { field: "Tarix" } }} className="subject-pill">Tarix</Link>
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
