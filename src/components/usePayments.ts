'use client';
import {useCallback,useEffect,useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {supabase} from '../lib/supabaseClient';
import type {PaymentRequest} from '../lib/payments';
export default function usePayments(){
  const {user,isSupabaseConfigured}=useAuth();
  const [payments,setPayments]=useState<PaymentRequest[]>([]);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  const refresh=useCallback(()=>{
    if(!user || !isSupabaseConfigured)return Promise.resolve();
    return Promise.resolve(supabase.from('payment_requests').select('*').order('created_at',{ascending:false}))
      .then(({data,error})=>{
        if(error)throw error;
        setPayments(data || []);setError('');
      }).catch(()=>{setError('To‘lovlar yuklanmadi. “Yangilash” tugmasini bosing yoki tahririyat bilan bog‘laning.');})
      .finally(()=>setLoading(false));
  },[user,isSupabaseConfigured]);
  useEffect(()=>{
    refresh();
    const timer=setInterval(refresh,30000);
    window.addEventListener('focus',refresh);
    window.addEventListener('journal:payments-updated',refresh);
    return()=>{clearInterval(timer);window.removeEventListener('focus',refresh);window.removeEventListener('journal:payments-updated',refresh);};
  },[refresh]);
  return {payments:user?payments.filter(p=>user.role==='admin' || p.author_id===user.id):[],error,loading:!!user && loading,refresh};
}
