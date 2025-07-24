import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import { ROUTES } from '@/utils/constants';


export const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        checkAuth,
        clearError,
        initialize,
    } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    const loginUser = async (credentials) => {
        const result = await login(credentials);

        if (result.success) {
            
            const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
            navigate(from, { replace: true });
        }

        return result;
    };

    const logoutUser = async () => {
        const result = await logout();

        if (result.success) {
            navigate(ROUTES.LOGIN, { replace: true });
        }

        return result;
    };

    const redirectToLogin = () => {
        navigate(ROUTES.LOGIN, {
            state: { from: location },
            replace: true,
        });
    };

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login: loginUser,
        logout: logoutUser,
        checkAuth,
        clearError,
        redirectToLogin,
    };
};


export const useRequireAuth = () => {
    const { isAuthenticated, checkAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isAuth = checkAuth();

        if (!isAuth) {
            navigate(ROUTES.LOGIN, {
                state: { from: location },
                replace: true,
            });
        }
    }, [checkAuth, navigate, location]);

    return isAuthenticated;
};


export const useRedirectIfAuthenticated = () => {
    const { isAuthenticated, checkAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = checkAuth();

        if (isAuth) {
            navigate(ROUTES.DASHBOARD, { replace: true });
        }
    }, [checkAuth, navigate]);

    return !isAuthenticated;
};