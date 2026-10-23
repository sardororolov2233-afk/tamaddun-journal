import { JOURNAL } from '../lib/journal';
export type PublicationTarget = { publication_year: number; volume: number; issue: number };
export const CURRENT_TARGET: PublicationTarget = { publication_year: JOURNAL.year, volume: JOURNAL.volume, issue: JOURNAL.issue };
export default function PublicationFields({ value, onChange }: { value: PublicationTarget; onChange: (value: PublicationTarget) => void }) {
  return <fieldset className="publication-fields"><legend>Nashr joylashuvi</legend>{([{key:'publication_year',label:'Yil',min:2026},{key:'volume',label:'Jild',min:1},{key:'issue',label:'Son',min:1}] as const).map(f => <label key={f.key}>{f.label}<input aria-label={f.label} type="number" required min={f.min} max={f.key === 'publication_year' ? 2200 : 999} value={value[f.key]} onChange={e => {const number = Number(e.target.value); if (Number.isInteger(number) && number >= f.min) onChange({...value,[f.key]:number});}} /></label>)}</fieldset>;
}
