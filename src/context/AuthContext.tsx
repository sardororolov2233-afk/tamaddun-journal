'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
export type Role = 'admin' | 'author' | 'reviewer';
interface User { id: string; name: string; email: string; role: Role }
interface AuthContextType {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isSupabaseConfigured: boolean;
}
const AuthContext = createContext<AuthContextType>({user:null,ready:false,login:async()=>{},register:async()=>false,logout:async()=>{},isSupabaseConfigured:false});
export const AuthProvider = ({children}:{children:React.ReactNode}) => {
  const [user,setUser] = useState<User|null>(null);
  const [ready,setReady] = useState(false);
  const router = useRouter();
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const fetchProfile = useCallback(async(id:string,email:string) => {
    const {data,error} = await supabase.from('profiles').select('id,email,full_name,role').eq('id',id).single();
    if(error || !data) {setUser(null);setReady(true);throw new Error('Akkaunt profilini yuklab bo‘lmadi. Qayta urinib ko‘ring yoki tahririyatga murojaat qiling.');}
    setUser({id,email:data.email || email,name:data.full_name || email.split('@')[0],role:data.role === 'admin' || data.role === 'reviewer' ? data.role : 'author'});
    setReady(true);
  },[]);
  useEffect(()=>{
    let active = true;
    if(!isSupabaseConfigured) { Promise.resolve().then(()=>{if(active)setReady(true);});return ()=>{active=false;}; }
    const sync = async()=>{
      try {
        const {data:{session}} = await supabase.auth.getSession();
        if(!active)return;
        if(session?.user) await fetchProfile(session.user.id,session.user.email || '');
        else {setUser(null);setReady(true);}
      } catch {if(active){setUser(null);setReady(true);}}
    };
    sync();
    const {data:{subscription}} = supabase.auth.onAuthStateChange(()=>{queueMicrotask(()=>{if(active)sync();});});
    return ()=>{active=false;subscription.unsubscribe();};
  },[isSupabaseConfigured,fetchProfile]);
  const destination = () => new URLSearchParams(window.location.search).get('next') === '/submit' ? '/submit' : '/dashboard';
  const requireConfigured = () => {if(!isSupabaseConfigured)throw new Error('Onlayn akkaunt xizmati ulanmagan. Hozircha email yoki Telegram orqali bog‘laning.');};
  const login = async(email:string,password:string) => {
    requireConfigured();
    const {data,error} = await supabase.auth.signInWithPassword({email,password});
    if(error)throw new Error(error.message);
    if(!data.user || !data.session)throw new Error('Hisobga kirishni tasdiqlab bo‘lmadi.');
    await fetchProfile(data.user.id,data.user.email || email);
    router.push(destination());
  };
  const register = async(email:string,password:string) => {
    requireConfigured();
    const {data,error} = await supabase.auth.signUp({email,password});
    if(error)throw new Error(error.message);
    // The database creates an author profile; no browser-provided staff role is accepted.
    if(data.session && data.user) {await fetchProfile(data.user.id,data.user.email || email);router.push(destination());return true;}
    return false;
  };
  const logout = async()=>{
    const {error} = await supabase.auth.signOut();
    if(error)throw new Error(error.message);
    setUser(null);router.push('/login');
  };
  return <AuthContext.Provider value={{user,ready,login,register,logout,isSupabaseConfigured}}>{children}</AuthContext.Provider>;
};
export const useAuth = ()=>useContext(AuthContext);
