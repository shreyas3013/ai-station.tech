import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signUp, signInWithMagicLink, resetPassword } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'forgot';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/chat');
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccess('Check your email to confirm your account.');
      } else {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccess('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) { setError('Enter your email first'); return; }
    setError(''); setLoading(true);
    try {
      const { error } = await signInWithMagicLink(email);
      if (error) throw error;
      setSuccess('Magic link sent! Check your email.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-heading font-bold text-foreground mb-2">🚉 AI STATION</h1>
          <p className="font-station text-sm text-muted-foreground">UNIFIED AI PLATFORM — ALL MODELS, ONE INTERFACE</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <h2 className="text-lg font-heading font-semibold text-foreground">
                {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
              </h2>

              <div>
                <label className="text-xs font-station text-muted-foreground">EMAIL</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="text-xs font-station text-muted-foreground">PASSWORD</label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required minLength={6}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="text-xs text-destructive">{error}</p>}
              {success && <p className="text-xs text-accent">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
              </button>

              {mode === 'signin' && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground font-station">OR</span></div>
                  </div>
                  <button type="button" onClick={handleMagicLink} disabled={loading}
                    className="w-full py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors disabled:opacity-50">
                    Send Magic Link ✨
                  </button>
                </>
              )}

              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                {mode === 'signin' ? (
                  <>
                    <button type="button" onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} className="hover:text-foreground">Create account</button>
                    <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} className="hover:text-foreground">Forgot password?</button>
                  </>
                ) : (
                  <button type="button" onClick={() => { setMode('signin'); setError(''); setSuccess(''); }} className="hover:text-foreground">← Back to Sign In</button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;