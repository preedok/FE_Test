import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { lalinService } from '@/services/lalinService';
import { LOADING_STATES, DEFAULT_PAGINATION, SUCCESS_MESSAGES } from '@/utils/constants';
import toast from 'react-hot-toast';

const useLalinStore = create(
    devtools(
        (set, get) => ({
            
            lalins: [],
            dashboardData: null,
            selectedDate: new Date(),
            searchQuery: '',
            filters: {},
            pagination: DEFAULT_PAGINATION,
            loading: LOADING_STATES.IDLE,
            error: null,
            selectedPaymentMethod: 'totalKeseluruhan',

         
            fetchLalins: async (params = {}) => {
                set({ loading: LOADING_STATES.LOADING, error: null });

                try {
                    const response = await lalinService.getLalins(params);

                    if (response.success) {
                        set({
                            lalins: response.data.rows?.rows || [],
                            pagination: {
                                page: response.data.current_page || 1,
                                limit: params.limit || DEFAULT_PAGINATION.limit,
                                total_pages: response.data.total_pages || 0,
                                count: response.data.count || 0,
                            },
                            loading: LOADING_STATES.SUCCESS,
                            error: null,
                        });

                        return { success: true, data: response.data };
                    } else {
                        set({
                            loading: LOADING_STATES.ERROR,
                            error: response.error,
                        });

                        toast.error(response.error);
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error.message || 'Gagal mengambil data lalin';
                    set({
                        loading: LOADING_STATES.ERROR,
                        error: errorMessage,
                    });

                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            fetchLalinsByDate: async (date, page = 1, limit = 10) => {
                const { fetchLalins } = get();

                set({ selectedDate: date });

                const params = {
                    tanggal: date.toISOString().split('T')[0],
                    page,
                    limit,
                };

                return fetchLalins(params);
            },

            searchLalins: async (query, filters = {}) => {
                const { fetchLalins, selectedDate } = get();

                set({ searchQuery: query, filters });

                const params = {
                    tanggal: selectedDate.toISOString().split('T')[0],
                    search: query,
                    page: 1,
                    limit: DEFAULT_PAGINATION.limit,
                    ...filters,
                };

                return fetchLalins(params);
            },

            fetchDashboardData: async (date) => {
                set({ loading: LOADING_STATES.LOADING, error: null });

                try {
                    const response = await lalinService.getDashboardData(date);

                    if (response.success) {
                        set({
                            dashboardData: response.data,
                            selectedDate: date,
                            loading: LOADING_STATES.SUCCESS,
                            error: null,
                        });

                        return { success: true, data: response.data };
                    } else {
                        set({
                            loading: LOADING_STATES.ERROR,
                            error: response.error,
                        });

                        toast.error(response.error);
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error.message || 'Gagal mengambil data dashboard';
                    set({
                        loading: LOADING_STATES.ERROR,
                        error: errorMessage,
                    });

                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            exportData: async (format = 'excel') => {
                const { selectedDate, searchQuery, filters } = get();

                try {
                    const exportFilters = {
                        tanggal: selectedDate.toISOString().split('T')[0],
                        search: searchQuery,
                        ...filters,
                    };

                    const response = await lalinService.exportData(exportFilters, format);

                    if (response.success) {
                        toast.success(SUCCESS_MESSAGES.EXPORT_SUCCESS);
                        return { success: true };
                    } else {
                        toast.error(response.error);
                        return { success: false, error: response.error };
                    }
                } catch (error) {
                    const errorMessage = error.message || 'Gagal mengekspor data';
                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            setSelectedDate: (date) => {
                set({ selectedDate: date });
            },

            setSearchQuery: (query) => {
                set({ searchQuery: query });
            },

            setFilters: (filters) => {
                set({ filters });
            },

            setSelectedPaymentMethod: (method) => {
                set({ selectedPaymentMethod: method });
            },

            setPagination: (pagination) => {
                set({ pagination: { ...get().pagination, ...pagination } });
            },

            clearError: () => {
                set({ error: null });
            },

            setLoading: (loading) => {
                set({ loading });
            },

            reset: () => {
                set({
                    lalins: [],
                    dashboardData: null,
                    searchQuery: '',
                    filters: {},
                    pagination: DEFAULT_PAGINATION,
                    loading: LOADING_STATES.IDLE,
                    error: null,
                    selectedPaymentMethod: 'totalKeseluruhan',
                });
            },

          
            getFilteredLalins: () => {
                const { lalins, selectedPaymentMethod } = get();

                if (selectedPaymentMethod === 'totalKeseluruhan') {
                    return lalins;
                }

             
                return lalins;
            },

            getPaymentTotals: () => {
                const { lalins } = get();
                return lalinService.calculatePaymentTotals(lalins);
            },

            getCurrentPageData: () => {
                const { lalins, pagination } = get();
                const startIndex = (pagination.page - 1) * pagination.limit;
                const endIndex = startIndex + pagination.limit;
                return lalins.slice(startIndex, endIndex);
            },
        }),
        {
            name: 'lalin-store',
        }
    )
);

export default useLalinStore;