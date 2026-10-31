'use client';
import JournalMark from './JournalMark';
import { useState } from 'react';
import Image from 'next/image';

export default function IssueCover({ volume, issue, year, image }: { volume: number; issue: number; year: number; image?: string }) {
  const [failed, setFailed] = useState(false);
  if (image && !failed) return <Image unoptimized width={300} height={400} className="issue-cover-image" src={image} alt={`Tamaddun — ${volume}-jild, ${issue}-son (${year})`} onError={() => setFailed(true)} />;
  return <div className={`issue-cover issue-tone-${issue % 3}`} aria-hidden="true"><div className="issue-cover-top">ILMIY KONFERENSIYA · SCIENTIFIC CONFERENCE</div><strong>Tamaddun</strong><span className="issue-rosette"><JournalMark /></span><div className="issue-cover-caption">ILM-FAN CHEGARASIZ.<br />BILIM ERKIN.</div><div className="issue-cover-bottom"><span>{volume}-JILD / {String(issue).padStart(2, '0')}-SON</span><span>{year}</span></div></div>;
}
