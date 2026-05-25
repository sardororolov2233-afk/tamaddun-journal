"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

export default function EditorsPage() {
  const { lang } = useLanguage();

  const content = {
    UZ: {
      title: "Muharrirlar Kengashi",
      subtitle: "Tamaddun xalqaro tahririyat tarkibi",
      intro: "Jurnalimizning tahrir hay'ati dunyoning turli mamlakatlaridan kelgan taniqli olimlar va tadqiqotchilardan iborat. Ular taqdim etilayotgan maqolalarning ilmiy saviyasini va taqriz jarayonini nazorat qiladilar.",
      
      eicTitle: "Bosh Muharrir",
      assocTitle: "Bosh Muharrir O'rinbosarlari",
      boardTitle: "Kengash A'zolari",

      editorsList: {
        eic: {
          name: "Prof. Dr. Alisher X. Tursunov",
          title: "Fizika-matematika fanlari doktori, professor",
          univ: "O'zbekiston Milliy Universiteti, O'zbekiston",
          email: "a.tursunov@tamaddun-journal.org"
        },
        assoc: [
          {
            name: "Dr. Sarah Jenkins",
            title: "PhD in Biomedical Sciences, Associate Professor",
            univ: "Stanford University, AQSH",
            email: "s.jenkins@tamaddun-journal.org"
          },
          {
            name: "Prof. Dr. Dmitry S. Ivanov",
            title: "Iqtisodiyot fanlari doktori, professor",
            univ: "Lomonosov nomidagi Moskva Davlat Universiteti, Rossiya",
            email: "d.ivanov@tamaddun-journal.org"
          }
        ],
        members: [
          {
            name: "Prof. Dr. Min-Kyu Park",
            title: "Informatika va sun'iy intellekt bo'yicha mutaxassis",
            univ: "Seoul National University, Janubiy Koreya"
          },
          {
            name: "Prof. Li Wei",
            title: "Kimyoviy texnologiyalar kafedrasi mudiri",
            univ: "Tsinghua University, Xitoy"
          },
          {
            name: "Dr. Marcus Weber",
            title: "Ekologiya va atrof-muhit muhofazasi professori",
            univ: "Technical University of Munich, Germaniya"
          },
          {
            name: "Prof. Robert Taylor",
            title: "Tarix va ijtimoiy fanlar professori",
            univ: "University of Oxford, Buyuk Britaniya"
          },
          {
            name: "Prof. Dr. Nigora M. Usmonova",
            title: "Filologiya fanlari doktori",
            univ: "Toshkent Davlat Sharqshunoslik Universiteti, O'zbekiston"
          },
          {
            name: "Dr. Elena Petrova",
            title: "Tibbiyot fanlari nomzodi, dotsent",
            univ: "Satbayev University, Qozog'iston"
          }
        ]
      },

      contactTitle: "Tahririyat bilan bog'lanish",
      contactDesc: "Tahririyat kengashiga a'zo bo'lish yoki hamkorlik masalalari bo'yicha quyidagi manzilga yozishingiz mumkin:",
      contactBtn: "Murojaat Yo'llash"
    },
    RU: {
      title: "Редакционная коллегия",
      subtitle: "Международный состав редакционной коллегии Tamaddun",
      intro: "Редакционная коллегия нашего журнала состоит из выдающихся ученых и исследователей из разных стран мира. Они контролируют научное качество публикаций и процесс рецензирования.",
      
      eicTitle: "Главный редактор",
      assocTitle: "Заместители главного редактора",
      boardTitle: "Члены редакционной коллегии",

      editorsList: {
        eic: {
          name: "Проф. Д-р Алишер Х. Турсунов",
          title: "Доктор физико-математических наук, профессор",
          univ: "Национальный университет Узбекистана, Узбекистан",
          email: "a.tursunov@tamaddun-journal.org"
        },
        assoc: [
          {
            name: "Д-р Сара Дженкинс",
            title: "PhD в области биомедицинских наук, доцент",
            univ: "Стэнфордский университет, США",
            email: "s.jenkins@tamaddun-journal.org"
          },
          {
            name: "Проф. Д-р Дмитрий С. Иванов",
            title: "Доктор экономических наук, профессор",
            univ: "Московский государственный университет имени М.В. Ломоносова, Россия",
            email: "d.ivanov@tamaddun-journal.org"
          }
        ],
        members: [
          {
            name: "Проф. Мин-Кю Пак",
            title: "Специалист в области информатики и искусственного интеллекта",
            univ: "Сеульский национальный университет, Южная Корея"
          },
          {
            name: "Проф. Ли Вэй",
            title: "Заведующий кафедрой химических технологий",
            univ: "Университет Цинхуа, Китай"
          },
          {
            name: "Д-р Маркус Вебер",
            title: "Профессор экологии и охраны окружающей среды",
            univ: "Мюнхенский технический университет, Германия"
          },
          {
            name: "Проф. Роберт Тейлор",
            title: "Профессор истории и социальных наук",
            univ: "Оксфордский университет, Великобритания"
          },
          {
            name: "Проф. Д-р Нигора М. Усмонова",
            title: "Доктор филологических наук",
            univ: "Ташкентский государственный университет востоковедения, Узбекистан"
          },
          {
            name: "Д-р Елена Петрова",
            title: "Кандидат медицинских наук, доцент",
            univ: "Satbayev University, Казахстан"
          }
        ]
      },

      contactTitle: "Контакты с редакцией",
      contactDesc: "По вопросам вступления в редакционную коллегию или сотрудничества пишите нам по адресу:",
      contactBtn: "Связаться с нами"
    },
    ENG: {
      title: "Editorial Board",
      subtitle: "International Editorial Board of Tamaddun",
      intro: "Our editorial board consists of distinguished scholars and researchers from various countries. They supervise the scientific quality, peer review process, and scope of our journal.",
      
      eicTitle: "Editor-in-Chief",
      assocTitle: "Associate Editors",
      boardTitle: "Editorial Board Members",

      editorsList: {
        eic: {
          name: "Prof. Dr. Alisher X. Tursunov",
          title: "Doctor of Physical and Mathematical Sciences, Professor",
          univ: "National University of Uzbekistan, Uzbekistan",
          email: "a.tursunov@tamaddun-journal.org"
        },
        assoc: [
          {
            name: "Dr. Sarah Jenkins",
            title: "PhD in Biomedical Sciences, Associate Professor",
            univ: "Stanford University, USA",
            email: "s.jenkins@tamaddun-journal.org"
          },
          {
            name: "Prof. Dr. Dmitry S. Ivanov",
            title: "Doctor of Economic Sciences, Professor",
            univ: "Lomonosov Moscow State University, Russia",
            email: "d.ivanov@tamaddun-journal.org"
          }
        ],
        members: [
          {
            name: "Prof. Min-Kyu Park",
            title: "Expert in Computer Science & Artificial Intelligence",
            univ: "Seoul National University, South Korea"
          },
          {
            name: "Prof. Li Wei",
            title: "Head of Chemical Engineering Department",
            univ: "Tsinghua University, China"
          },
          {
            name: "Dr. Marcus Weber",
            title: "Professor of Ecology & Environmental Studies",
            univ: "Technical University of Munich, Germany"
          },
          {
            name: "Prof. Robert Taylor",
            title: "Professor of History & Social Sciences",
            univ: "University of Oxford, United Kingdom"
          },
          {
            name: "Prof. Dr. Nigora M. Usmonova",
            title: "Doctor of Philological Sciences",
            univ: "Tashkent State University of Oriental Studies, Uzbekistan"
          },
          {
            name: "Dr. Elena Petrova",
            title: "MD, PhD, Associate Professor",
            univ: "Satbayev University, Kazakhstan"
          }
        ]
      },

      contactTitle: "Contact Editorial Office",
      contactDesc: "For queries regarding joining our editorial board or potential partnerships, please write to us at:",
      contactBtn: "Contact Us"
    }
  };

  const t = content[lang as keyof typeof content] || content.UZ;
  const ed = t.editorsList;

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

      {/* Editor-in-Chief Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--navy)', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', marginBottom: '1.5rem' }}>
          {t.eicTitle}
        </h2>
        
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ width: '70px', height: '70px', background: 'var(--navy)', color: 'var(--gold-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 600, fontFamily: '"Playfair Display", serif' }}>
            AT
          </div>
          <div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.35rem', color: 'var(--navy)', marginBottom: '4px' }}>
              {ed.eic.name}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>
              {ed.eic.title}
            </p>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)', marginBottom: '8px' }}>
              {ed.eic.univ}
            </p>
            <span style={{ fontSize: '12.5px', color: 'var(--navy)', fontFamily: 'monospace' }}>
              <i className="ti ti-mail"></i> {ed.eic.email}
            </span>
          </div>
        </div>
      </div>

      {/* Associate Editors Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--navy)', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', marginBottom: '1.5rem' }}>
          {t.assocTitle}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {ed.assoc.map((editor, idx) => (
            <div key={idx} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'var(--cream2)', color: 'var(--navy)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600, fontFamily: '"Playfair Display", serif' }}>
                {editor.name.split(' ').filter(n => !n.includes('.') && n.length > 1).map(n => n[0]).join('')}
              </div>
              <div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '4px' }}>
                  {editor.name}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>
                  {editor.title}
                </p>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '8px' }}>
                  {editor.univ}
                </p>
                <span style={{ fontSize: '11.5px', color: 'var(--navy)', fontFamily: 'monospace' }}>
                  <i className="ti ti-mail"></i> {editor.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Board Members Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: 'var(--navy)', borderBottom: '2px solid var(--gold)', paddingBottom: '8px', marginBottom: '1.5rem' }}>
          {t.boardTitle}
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {ed.members.map((member, idx) => (
            <div key={idx} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--cream)', color: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                {idx + 1}
              </div>
              <div>
                <h4 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', color: 'var(--navy)', marginBottom: '4px' }}>
                  {member.name}
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginBottom: '4px' }}>
                  {member.title}
                </p>
                <p style={{ fontSize: '12.5px', color: 'var(--gold)', fontWeight: 500 }}>
                  {member.univ}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Contact Banner */}
      <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: '8px', padding: '2.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: 'var(--gold-light)', marginBottom: '8px' }}>
            {t.contactTitle}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', maxWidth: '600px' }}>
            {t.contactDesc} <strong style={{ color: '#fff', textDecoration: 'underline' }}>info@tamaddun-journal.org</strong>
          </p>
        </div>
        <button onClick={() => window.location.href = 'mailto:info@tamaddun-journal.org'} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-mail-forward"></i> {t.contactBtn}
        </button>
      </div>
    </div>
  );
}
