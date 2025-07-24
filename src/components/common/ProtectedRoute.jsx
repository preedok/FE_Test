import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import { PageLoading } from './Loading';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuth, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (loading === 'loading') {
        return <PageLoading message="Memeriksa autentikasi..." />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to={ROUTES.LOGIN}
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;