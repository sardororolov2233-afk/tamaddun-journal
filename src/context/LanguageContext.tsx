"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'UZ' | 'RU' | 'ENG';

export const dictionaries = {
  UZ: {
    nav: {
      archive: "Arxiv",
      about: "Haqida",
      editors: "Muharrirlar",
      guidelines: "Yo'riqnoma",
      login: "Kirish",
      submit: "Maqola Yuklash"
    },
    hero: {
      badge: "Open Access · CC BY 4.0",
      title1: "Ilm-fan chegarasiz, ",
      title2: "bilim erkin.",
      desc: "Tamaddun — ko'p tarmoqli, ochiq kirish ilmiy jurnali. Barcha soha mutaxassislariga mahsulotli va sifatli ilmiy nashr imkonini yaratamiz.",
      btnPrimary: "Maqola Yuklash ↗",
      btnOutline: "Arxivni Ko'rish"
    },
    stats: {
      published: "Nashr maqolalar",
      editors: "Muharrirlar",
      countries: "Mamlakatlar"
    },
    search: {
      placeholder: "Maqola sarlavhasi, muallif, kalit so'z...",
      allFields: "Barcha sohalar",
      physics: "Fizika",
      biology: "Biologiya",
      economics: "Iqtisodiyot",
      medicine: "Tibbiyot",
      cs: "Informatika",
      btn: "Qidirish"
    },
    tabs: {
      latest: "So'nggi Nashrlar",
      downloaded: "Ko'p Yuklangan",
      review: "Taqriz Jarayonida",
      viewAll: "Barchasini ko'rish →"
    },
    sidebar: {
      currentIssue: "Joriy Son",
      articles: "Maqolalar",
      downloads: "Yuklamalar",
      citations: "Iqtiboslar",
      quickLinks: "Tezkor Havolalar",
      track: "Tahrir Holatini Kuzatish",
      apc: "APC To'lovi",
      authorGuide: "Muallif Qo'llanmasi",
      beEditor: "Muharrir Bo'lish",
      fields: "Ilmiy Sohalar",
      indexation: "Indeksatsiya",
      inProgress: "(jarayonda)"
    },
    footer: {
      desc: "Tamaddun ko'p tarmoqli, ochiq kirish ilmiy jurnal bo'lib, 2022 yildan faoliyat yuritadi. Maqolalar ikki tomonlama ko'r-ko'r taqriz (double-blind peer review) usuli bilan baholanadi.",
      journal: "Jurnal",
      editorialBoard: "Muharrirlar Kengashi",
      ethics: "Etika Qoidalari",
      reviewProcess: "Taqriz Jarayoni",
      forAuthors: "Mualliflar Uchun",
      template: "Shablon Yuklash",
      plagiarism: "Plagiat Tekshiruvi",
      privacy: "Maxfiylik · Murojaat:"
    },
    login: {
      title: "Tizimga Kirish",
      desc: "Maqola yuklash va tahrir holatini kuzatish uchun profilingizga kiring.",
      emailLabel: "Elektron pochta",
      emailPlaceholder: "Ismingiz@gmail.com",
      passwordLabel: "Parol",
      passwordPlaceholder: "Parolingizni kiriting",
      forgotPass: "Parolni unutdingizmi?",
      loginBtn: "Kirish",
      or: "Yoki",
      googleBtn: "Google orqali kirish",
      noAccount: "Akkauntingiz yo'qmi?",
      signup: "Ro'yxatdan o'tish"
    },
    register: {
      title: "Ro'yxatdan o'tish",
      desc: "Yangi maqola yuklash uchun akkaunt yarating.",
      emailLabel: "Elektron pochta",
      emailPlaceholder: "Ismingiz@gmail.com",
      passwordLabel: "Parol",
      passwordPlaceholder: "Kamida 8 ta belgi",
      confirmPasswordLabel: "Parolni tasdiqlang",
      confirmPasswordPlaceholder: "Parolni qayta kiriting",
      registerBtn: "Akkaunt yaratish",
      or: "Yoki",
      googleBtn: "Google orqali ro'yxatdan o'tish",
      haveAccount: "Akkauntingiz bormi?",
      login: "Kirish"
    }
  },
  RU: {
    nav: {
      archive: "Архив",
      about: "О нас",
      editors: "Редакторы",
      guidelines: "Руководство",
      login: "Войти",
      submit: "Отправить статью"
    },
    hero: {
      badge: "Открытый доступ · CC BY 4.0",
      title1: "Наука без границ, ",
      title2: "знания свободны.",
      desc: "Tamaddun — это многопрофильный научный журнал в открытом доступе. Мы предоставляем возможность качественной научной публикации.",
      btnPrimary: "Отправить статью ↗",
      btnOutline: "Смотреть архив"
    },
    stats: {
      published: "Опубликовано",
      editors: "Редакторы",
      countries: "Страны"
    },
    search: {
      placeholder: "Заголовок, автор, ключевое слово...",
      allFields: "Все направления",
      physics: "Физика",
      biology: "Биология",
      economics: "Экономика",
      medicine: "Медицина",
      cs: "Информатика",
      btn: "Поиск"
    },
    tabs: {
      latest: "Последние выпуски",
      downloaded: "Популярные",
      review: "На рецензии",
      viewAll: "Смотреть все →"
    },
    sidebar: {
      currentIssue: "Текущий выпуск",
      articles: "Статьи",
      downloads: "Скачивания",
      citations: "Цитирования",
      quickLinks: "Быстрые ссылки",
      track: "Статус статьи",
      apc: "Оплата APC",
      authorGuide: "Руководство автора",
      beEditor: "Стать редактором",
      fields: "Научные направления",
      indexation: "Индексация",
      inProgress: "(в процессе)"
    },
    footer: {
      desc: "Tamaddun — это многопрофильный научный журнал, работающий с 2022 года. Статьи проходят двойное слепое рецензирование.",
      journal: "Журнал",
      editorialBoard: "Редакционная коллегия",
      ethics: "Этика публикаций",
      reviewProcess: "Процесс рецензирования",
      forAuthors: "Авторам",
      template: "Скачать шаблон",
      plagiarism: "Проверка на плагиат",
      privacy: "Конфиденциальность · Контакты:"
    },
    login: {
      title: "Войти в систему",
      desc: "Войдите в профиль, чтобы загружать статьи и отслеживать их статус.",
      emailLabel: "Электронная почта",
      emailPlaceholder: "Ваш@gmail.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Введите пароль",
      forgotPass: "Забыли пароль?",
      loginBtn: "Войти",
      or: "Или",
      googleBtn: "Войти через Google",
      noAccount: "Нет аккаунта?",
      signup: "Зарегистрироваться"
    },
    register: {
      title: "Регистрация",
      desc: "Создайте аккаунт для отправки статей.",
      emailLabel: "Электронная почта",
      emailPlaceholder: "Ваш@gmail.com",
      passwordLabel: "Пароль",
      passwordPlaceholder: "Минимум 8 символов",
      confirmPasswordLabel: "Подтвердите пароль",
      confirmPasswordPlaceholder: "Повторите пароль",
      registerBtn: "Создать аккаунт",
      or: "Или",
      googleBtn: "Регистрация через Google",
      haveAccount: "Уже есть аккаунт?",
      login: "Войти"
    }
  },
  ENG: {
    nav: {
      archive: "Archive",
      about: "About",
      editors: "Editors",
      guidelines: "Guidelines",
      login: "Login",
      submit: "Submit Article"
    },
    hero: {
      badge: "Open Access · CC BY 4.0",
      title1: "Science without borders, ",
      title2: "knowledge is free.",
      desc: "Tamaddun is a multidisciplinary open access scientific journal. We provide an opportunity for productive and high-quality scientific publication.",
      btnPrimary: "Submit Article ↗",
      btnOutline: "View Archive"
    },
    stats: {
      published: "Published Articles",
      editors: "Editors",
      countries: "Countries"
    },
    search: {
      placeholder: "Article title, author, keyword...",
      allFields: "All Fields",
      physics: "Physics",
      biology: "Biology",
      economics: "Economics",
      medicine: "Medicine",
      cs: "Computer Science",
      btn: "Search"
    },
    tabs: {
      latest: "Latest Publications",
      downloaded: "Most Downloaded",
      review: "Under Review",
      viewAll: "View All →"
    },
    sidebar: {
      currentIssue: "Current Issue",
      articles: "Articles",
      downloads: "Downloads",
      citations: "Citations",
      quickLinks: "Quick Links",
      track: "Track Submission",
      apc: "APC Payment",
      authorGuide: "Author Guidelines",
      beEditor: "Become an Editor",
      fields: "Scientific Fields",
      indexation: "Indexation",
      inProgress: "(in progress)"
    },
    footer: {
      desc: "Tamaddun is a multidisciplinary open access scientific journal operating since 2022. Articles are evaluated via double-blind peer review.",
      journal: "Journal",
      editorialBoard: "Editorial Board",
      ethics: "Ethics Guidelines",
      reviewProcess: "Review Process",
      forAuthors: "For Authors",
      template: "Download Template",
      plagiarism: "Plagiarism Check",
      privacy: "Privacy · Contact:"
    },
    login: {
      title: "Log In",
      desc: "Log in to your profile to submit articles and track their status.",
      emailLabel: "Email Address",
      emailPlaceholder: "Your@gmail.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      forgotPass: "Forgot password?",
      loginBtn: "Log In",
      or: "Or",
      googleBtn: "Continue with Google",
      noAccount: "Don't have an account?",
      signup: "Sign up"
    },
    register: {
      title: "Sign Up",
      desc: "Create an account to submit your articles.",
      emailLabel: "Email Address",
      emailPlaceholder: "Your@gmail.com",
      passwordLabel: "Password",
      passwordPlaceholder: "At least 8 characters",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter password",
      registerBtn: "Create Account",
      or: "Or",
      googleBtn: "Sign up with Google",
      haveAccount: "Already have an account?",
      login: "Log in"
    }
  }
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('UZ');

  useEffect(() => {
    const saved = localStorage.getItem('gjir_lang') as Lang;
    if (saved && ['UZ', 'RU', 'ENG'].includes(saved)) {
      setLang(saved);
    }
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('gjir_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
