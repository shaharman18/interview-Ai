import React, { createContext, useState } from 'react';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <InterviewContext.Provider value={{
            report,
            setReport,
            reports,
            setReports,
            loading,
            setLoading,
            error,
            setError
        }}>
            {children}
        </InterviewContext.Provider>
    );
};

export default InterviewContext;
