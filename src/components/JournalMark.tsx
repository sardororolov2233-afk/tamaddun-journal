export default function JournalMark() {
  return <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false"><g stroke="currentColor" strokeWidth="9" strokeLinecap="round">{Array.from({length:8},(_,index) => <path key={index} d="M50 40V12" transform={`rotate(${index * 45} 50 50)`} />)}</g><circle cx="50" cy="50" r="6" fill="currentColor" /></svg>;
}
