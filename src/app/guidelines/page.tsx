"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

export default function GuidelinesPage() {
  const { lang } = useLanguage();

  const content = {
    UZ: {
      title: "Mualliflar uchun yo'riqnoma",
      subtitle: "Maqolani rasmiylashtirish va taqdim etish talablari",
      intro: "Jurnalga taqdim etiladigan barcha ilmiy maqolalar quyidagi talablarga muvofiq tayyorlangan bo'lishi lozim. Talablarga javob bermaydigan maqolalar ko'rib chiqilmasdan rad etilishi mumkin.",
      
      section1Title: "1. Maqola tuzilishi (Structure)",
      section1Desc: "Maqola matni mantiqiy ketma-ketlikda va quyidagi majburiy qismlardan iborat bo'lishi kerak:",
      structureItems: [
        { name: "Sarlavha (Title)", desc: "Qisqa, aniq va maqola mazmunini to'liq ifodalovchi (o'zbek, rus va ingliz tillarida)." },
        { name: "Mualliflar haqida ma'lumot (Authors)", desc: "F.I.SH., ish yoki o'qish joyi, ilmiy darajasi, mamlakat va elektron pochta manzili." },
        { name: "Annotatsiya (Abstract)", desc: "Maqola mazmunining qisqacha bayoni (150-250 ta so'z) uch tilda." },
        { name: "Kalit so'zlar (Keywords)", desc: "Mavzuga oid 5-8 ta asosiy so'z yoki ibora." },
        { name: "Kirish (Introduction)", desc: "Mavzuning dolzarbligi, muammoning qo'yilishi va tadqiqot maqsadi." },
        { name: "Metodologiya (Methods)", desc: "Tadqiqot usullari, ma'lumotlar manbai va tahlil bosqichlari." },
        { name: "Natijalar (Results)", desc: "Olingan ilmiy natijalar va ularning tahlili (jadval, grafik va rasmlar bilan)." },
        { name: "Xulosa (Conclusion)", desc: "Tadqiqotning yakuniy xulosalari va kelgusidagi tavsiyalar." },
        { name: "Adabiyotlar ro'yxati (References)", desc: "Foydalanilgan manbalar ro'yxati (eng kamida 10 ta manba, APA yoki IEEE formatida)." }
      ],

      section2Title: "2. Texnik talablar (Formatting)",
      section2Desc: "Hujjat Microsoft Word (.doc, .docx) va PDF formatlarida taqdim etilishi kerak. Har ikki faylni yuklash majburiydir:",
      formatItems: [
        "Shrift: Times New Roman yoki Arial, hajmi — 12 pt, qatorlar oralig'i (line spacing) — 1.15.",
        "Hoshiyalar (Margins): yuqoridan va pastdan — 2 sm, chapdan — 3 sm, o'ngdan — 1.5 sm.",
        "Rasmlar va jadvallar: Maqola ichida raqamlangan va aniq sarlavhaga ega bo'lishi lozim.",
        "Maqola hajmi: 6 betdan 15 betgacha bo'lishi tavsiya etiladi.",
        "PDF variant: Har bir sahifaning yuqori (header) va pastki (footer) qismida «Tamaddun» ilmiy jurnali nomi va maxsus hoshiyalari (lines) qo'yilishi shart."
      ],

      section3Title: "3. Nashr etish jarayoni",
      step1: "Yuborish",
      step1Desc: "Muallif platforma orqali ro'yxatdan o'tadi va maqolani yuklaydi.",
      step2: "Taqriz",
      step2Desc: "Maqola 2 ta mustaqil taqrizchiga yuboriladi (2-4 hafta).",
      step3: "Tahrirlash",
      step3Desc: "Muallif taqrizchilar mulohazalari asosida maqolani to'g'rilaydi.",
      step4: "Chop etish",
      step4Desc: "Maqolaga DOI raqami beriladi va jurnal arxiviga joylashtiriladi.",

      templateTitle: "Maqola Shablonini Yuklab Olish",
      templateDesc: "Tayyorlash jarayonini osonlashtirish uchun bizning rasmiy MS Word shablonimizdan foydalaning.",
      templateBtn: "Shablonni yuklab olish (.docx)",
      
      apcTitle: "APC (Article Processing Charge)",
      apcDesc: "Jurnal ochiq kirish litsenziyasi ostida ishlagani sababli, maqolani tahrirlash, DOI berish va texnik ko'rik uchun to'lov (APC) undiriladi. Batafsil ma'lumot shaxsiy kabinetda ko'rsatiladi."
    },
    RU: {
      title: "Руководство для авторов",
      subtitle: "Требования к оформлению и отправке научных статей",
      intro: "Все научные статьи, представляемые в журнал, должны быть оформлены в соответствии со следующими требованиями. Статьи, не соответствующие правилам, могут быть отклонены без рассмотрения.",
      
      section1Title: "1. Структура статьи (Structure)",
      section1Desc: "Текст статьи должен быть логически последовательным и содержать следующие обязательные разделы:",
      structureItems: [
        { name: "Название (Title)", desc: "Краткое, точное и отражающее суть статьи (на узбекском, русском и английском языках)." },
        { name: "Сведения об авторах (Authors)", desc: "Ф.И.О., место работы/учебы, научная степень, страна и адрес электронной почты." },
        { name: "Аннотация (Abstract)", desc: "Краткое изложение содержания статьи (150-250 слов) на трех языках." },
        { name: "Ключевые слова (Keywords)", desc: "5-8 ключевых слов или словосочетаний по теме статьи." },
        { name: "Введение (Introduction)", desc: "Актуальность темы, постановка проблемы и цель исследования." },
        { name: "Методология (Methods)", desc: "Методы исследования, источники данных и этапы анализа." },
        { name: "Результаты (Results)", desc: "Полученные научные результаты и их анализ (с таблицами, графиками и рисунками)." },
        { name: "Заключение (Conclusion)", desc: "Основные выводы исследования и рекомендации." },
        { name: "Список литературы (References)", desc: "Список цитируемых источников (минимум 10 источников, в стиле APA или IEEE)." }
      ],

      section2Title: "2. Технические требования (Formatting)",
      section2Desc: "Документ должен быть представлен в форматах Microsoft Word (.doc, .docx) и PDF. Загрузка обоих файлов обязательна:",
      formatItems: [
        "Шрифт: Times New Roman или Arial, размер — 12 pt, межстрочный интервал — 1.15.",
        "Поля (Margins): сверху и снизу — 2 см, слева — 3 см, справа — 1.5 см.",
        "Рисунки и таблицы: Должны быть пронумерованы внутри статьи и иметь четкие заголовки.",
        "Объем статьи: Рекомендуемый объем от 6 до 15 страниц.",
        "Вариант PDF: В верхней (header) и нижней (footer) частях каждой страницы должны быть указаны название научного журнала «Tamaddun» и его рамки."
      ],

      section3Title: "3. Процесс публикации",
      step1: "Отправка",
      step1Desc: "Автор регистрируется на платформе и загружает файл статьи.",
      step2: "Рецензирование",
      step2Desc: "Статья отправляется двум независимым рецензентам (2-4 недели).",
      step3: "Доработка",
      step3Desc: "Автор исправляет статью на основе комментариев рецензентов.",
      step4: "Публикация",
      step4Desc: "Статье присваивается DOI, и она публикуется в архиве журнала.",

      templateTitle: "Скачать шаблон статьи",
      templateDesc: "Используйте наш официальный шаблон MS Word, чтобы упростить процесс форматирования.",
      templateBtn: "Скачать шаблон (.docx)",
      
      apcTitle: "APC (Редакционный сбор)",
      apcDesc: "Поскольку журнал работает по модели открытого доступа, за редактирование, присвоение DOI и техническую обработку взимается издательский сбор (APC). Детали доступны в личном кабинете."
    },
    ENG: {
      title: "Author Guidelines",
      subtitle: "Manuscript Preparation and Submission Guidelines",
      intro: "All manuscripts submitted to the journal must be formatted in accordance with the guidelines below. Submissions failing to meet these rules may be rejected without peer review.",
      
      section1Title: "1. Manuscript Structure",
      section1Desc: "The text of the paper should be logically structured and contain the following mandatory sections:",
      structureItems: [
        { name: "Title", desc: "Concise, precise, and descriptive of the work (in Uzbek, Russian, and English)." },
        { name: "Author Affiliations", desc: "Full name, institution/organization, academic degree, country, and email address." },
        { name: "Abstract", desc: "A brief summary of the paper's contents (150-250 words) in three languages." },
        { name: "Keywords", desc: "5-8 keywords or phrases representing the subject matter." },
        { name: "Introduction", desc: "Context, problem statement, research significance, and core objectives." },
        { name: "Methodology", desc: "Research design, data collection sources, and analytical methods used." },
        { name: "Results & Discussion", desc: "Core findings, analyses, and comparisons (with tables, figures, and charts)." },
        { name: "Conclusion", desc: "Key take-away points, contributions, and recommendations for future study." },
        { name: "References", desc: "List of cited literature (minimum 10 sources, formatted in APA or IEEE style)." }
      ],

      section2Title: "2. Technical Formatting",
      section2Desc: "The manuscript must be submitted in both Microsoft Word (.doc, .docx) and PDF formats. Uploading both files is mandatory:",
      formatItems: [
        "Font: Times New Roman or Arial, size — 12 pt, line spacing — 1.15.",
        "Margins: top and bottom — 2 cm, left — 3 cm, right — 1.5 cm.",
        "Figures and Tables: Must be embedded inline, numbered chronologically, and have clear captions.",
        "Paper length: Recommended length is 6 to 15 pages.",
        "PDF variant: The top (header) and bottom (footer) margins of each page must contain the 'Tamaddun' journal name and its borders/lines."
      ],

      section3Title: "3. Publication Process",
      step1: "Submission",
      step1Desc: "The author registers on the portal and uploads the manuscript file.",
      step2: "Peer Review",
      step2Desc: "The paper is evaluated by 2 independent peer reviewers (takes 2-4 weeks).",
      step3: "Revision",
      step3Desc: "The author revises the paper based on peer reviewer feedback.",
      step4: "Publication",
      step4Desc: "A DOI is assigned to the paper, and it is published in the online archive.",

      templateTitle: "Download Manuscript Template",
      templateDesc: "Use our official MS Word manuscript template to make preparation easier.",
      templateBtn: "Download Template (.docx)",
      
      apcTitle: "APC (Article Processing Charge)",
      apcDesc: "Since the journal operates under an open-access model, an Article Processing Charge (APC) is required to cover editing, DOI registration, and indexing costs. Details are shown in the author dashboard."
    }
  };

  const t = content[lang as keyof typeof content] || content.UZ;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem', minHeight: 'calc(100vh - 200px)' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: 'var(--gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
          <i className="ti ti-arrow-left"></i> {lang === 'UZ' ? 'Bosh sahifa' : lang === 'RU' ? 'Главная' : 'Home'}
        </Link>
      </div>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--gold)', fontWeight: 600, fontFamily: '"Playfair Display", serif', marginBottom: '1rem' }}>
          {t.subtitle}
        </p>
        <p style={{ fontSize: '14.5px', color: 'var(--muted)', lineHeight: '1.7', maxWidth: '850px' }}>
          {t.intro}
        </p>
      </div>

      {/* Manuscript Structure & Formatting */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Structure section */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="ti ti-list-details" style={{ color: 'var(--gold)', fontSize: '1.6rem' }}></i> {t.section1Title}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '1.5rem' }}>{t.section1Desc}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {t.structureItems.map((item, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                <strong style={{ color: 'var(--navy)', display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                  {item.name}
                </strong>
                <span style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.5', display: 'block' }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Formatting section */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="ti ti-file-text" style={{ color: 'var(--gold)', fontSize: '1.6rem' }}></i> {t.section2Title}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '1.25rem' }}>{t.section2Desc}</p>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text)', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {t.formatItems.map((item, idx) => (
              <li key={idx} style={{ lineHeight: '1.6' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Publication Steps */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', marginBottom: '3rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="ti ti-git-fork" style={{ color: 'var(--gold)', fontSize: '1.6rem' }}></i> {t.section3Title}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ borderRight: '1px solid var(--border)', paddingRight: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--cream2)', color: 'var(--navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 'bold' }}>1</div>
            <h4 style={{ fontSize: '14.5px', color: 'var(--navy)', marginBottom: '8px' }}>{t.step1}</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.5' }}>{t.step1Desc}</p>
          </div>
          <div style={{ borderRight: '1px solid var(--border)', paddingRight: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--cream2)', color: 'var(--navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 'bold' }}>2</div>
            <h4 style={{ fontSize: '14.5px', color: 'var(--navy)', marginBottom: '8px' }}>{t.step2}</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.5' }}>{t.step2Desc}</p>
          </div>
          <div style={{ borderRight: '1px solid var(--border)', paddingRight: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--cream2)', color: 'var(--navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 'bold' }}>3</div>
            <h4 style={{ fontSize: '14.5px', color: 'var(--navy)', marginBottom: '8px' }}>{t.step3}</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.5' }}>{t.step3Desc}</p>
          </div>
          <div>
            <div style={{ width: '40px', height: '40px', background: 'var(--navy)', color: 'var(--gold-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 'bold' }}>4</div>
            <h4 style={{ fontSize: '14.5px', color: 'var(--navy)', marginBottom: '8px' }}>{t.step4}</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.5' }}>{t.step4Desc}</p>
          </div>
        </div>
      </div>

      {/* APC Info & Template Downloader */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
        {/* Template card */}
        <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', color: 'var(--gold-light)', marginBottom: '0.75rem' }}>
              {t.templateTitle}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {t.templateDesc}
            </p>
          </div>
          <button onClick={() => alert('Template file is being downloaded...')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
            <i className="ti ti-download"></i> {t.templateBtn}
          </button>
        </div>

        {/* APC card */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '0.75rem' }}>
              {t.apcTitle}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {t.apcDesc}
            </p>
          </div>
          <Link href="/login" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', width: 'fit-content', border: '1px solid var(--navy)', color: 'var(--navy)', textDecoration: 'none' }}>
            {lang === 'UZ' ? 'Kabinetga kirish' : lang === 'RU' ? 'В личный кабинет' : 'Go to Dashboard'} <i className="ti ti-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
