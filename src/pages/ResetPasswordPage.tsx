import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl font-heading font-bold text-foreground text-center mb-6">Reset Password</h1>
        <form onSubmit={handleReset} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs font-station text-muted-foreground">NEW PASSWORD</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={6}
              className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {message && <p className="text-xs text-accent">{message}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;