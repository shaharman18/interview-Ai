import { useContext, useCallback } from 'react';
import InterviewContext from '../InterviewContext';
import { getInterview as fetchInterviewApi, createInterview as createInterviewApi, getAllInterviews as fetchAllInterviewsApi, tailorResume as tailorResumeApi, deleteInterview as deleteInterviewApi } from '../services/interview.api';

const useInterview = () => {
    const context = useContext(InterviewContext);
    
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider');
    }

    const { 
        report, setReport, 
        reports, setReports,
        loading, setLoading, 
        error, setError 
    } = context;

    const getInterview = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchInterviewApi(id);
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch interview report';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setReport]);

    const getHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllInterviewsApi();
            setReports(data.interviews);
            return data.interviews;
        } catch (err) {
            console.error("Hook: getHistory error", err);
            const msg = err.response?.data?.message || err.message || 'Failed to fetch interview history';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setReports]);

    const createInterview = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await createInterviewApi(formData);
            setReport(data.interviewReport);
            return data.interviewReport;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to generate interview questions';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const tailorResume = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tailorResumeApi(formData);
            return data.tailoredResume;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to tailor resume';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const deleteInterview = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteInterviewApi(id);
            // Refresh history
            const data = await fetchAllInterviewsApi();
            setReports(data.interviews);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete interview report';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const clearReport = () => setReport(null);
    
    return {
        report,
        reports,
        loading,
        error,
        getInterview,
        getHistory,
        createInterview,
        tailorResume,
        deleteInterview,
        clearReport,
        setReport,
        setError
    };
};



export { useInterview };
