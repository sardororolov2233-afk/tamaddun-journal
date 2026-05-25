"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, Role } from '../../context/AuthContext';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('author');

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Parollar mos kelmadi! / Пароли не совпадают! / Passwords do not match!");
      return;
    }
    await register(email, role, password);
  };

  const handleGoogleRegister = async () => {
    await register('google_user@gmail.com', role, 'password123');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 56px - 200px)', padding: '4rem 2rem' }}>
      <div style={{
        background: '#fff',
        width: '100%',
        maxWidth: '420px',
        borderRadius: '8px',
        padding: '2.5rem 2rem',
        boxShadow: '0 10px 40px rgba(10,22,40,0.08)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', width: '48px', height: '48px', background: 'var(--gold)', borderRadius: '6px', alignItems: 'center', justifyContent: 'center', fontFamily: '"Playfair Display", serif', fontWeight: 700, color: 'var(--navy)', fontSize: '20px', letterSpacing: '-0.5px', marginBottom: '1rem' }}>
            GJ
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
            {t.register.title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.6' }}>
            {t.register.desc}
          </p>
        </div>

        <form onSubmit={handleEmailRegister}>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              {t.register.emailLabel}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.register.emailPlaceholder}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                background: 'var(--cream)',
                color: 'var(--text)'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              {t.register.passwordLabel}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t.register.passwordPlaceholder}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                background: 'var(--cream)',
                color: 'var(--text)'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>
              {t.register.confirmPasswordLabel}
            </label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={t.register.confirmPasswordPlaceholder}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                background: 'var(--cream)',
                color: 'var(--text)'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            padding: '12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
            marginTop: '0.5rem'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--navy2)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--navy)'}>
            {t.register.registerBtn}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <div style={{ padding: '0 12px', fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>{t.register.or}</div>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <button 
          onClick={handleGoogleRegister}
          style={{
            width: '100%',
            background: '#fff',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            padding: '10px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--cream)'}
          onMouseOut={e => e.currentTarget.style.background = '#fff'}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          {t.register.googleBtn}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px' }}>
          <span style={{ color: 'var(--muted)' }}>{t.register.haveAccount} </span>
          <Link href="/login" style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'none' }}>{t.register.login}</Link>
        </div>
      </div>
    </div>
  );
}
