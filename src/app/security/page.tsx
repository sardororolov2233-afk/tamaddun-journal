import PolicyPage from '../../components/PolicyPage';
export const metadata = { title: 'Xavfsizlik qoidalari — Tamaddun' };
export default function SecurityPage() {
  return <PolicyPage title="Xavfsizlik qoidalari" intro="Hisobingiz, fayllaringiz va to‘lovlaringizni himoya qilish bo‘yicha foydalanish qoidalari." sections={[
    {title:'Hisob xavfsizligi',text:'Boshqa saytlarda ishlatilmaydigan kuchli parol tanlang. Parol, SMS kodi yoki tiklash havolasini hech kimga bermang. Tahririyat sizdan parol yoki bir martalik kod so‘ramaydi. Umumiy qurilmalarda ish tugagach hisobdan chiqing.'},
    {title:'Fayl topshirish',text:'Faqat o‘zingizga tegishli va hammualliflar roziligi olingan ilmiy DOCX hamda PDF fayllarni topshiring. Zararli dastur, makrosli yoki bajariluvchi fayllarni yubormang. Fayllarni antivirusda tekshiring; ularga pasport, karta rekvizitlari yoki maxfiy tadqiqot ma’lumotlarini qo‘shmang.'},
    {title:'Rasmiy aloqa',text:'Rasmiy Telegram manzili — @sardorbekuralov, email — sardororolov2233@gmail.com. Begona akkauntlardan kelgan to‘lov yoki fayl so‘rovlarini shu manzillar orqali tekshiring. Materialingizning zaxira nusxasini saqlang.'},
    {title:'To‘lov xavfsizligi',text:'To‘lovni faqat ish nashrga qabul qilinib, rekvizitlar rasmiy aloqa kanali orqali tasdiqlangach amalga oshiring. Karta raqami bilan birga CVV, amal qilish muddati yoki SMS kodini yubormang. To‘lov dalilini saqlab qo‘ying. Saytdagi narxlar: maqola 120 000 so‘m, tezis 80 000 so‘m.'},
    {title:'Ruxsatsiz harakatlar',text:'Boshqa foydalanuvchining hisobiga kirish, ruxsatsiz ma’lumot olish, xizmatni ishdan chiqarish va zararli fayl tarqatish taqiqlanadi. Shubhali faoliyat, buzilgan havola yoki ma’lumotlarning ochilib qolishini sezsangiz, tahririyatga xabar bering.'},
  ]} />;
}
