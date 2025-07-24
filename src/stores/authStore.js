import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService } from '@/service/authService';
import { LOADING_STATES, SUCCESS_MESSAGES } from '@/utils/constants';
import toast from 'react-hot-toast';

const useAuthStore = create(
    devtools(
        persist(
            (set, get) => ({
     
                user: null,
                token: null,
                isAuthenticated: false,
                loading: LOADING_STATES.IDLE,
                error: null,

         
                login: async (credentials) => {
                    set({ loading: LOADING_STATES.LOADING, error: null });

                    try {
                        const response = await authService.login(credentials);

                        if (response.success) {
                            set({
                                user: response.data.user,
                                token: response.data.token,
                                isAuthenticated: true,
                                loading: LOADING_STATES.SUCCESS,
                                error: null,
                            });

                            toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
                            return { success: true };
                        } else {
                            set({
                                loading: LOADING_STATES.ERROR,
                                error: response.error,
                            });

                            toast.error(response.error);
                            return { success: false, error: response.error };
                        }
                    } catch (error) {
                        const errorMessage = error.message || 'Login gagal';
                        set({
                            loading: LOADING_STATES.ERROR,
                            error: errorMessage,
                        });

                        toast.error(errorMessage);
                        return { success: false, error: errorMessage };
                    }
                },

                logout: async () => {
                    set({ loading: LOADING_STATES.LOADING });

                    try {
                        await authService.logout();

                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            loading: LOADING_STATES.IDLE,
                            error: null,
                        });

                        toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
                        return { success: true };
                    } catch (error) {
                       
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            loading: LOADING_STATES.IDLE,
                            error: null,
                        });

                        return { success: true };
                    }
                },

                checkAuth: () => {
                    const token = authService.getToken();
                    const user = authService.getCurrentUser();

                    if (token && user && !authService.isTokenExpired()) {
                        set({
                            user,
                            token,
                            isAuthenticated: true,
                            loading: LOADING_STATES.IDLE,
                        });
                        return true;
                    } else {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            loading: LOADING_STATES.IDLE,
                        });
                        return false;
                    }
                },

                clearError: () => {
                    set({ error: null });
                },

                setLoading: (loading) => {
                    set({ loading });
                },

              
                initialize: () => {
                    const { checkAuth } = get();
                    checkAuth();

                 
                    authService.setupTokenExpiredHandler();
                },
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({
                    user: state.user,
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                }),
            }
        ),
        {
            name: 'auth-store',
        }
    )
);

export default useAuthStore;