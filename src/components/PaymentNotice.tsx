'use client';
import Link from 'next/link';
import {useAuth} from '../context/AuthContext';
import {paymentLabels,type PaymentRequest} from '../lib/payments';
export default function PaymentNotice({payments}:{payments:PaymentRequest[]}){
  const {user}=useAuth();if(!user)return null;
  const actionable=payments.filter(p=>!p.deleted_at && (user.role==='admin'?p.status==='submitted':['awaiting_receipt','rejected'].includes(p.status)));
  return <div className={`payment-notice ${actionable.length?'needs-attention':''}`} role={actionable.length?'status':undefined}><div><strong>{user.role==='admin'?`Tekshirish uchun cheklar: ${actionable.length}`:`To‘lov eslatmalari: ${actionable.length}`}</strong>{actionable.slice(0,3).map(p=><p key={p.id}>{p.title} · {new Intl.NumberFormat('uz-UZ').format(p.amount)} so‘m · {paymentLabels[p.status]}</p>)}</div><Link href="/payments" className="btn-search">{user.role==='admin'?'Cheklarni tekshirish':'To‘lovlarim'}</Link></div>;
}
