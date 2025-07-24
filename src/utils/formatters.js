import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';


export const formatNumber = (num) => {
    if (num === null || num === undefined || num === '') return '0';
    return new Intl.NumberFormat('id-ID').format(Number(num));
};


export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(amount));
};


export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr, { locale: id });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};


export const formatDateTime = (date) => {
    return formatDate(date, 'dd/MM/yyyy HH:mm:ss');
};


export const formatDateForAPI = (date) => {
    return formatDate(date, 'yyyy-MM-dd');
};


export const parseDateFromAPI = (dateString) => {
    if (!dateString) return null;
    try {
        return parseISO(dateString);
    } catch (error) {
        console.error('Error parsing date:', error);
        return null;
    }
};


export const formatGerbangName = (namaGerbang, namaCabang) => {
    if (!namaGerbang && !namaCabang) return '-';
    if (!namaCabang) return namaGerbang;
    if (!namaGerbang) return namaCabang;
    return `${namaGerbang} - ${namaCabang}`;
};


export const formatShift = (shift) => {
    const shiftMap = {
        1: 'Shift 1 (00:00-08:00)',
        2: 'Shift 2 (08:00-16:00)',
        3: 'Shift 3 (16:00-24:00)',
    };
    return shiftMap[shift] || `Shift ${shift}`;
};


export const formatGolongan = (golongan) => {
    const golonganMap = {
        1: 'Gol I',
        2: 'Gol II',
        3: 'Gol III',
        4: 'Gol IV',
        5: 'Gol V',
    };
    return golonganMap[golongan] || `Gol ${golongan}`;
};


export const formatStatus = (status) => {
    return status ? 'Aktif' : 'Tidak Aktif';
};


export const formatPercentage = (value, total) => {
    if (!total || total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
};


export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};


export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};


export const formatPaymentMethod = (method) => {
    const methodMap = {
        Tunai: 'Tunai',
        eMandiri: 'e-Mandiri',
        eBri: 'e-BRI',
        eBni: 'e-BNI',
        eBca: 'e-BCA',
        eNobu: 'e-Nobu',
        eDKI: 'e-DKI',
        eMega: 'e-Mega',
        eFlo: 'e-Flo',
    };
    return methodMap[method] || method;
};


export const formatValidationError = (errors) => {
    if (typeof errors === 'string') return errors;
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'object') {
        return Object.values(errors).flat().join(', ');
    }
    return 'Terjadi kesalahan validasi';
};


export const formatRowNumber = (index, currentPage, pageSize) => {
    return (currentPage - 1) * pageSize + index + 1;
};


export const formatEmptyValue = (value, fallback = '-') => {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    return value;
};


export const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};


export const formatExportFilename = (prefix) => {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    return `${sanitizeFilename(prefix)}_${timestamp}`;
};