"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = ['UZ', 'RU', 'ENG'];

  const handleSelect = (selected: string) => {
    changeLang(selected);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255,255,255,0.1)',
          color: 'var(--gold-light)',
          border: '0.5px solid rgba(255,255,255,0.2)',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: 600,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        <i className="ti ti-world"></i> {lang} <i className={`ti ti-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '6px',
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          zIndex: 50,
          minWidth: '80px'
        }}>
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => handleSelect(l)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 16px',
                border: 'none',
                background: lang === l ? 'var(--cream)' : 'transparent',
                color: lang === l ? 'var(--navy)' : 'var(--text)',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: lang === l ? 600 : 400
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--cream)'}
              onMouseOut={(e) => e.currentTarget.style.background = lang === l ? 'var(--cream)' : 'transparent'}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
