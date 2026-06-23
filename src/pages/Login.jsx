import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Lock, Mail, Percent } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('owner@apex.com'); // Prepopulated to match reference
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      try {
        apiService.login(email, password);
        navigate('/');
        // Force refresh layout session
        window.location.reload();
      } catch (err) {
        setError(err.message || 'Login failed. Please check credentials.');
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="h-screen w-screen bg-linear-to-tr from-[#EEF2FF] via-[#F5F3FF] to-[#FFF5F5] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/40 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shadow-lg shadow-indigo-200 mx-auto">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Apex GST Invoice</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Billing & Inventory Portal</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold text-slate-655">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[10.5px] font-bold leading-normal">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@apex.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4F46E5] text-slate-800 font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl font-bold shadow-md shadow-indigo-150 transition-all flex items-center justify-center cursor-pointer text-xs"
          >
            {loading ? 'Validating Session...' : 'Sign In'}
          </button>
        </form>

        {/* Action switch */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#4F46E5] hover:underline">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
