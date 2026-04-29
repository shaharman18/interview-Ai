import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { handleForgotPassword, handleResetPassword, loading, error, setError } = useAuth();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [data, setData] = useState({
        email: "",
        otp: "",
        newPassword: ""
    });
    const [successMessage, setSuccessMessage] = useState("");

    const handleInput = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const onRequestOTP = async (e) => {
        e.preventDefault();
        const success = await handleForgotPassword(data.email);
        if (success) {
            setStep(2);
        }
    };

    const onReset = async (e) => {
        e.preventDefault();
        const success = await handleResetPassword(data.email, data.otp, data.newPassword);
        if (success) {
            setSuccessMessage("Password reset successfully. Redirecting to sign in...");
            setTimeout(() => navigate("/login"), 3000);
        }
    };

    return (
        <main className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-4 relative overflow-hidden font-outfitSelection">
            {/* Multi-layered Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-600/[0.03] blur-[180px] rounded-full"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-600/[0.03] blur-[180px] rounded-full"></div>

            <div className="w-full max-w-lg bg-[#111827]/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-8 sm:p-16 shadow-3xl animate-in fade-in zoom-in-95 duration-700 relative z-10">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-3xl border border-red-500/20 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/10 transition-transform hover:rotate-12">
                        <ShieldAlertIcon />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter italic">
                        {step === 1 ? 'Reset Password' : 'Create New Password'}
                    </h1>
                    <p className="text-gray-600 mt-2 font-medium">
                        {step === 1 ? "Enter your email to receive a reset code." : `A reset code has been sent to ${data.email}`}
                    </p>
                </div>

                <form onSubmit={step === 1 ? onRequestOTP : onReset} className="space-y-8">
                    {step === 1 ? (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 ml-1">Email Address</label>
                            <input 
                                value={data.email} 
                                onChange={handleInput} 
                                type="email" 
                                name="email" 
                                required
                                className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 text-sm font-semibold outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all placeholder:text-gray-800" 
                                placeholder="name@domain.com" 
                            />
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[4px] text-gray-500 text-center block w-full">Reset Code</label>
                                <input 
                                    value={data.otp} 
                                    onChange={handleInput} 
                                    type="text" 
                                    name="otp" 
                                    maxLength="6"
                                    required
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-4xl text-center font-black tracking-[12px] text-red-500 outline-none focus:border-red-500 transition-all placeholder:text-gray-800" 
                                    placeholder="000000" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-600 ml-1">New Password (8+ Chars)</label>
                                <input 
                                    value={data.newPassword} 
                                    onChange={handleInput} 
                                    type="password" 
                                    name="newPassword" 
                                    required
                                    minLength="8"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl p-5 text-sm font-semibold outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all placeholder:text-gray-800" 
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-wide p-5 rounded-3xl flex items-center gap-4 animate-shake">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-500/5 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-wide p-5 rounded-3xl flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            {successMessage}
                        </div>
                    )}

                    {!successMessage && (
                        <button 
                            disabled={loading}
                            className={`w-full py-6 rounded-3xl font-black uppercase tracking-[3px] text-xs transition-all duration-500 shadow-2xl active:scale-[0.98] ${
                                loading 
                                ? 'bg-gray-900 text-gray-700 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-red-500/20'
                            }`}
                            type="submit"
                        >
                            {loading ? 'Processing...' : (step === 1 ? 'Send Code' : 'Reset Password')}
                        </button>
                    )}
                </form>

                <div className="mt-12 text-center">
                    <NavLink to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-all flex items-center justify-center gap-3">
                        <ArrowLeftIcon /> Back to Sign In
                    </NavLink>
                </div>
            </div>
        </main>
    );
};

// Icons Re-themed
const ShieldAlertIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);

export default ForgotPassword;
