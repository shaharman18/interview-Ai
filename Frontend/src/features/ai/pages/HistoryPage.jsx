import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../hook/useInterview';
import { useAuth } from '../../auth/hooks/useAuth';

const HistoryPage = () => {
    const navigate = useNavigate();
    const { handleLogout } = useAuth();
    const { getHistory, reports, deleteInterview, loading } = useInterview();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    const onLogout = useCallback(async () => {
        await handleLogout();
        navigate('/login');
    }, [handleLogout, navigate]);

    const openDeleteModal = useCallback((e, report) => {
        e.stopPropagation();
        setReportToDelete(report);
        setIsDeleteModalOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!reportToDelete) return;
        setIsDeleting(true);
        await deleteInterview(reportToDelete._id);
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setReportToDelete(null);
    }, [deleteInterview, reportToDelete]);

    const filteredReports = useMemo(() => {
        if (!reports) return [];
        return reports.filter(r => 
            r.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.matchAnalysis && r.matchAnalysis.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [reports, searchQuery]);

    const avgScore = useMemo(() => {
        if (!reports || reports.length === 0) return 0;
        const sum = reports.reduce((acc, r) => acc + (r.matchScore || 0), 0);
        return Math.round(sum / reports.length);
    }, [reports]);

    return (
        <div className="min-h-screen bg-[#0B1120] text-white flex flex-col items-center selection:bg-pink-500/30 font-outfitSelection relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full"></div>
            </div>

            {/* Custom Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0 backdrop-blur-3xl bg-[#0B1120]/60 animate-in fade-in duration-300">
                    <div className="bg-[#111827] border border-white/10 w-full max-w-md rounded-[40px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="p-8 sm:p-10 text-center">
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500 shadow-2xl shadow-red-500/20">
                                <AlertTriangleIcon />
                            </div>
                            <h3 className="text-2xl font-black italic tracking-tight mb-4 uppercase">Delete This Report?</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 px-4 italic">
                                Are you sure you want to delete this report? This action cannot be undone.
                            </p>
                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="w-full py-5 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl text-white font-black text-xs uppercase tracking-[3px] hover:shadow-[0_15px_30px_rgba(220,38,38,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button 
                                    onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                                    className="w-full py-5 bg-white/5 border border-white/5 text-gray-400 font-black text-xs uppercase tracking-[3px] rounded-2xl hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-[#0B1120]/80 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-4 sm:px-12">
                <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-lg sm:text-xl italic text-white shadow-2xl shadow-pink-500/20 group-hover:rotate-3 transition-transform">A</div>
                    <span className="font-black text-sm sm:text-xl tracking-tighter truncate max-w-[120px] sm:max-w-none">Interview<span className="text-pink-500">History</span></span>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => navigate('/')} className="hidden sm:flex px-4 sm:px-6 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-[10px] sm:text-xs uppercase tracking-widest">Dashboard</button>
                    <button onClick={() => navigate('/settings')} className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all"><SettingsIcon /></button>
                </div>
            </nav>

            <main className="w-full max-w-7xl pt-32 sm:pt-44 p-4 sm:p-8 lg:p-12 relative z-10">
                {/* Stats Header */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-10 mb-10 sm:mb-16">
                    <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 flex items-center gap-4 sm:gap-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-pink-500 flex-shrink-0"><FileIconLarge /></div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black italic tracking-tighter">{reports?.length || 0}</div>
                            <div className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Interview Plans</div>
                        </div>
                    </div>
                    <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 flex items-center gap-4 sm:gap-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-violet-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-violet-500 flex-shrink-0"><TargetIcon /></div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black italic tracking-tighter">{avgScore}%</div>
                            <div className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Average Match</div>
                        </div>
                    </div>
                    <div className="hidden lg:flex bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 items-center gap-4 sm:gap-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-blue-500 flex-shrink-0"><ClockIcon /></div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-[16px] sm:text-[18px]">ACTIVE</div>
                            <div className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Account Status</div>
                        </div>
                    </div>
                </div>

                {/* Search & Header */}
                <div className="flex flex-col gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tighter italic uppercase text-white/90">Interview <span className="text-pink-500">History</span></h2>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">Found {filteredReports.length} past interview plans.</p>
                    </div>
                    
                    <div className="relative group w-full max-w-2xl">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by job title or keyword..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 pl-12 sm:pl-14 text-sm font-medium outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 transition-all placeholder:text-gray-700"
                        />
                        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pink-500 transition-colors">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading && (!reports || reports.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-24 sm:py-32">
                        <div className="w-12 h-12 border-4 border-pink-500/10 border-t-pink-500 rounded-full animate-spin mb-6"></div>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[4px]">Loading History...</span>
                    </div>
                ) : filteredReports.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-32">
                        {filteredReports.map((report) => (
                            <div
                                key={report._id}
                                onClick={() => navigate(`/interview/${report._id}`)}
                                className="group relative bg-[#111827]/40 backdrop-blur-xl border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 lg:p-10 cursor-pointer hover:border-pink-500/30 hover:bg-white/[0.03] transition-all duration-500 shadow-xl hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex flex-col">
                                        <div className="text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{new Date(report.createdAt).toLocaleDateString()}</div>
                                        <div className="text-xl sm:text-2xl font-black italic tracking-tighter group-hover:text-pink-500 transition-colors">#{report._id.substring(report._id.length - 4)}</div>
                                    </div>
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center group-hover:border-pink-500/30 transition-all">
                                        <div className="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-tighter">Match</div>
                                        <div className="text-base sm:text-lg font-black italic text-pink-500">{report.matchScore}%</div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-10 min-h-[100px]">
                                    <h3 className="text-lg sm:text-xl font-black tracking-tight line-clamp-2 leading-tight text-white/90 uppercase">{report.jobDescription}</h3>
                                    <p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-relaxed italic line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">"{report.matchAnalysis}"</p>
                                </div>

                                <div className="flex items-center justify-between pt-6 sm:pt-8 border-t border-white/5">
                                    <button 
                                        onClick={(e) => openDeleteModal(e, report)}
                                        className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-red-500 transition-colors flex items-center gap-2 group/btn"
                                    >
                                        <TrashIconSmall /> <span className="hidden xs:inline">Delete This</span><span className="xs:hidden">Delete</span>
                                    </button>
                                    <div className="px-4 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-500 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest group-hover:bg-pink-500 group-hover:text-white transition-all">View Details</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center bg-[#111827]/30 border-2 border-dashed border-white/5 rounded-[40px] px-8">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 mb-8 transform hover:scale-110 transition-transform"><EmptyBoxIcon /></div>
                        <h3 className="text-2xl font-black italic tracking-tighter mb-2 text-center">No Interviews Found</h3>
                        <p className="text-gray-500 text-sm font-medium mb-10 max-w-xs text-center leading-relaxed italic opacity-60">"You haven't generated any interview plans yet."</p>
                        <button onClick={() => navigate('/')} className="px-10 py-4 bg-white text-black font-black text-[10px] sm:text-xs uppercase tracking-[3px] rounded-2xl hover:bg-pink-500 hover:text-white transition-all shadow-2xl">Start New Interview</button>
                    </div>
                )}
            </main>
        </div>
    );
};

// Icons
const AlertTriangleIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const FileIconLarge = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);
const TargetIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const ClockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const TrashIconSmall = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const EmptyBoxIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);

export default HistoryPage;
