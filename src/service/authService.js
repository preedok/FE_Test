import { post } from './api';
import { API_ENDPOINTS } from '@/utils/constants';


export const authService = {

    login: async (credentials) => {
        try {
            const response = await post(API_ENDPOINTS.LOGIN, credentials);

            if (response.success && response.data.status) {
                const { token, ...userData } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                return {
                    success: true,
                    data: {
                        token,
                        user: userData,
                    },
                };
            }

            return {
                success: false,
                error: response.data?.message || 'Login gagal',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Login gagal',
            };
        }
    },

    logout: async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return {
                success: true,
            };
        } catch (error) {
          
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            return {
                success: true,
            };
        }
    },


    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },


    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },

 
    getToken: () => {
        return localStorage.getItem('token');
    },


    refreshToken: async () => {
        try {
          

            return {
                success: false,
                error: 'Token refresh not implemented',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

   
    isTokenExpired: () => {
        const token = localStorage.getItem('token');
        if (!token) return true;

        try {
           
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;

            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return true;
        }
    },

 
    setupTokenExpiredHandler: () => {
        const checkTokenExpiry = () => {
            if (authService.isTokenExpired()) {
                authService.logout();
                window.location.href = '/login';
            }
        };

       
        setInterval(checkTokenExpiry, 60000);
    },
};