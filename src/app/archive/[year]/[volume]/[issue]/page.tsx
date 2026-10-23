import { notFound } from 'next/navigation';
import ArchiveBrowser from '../../../../../components/ArchiveBrowser';
export default async function IssuePage({ params }: { params: Promise<{ year: string; volume: string; issue: string }> }) {
  const p = await params;
  if (![p.year, p.volume, p.issue].every(v => /^\d+$/.test(v) && Number(v) > 0) || Number(p.year) < 2026) notFound();
  return <ArchiveBrowser selected={{ year: Number(p.year), volume: Number(p.volume), issue: Number(p.issue) }} />;
}
