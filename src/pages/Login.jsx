import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Owner');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Load registered users from localStorage
    const users = JSON.parse(localStorage.getItem('auth_users') || '[]');
    
    // Check default or registered user
    const defaultUser = email === 'admin@apex.com' && password === 'admin123';
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (defaultUser || foundUser) {
      const sessionUser = {
        name: foundUser ? foundUser.name : 'Vikram Malhotra',
        email: email,
        role: foundUser ? foundUser.role : role
      };
      
      localStorage.setItem('active_session', JSON.stringify(sessionUser));
      navigate('/');
      window.location.reload(); // refresh to load state from session
    } else {
      setError('Invalid email address or password credentials.');
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#1E1B4B] via-[#311042] to-[#0F0E17] flex items-center justify-center p-4 select-none font-sans overflow-hidden relative">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Login Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl rounded-3xl p-8 max-w-sm w-full space-y-6 relative z-10 transition-all hover:border-white/20">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-lg shadow-indigo-500/30">
            %
          </div>
          <h2 className="text-white font-black tracking-tight text-xl">APEX GST BILLING</h2>
          <p className="text-[10px] font-bold text-indigo-200 tracking-wider uppercase">Portal Access Control</p>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/20 p-3 rounded-xl flex items-start gap-2.5 text-rose-200 text-[10.5px] leading-snug">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold text-slate-200">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-[9.5px] font-bold text-indigo-200 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-indigo-300/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@apex.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent text-white font-medium placeholder-indigo-300/30 transition-all text-xs"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[9.5px] font-bold text-indigo-200 uppercase tracking-widest block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-indigo-300/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-transparent text-white font-medium placeholder-indigo-300/30 transition-all text-xs"
              />
            </div>
          </div>

          {/* Role Choice */}
          <div className="space-y-1">
            <label className="text-[9.5px] font-bold text-indigo-200 uppercase tracking-widest block">Login Role</label>
            <div className="grid grid-cols-2 gap-2 p-0.5 bg-white/5 rounded-xl border border-white/5 text-[11px]">
              <button
                type="button"
                onClick={() => setRole('Owner')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  role === 'Owner' ? 'bg-white/20 text-white shadow-xs' : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                Owner Role
              </button>
              <button
                type="button"
                onClick={() => setRole('Staff')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  role === 'Staff' ? 'bg-white/20 text-white shadow-xs' : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                Staff Role
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-xs mt-2"
          >
            Authenticate Session
          </button>

        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-indigo-200/50">
            Don't have a business account?{' '}
            <Link to="/register" className="text-indigo-300 font-bold hover:underline">
              Register now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
