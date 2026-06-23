import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ShieldAlert } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Owner');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input checks
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('auth_users') || '[]');
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
      setError('This email address is already registered.');
      return;
    }

    const newUser = {
      id: `u-${Date.now()}`,
      businessName,
      name: ownerName,
      email,
      password,
      role
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('auth_users', JSON.stringify(users));

    // Seed profile settings dynamically
    const profile = {
      name: businessName,
      gstin: "07" + Math.random().toString(36).substring(2, 11).toUpperCase() + "1Z1",
      email: email,
      phone: "+91 99887 76655",
      address: "India Headquarters",
      state: "Delhi",
      stateCode: "07",
      currency: "INR"
    };
    localStorage.setItem('business_profile', JSON.stringify(profile));

    setSuccess('Registration successful! Redirecting to login page...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#1E1B4B] via-[#311042] to-[#0F0E17] flex items-center justify-center p-4 select-none font-sans overflow-hidden relative">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Registration Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl rounded-3xl p-8 max-w-sm w-full space-y-5 relative z-10 transition-all hover:border-white/20">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white font-extrabold text-lg mx-auto shadow-lg shadow-indigo-500/30">
            %
          </div>
          <h2 className="text-white font-black tracking-tight text-xl leading-none mt-2">Create Account</h2>
          <p className="text-[9px] font-bold text-indigo-255 text-indigo-200 tracking-wider uppercase mt-1">Register your Business</p>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/20 p-2.5 rounded-xl flex items-start gap-2 text-rose-200 text-[10px] leading-snug">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/15 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-305 text-emerald-300 text-[10px] font-bold text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-semibold text-slate-200">
          
          {/* Business Name */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest block">Business / Company Name</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-2.5 w-4 h-4 text-indigo-300/60" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Apex Electronics Ltd"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white placeholder-indigo-300/30 text-xs font-medium"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest block">Owner / Contact Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-2.5 w-4 h-4 text-indigo-300/60" />
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Vikram Malhotra"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white placeholder-indigo-300/30 text-xs font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-indigo-300/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@apex.com"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white placeholder-indigo-300/30 text-xs font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-indigo-300/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white placeholder-indigo-300/30 text-xs font-medium"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-0.5">
            <label className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest block">Select Default Role</label>
            <div className="grid grid-cols-2 gap-2 p-0.5 bg-white/5 rounded-xl border border-white/5 text-[11px]">
              <button
                type="button"
                onClick={() => setRole('Owner')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  role === 'Owner' ? 'bg-white/20 text-white shadow-xs' : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => setRole('Staff')}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  role === 'Staff' ? 'bg-white/20 text-white shadow-xs' : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                Staff
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-xs mt-3.5"
          >
            Create Company Account
          </button>

        </form>

        <div className="text-center pt-1.5">
          <p className="text-[10px] text-indigo-200/50">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-300 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
