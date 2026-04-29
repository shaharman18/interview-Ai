import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin, loading, error, setError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleFormData = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        const success = await handleLogin(email, password);
        if (success) navigate("/");
    }

    return ( 
        <main className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-4 relative overflow-hidden font-outfitSelection">
            {/* High-End Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-600/10 blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[180px] rounded-full"></div>

            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-[#111827]/40 backdrop-blur-3xl border border-white/5 rounded-[48px] overflow-hidden shadow-3xl animate-in fade-in zoom-in-95 duration-700 relative z-10">
                
                {/* Visual Side (LHS) */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-pink-600/20 via-violet-600/10 to-transparent relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent)]"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-10 border border-white/10 group-hover:rotate-6 transition-transform">
                            <span className="text-xl font-black italic">A</span>
                        </div>
                        <h2 className="text-5xl font-black leading-[1.1] tracking-tighter italic">
                            Redefining <br/> 
                            <span className="text-pink-500">Interview</span> <br/> 
                            Preparation.
                        </h2>
                        <p className="mt-6 text-gray-500 font-medium max-w-xs leading-relaxed italic">
                            "The best way to predict the future is to create it. Prepare for your next role with confidence."
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B1120] bg-gray-800 flex items-center justify-center text-[10px] font-black">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[2px] text-gray-600">Joined by 2,000+ candidates</div>
                    </div>
                </div>

                {/* Form Side (RHS) */}
                <div className="p-8 sm:p-16 lg:p-20 flex flex-col justify-center">
                    <div className="mb-12">
                        <div className="lg:hidden w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-6 font-black italic">A</div>
                        <h1 className="text-4xl font-black tracking-tighter italic">Welcome Back</h1>
                        <p className="text-gray-600 mt-2 font-medium">Log in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 ml-1">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                required
                                value={formData.email} 
                                onChange={handleFormData}
                                className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 text-sm font-semibold outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 transition-all placeholder:text-gray-800" 
                                placeholder="name@domain.com" 
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 ml-1">Password</label>
                                <NavLink to="/forgot-password" size="sm" className="text-[10px] text-gray-600 hover:text-pink-500 font-black uppercase tracking-widest transition-colors">Forgot?</NavLink>
                            </div>
                            <div className="relative group">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    required
                                    value={formData.password} 
                                    onChange={handleFormData}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 pr-14 text-sm font-semibold outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 transition-all placeholder:text-gray-800" 
                                    placeholder="••••••••" 
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-wide p-5 rounded-3xl flex items-center gap-4 animate-shake">
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                {error}
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            className={`w-full py-6 rounded-3xl font-black uppercase tracking-[3px] text-xs transition-all duration-500 shadow-2xl active:scale-[0.98] ${
                                loading 
                                ? 'bg-gray-900 text-gray-700 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-pink-600 to-violet-600 hover:shadow-pink-500/20'
                            }`}
                            type="submit"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-600 text-xs font-medium">
                            New here? 
                            <NavLink to="/register" className="text-pink-500 hover:underline font-black ml-2 uppercase tracking-widest text-[10px]">Create Account</NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2.1 11.83s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
);

export default Login
