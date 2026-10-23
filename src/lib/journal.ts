export const JOURNAL = {
  started: 2026,
  year: 2026,
  volume: 1,
  issue: 3,
  articlePrice: 120_000,
  thesisPrice: 80_000,
  telegram: "https://t.me/sardorbekuralov",
  email: "sardororolov2233@gmail.com",
} as const;

export type JournalArticle = {
  id: string; title: string; authors: string | string[]; abstract: string;
  keywords: string; field?: string; affiliation?: string; status: string;
  volume: number; issue: number; publication_year?: number; created_at?: string;
  date?: string; doi?: string; has_docx?: boolean; has_pdf?: boolean;
  has_certificate?: boolean; kind?: "article" | "thesis";
};
export type JournalVolume = {
  id: string; title: string; volume?: number; issue?: number; publication_year?: number;
  pdf_url?: string; cover_image_url?: string; comment?: string; created_at?: string;
};
export type JournalIssue = {
  year: number; volume: number; issue: number; articles: JournalArticle[]; collections: JournalVolume[];
};
export function issuePath(item: { year: number; volume: number; issue: number }) {
  return `/archive/${item.year}/${item.volume}/${item.issue}`;
}
export function articleYear(article: JournalArticle) {
  return article.publication_year || new Date(article.created_at || article.date || "2026-01-01").getUTCFullYear();
}
export function articlePath(article: JournalArticle) {
  return `/article/${article.id}${article.kind === "thesis" ? "?kind=thesis" : ""}`;
}
export function groupIssues(articles: JournalArticle[], collections: JournalVolume[] = []): JournalIssue[] {
  const issues = new Map<string, JournalIssue>();
  const ensure = (year: number, volume: number, issue: number) => {
    const key = `${year}/${volume}/${issue}`;
    if (!issues.has(key)) issues.set(key, { year, volume, issue, articles: [], collections: [] });
    return issues.get(key)!;
  };
  for (const article of articles) {
    if (article.status === "published") ensure(articleYear(article), Number(article.volume) || 1, Number(article.issue) || 1).articles.push(article);
  }
  for (const collection of collections) {
    // Support previously uploaded volumes whose issue metadata is encoded in their title.
    const v = collection.volume || Number(collection.title.match(/(\d+)\s*[-–]?\s*(?:jild|том)/i)?.[1]);
    const n = collection.issue || Number(collection.title.match(/(\d+)\s*[-–]?\s*(?:son|выпуск)/i)?.[1]);
    const year = collection.publication_year || Number(collection.title.match(/20\d{2}/)?.[0]) || 2026;
    if (v > 0 && n > 0) ensure(year, v, n).collections.push(collection);
  }
  return [...issues.values()].sort((a, b) => b.year - a.year || b.volume - a.volume || b.issue - a.issue)
    .map(item => ({ ...item, articles: item.articles.sort((a, b) => (a.created_at || a.date || "").localeCompare(b.created_at || b.date || "") || a.id.localeCompare(b.id)) }));
}

export const DEFAULT_ARTICLES: JournalArticle[] = [
  {
    id: "1",
    title: "CRISPR-Cas9 texnologiyasi yordamida irsiy kasalliklarni davolashning yangi yondashuvlari",
    authors: "Karimov A.B., Yusupova N.K., Chen L.",
    affiliation: "Toshkent Tibbiyot Universiteti",
    abstract: "Ushbu tadqiqot CRISPR-Cas9 genni tahrirlash texnologiyasidan foydalangan holda monogen kasalliklarni in vivo sharoitda bartaraf etishning yangi usullarini taqdim etadi. Olib borilgan tajribalar natijasida β-talassemiya kasalligi bilan og'rigan in vitro modellarida 87% samaradorlik ko'rsatkichi erishildi.",
    keywords: "CRISPR-Cas9, gen tahrirlash, irsiy kasalliklar, β-talassemiya",
    field: "Biotibbiyot",
    status: "published",
    publication_year: 2026,
    kind: "article",
    volume: 1,
    issue: 1,
    created_at: "2026-05-12T12:00:00.000Z",
    has_docx: false,
    has_pdf: false
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
    publication_year: 2026,
    kind: "article",
    volume: 1,
    issue: 1,
    created_at: "2026-05-07T12:00:00.000Z",
    has_docx: false,
    has_pdf: false
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
    publication_year: 2026,
    kind: "article",
    volume: 1,
    issue: 2,
    created_at: "2026-05-01T12:00:00.000Z",
    has_docx: false,
    has_pdf: false
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
    publication_year: 2026,
    kind: "article",
    volume: 1,
    issue: 2,
    created_at: "2026-04-28T12:00:00.000Z",
    has_docx: false,
    has_pdf: false
  }
];

