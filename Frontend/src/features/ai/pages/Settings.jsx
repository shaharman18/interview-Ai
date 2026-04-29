import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useInterview } from '../hooks/useInterview';

const Settings = () => {
    const navigate = useNavigate();
    const { user, handleLogout, handleUpdateProfile } = useAuth();
    const { getHistory, reports, loading: historyLoading } = useInterview();

    const [editedName, setEditedName] = useState(user?.username || '');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    useEffect(() => {
        if (user) {
            setEditedName(user.username);
        }
    }, [user]);

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        const updated = await handleUpdateProfile(editedName, user.email);
        if (updated) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
        setIsUpdating(false);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B1120]' : 'bg-gray-50'} flex flex-col items-center relative overflow-x-hidden transition-colors duration-500 font-outfitSelection`}>
            
            {/* Global Navbar - Fixed and responsive */}
            <nav className={`fixed top-0 left-0 right-0 h-20 ${isDarkMode ? 'bg-[#0B1120]/80 border-white/5 text-white' : 'bg-white/80 border-gray-200 text-gray-900'} backdrop-blur-2xl border-b z-[100] flex items-center justify-between px-4 sm:px-12`}>
                <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-pink-500/30 group-hover:scale-105 transition-transform italic">A</div>
                    <span className="font-black text-base sm:text-xl tracking-tighter truncate max-w-[120px] sm:max-w-none">
                        Interview<span className="text-pink-500">AI</span>
                    </span>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border ${isDarkMode ? 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'} transition-all duration-300 font-black text-[10px] sm:text-xs uppercase tracking-widest`}
                >
                    <HomeIcon /> 
                    <span>Dashboard</span>
                </button>
            </nav>

            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {isDarkMode ? (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/5 blur-[150px] rounded-full animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full animate-pulse"></div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
                )}
            </div>

            <main className="w-full max-w-7xl pt-32 p-4 sm:p-12 relative z-10 flex flex-col items-center">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    
                    {/* Main Settings Column */}
                    <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h1 className={`text-4xl sm:text-5xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h1>
                                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1 font-medium text-sm`}>Manage your account information and theme</p>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[2px] self-start sm:self-auto ${isDarkMode ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' : 'bg-pink-100 text-pink-600 border border-pink-200'}`}>
                                Account Verified
                            </div>
                        </div>

                        {/* Profile Card */}
                        <div className={`${isDarkMode ? 'bg-[#111827]/40 border-white/5 ring-1 ring-white/5 shadow-3xl' : 'bg-white border-gray-100 text-gray-900 shadow-xl'} backdrop-blur-3xl border rounded-[40px] overflow-hidden transition-all duration-500`}>
                            <div className="h-28 sm:h-32 bg-gradient-to-r from-pink-600/20 via-violet-600/10 to-transparent relative">
                                <div className="absolute -bottom-12 left-6 sm:left-10 p-1.5 bg-[#0B1120] rounded-[32px] ring-4 ring-[#0B1120]">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] bg-gradient-to-br from-pink-600 to-violet-600 flex items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-2xl shadow-pink-600/40">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 p-6 sm:p-10">
                                <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                        <div className="space-y-3">
                                            <label className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Your Name</label>
                                            <input 
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className={`w-full p-4 sm:p-5 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/50 transition-all font-bold text-sm`}
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className={`text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Email Address</label>
                                                <span className="flex items-center gap-1 text-[8px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 uppercase">
                                                    <VerifiedIcon /> Active
                                                </span>
                                            </div>
                                            <div className="relative group">
                                                <input 
                                                    type="email"
                                                    value={user?.email || ''}
                                                    readOnly
                                                    className={`w-full p-4 sm:p-5 rounded-3xl border cursor-not-allowed ${isDarkMode ? 'bg-white/[0.02] border-white/5 text-gray-600' : 'bg-gray-100 border-gray-200 text-gray-400'} transition-all font-bold text-sm italic`}
                                                />
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700">
                                                    <LockIcon />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {message.text && (
                                        <div className={`p-4 sm:p-5 rounded-3xl text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                                            {message.text}
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                                        <button 
                                            type="submit"
                                            disabled={isUpdating}
                                            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pink-600 to-violet-600 rounded-2xl sm:rounded-3xl text-white font-black text-[10px] sm:text-xs uppercase tracking-[3px] shadow-2xl shadow-pink-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 active:scale-95"
                                        >
                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <p className="text-[10px] text-gray-600 sm:max-w-xs font-medium leading-relaxed italic order-first sm:order-none">Your name will be used in your interview reports.</p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Secondary Toggles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div className={`${isDarkMode ? 'bg-[#111827]/40 border-white/5' : 'bg-white border-gray-100 text-gray-900 shadow-xl'} backdrop-blur-xl border rounded-[32px] p-6 lg:p-8 group hover:border-pink-500/30 transition-all`}>
                                <h2 className="text-[10px] font-black uppercase tracking-[3px] mb-6 flex items-center gap-3 text-gray-500">
                                    <AppearanceIcon /> Appearance
                                </h2>
                                <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-black/10' : 'bg-gray-50'} rounded-2xl border border-white/5`}>
                                    <span className="text-xs font-black uppercase tracking-tight opacity-70">{isDarkMode ? 'Dark' : 'Light'}</span>
                                    <button 
                                        onClick={toggleTheme}
                                        className={`w-14 h-8 rounded-full relative transition-all duration-500 ${isDarkMode ? 'bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.3)]' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 ${isDarkMode ? 'right-1 scale-100' : 'left-1 scale-90'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <div className={`${isDarkMode ? 'bg-[#111827]/40 border-white/5' : 'bg-white border-gray-100 text-gray-900 shadow-xl'} backdrop-blur-xl border rounded-[32px] p-6 lg:p-8 flex flex-col justify-center gap-4`}>
                                <h2 className="text-[10px] font-black uppercase tracking-[3px] flex items-center gap-3 text-gray-500">
                                    <SecurityIcon /> Security
                                </h2>
                                <button className={`w-full py-4 rounded-xl border ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-gray-50'} transition-all text-[10px] font-black uppercase tracking-widest opacity-40 cursor-not-allowed`}>
                                    Key Settings (Coming Soon)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Sidebar (Responsive) */}
                    <div className="space-y-8 lg:block overflow-hidden">
                        <div className={`${isDarkMode ? 'bg-[#111827]/60 border-white/5 z-0 shadow-3xl' : 'bg-white border-gray-100 text-gray-900 shadow-xl'} backdrop-blur-3xl border rounded-[40px] p-8 flex flex-col h-full lg:sticky lg:top-28 transition-all duration-500`}>
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                                <h2 className="text-xl font-black italic tracking-tighter">Recent Interviews</h2>
                                <button onClick={() => navigate('/history')} className="text-[9px] px-3 py-1 bg-pink-500/10 text-pink-500 border border-pink-500/20 rounded-full font-black uppercase tracking-widest hover:bg-pink-500/20 transition-all">View All</button>
                            </div>

                            <div className="flex-1 space-y-7 px-1 custom-scrollbar overflow-y-auto max-h-[400px] lg:max-h-none">
                                {historyLoading ? (
                                    <div className="py-10 text-center flex flex-col items-center gap-4">
                                        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">Loading...</span>
                                    </div>
                                ) : reports && reports.length > 0 ? (
                                    reports.slice(0, 4).map((report, idx) => (
                                        <div 
                                            key={report._id}
                                            onClick={() => navigate(`/interview/${report._id}`)}
                                            className={`group relative pl-6 border-l-2 ${idx === 0 ? 'border-pink-500' : 'border-white/5'} pb-1 cursor-pointer transition-all`}
                                        >
                                            <div className={`absolute -left-[7px] top-0 w-3 h-3 rounded-full ${idx === 0 ? 'bg-pink-500 shadow-[0_0_10px_rgba(219,39,119,0.5)]' : 'bg-[#1F2937]'}`}></div>
                                            <div className="text-[8px] uppercase font-black text-gray-600 mb-1 group-hover:text-pink-500 transition-colors">{new Date(report.createdAt).toLocaleDateString()}</div>
                                            <div className={`font-bold text-[13px] line-clamp-2 leading-[1.4] transition-colors ${isDarkMode ? 'text-white group-hover:text-pink-400' : 'text-gray-900 group-hover:text-pink-600'}`}>{report.jobDescription}</div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500" style={{ width: `${report.matchScore}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-black text-pink-500 italic shrink-0">{report.matchScore}% Score</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-gray-700 italic text-[10px] font-black uppercase tracking-widest opacity-30">No recent activity</div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <div className="bg-gradient-to-br from-pink-600 to-violet-700 rounded-[32px] p-8 text-center shadow-3xl shadow-pink-600/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity translate-x-full group-hover:translate-x-0 duration-1000"></div>
                                    <div className="text-5xl font-black text-white mb-2 relative italic tracking-tighter">{reports?.length || 0}</div>
                                    <div className="text-[9px] uppercase font-black text-white/50 tracking-[3px] relative">Total Interviews</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Session Terminate (Footer style) */}
                <div className="w-full max-w-5xl mt-16 px-0 animate-in slide-in-from-bottom-8 duration-700">
                    <div className={`${isDarkMode ? 'bg-[#111827]/40 border-white/5' : 'bg-gray-100 border-gray-200'} rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative`}>
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20"></div>
                        <div className="flex items-center gap-4 text-gray-500">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600"><SecurityIcon /></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[3px]">Privacy & Data</span>
                                <span className="text-xs text-gray-700 font-medium">We keep your information private and secure.</span>
                            </div>
                        </div>
                        <button 
                            onClick={onLogout}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl sm:rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[3px] group shadow-2xl active:scale-95"
                        >
                            <LogoutIcon /> 
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Sub-Icons
const HomeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const AppearanceIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);
const SecurityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const VerifiedIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

export default Settings;
