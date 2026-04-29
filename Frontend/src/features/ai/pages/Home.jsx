import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview';
import { useAuth } from '../../auth/hooks/useAuth';

const Home = () => {
    const navigate = useNavigate();
    const { handleLogout, user } = useAuth();
    const { createInterview, tailorResume, reports, loading, error: apiError } = useInterview();

    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [resume, setResume] = useState(null);
    const [localError, setLocalError] = useState('');
    const [tailoredData, setTailoredData] = useState(null);
    const [showTailoredModal, setShowTailoredModal] = useState(false);

    const handleTailor = useCallback(async () => {
        if (!jobDescription) {
            setLocalError('Job description is mandatory for tailoring.');
            return;
        }
        if (!resume && !selfDescription) {
            setLocalError('Upload a resume or describe your profile.');
            return;
        }

        setLocalError('');
        const formData = new FormData();
        formData.append('jobDescription', jobDescription);
        formData.append('selfDescription', selfDescription);
        if (resume) formData.append('resume', resume);

        try {
            const data = await tailorResume(formData);
            if (data) {
                setTailoredData(data);
                setShowTailoredModal(true);
            }
        } catch (err) {}
    }, [jobDescription, resume, selfDescription, tailorResume]);

    const handleGenerate = useCallback(async () => {
        if (!jobDescription || (!resume && !selfDescription)) {
            setLocalError('All inputs are required for full strategy generation.');
            return;
        }

        setLocalError('');
        const formData = new FormData();
        formData.append('jobDescription', jobDescription);
        formData.append('selfDescription', selfDescription);
        if (resume) formData.append('resume', resume);

        try {
            const interview = await createInterview(formData);
            if (interview?._id) navigate(`/interview/${interview._id}`);
        } catch (err) {}
    }, [jobDescription, resume, selfDescription, createInterview, navigate]);

    const onLogout = useCallback(async () => {
        await handleLogout();
        navigate('/login');
    }, [handleLogout, navigate]);

    const displayError = useMemo(() => localError || apiError, [localError, apiError]);

    return (
        <main className="min-h-screen bg-[#0B1120] text-white flex flex-col items-center relative overflow-hidden font-outfitSelection">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full"></div>

            {/* Tailored Resume Modal */}
            {showTailoredModal && tailoredData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 backdrop-blur-2xl bg-[#0B1120]/80">
                    <div className="bg-[#111827] border border-white/10 w-full max-w-5xl h-[85vh] rounded-[40px] shadow-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-pink-500/10 via-transparent to-violet-500/10">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                                    <MagicIcon /> Resume Improvement Plan
                                </h3>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-[2px]">Professional Strategy Map</p>
                            </div>
                            <button onClick={() => setShowTailoredModal(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:rotate-90 transition-all duration-300">
                                <CloseIcon />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                            {/* Summary */}
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center font-black text-xs">01</div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest">Personal Statement</h4>
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-500/5 to-transparent rounded-[32px] p-8 border border-white/5 relative group">
                                        <div className="absolute top-4 right-6 opacity-10 group-hover:opacity-30 transition-opacity"><QuoteIcon /></div>
                                        <p className="text-gray-300 text-lg leading-relaxed font-medium italic">"{tailoredData.optimizedSummary}"</p>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center font-black text-xs">02</div>
                                        <h4 className="text-white font-black text-sm uppercase tracking-widest">Skill Match Analysis</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tailoredData.keySkills.map((s, idx) => (
                                            <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-violet-500/30 transition-all group">
                                                <div className="font-black text-white mb-2 group-hover:text-violet-400 transition-colors uppercase text-xs tracking-wider">{s.skill}</div>
                                                <div className="text-sm text-gray-400 leading-relaxed font-medium">{s.alignment}</div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-gradient-to-br from-blue-500/10 to-transparent p-10 rounded-[40px] border border-blue-500/20">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                                        <div>
                                            <h4 className="text-blue-400 font-extrabold text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></div>
                                                Professional Resume Code
                                            </h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ready for PDF Export</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => { navigator.clipboard.writeText(tailoredData.latexCode); }} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all">Copy Source</button>
                                            <button className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-105 transition-all">Open Overleaf</button>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                                        <pre className="text-[10px] font-mono text-blue-400/70 overflow-x-auto max-h-60 custom-scrollbar leading-relaxed">
                                            {tailoredData.latexCode}
                                        </pre>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-[#0B1120]/50 flex justify-center">
                            <button onClick={() => setShowTailoredModal(false)} className="px-12 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest border border-white/10 transition-all">Dismiss Strategy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0B1120]/80 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-8 sm:px-12">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-2xl shadow-pink-500/20 group-hover:rotate-6 transition-transform">A</div>
                    <span className="font-black text-xl tracking-tighter text-white">Interview<span className="text-pink-500">AI</span></span>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-6">
                    <button onClick={() => navigate('/history')} className="p-3 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"><HistoryIcon /></button>
                    <button onClick={() => navigate('/settings')} className="p-3 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all"><SettingsIcon /></button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <button onClick={onLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Logout</button>
                </div>
            </nav>

            {/* Content Area */}
            <div className="mt-32 w-full max-w-7xl px-4 sm:px-10 pb-20">
                {/* Hero Header */}
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/5 border border-pink-500/10 text-pink-500 text-[10px] font-black uppercase tracking-[3px] mb-4">
                        <ActivityIcon /> Interview Helper
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
                        Dominate Your Next <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500">Career Goals.</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Expert tools to help you land your dream job by analyzing your experience.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left: Inputs */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[48px] p-8 sm:p-12 shadow-3xl group transition-all hover:border-pink-500/20">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black italic tracking-tighter">Job Details</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Paste the job description</p>
                                </div>
                                <div className="text-[10px] font-mono text-gray-600 px-3 py-1 bg-white/5 rounded-full">{jobDescription.length} chars</div>
                            </div>
                            <div className="relative h-96 group">
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the full job description here... (Responsibilities, Requirements, Tech Stack)"
                                    className="w-full h-full bg-white/[0.02] border border-white/5 rounded-[32px] p-8 text-sm text-gray-300 outline-none focus:border-pink-500/50 transition-all resize-none font-medium leading-relaxed custom-scrollbar placeholder:text-gray-700"
                                />
                                <div className="absolute inset-x-8 -bottom-4 h-8 bg-[#111827] blur-xl opacity-50"></div>
                            </div>
                        </div>

                        {/* Stats / Badges (Industry feel) */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: 'Interviews', value: reports?.length || 0, icon: <LayoutIcon/> },
                                { label: 'Success Rate', value: '94%', icon: <TrendsIcon/> },
                                { label: 'Feedback', value: 'Expert', icon: <PulseIcon/> }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px] flex flex-col items-center justify-center gap-2 group hover:bg-white/[0.04] transition-all">
                                    <div className="text-pink-500/50 group-hover:text-pink-500 transition-colors">{stat.icon}</div>
                                    <div className="text-xl font-black text-white">{stat.value}</div>
                                    <div className="text-[8px] uppercase font-black text-gray-600 tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Profile & Actions */}
                    <div className="lg:col-span-2 space-y-10 flex flex-col justify-start">
                        {/* Profile Input Group */}
                        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[48px] p-8 sm:p-12 shadow-3xl space-y-10">
                            <div>
                                <h2 className="text-2xl font-black italic tracking-tighter mb-6">Tell Us About Yourself</h2>
                                <label className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[40px] cursor-pointer transition-all duration-700 group overflow-hidden ${resume ? 'border-pink-500/50 bg-pink-500/5' : 'border-white/5 hover:border-pink-500/20 bg-white/[0.02]'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {resume ? (
                                        <div className="relative z-10 text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-2xl shadow-pink-500/40 animate-bounce-subtle">
                                                <FileCheckIcon />
                                            </div>
                                            <p className="text-xs font-black text-white truncate max-w-[200px] mb-2">{resume.name}</p>
                                            <button onClick={(e) => { e.preventDefault(); setResume(null); }} className="text-[10px] font-black uppercase text-pink-500 tracking-widest hover:underline">Replace Document</button>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 text-center p-6">
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-500 font-light text-gray-500">
                                                <UploadIcon />
                                            </div>
                                            <p className="text-sm font-black text-gray-400 group-hover:text-white transition-colors">Upload Resume (PDF)</p>
                                            <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-2">Max file size 10MB</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
                                </label>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 ml-2">Experience Highlights</h3>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    placeholder="Briefly describe your key achievements or specific areas you want to highlight..."
                                    className="w-full h-32 bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-sm text-gray-300 outline-none focus:border-violet-500/50 transition-all resize-none placeholder:text-gray-700"
                                />
                            </div>

                            {/* Main CTA */}
                            <div className="space-y-4 pt-4">
                                {displayError && (
                                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{displayError}</span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="w-full py-6 rounded-[32px] bg-gradient-to-r from-pink-600 to-violet-600 text-white font-black uppercase tracking-[3px] text-xs shadow-[0_20px_40px_rgba(219,39,119,0.3)] hover:shadow-[0_25px_50px_rgba(219,39,119,0.4)] hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        {loading ? 'Generating...' : 'Get Interview Questions'}
                                    </button>
                                    <button
                                        onClick={handleTailor}
                                        disabled={loading}
                                        className="w-full py-5 rounded-[32px] bg-white/5 border border-white/5 text-gray-300 font-black uppercase tracking-[3px] text-xs hover:bg-white/10 hover:text-white transition-all disabled:opacity-30"
                                    >
                                        Improve My Resume
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Footer */}
                        <div className="text-center space-y-2 opacity-30">
                            <p className="text-[9px] font-black uppercase tracking-[4px]">Your data is kept private and secure</p>
                            <p className="text-[8px] font-bold text-gray-500">SECURE DATA PROTECTION PROTOCOLS</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

// Industry Standard Icons
const MagicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-2 2-3.8 4-4 2 .2 3.8 2 4 4-.2 2-2 3.8-4 4-2-.2-3.8-2-4-4Z"/><path d="M9 18c.2-2 2-3.8 4-4 2 .2 3.8 2 4 4-.2 2-2 3.8-4 4-2-.2-3.8-2-4-4Z"/><path d="M5 10c.2-2 2-3.8 4-4 2 .2 3.8 2 4 4-.2 2-2 3.8-4 4-2-.2-3.8-2-4-4Z"/></svg>
);
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const QuoteIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.9124 16 5.01697 16H8.01697C8.56925 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56925 8 8.01697 8H5.01697C3.9124 8 3.01697 7.10457 3.01697 6V3H10.017V15C10.017 18.3137 7.33068 21 4.01697 21H3.01697Z"/></svg>
);
const HistoryIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);
const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const ActivityIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
const LayoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const TrendsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 6-6 4 4 8-8"/><polyline points="14 7 21 7 21 14"/></svg>
);
const PulseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1-.7-.7.7"/></svg>
);
const UploadIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const FileCheckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
);

export default Home;