import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '../hook/useInterview';
import { useAuth } from '../../auth/hooks/useAuth';

const InterviewPage = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { report, loading, getInterview, tailorResume, error } = useInterview();
    const { handleLogout } = useAuth();
    const [activeSection, setActiveSection] = useState('technical');
    const [showToast, setShowToast] = useState(false);
    
    const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
    const [tailoredData, setTailoredData] = useState(null);
    const [isTailoring, setIsTailoring] = useState(false);

    useEffect(() => {
        getInterview(interviewId);
    }, [interviewId, getInterview]);

    const handleShare = useCallback(() => {
        navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }, []);

    const onLogout = useCallback(async () => {
        await handleLogout();
        navigate('/login');
    }, [handleLogout, navigate]);

    const handleTailorResume = async () => {
        if (!report?.jobDescription) return;
        setIsTailoring(true);
        try {
            const formData = new FormData();
            formData.append('jobDescription', report.jobDescription);
            if (report.resume) formData.append('selfDescription', report.resume); 
            const data = await tailorResume(formData);
            setTailoredData(data);
            setIsTailorModalOpen(true);
        } catch (err) {
            console.error("Tailoring error:", err);
        } finally {
            setIsTailoring(false);
        }
    };

    const handleOpenInOverleaf = () => {
        if (!tailoredData?.latexCode) return;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.overleaf.com/docs';
        form.target = '_blank';
        const snipInput = document.createElement('input');
        snipInput.type = 'hidden';
        snipInput.name = 'snip[]';
        snipInput.value = tailoredData.latexCode;
        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.name = 'snip_name[]';
        nameInput.value = 'main.tex';
        form.appendChild(snipInput);
        form.appendChild(nameInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-pink-500/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                    <span className="text-xs font-black text-gray-500 uppercase tracking-[4px] animate-pulse">Loading Report...</span>
                </div>
            </div>
        );
    }

    if (!report) return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white flex-col gap-6">
            <div className="text-4xl font-black opacity-20 uppercase tracking-tighter italic">Report Unavailable</div>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Go to Dashboard</button>
        </div>
    );

    const navItems = [
        { id: 'technical', label: 'Technical Questions', icon: <CodeIcon />, count: report.technicalQuestions?.length },
        { id: 'behavioral', label: 'Behavioral Questions', icon: <ChatIcon />, count: report.behavioralQuestions?.length },
        { id: 'roadmap', label: 'Preparation Plan', icon: <MapIcon />, count: report.preparationPlan?.length },
    ];

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-100 selection:bg-pink-500/30 font-outfitSelection">
            {/* Ambient Lighting */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row h-screen">
                
                {/* Desktop Sidebar (Industry Navigation) */}
                <aside className="hidden lg:flex w-80 bg-[#111827]/40 backdrop-blur-3xl border-r border-white/5 flex-col p-8">
                    <div className="flex items-center gap-3 mb-16 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center shadow-2xl shadow-pink-500/20 group-hover:scale-110 transition-transform font-black text-xl italic text-white">A</div>
                        <h1 className="text-xl font-black tracking-tighter">Interview<span className="text-pink-500">Report</span></h1>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[3px] mb-6 block">Navigation</label>
                            <nav className="space-y-3">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group ${
                                            activeSection === item.id
                                                ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20 shadow-2xl shadow-pink-500/5'
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <div className={`${activeSection === item.id ? 'text-pink-500' : 'text-gray-600 group-hover:text-gray-400'}`}>{item.icon}</div>
                                        <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                        <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${activeSection === item.id ? 'bg-pink-500 text-white' : 'bg-white/5 text-gray-600 group-hover:bg-white/10'}`}>{item.count}</span>
                                    </button>
                                ))}
                            </nav>
                        </section>

                        <section className="pt-10 border-t border-white/5">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[3px] mb-6 block">Performance Data</label>
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col items-center">
                                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/[0.02]" />
                                        <circle
                                            cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent"
                                            strokeDasharray={364}
                                            strokeDashoffset={364 - (364 * (report.matchScore || 0)) / 100}
                                            className="text-pink-500 transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-3xl font-black italic">{report.matchScore}%</span>
                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Match Score</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 italic text-center leading-relaxed">Score based on how your profile matches this role</p>
                            </div>
                        </section>
                    </div>

                    <div className="mt-auto space-y-4 pt-10 border-t border-white/5">
                        <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-4 px-6 py-4 text-gray-400 hover:text-white transition-all text-sm font-bold"><SettingsIcon /> Settings</button>
                        <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-500/50 hover:text-red-500 transition-all text-sm font-bold"><LogoutIcon /> Logout</button>
                    </div>
                </aside>

                {/* Mobile Navigation (Floating Bottom Bar) */}
                <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-[#111827]/90 backdrop-blur-xl border border-white/10 rounded-3xl z-[60] flex items-center justify-around px-4 shadow-3xl">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeSection === item.id ? 'text-pink-500' : 'text-gray-500'}`}
                        >
                            {item.icon}
                            <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.id}</span>
                        </button>
                    ))}
                    <button onClick={() => navigate('/')} className="flex flex-col items-center p-2 text-gray-500"><HomeIcon /></button>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 sm:p-12 lg:p-16 custom-scrollbar relative">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-16">
                        <div>
                            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-[3px] mb-4">
                                <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
                                <span>/</span>
                                <span className="text-pink-500">REPORT_{interviewId.substring(0, 8)}</span>
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white">
                                {navItems.find(s => s.id === activeSection).label}
                            </h2>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button 
                                onClick={handleTailorResume}
                                disabled={isTailoring}
                                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                                    isTailoring ? 'bg-gray-800 text-gray-500' : 'bg-gradient-to-r from-pink-600 to-violet-600 text-white shadow-pink-500/30 hover:-translate-y-1'
                                }`}
                            >
                                {isTailoring ? 'Improving Resume...' : 'Tailor Resume'}
                            </button>
                            <button onClick={handleShare} className="px-8 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[2px] text-gray-300 hover:bg-white/10 transition-all flex items-center justify-center gap-3">Share Report</button>
                        </div>
                    </div>

                    {/* Notification Toast */}
                    {showToast && (
                        <div className="fixed top-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-pink-600 text-white rounded-2xl font-black text-xs uppercase tracking-[2px] z-[100] shadow-3xl flex items-center gap-4 animate-in slide-in-from-top-10 duration-500">
                            <VerifiedIcon /> Shareable link ready to use
                        </div>
                    )}

                    {/* Scrollable Report Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-32">
                        
                        {/* Content Column */}
                        <div className="lg:col-span-8 space-y-6">
                            {activeSection === 'technical' && report.technicalQuestions?.map((q, idx) => (
                                <InteractiveCard key={idx} number={idx + 1} item={q} color="pink" />
                            ))}
                            {activeSection === 'behavioral' && report.behavioralQuestions?.map((q, idx) => (
                                <InteractiveCard key={idx} number={idx + 1} item={q} color="blue" />
                            ))}
                            {activeSection === 'roadmap' && (
                                <div className="space-y-10">
                                    <div className="p-8 bg-violet-600/5 border border-violet-500/20 rounded-[40px] flex flex-col sm:flex-row items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-violet-600/50">i</div>
                                        <div>
                                            <h4 className="text-xl font-black italic tracking-tight text-white">Preparation Strategy</h4>
                                            <p className="text-sm text-gray-500 font-medium leading-relaxed">This plan focuses on fixing your weak points and improving your core skills found in the job description.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8">
                                        {report.preparationPlan?.map((plan, idx) => (
                                            <TimelineStep key={idx} plan={plan} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Side Info Column (Desktop Only Context) */}
                        <div className="hidden lg:block lg:col-span-4 space-y-10">
                            <section className="bg-[#111827]/40 border border-white/5 p-10 rounded-[48px]">
                                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[3px] mb-10">Skill Gaps</h3>
                                <div className="space-y-6">
                                    {report.skillGaps?.map((gap, idx) => (
                                        <div key={idx} className="group">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-black text-white group-hover:text-pink-500 transition-colors uppercase tracking-tight">{gap.skill}</span>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${gap.severity === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>{gap.severity}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-4">{gap.recommendation}</p>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${gap.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'} opacity-20`} style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-gradient-to-br from-pink-600/5 to-transparent p-10 rounded-[48px] border border-white/5">
                                <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-[3px] mb-6">Expert Advice</h3>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed italic opacity-80">"Success in this role will depend on how effectively you articulate the trade-offs in your previous architectural decisions. Focus on the 'Why' during the tech rounds."</p>
                            </section>
                        </div>
                    </div>

                    {/* Tailor Resume Modal Overlay */}
                    {isTailorModalOpen && tailoredData && (
                        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 backdrop-blur-3xl bg-[#0B1120]/80 animate-in fade-in duration-500">
                             <div className="bg-[#111827] border border-white/10 w-full max-w-5xl h-[85vh] rounded-[40px] shadow-3xl flex flex-col overflow-hidden">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-pink-500/10 to-transparent">
                                    <div>
                                        <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Resume Improvement Plan</h3>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase font-black tracking-[2px]">Resume Optimization Map</p>
                                    </div>
                                    <button onClick={() => setIsTailorModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                                        <CloseIcon />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
                                     <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
                                        <p className="text-lg text-gray-300 italic leading-relaxed font-medium">"{tailoredData.optimizedSummary}"</p>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {tailoredData.suggestedChanges?.map((change, i) => (
                                            <div key={i} className="p-6 bg-white/2 border border-white/5 rounded-3xl hover:border-pink-500/30 transition-all">
                                                <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-3">Refinement Suggestion</div>
                                                <p className="text-xs text-gray-400 font-medium leading-relaxed">{change.optimized}</p>
                                            </div>
                                        ))}
                                     </div>
                                     <section className="bg-blue-600/5 p-10 rounded-[40px] border border-blue-500/20">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-blue-400 font-black text-sm uppercase tracking-widest">Resume Code</h4>
                                            <button onClick={handleOpenInOverleaf} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Open Overleaf</button>
                                        </div>
                                        <pre className="p-6 bg-black/40 rounded-3xl text-[10px] text-blue-400/80 max-h-48 overflow-y-auto custom-scrollbar font-mono leading-relaxed">{tailoredData.latexCode}</pre>
                                     </section>
                                </div>
                             </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// High-Fidelity Sub-components
const InteractiveCard = ({ number, item, color }) => {
    const [open, setOpen] = useState(false);
    const themeClass = color === "pink" ? "text-pink-500 bg-pink-500/10 border-pink-500/20 shadow-pink-500/5" : "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5";

    return (
        <div className={`bg-[#111827]/60 backdrop-blur-xl border rounded-[32px] overflow-hidden transition-all duration-500 ${open ? 'border-white/10 ring-1 ring-white/5 shadow-3xl' : 'border-white/5 hover:border-white/10'}`}>
            <button 
                onClick={() => setOpen(!open)}
                className="w-full text-left p-8 sm:p-10 flex items-start gap-8"
            >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-xs shrink-0 ${themeClass}`}>
                    {number < 10 ? `0${number}` : number}
                </div>
                <div className="flex-1">
                    <h4 className="text-lg sm:text-2xl font-black italic tracking-tight text-white/90 leading-tight group-hover:text-white transition-colors">
                        {item.question}
                    </h4>
                    <div className="mt-4 flex items-center gap-6 opacity-40">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><CircleIcon /> Question Insight</div>
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${open ? 'opacity-0' : 'opacity-100'}`}>Click to see how to answer</div>
                    </div>
                </div>
                <div className={`mt-2 transition-transform duration-500 ${open ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon className="text-gray-600" />
                </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-10 pb-10 flex flex-col gap-8">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
                        <h5 className="text-[10px] font-black text-gray-600 uppercase tracking-[3px] mb-4 flex items-center gap-2">What They're Looking For <InfoIcon /></h5>
                        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed italic opacity-80">"{item.intention}"</p>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-pink-600/5 to-violet-600/5 border border-pink-500/10 rounded-[32px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><QuoteIconSmall /></div>
                        <h5 className="text-[10px] font-black text-pink-500 uppercase tracking-[3px] mb-4">Recommended Answer</h5>
                        <p className="text-sm sm:text-base text-gray-300 font-bold leading-relaxed">{item.answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimelineStep = ({ plan }) => (
    <div className="group flex gap-10">
        <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-center font-black text-xl text-pink-500 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-pink-600/30">
                {plan.day}
            </div>
            <div className="flex-1 w-px bg-white/5 my-4"></div>
        </div>
        <div className="flex-1 pb-16">
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[3px] mb-2 font-mono">Sprint Stage {plan.day}</div>
            <h4 className="text-2xl font-black italic tracking-tighter text-white mb-6 uppercase">{plan.focus}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Array.isArray(plan.tasks) ? plan.tasks : [plan.task]).map((task, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-pink-500/20 transition-all font-medium text-gray-400 text-xs sm:text-sm leading-relaxed">
                        <div className="mt-1 w-2 h-2 rounded-full bg-pink-500 shrink-0 shadow-[0_0_8px_rgba(219,39,119,0.4)]"></div>
                        <span>{task}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Icons
const CodeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);
const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const MapIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
);
const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const SettingsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);
const LogoutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const ChevronDownIcon = ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const VerifiedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const QuoteIconSmall = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500 opacity-20"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.9124 16 5.01697 16H8.01697C8.56925 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56925 8 8.01697 8H5.01697C3.9124 8 3.01697 7.10457 3.01697 6V3H10.017V15C10.017 18.3137 7.33068 21 4.01697 21H3.01697Z"/></svg>
);
const CircleIcon = () => (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/></svg>
);
const InfoIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

export default InterviewPage;
