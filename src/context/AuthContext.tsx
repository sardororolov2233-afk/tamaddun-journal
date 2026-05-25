"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export type Role = 'admin' | 'author' | 'reviewer';

interface User {
  id?: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role, password?: string) => Promise<void>;
  register: (email: string, role: Role, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  isSupabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isSupabaseConfigured: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // Check if Supabase is properly configured
  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'));

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email!);
        } else {
          setIsReady(true);
        }
      });

      // 2. Listen to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email!);
        } else {
          setUser(null);
          setIsReady(true);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Fallback: Local Storage Mock if Supabase is not configured
      const savedUser = localStorage.getItem('gjir_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsReady(true);
    }
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setUser({
        id: userId,
        email: data.email || email,
        name: data.full_name || email.split('@')[0],
        role: data.role as Role
      });
    } else {
      // Fallback if profile not created yet
      setUser({ id: userId, email, name: email.split('@')[0], role: 'author' });
    }
    setIsReady(true);
  };

  const register = async (email: string, role: Role, password = 'password123') => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert([
          { id: data.user.id, email, full_name: email.split('@')[0], role }
        ]);
        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        router.push('/dashboard');
      }
    } else {
      // Mock logic
      const newUser = { id: Date.now().toString(), name: email.split('@')[0], email, role };
      setUser(newUser);
      localStorage.setItem('gjir_user', JSON.stringify(newUser));
      router.push('/dashboard');
    }
  };

  const login = async (email: string, role: Role, password = 'password123') => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert("Xatolik: " + error.message);
        return;
      }
      router.push('/dashboard');
    } else {
      // Mock logic
      const newUser = { id: Date.now().toString(), name: email.split('@')[0], email, role };
      setUser(newUser);
      localStorage.setItem('gjir_user', JSON.stringify(newUser));
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('gjir_user');
    router.push('/login');
  };

  if (!isReady) return null;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
