'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useAuth} from '../context/AuthContext';
export default function AuthForm({registering=false}:{registering?:boolean}) {
  const {login,register,isSupabaseConfigured} = useAuth();
  const [email,setEmail] = useState('');const [password,setPassword] = useState('');const [confirmation,setConfirmation] = useState('');
  const [busy,setBusy] = useState(false);const [error,setError] = useState('');const [message,setMessage] = useState('');
  async function submit(event:React.FormEvent) {
    event.preventDefault();if(busy)return;setError('');setMessage('');
    if(registering && password!==confirmation){setError('Parollar mos kelmadi.');return;}
    setBusy(true);
    try {
      if(registering){const signedIn=await register(email,password);if(!signedIn)setMessage('Email manzilingizga tasdiqlash havolasi yuborildi. Havolani oching, keyin akkauntingizga kiring.');}
      else await login(email,password);
    } catch(error){setError(error instanceof Error ? error.message : 'Hisob bilan ishlashda xatolik yuz berdi.');}
    finally{setBusy(false);}
  }
  return <div className="journal-page"><section className="account-form"><span className="section-kicker">TAMADDUN / SHAXSIY KABINET</span><h1>{registering ? 'Ro‘yxatdan o‘tish' : 'Akkauntga kirish'}</h1><p>Maqola topshirish, to‘lov eslatmalarini olish va chek yuborish uchun shaxsiy akkaunt talab etiladi.</p>{!isSupabaseConfigured && <p className="demo-notice">Onlayn akkaunt xizmati hozir ulanmagan. <Link href="/contact">Tahririyat bilan bog‘laning.</Link></p>}{error && <p role="alert" className="error-notice">{error}</p>}{message && <p role="status" className="submission-info">{message}</p>}<form onSubmit={submit}><label htmlFor="account-email">Email</label><input id="account-email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} /><label htmlFor="account-password">Parol</label><input id="account-password" type="password" autoComplete={registering?'new-password':'current-password'} required minLength={registering?8:undefined} value={password} onChange={e=>setPassword(e.target.value)} />{registering && <><label htmlFor="account-confirmation">Parolni takrorlang</label><input id="account-confirmation" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={e=>setConfirmation(e.target.value)} /></>}<button className="btn-search" disabled={busy || !isSupabaseConfigured}>{busy?'Kutilmoqda…':registering?'Akkaunt yaratish':'Kirish'}</button></form><p>{registering?'Akkauntingiz bormi?':'Akkauntingiz yo‘qmi?'} <Link href={registering?'/login?next=/submit':'/register?next=/submit'}>{registering?'Kirish':'Ro‘yxatdan o‘tish'}</Link></p></section></div>;
}
