import { supabase } from './supabase';

export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email, password });

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signInWithMagicLink = (email: string) =>
  supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin }
  });

export const signOut = () => supabase.auth.signOut();

export const resetPassword = (email: string) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });