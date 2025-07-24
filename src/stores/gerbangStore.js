import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { gerbangService } from '@/services/gerbangService';
import { LOADING_STATES, DEFAULT_PAGINATION, SUCCESS_MESSAGES } from '@/utils/constants';
import toast from 'react-hot-toast';

const useGerbangStore = create(
    devtools(
        (set, get) => ({
 
            gerbangs: [],
            gerbangOptions: [],
            selectedGerbang: null,
            searchQuery: '',
            pagination: DEFAULT_PAGINATION,
            loading: LOADING_STATES.IDLE,
            error: null,
            isModalOpen: false,
            modalMode: 'create', 

   
            fetchGerbangs: async (params = {}) => {
                set({ loading: LOADING_STATES.LOADING, error: null });

                try {
                    const response = await gerbangService.getGerbangs(params);

                    if (response.success) {
                        set({
                            gerbangs: response.data.rows?.rows || [],
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
                    const errorMessage = error.message || 'Gagal mengambil data gerbang';
                    set({
                        loading: LOADING_STATES.ERROR,
                        error: errorMessage,
                    });

                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            fetchGerbangsPaginated: async (page = 1, limit = 10, search = '') => {
                const { fetchGerbangs } = get();

                set({ searchQuery: search });

                const params = {
                    page,
                    limit,
                    search,
                };

                return fetchGerbangs(params);
            },

            fetchGerbangById: async (id) => {
                set({ loading: LOADING_STATES.LOADING, error: null });

                try {
                    const response = await gerbangService.getGerbangById(id);

                    if (response.success) {
                        set({
                            selectedGerbang: response.data,
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
                    const errorMessage = error.message || 'Gagal mengambil data gerbang';
                    set({
                        loading: LOADING_STATES.ERROR,
                        error: errorMessage,
                    });

                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            createGerbang: async (gerbangData) => {
                set({ loading: LOADING_STATES.LOADING, error: null });

                try {
                    const response = await gerbangService.createGerbang(gerbangData);

                    if (response.success) {
                        set({
                            loading: LOADING_STATES.SUCCESS,
                            error: null,
                            isModalOpen: false,
                        });

                        toast.success(SUCCESS_MESSAGES.DATA_SAVED);

                 
                        const { fetchGerbangs, pagination, searchQuery } = get();
                        await fetchGerbangs({
                            page: pagination.page,
                            limit: pagination.limit,
                            search: searchQuery,
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
                    const errorMessage = error.message || 'Gagal menambahkan gerbang';
                    set({
                        loading: LOADING_STATES.ERROR,
                        error: errorMessage,
                    });

                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            updateGerbang: async (gerbangData) => {
                set({ loading: LOADING_STATES.LOADING, error: null });

                try {
                    const response = await gerbangService.updateGerbang(gerbangData);

                    if (response.success) {
                        set({
                            loading: LOADING_STATES.SUCCESS,
                            error: null,
                            isModalOpen: false,
                            selectedGerbang: null,
                        });

                        toast.success(SUCCESS_MESSAGES.DATA_UPDATED);

                      
                        const { fetchGerbangs, pagination, searchQuery } = get();
                        await fetchGerbangs({
                            page: pagination.page,
                            limit: pagination.limit,
                            search: searchQuery,
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
                    const errorMessage = error.message || 'Gagal memperbarui gerbang';
                    set({
                        loading: LOADING_STATES.ERROR,
                        error: errorMessage,
                    });

                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            deleteGerbang: async (id, IdCabang) => {
                set({ loading: LOADING_STATES.LOADING, error: null });

                try {
                    const response = await gerbangService.deleteGerbang(id, IdCabang);

                    if (response.success) {
                        set({
                            loading: LOADING_STATES.SUCCESS,
                            error: null,
                        });

                        toast.success(SUCCESS_MESSAGES.DATA_DELETED);

                     
                        const { fetchGerbangs, pagination, searchQuery } = get();
                        await fetchGerbangs({
                            page: pagination.page,
                            limit: pagination.limit,
                            search: searchQuery,
                        });

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
                    const errorMessage = error.message || 'Gagal menghapus gerbang';
                    set({
                        loading: LOADING_STATES.ERROR,
                        error: errorMessage,
                    });

                    toast.error(errorMessage);
                    return { success: false, error: errorMessage };
                }
            },

            fetchGerbangOptions: async () => {
                try {
                    const response = await gerbangService.getGerbangOptions();

                    if (response.success) {
                        set({
                            gerbangOptions: response.data,
                        });

                        return { success: true, data: response.data };
                    }

                    return { success: false, error: response.error };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            },

            searchGerbangs: async (query, page = 1, limit = 10) => {
                return get().fetchGerbangsPaginated(page, limit, query);
            },

            openModal: (mode = 'create', gerbang = null) => {
                set({
                    isModalOpen: true,
                    modalMode: mode,
                    selectedGerbang: gerbang,
                });
            },

            closeModal: () => {
                set({
                    isModalOpen: false,
                    modalMode: 'create',
                    selectedGerbang: null,
                });
            },

            setSearchQuery: (query) => {
                set({ searchQuery: query });
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
                    gerbangs: [],
                    gerbangOptions: [],
                    selectedGerbang: null,
                    searchQuery: '',
                    pagination: DEFAULT_PAGINATION,
                    loading: LOADING_STATES.IDLE,
                    error: null,
                    isModalOpen: false,
                    modalMode: 'create',
                });
            },

          
            getCurrentPageData: () => {
                const { gerbangs } = get();
                return gerbangs;
            },

            getGerbangById: (id) => {
                const { gerbangs } = get();
                return gerbangs.find(gerbang => gerbang.id === id);
            },
        }),
        {
            name: 'gerbang-store',
        }
    )
);

export default useGerbangStore;