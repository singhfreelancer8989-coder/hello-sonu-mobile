import React, { createContext, useState, useCallback } from 'react';
import { fetchDashboardAnalytics } from '../services/analytics.service';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDashboardAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchDashboardAnalytics();
            if (response && response.data) {
                setDashboardData(response.data);
            } else {
                setError(response?.message || "Failed to fetch dashboard data");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AnalyticsContext.Provider value={{
            dashboardData,
            loading,
            error,
            getDashboardAnalytics
        }}>
            {children}
        </AnalyticsContext.Provider>
    );
};
