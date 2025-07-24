import { get, download, triggerDownload } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { formatDateForAPI, formatExportFilename } from '@/utils/formatters';


export const lalinService = {
   
    getLalins: async (params = {}) => {
        try {
            const response = await get(API_ENDPOINTS.LALINS, params);

            if (response.success && response.data.status) {
                return {
                    success: true,
                    data: response.data.data,
                };
            }

            return {
                success: false,
                error: response.data?.message || 'Gagal mengambil data lalin',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal mengambil data lalin',
            };
        }
    },

    
    getLalinsByDate: async (tanggal, page = 1, limit = 10) => {
        const params = {
            tanggal: formatDateForAPI(tanggal),
            page,
            limit,
        };

        return lalinService.getLalins(params);
    },

   
    searchLalins: async (searchQuery, filters = {}) => {
        const params = {
            search: searchQuery,
            ...filters,
        };

        return lalinService.getLalins(params);
    },

  
    getDashboardData: async (tanggal) => {
        try {
            const response = await lalinService.getLalinsByDate(tanggal, 1, 1000);

            if (response.success) {
                const rawData = response.data.rows.rows || [];

              
                const processedData = lalinService.processDashboardData(rawData);

                return {
                    success: true,
                    data: processedData,
                };
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal mengambil data dashboard',
            };
        }
    },

   
    processDashboardData: (rawData) => {
       
        const paymentMethodData = lalinService.groupByPaymentMethod(rawData);

       
        const gerbangData = lalinService.groupByGerbang(rawData);

       
        const shiftData = lalinService.groupByShift(rawData);

       
        const ruasData = lalinService.groupByRuas(rawData);

        return {
            paymentMethods: paymentMethodData,
            gerbangs: gerbangData,
            shifts: shiftData,
            ruas: ruasData,
            totalRecords: rawData.length,
        };
    },

  
    groupByPaymentMethod: (data) => {
        const paymentMethods = ['eMandiri', 'eBri', 'eBni', 'eBca', 'eNobu', 'eDKI', 'eMega', 'eFlo'];

        return paymentMethods.map(method => {
            const total = data.reduce((sum, item) => sum + (item[method] || 0), 0);
            return {
                name: method,
                value: total,
                label: method.replace('e', 'e-'),
            };
        }).filter(item => item.value > 0);
    },

  
    groupByGerbang: (data) => {
        const gerbangMap = new Map();

        data.forEach(item => {
            const gerbangId = item.IdGerbang;
            const gerbangName = `Gerbang ${gerbangId}`;

            if (!gerbangMap.has(gerbangId)) {
                gerbangMap.set(gerbangId, {
                    id: gerbangId,
                    name: gerbangName,
                    value: 0,
                });
            }

            const gerbang = gerbangMap.get(gerbangId);

           
            const total = ['Tunai', 'eMandiri', 'eBri', 'eBni', 'eBca', 'eNobu', 'eDKI', 'eMega', 'eFlo']
                .reduce((sum, method) => sum + (item[method] || 0), 0);

            gerbang.value += total;
        });

        return Array.from(gerbangMap.values()).sort((a, b) => b.value - a.value);
    },

   
    groupByShift: (data) => {
        const shiftMap = new Map();

        data.forEach(item => {
            const shift = item.Shift;

            if (!shiftMap.has(shift)) {
                shiftMap.set(shift, {
                    shift,
                    name: `Shift ${shift}`,
                    value: 0,
                });
            }

            const shiftData = shiftMap.get(shift);

           
            const total = ['Tunai', 'eMandiri', 'eBri', 'eBni', 'eBca', 'eNobu', 'eDKI', 'eMega', 'eFlo']
                .reduce((sum, method) => sum + (item[method] || 0), 0);

            shiftData.value += total;
        });

        return Array.from(shiftMap.values()).sort((a, b) => a.shift - b.shift);
    },

   
    groupByRuas: (data) => {
        const ruasMap = new Map();

        data.forEach(item => {
            const cabangId = item.IdCabang;
            const ruasName = `Ruas ${cabangId}`;

            if (!ruasMap.has(cabangId)) {
                ruasMap.set(cabangId, {
                    id: cabangId,
                    name: ruasName,
                    value: 0,
                });
            }

            const ruas = ruasMap.get(cabangId);

            const total = ['Tunai', 'eMandiri', 'eBri', 'eBni', 'eBca', 'eNobu', 'eDKI', 'eMega', 'eFlo']
                .reduce((sum, method) => sum + (item[method] || 0), 0);

            ruas.value += total;
        });

        return Array.from(ruasMap.values()).sort((a, b) => b.value - a.value);
    },

 
    calculatePaymentTotals: (data) => {
        const totals = {
            totalTunai: 0,
            totalEToll: 0,
            totalFlo: 0,
            totalKTP: 0,
            totalKeseluruhan: 0,
            totalETollTunaiFlo: 0,
        };

        data.forEach(item => {
            
            totals.totalTunai += item.Tunai || 0;
            totals.totalTunai += item.DinasOpr || 0;
            totals.totalTunai += item.DinasMitra || 0;
            totals.totalTunai += item.DinasKary || 0;

            
            const eTollAmount = (item.eMandiri || 0) + (item.eBri || 0) + (item.eBni || 0) +
                (item.eBca || 0) + (item.eNobu || 0) + (item.eDKI || 0) + (item.eMega || 0);
            totals.totalEToll += eTollAmount;

          
            totals.totalFlo += item.eFlo || 0;

           
            totals.totalKeseluruhan += (item.Tunai || 0) + (item.DinasOpr || 0) +
                (item.DinasMitra || 0) + (item.DinasKary || 0) +
                eTollAmount + (item.eFlo || 0);

           
            totals.totalETollTunaiFlo += eTollAmount + (item.Tunai || 0) +
                (item.DinasOpr || 0) + (item.DinasMitra || 0) +
                (item.DinasKary || 0) + (item.eFlo || 0);
        });

        return totals;
    },

  
    exportData: async (filters = {}, format = 'excel') => {
        try {
            const params = {
                ...filters,
                export: format,
            };

            const response = await lalinService.getLalins(params);

            if (response.success) {
                const data = response.data.rows.rows || [];
                const filename = formatExportFilename(`lalin_data_${filters.tanggal || 'all'}`);

              
                const csvContent = lalinService.convertToCSV(data);
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

                triggerDownload(blob, `${filename}.csv`);

                return {
                    success: true,
                    message: 'Data berhasil diekspor',
                };
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Gagal mengekspor data',
            };
        }
    },

  
    convertToCSV: (data) => {
        if (!data || data.length === 0) return '';

        const headers = [
            'ID', 'ID Cabang', 'ID Gerbang', 'Tanggal', 'Shift', 'ID Gardu',
            'Golongan', 'ID Asal Gerbang', 'Tunai', 'Dinas Opr', 'Dinas Mitra',
            'Dinas Kary', 'e-Mandiri', 'e-BRI', 'e-BNI', 'e-BCA', 'e-Nobu',
            'e-DKI', 'e-Mega', 'e-Flo'
        ];

        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.id,
                row.IdCabang,
                row.IdGerbang,
                row.Tanggal,
                row.Shift,
                row.IdGardu,
                row.Golongan,
                row.IdAsalGerbang,
                row.Tunai,
                row.DinasOpr,
                row.DinasMitra,
                row.DinasKary,
                row.eMandiri,
                row.eBri,
                row.eBni,
                row.eBca,
                row.eNobu,
                row.eDKI,
                row.eMega,
                row.eFlo
            ].join(','))
        ].join('\n');

        return csvContent;
    },
};