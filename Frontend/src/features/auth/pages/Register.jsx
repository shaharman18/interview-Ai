import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const { handleRegister, handleSendOTP, loading, error, setError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [userdata, setUserdata] = useState({
        username: "",
        email: "",
        password: "",
        otp: ""
    });

    const handleFormData = (e) => {
        setUserdata((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (error) setError(null);
    }

    const onSendOTP = async (e) => {
        e.preventDefault();
        const success = await handleSendOTP(userdata.email);
        if (success) {
            setStep(2);
        }
    }

    const onRegister = async (e) => {
        e.preventDefault();
        const success = await handleRegister(userdata.username, userdata.email, userdata.password, userdata.otp);
        if (success) {
            navigate("/");
        }
    }

    return (
        <main className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-4 relative overflow-hidden font-outfitSelection">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[180px] rounded-full"></div>

            <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-[#111827]/40 backdrop-blur-3xl border border-white/5 rounded-[48px] overflow-hidden shadow-3xl animate-in fade-in zoom-in-95 duration-700 relative z-10">
                
                {/* Visual Side (LHS) */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-violet-600/20 via-pink-600/10 to-transparent relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent)]"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-10 border border-white/10 group-hover:rotate-6 transition-transform">
                            <span className="text-xl font-black italic">A</span>
                        </div>
                        <h2 className="text-5xl font-black leading-[1.1] tracking-tighter italic text-white/90">
                            The Future of <br/> 
                            <span className="text-violet-500">Interview</span> <br/> 
                            Preparation.
                        </h2>
                        <p className="mt-6 text-gray-500 font-medium max-w-xs leading-relaxed italic">
                            "Success favors the prepared. Join the elite network of developers mastering their narrative."
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <ShieldIcon />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Your data is secure and private</div>
                        </div>
                    </div>
                </div>

                {/* Form Side (RHS) */}
                <div className="p-8 sm:p-16 lg:p-20 flex flex-col justify-center">
                    <div className="mb-12">
                        <div className="lg:hidden w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-6 font-black italic">A</div>
                        <h1 className="text-4xl font-black tracking-tighter italic">
                            {step === 1 ? 'Create Account' : 'Verify Your Email'}
                        </h1>
                        <p className="text-gray-600 mt-2 font-medium">
                            {step === 1 ? 'Start your interview preparation today' : `We've sent a code to ${userdata.email}`}
                        </p>
                    </div>

                    <form onSubmit={step === 1 ? onSendOTP : onRegister} className="space-y-6">
                        {step === 1 ? (
                            <>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 ml-1">Full Name</label>
                                    <input 
                                        value={userdata.username} 
                                        onChange={handleFormData} 
                                        type="text" 
                                        name="username" 
                                        required
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 text-sm font-semibold outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all placeholder:text-gray-800" 
                                        placeholder="johndoe_dev" 
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 ml-1">Email Address</label>
                                    <input 
                                        value={userdata.email} 
                                        onChange={handleFormData} 
                                        type="email" 
                                        name="email" 
                                        required
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 text-sm font-semibold outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all placeholder:text-gray-800" 
                                        placeholder="name@domain.com" 
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 ml-1">Password</label>
                                    <div className="relative group">
                                        <input 
                                            value={userdata.password} 
                                            onChange={handleFormData} 
                                            type={showPassword ? "text" : "password"} 
                                            name="password" 
                                            required
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 pr-14 text-sm font-semibold outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all placeholder:text-gray-800" 
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
                            </>
                        ) : (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 text-center block w-full">Enter Verification Code</label>
                                    <div className="relative group">
                                        <input 
                                            value={userdata.otp} 
                                            onChange={handleFormData} 
                                            type="text" 
                                            name="otp" 
                                            maxLength="6"
                                            required
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-4xl text-center font-black tracking-[12px] text-violet-500 outline-none focus:border-violet-500 transition-all placeholder:text-gray-800" 
                                            placeholder="000000" 
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)}
                                    className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors block mx-auto underline underline-offset-8"
                                >
                                    Change Details
                                </button>
                            </div>
                        )}

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
                                : 'bg-gradient-to-r from-violet-600 to-pink-600 hover:shadow-violet-500/20'
                            }`}
                            type="submit"
                        >
                            {loading ? 'Creating Account...' : (step === 1 ? 'Send Code' : 'Complete Sign Up')}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-gray-600 text-xs font-medium">
                            Already have an account? 
                            <NavLink to="/login" className="text-violet-500 hover:underline font-black ml-2 uppercase tracking-widest text-[10px]">Sign In</NavLink>
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

const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
);

export default Register;
