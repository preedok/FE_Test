import { get, post, put, del } from './api';
import { API_ENDPOINTS } from '@/utils/constants';


export const gerbangService = {
   
    getGerbangs: async (params = {}) => {
        try {
            const response = await get(API_ENDPOINTS.GERBANGS, params);

            if (response.success && response.data.status) {
                return {
                    success: true,
                    data: response.data.data,
                };
            }

            return {
                success: false,
                error: response.data?.message || 'Gagal mengambil data gerbang',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal mengambil data gerbang',
            };
        }
    },

  
    getGerbangsPaginated: async (page = 1, limit = 10, search = '') => {
        const params = {
            page,
            limit,
        };

        if (search) {
            params.search = search;
        }

        return gerbangService.getGerbangs(params);
    },

   
    getGerbangById: async (id) => {
        try {
            const response = await get(`${API_ENDPOINTS.GERBANGS}/${id}`);

            if (response.success && response.data.status) {
                return {
                    success: true,
                    data: response.data.data,
                };
            }

            return {
                success: false,
                error: response.data?.message || 'Gagal mengambil data gerbang',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal mengambil data gerbang',
            };
        }
    },

   
    createGerbang: async (gerbangData) => {
        try {
            const response = await post(API_ENDPOINTS.GERBANGS, gerbangData);

            if (response.success && response.data.status) {
                return {
                    success: true,
                    data: response.data.id,
                    message: response.data.message || 'Gerbang berhasil ditambahkan',
                };
            }

            return {
                success: false,
                error: response.data?.message || 'Gagal menambahkan gerbang',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal menambahkan gerbang',
            };
        }
    },

   
    updateGerbang: async (gerbangData) => {
        try {
            const response = await put(`${API_ENDPOINTS.GERBANGS}/`, gerbangData);

            if (response.success && response.data.status) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Gerbang berhasil diperbarui',
                };
            }

            return {
                success: false,
                error: response.data?.message || 'Gagal memperbarui gerbang',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal memperbarui gerbang',
            };
        }
    },

   
    deleteGerbang: async (id, IdCabang) => {
        try {
            const response = await del(`${API_ENDPOINTS.GERBANGS}/`, {
                id,
                IdCabang,
            });

            if (response.success && response.data.status) {
                return {
                    success: true,
                    message: response.data.message || 'Gerbang berhasil dihapus',
                };
            }

            return {
                success: false,
                error: response.data?.message || 'Gagal menghapus gerbang',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal menghapus gerbang',
            };
        }
    },

  
    searchGerbangs: async (searchQuery, page = 1, limit = 10) => {
        return gerbangService.getGerbangsPaginated(page, limit, searchQuery);
    },

    
    getGerbangOptions: async () => {
        try {
            const response = await gerbangService.getGerbangs();

            if (response.success) {
                const gerbangs = response.data.rows?.rows || [];
                return {
                    success: true,
                    data: gerbangs.map(gerbang => ({
                        value: gerbang.id,
                        label: `${gerbang.NamaGerbang} - ${gerbang.NamaCabang}`,
                        ...gerbang,
                    })),
                };
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal mengambil opsi gerbang',
            };
        }
    },
};